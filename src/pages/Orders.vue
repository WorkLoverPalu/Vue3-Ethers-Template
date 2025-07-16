<template>
  <div class="orders-page">
    <div class="orders-header">
      <h1 class="page-title">{{ t('orders.title') }}</h1>

    </div>


    <!-- Orders List -->
    <div class="orders-container">
      <div v-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">{{ t('orders.noOrders') }}</div>
        <AppButton variant="cyan" @click="goToShop">
          {{ t('orders.goShopping') }}
        </AppButton>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.Id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <div class="order-plan">A {{ order.EnergyId }}</div>
              <div class="order-date">{{ (order.CreateTime) }}</div>
            </div>
           
          </div>

          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">{{ t('orders.orderAmount') }}:</span>
              <span class="detail-value">{{ order.UAmount }} USDT</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ t('orders.power') }}:</span>
              <span class="detail-value">{{ order.Pow }} T</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ t('orders.已释放天数') }}:</span>
              <span class="detail-value green">{{ formatNumber(order.SucDay) }} </span>
            </div>

          </div>

          <div class="order-progress">
            <div class="progress-info">
              <span class="progress-label">{{ t('orders.progress') }}</span>
              <span class="progress-text">{{ order.SucDay }}/{{ 600 }} {{ t('orders.days') }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${(order.SucDay / 600) * 100}%` }"></div>
            </div>
          </div>


        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/utils/i18n'
import { formatNumber } from '@/utils/formatters'
import AppButton from '@/components/AppButton.vue'
import request from '@/utils/request'
import { useEthers } from '@/composables/useWallet'

const { walletState } = useEthers()
const router = useRouter()
// Mock order data
const orders = ref<any[]>([
])
const goToShop = (): void => {
  router.push('/shop')
}

const fetchData = async () => {
  try {
    const res = await request.post(`/MyBackPack?addr=${walletState.value.account}`);
    console.log("res", res)
    orders.value = res.data;
  } catch (error) {
    console.error('Failed to fetch data:', error)
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
.orders-page {
  min-height: 100vh;
  padding: 0;
}

.orders-header {
  padding: 1.5rem 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}



/* Orders Container */
.order-info{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.orders-container {
  padding: 0 1rem 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.order-plan {
  font-size: 1.1rem;
  font-weight: 600;
  color: #00d4ff;
  margin-bottom: 0.25rem;
}

.order-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(0, 230, 118, 0.2);
  color: #00e676;
  border: 1px solid rgba(0, 230, 118, 0.3);
}

.status-badge.completed {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.status-badge.cancelled {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.order-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.detail-value {
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
}

.detail-value.green {
  color: #00e676;
}

.detail-value.purple {
  color: #e91e63;
}

.order-progress {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #00a8cc);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.order-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .orders-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .order-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .order-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .order-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .orders-header {
    padding: 1rem;
  }

  .orders-container {
    padding: 0 0.5rem 2rem;
  }

  .order-card {
    padding: 1.25rem;
  }

  .order-actions {
    flex-direction: column;
  }
}
</style>
