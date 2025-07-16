<template>
  <div class="wallet-page">
    <div class="wallet-header">
      <h1 class="page-title">{{ t('wallet.title') }}</h1>
    </div>

    <div class="wallet-content">
      <!-- Personal Earnings Section -->
      <div class="earnings-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">📈</span>
            <span>{{ t('wallet.personalEarnings') }}</span>
          </div>
          <div class="last-withdrawal">
          </div>
        </div>

        <div class="earnings-cards">
          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">🕐</span>
              <span class="card-title">{{ t('wallet.currentEarnings') }}</span>
            </div>
            <div class="earning-amount green">{{ formatNumber(userInfo.Ua.UseProfit) }}</div>
            <div class="earning-unit">TIG</div>
          </div>

          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">✅</span>
              <span class="card-title">{{ t('wallet.historicalEarnings') }}</span>
            </div>
            <div class="earning-amount blue">{{ formatNumber(userInfo.Ua.TotalProfit) }}</div>
            <div class="earning-unit">TIG</div>
          </div>
        </div>


      </div>

      <!-- Team Earnings Section -->
      <div class="earnings-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">👥</span>
            <span>{{ t('wallet.teamEarnings') }}</span>
          </div>
          <!-- <div class="last-withdrawal">
            <span>{{ t('wallet.lastWithdrawal') }}</span>
            <span class="withdrawal-date">2024-01-12</span>
          </div> -->
        </div>

        <div class="earnings-cards">
          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">🕐</span>
              <span class="card-title">{{ t('wallet.currentEarnings') }}</span>
            </div>
            <div class="earning-amount purple">{{ formatNumber(userInfo.Ua.TeamProfit || 0) }}</div>
            <div class="earning-unit">TIG</div>
          </div>

          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">✅</span>
              <span class="card-title">{{ t('wallet.historicalEarnings') }}</span>
            </div>
            <div class="earning-amount blue">{{ formatNumber(userInfo.Ua.TeamPerformance) }}</div>
            <div class="earning-unit">TIG</div>
          </div>
        </div>


      </div>

      <AppButton variant="purple" class="withdraw-btn" :loading="withdrawLoading === 'team'"
        @click="withdrawEarnings('team')">
        {{ t('wallet.withdraw') }} {{ formatNumber(userInfo.Ua.TeamPerformance) }} TIG
      </AppButton>

      <!-- Withdrawal Instructions -->
      <div class="withdrawal-instructions">
        <h3 class="instructions-title">{{ t('wallet.withdrawalInstructions') }}</h3>
        <ul class="instructions-list">
          <li>{{ t('wallet.instruction1') }}</li>
          <li>{{ t('wallet.instruction2') }}</li>
          <li>{{ t('wallet.instruction3') }}</li>
          <li>{{ t('wallet.instruction4') }}</li>
          <li>{{ t('wallet.instruction5') }}</li>
        </ul>
      </div>

      <!-- Recent Withdrawal Records -->
      <!-- <div class="withdrawal-records">
        <h3 class="records-title">{{ t('wallet.recentWithdrawals') }}</h3>
        <div class="records-list">
          <div v-for="record in withdrawalRecords" :key="record.id" class="record-item">
            <div class="record-info">
              <div class="record-type">{{ record.type }}</div>
              <div class="record-date">{{ formatDate(record.date) }}</div>
            </div>
            <div class="record-amount">+{{ formatNumber(record.amount) }} TIG</div>
          </div>
        </div>
      </div> -->
      <!-- 修改记录部分为 Tab 标签页 -->
      <div class="withdrawal-records">
        <div class="records-header">
          <h3 class="records-title">{{ t('wallet.recentWithdrawals') }}</h3>
          <div class="records-tabs">
            <button class="tab-button" :class="{ active: activeTab === 'withdrawals' }"
              @click="activeTab = 'withdrawals'">
              {{ t('wallet.收益记录') }}
            </button>
            <button class="tab-button" :class="{ active: activeTab === 'earnings' }" @click="activeTab = 'earnings'">
              {{ t('wallet.提取记录') }}
            </button>
          </div>
        </div>

        <!-- 提取记录 -->
        <div v-if="activeTab === 'withdrawals'">
          <div class="records-list">
            <div v-for="record in paginatedWithdrawals" :key="record.id" class="record-item">
              <div class="record-info">
                <div class="record-type">{{ record.type }}</div>
                <div class="record-date">{{ formatDate(record.date) }}</div>
              </div>
              <div class="record-amount">+{{ formatNumber(record.amount) }} TIG</div>
            </div>
            <div v-if="withdrawalRecords.length === 0" class="no-records">
              {{ t('wallet.noRecords') }}
            </div>
          </div>
          <div class="records-pagination">
            <button class="pagination-button" :disabled="currentWithdrawalPage === 1" @click="currentWithdrawalPage--">
              &lt;
            </button>
            <span class="page-info">
              {{ currentWithdrawalPage }} / {{ totalWithdrawalPages }}
            </span>
            <button class="pagination-button" :disabled="currentWithdrawalPage === totalWithdrawalPages"
              @click="currentWithdrawalPage++">
              &gt;
            </button>
          </div>
        </div>

        <!-- 收益记录 -->
        <div v-if="activeTab === 'earnings'">
          <div class="records-list">
            <div v-for="record in paginatedEarnings" :key="record.id" class="record-item">
              <div class="record-info">
                <div class="record-type">{{ record.type }}</div>
                <div class="record-date">{{ formatDate(record.date) }}</div>
              </div>
              <div class="record-amount">+{{ formatNumber(record.amount) }} TIG</div>
            </div>
            <div v-if="earningsRecords.length === 0" class="no-records">
              {{ t('wallet.noRecords') }}
            </div>
          </div>
          <div class="records-pagination">
            <button class="pagination-button" :disabled="currentEarningsPage === 1" @click="currentEarningsPage--">
              &lt;
            </button>
            <span class="page-info">
              {{ currentEarningsPage }} / {{ totalEarningsPages }}
            </span>
            <button class="pagination-button" :disabled="currentEarningsPage === totalEarningsPages"
              @click="currentEarningsPage++">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { userStore } from '@/stores/user'
import { t } from '@/utils/i18n'
import { formatDate, formatNumber, sleep } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'
import { useEthers } from '@/composables/useWallet'

type WithdrawType = 'personal' | 'team'

const withdrawLoading = ref<WithdrawType | null>(null)
const { walletState } = useEthers()
const useUserStore = userStore();

const userInfo = ref({
  "Ua": {
    "Addr": "",
    "IdFlag": 0,
    "Pid": 0,
    "PidFlag": "",
    "People": 0,
    "UseProfit": 0,
    "TotalProfit": 0,
    "TeamPerformance": 0,
    "Performance": 0,
    "LevelPerformance": 0,
    "Level": 0,
    "CreateTime": ""
  },
  "PAddr": ""
})


const withdrawalRecords = reactive([
  {
    id: 1,
    type: '个人收益',
    amount: 125.6,
    date: new Date('2024-01-15 14:30'),
    status: 'completed'
  },
  {
    id: 2,
    type: '团队收益',
    amount: 67.8,
    date: new Date('2024-01-12 09:15'),
    status: 'completed'
  },
  {
    id: 3,
    type: '个人收益',
    amount: 89.3,
    date: new Date('2024-01-08 16:45'),
    status: 'completed'
  }
])

const withdrawEarnings = async (type: WithdrawType): Promise<void> => {
  withdrawLoading.value = type

  try {
    // Simulate withdrawal process
    await sleep(2000)
    console.log('Withdrawing earnings:', type)
    alert(`Successfully withdrew ${type} earnings!`)
  } catch (error) {
    console.error('Withdrawal failed:', error)
    alert('Withdrawal failed!')
  } finally {
    withdrawLoading.value = null
  }
}

// 新增的状态管理
const activeTab = ref<'withdrawals' | 'earnings'>('withdrawals')
const currentWithdrawalPage = ref(1)
const currentEarningsPage = ref(1)
const itemsPerPage = 5

// 计算属性
const paginatedWithdrawals = computed(() => {
  const start = (currentWithdrawalPage.value - 1) * itemsPerPage
  return withdrawalRecords.slice(start, start + itemsPerPage)
})

const totalWithdrawalPages = computed(() => {
  return Math.ceil(withdrawalRecords.length / itemsPerPage)
})

const paginatedEarnings = computed(() => {
  const start = (currentEarningsPage.value - 1) * itemsPerPage
  return earningsRecords.slice(start, start + itemsPerPage)
})

const totalEarningsPages = computed(() => {
  return Math.ceil(earningsRecords.length / itemsPerPage)
})

// 模拟数据
const earningsRecords = [
  // 你的收益记录数据
]


const fetchData = async () => {
  console.log("用户地址", walletState.value.account)
  if (!walletState.value.account) return
  try {
    userInfo.value = await useUserStore.getUserInfo(walletState.value.account);

  } catch (err) {
    console.error('Failed to fetch data:', err)

  }
}

watch(() => walletState.value.isConnected, (connected) => {
  if (connected) {
    fetchData()
  }
})
onMounted(() => {
  if (walletState.value.isConnected) {
    fetchData()
  }
})
</script>

<style scoped>
.wallet-page {
  min-height: 100vh;
  padding: 0;
}

.wallet-header {
  padding: 1.5rem 1rem 1rem;
  background: transparent;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.wallet-content {
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Earnings Section */
.earnings-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.section-icon {
  font-size: 1.1rem;
}

.last-withdrawal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.withdrawal-date {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.earnings-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.earning-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 1rem;
}

.card-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.earning-amount {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.earning-amount.green {
  color: #00e676;
}

.earning-amount.blue {
  color: #2196f3;
}

.earning-amount.purple {
  color: rgb(192 132 252);
}

.earning-unit {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.withdraw-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
}

/* Withdrawal Instructions */
.withdrawal-instructions {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.instructions-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.instructions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instructions-list li {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  padding-left: 1rem;
  position: relative;
}

.instructions-list li::before {
  content: '•';
  color: #00d4ff;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.instructions-list li:last-child {
  margin-bottom: 0;
}

/* Withdrawal Records */
.withdrawal-records {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.records-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.record-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.record-info {
  display: flex;
  flex-direction: column;
}

.record-type {
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.record-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.record-amount {
  font-size: 0.9rem;
  color: #00e676;
  font-weight: 600;
}

.record-status {
  font-size: 0.8rem;
  color: #00e676;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .wallet-header {
    padding: 1rem;
  }

  .wallet-content {
    padding: 0 0.5rem 2rem;
    gap: 1rem;
  }

  .earnings-section {
    padding: 1.25rem;
  }

  .earnings-cards {
    gap: 0.75rem;
  }

  .earning-card {
    padding: 1rem;
  }

  .earning-amount {
    font-size: 1.5rem;
  }

  .section-header {
    /* flex-direction: column; */
    align-items: flex-start;
    gap: 0.5rem;
  }

  .last-withdrawal {
    align-items: flex-start;
  }

  .record-item {
    /* flex-direction: column; */
    align-items: flex-start;
    gap: 0.5rem;
  }
}


/* 新增的样式 - 完全匹配现有风格 */
.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.records-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
}

.tab-button.active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.records-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}

.pagination-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.no-records {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

/* 保持原有响应式设计 */
@media (max-width: 480px) {
  .records-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .records-tabs {
    width: 100%;
  }

  .tab-button {
    flex: 1;
    text-align: center;
  }
}
</style>
