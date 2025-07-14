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
            <span>{{ t('wallet.lastWithdrawal') }}</span>
            <span class="withdrawal-date">2024-01-15</span>
          </div>
        </div>
        
        <div class="earnings-cards">
          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">🕐</span>
              <span class="card-title">{{ t('wallet.currentEarnings') }}</span>
            </div>
            <div class="earning-amount green">{{ formatNumber(userStore.stats.availableEarnings) }}</div>
            <div class="earning-unit">TIG</div>
          </div>
          
          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">✅</span>
              <span class="card-title">{{ t('wallet.historicalEarnings') }}</span>
            </div>
            <div class="earning-amount blue">{{ formatNumber(userStore.stats.personalEarnings * 8) }}</div>
            <div class="earning-unit">TIG</div>
          </div>
        </div>
        
        <AppButton 
          variant="success" 
          class="withdraw-btn"
          :loading="withdrawLoading === 'personal'"
          @click="withdrawEarnings('personal')"
        >
          {{ t('wallet.withdraw') }} {{ formatNumber(userStore.stats.availableEarnings) }} TIG
        </AppButton>
      </div>

      <!-- Team Earnings Section -->
      <div class="earnings-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">👥</span>
            <span>{{ t('wallet.teamEarnings') }}</span>
          </div>
          <div class="last-withdrawal">
            <span>{{ t('wallet.lastWithdrawal') }}</span>
            <span class="withdrawal-date">2024-01-12</span>
          </div>
        </div>
        
        <div class="earnings-cards">
          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">🕐</span>
              <span class="card-title">{{ t('wallet.currentEarnings') }}</span>
            </div>
            <div class="earning-amount purple">{{ formatNumber(userStore.stats.teamEarnings) }}</div>
            <div class="earning-unit">TIG</div>
          </div>
          
          <div class="earning-card">
            <div class="card-header">
              <span class="card-icon">✅</span>
              <span class="card-title">{{ t('wallet.historicalEarnings') }}</span>
            </div>
            <div class="earning-amount blue">{{ formatNumber(567.3) }}</div>
            <div class="earning-unit">TIG</div>
          </div>
        </div>
        
        <AppButton 
          variant="purple" 
          class="withdraw-btn"
          :loading="withdrawLoading === 'team'"
          @click="withdrawEarnings('team')"
        >
          {{ t('wallet.withdraw') }} {{ formatNumber(userStore.stats.teamEarnings) }} TIG
        </AppButton>
      </div>

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
      <div class="withdrawal-records">
        <h3 class="records-title">{{ t('wallet.recentWithdrawals') }}</h3>
        <div class="records-list">
          <div v-for="record in withdrawalRecords" :key="record.id" class="record-item">
            <div class="record-info">
              <div class="record-type">{{ record.type }}</div>
              <div class="record-date">{{ formatDate(record.date) }}</div>
            </div>
            <div class="record-amount">+{{ formatNumber(record.amount) }} TIG</div>
            <div class="record-status">{{ t('wallet.completed') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { userStore } from '@/stores/date'
import { t } from '@/utils/i18n'
import { formatDate, formatNumber, sleep } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'

type WithdrawType = 'personal' | 'team'

const withdrawLoading = ref<WithdrawType | null>(null)

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
  color: #e91e63;
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
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .last-withdrawal {
    align-items: flex-start;
  }
  
  .record-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
