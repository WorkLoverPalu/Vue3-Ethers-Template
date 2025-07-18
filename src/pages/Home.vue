<template>
  <div class="home-page">
    <!-- Stats Grid - 2x2 layout -->
    <div class="stats-grid">
      <!-- My Power -->
      <!-- {{ userInfo }} -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.个人业绩') }}</span>
          <div class="stat-icon lightning">⚡</div>
        </div>
        <div class="stat-value">{{ walletState.apiUserInfo.Ua.Performance }} </div>
        <div class="stat-label">{{ t('dashboard.level') }}: A{{ walletState.apiUserInfo.Ua.LevelPerformance }}</div>
      </div>

      <!-- Daily Income -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.团队业绩') }}</span>
          <div class="stat-icon trending">📈</div>
        </div>
        <div class="stat-value">{{ formatNumber(walletState.apiUserInfo.Ua.TeamPerformance) }}</div>
        <div class="stat-label"></div>
      </div>

      <!-- Total Assets -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.累计收益') }}</span>
          <div class="stat-icon wallet">💳</div>
        </div>
        <div class="stat-value">{{ formatNumber(walletState.apiUserInfo.Ua.TotalProfit) }}</div>
        <div class="stat-label">TIG</div>
      </div>

      <!-- Team Members -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.teamMembers') }}</span>
          <div class="stat-icon people">👥</div>
        </div>
        <div class="stat-value">{{ walletState.apiUserInfo.Ua.People }}</div>
        <div class="stat-label">{{ t('dashboard.people') }}</div>
      </div>
    </div>

    <!-- Quick Operations -->
    <div class="quick-operations">
      <h3 class="section-title">{{ t('dashboard.quickOperations') }}</h3>
      <div class="operation-buttons">
        <button class="operation-btn btn-cyan" @click="goToOrders">
          {{ t('dashboard.myOrders') }}
        </button>
        <button class="operation-btn btn-green" @click="goToTrade">
          {{ t('dashboard.tradeTIG') }}
        </button>
      </div>
    </div>

    <!-- Earnings Overview -->
    <div class="earnings-overview">
      <h3 class="section-title">{{ t('dashboard.概览') }}</h3>
      <div class="earnings-list">
        <div class="earning-item">
          <span class="earning-label">{{ t('dashboard.共享手续费分红') }}</span>
          <span class="earning-value green">{{ formatNumber(availableFee) }} TIG</span>
        </div>

        <div class="earning-item">
          <span class="earning-label">{{ t('dashboard.tigPrice') }}</span>
          <span class="earning-value cyan">${{ formatNumber(price) }}</span>
        </div>
        <div class="earning-item">
          <span class="earning-label">{{ t('dashboard.我的TIG资产') }}</span>
          <span class="earning-value cyan">{{ formatNumber(walletState.chainUserInfo.tigBalance) }} TIG</span>
        </div>
        <div class="earning-item">
          <span class="earning-label">{{ t('dashboard.我的NOS资产') }}</span>
          <span class="earning-value cyan">{{ formatNumber(walletState.chainUserInfo.nosBalance) }} NOS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { t } from '@/utils/i18n'
import { formatNumber, shortAddress } from '@/utils/formatters'
import { useRouter } from 'vue-router'
import { useEthers } from '@/composables/useWallet'
import request from '@/utils/request'


const router = useRouter()
const { walletState, Instance } = useEthers()
const availableFee = ref<string | '0'>('0')
const chainPrice = ref<string | '0'>('0')

const goToOrders = (): void => {
  // Navigate to orders page or show orders modal
  router.push('/orders')
}

const goToTrade = (): void => {
  // Navigate to trade page
  window.open(Instance.value.tradeUrl, '_blank');
}

const price = computed(() => {
  let apiPrice = walletState.value.apiPrice;
  return (apiPrice / Number(chainPrice.value)).toString();
})

const fetchData = async () => {
  if (!walletState.value.account) return
  try {
    // 加载手续费分红
    let availableFeeRes = await request.post(`/AvailableFee`);
    availableFee.value = (availableFeeRes.data).toString();

    let chainPriceres = await Instance.value.getTokenPrice();
    chainPrice.value = chainPriceres.price

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
.home-page {
  padding: 1rem;
  max-width: 400px;
  margin: 0 auto 20px auto;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-title {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.stat-icon {
  font-size: 1.2rem;
  opacity: 0.7;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

/* Quick Operations */
.quick-operations {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.operation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.operation-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.btn-cyan {
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
}

.btn-cyan:hover {
  background: linear-gradient(135deg, #00a8cc, #007a99);
}

.btn-green {
  background: linear-gradient(135deg, #00e676, #00c853);
}

.btn-green:hover {
  background: linear-gradient(135deg, #00c853, #00a040);
}

/* Earnings Overview */
.earnings-overview {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.earnings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.earning-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.earning-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.earning-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.earning-value.green {
  color: #00e676;
}

.earning-value.purple {
  color: #e91e63;
}

.earning-value.cyan {
  color: #00d4ff;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .home-page {
    padding: 0.5rem;
  }

  .stats-grid {
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-value {
    font-size: 1.6rem;
  }

  .operation-buttons {
    gap: 0.75rem;
  }

  .operation-btn {
    padding: 0.875rem;
    font-size: 0.85rem;
  }
}

@media (min-width: 481px) {
  .home-page {
    max-width: 420px;
  }
}
</style>
