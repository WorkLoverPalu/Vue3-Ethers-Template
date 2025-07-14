<template>
  <div class="home-page">
    <!-- Stats Grid - 2x2 layout -->
    <div class="stats-grid">
      <!-- My Power -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.myPower') }}</span>
          <div class="stat-icon lightning">⚡</div>
        </div>
        <div class="stat-value">{{ userStore.stats.power }} T</div>
        <div class="stat-label">{{ t('dashboard.level') }}: A3</div>
      </div>

      <!-- Daily Income -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.dailyIncome') }}</span>
          <div class="stat-icon trending">📈</div>
        </div>
        <div class="stat-value">{{ formatNumber(userStore.stats.dailyOutput) }}</div>
        <div class="stat-label">TIG</div>
      </div>

      <!-- Total Assets -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.totalAssets') }}</span>
          <div class="stat-icon wallet">💳</div>
        </div>
        <div class="stat-value">${{ formatNumber(userStore.stats.balance) }}</div>
        <div class="stat-label">USDT</div>
      </div>

      <!-- Team Members -->
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ t('dashboard.teamMembers') }}</span>
          <div class="stat-icon people">👥</div>
        </div>
        <div class="stat-value">{{ userStore.stats.teamMembers }}</div>
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
      <h3 class="section-title">{{ t('dashboard.earningsOverview') }}</h3>
      <div class="earnings-list">
        <div class="earning-item">
          <span class="earning-label">{{ t('dashboard.availableEarnings') }}</span>
          <span class="earning-value green">{{ formatNumber(userStore.stats.availableEarnings) }} TIG</span>
        </div>
        <div class="earning-item">
          <span class="earning-label">{{ t('dashboard.availableTeamRewards') }}</span>
          <span class="earning-value purple">{{ formatNumber(userStore.stats.teamEarnings) }} TIG</span>
        </div>
        <div class="earning-item">
          <span class="earning-label">{{ t('dashboard.tigPrice') }}</span>
          <span class="earning-value cyan">${{ formatNumber(userStore.stats.tigPrice, 3) }} (+2.3%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userStore } from '@/stores/user'
import { t } from '@/utils/i18n'
import { formatNumber } from '@/utils/helpers'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToOrders = (): void => {
  // Navigate to orders page or show orders modal
  router.push('/orders')
}

const goToTrade = (): void => {
  // Navigate to trade page
  router.push('/shop')
}
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
