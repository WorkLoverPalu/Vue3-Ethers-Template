<template>
  <div class="orders-page">
    <div class="orders-header">
      <h1 class="page-title">{{ t('orders.title') }}</h1>
      <div class="header-actions">
        <select v-model="selectedStatus" @change="filterOrders" class="status-filter">
          <option value="all">{{ t('orders.allStatus') }}</option>
          <option value="active">{{ t('orders.active') }}</option>
          <option value="completed">{{ t('orders.completed') }}</option>
          <option value="cancelled">{{ t('orders.cancelled') }}</option>
        </select>
      </div>
    </div>

    <!-- Order Statistics -->
    <div class="order-stats">
      <div class="stat-item">
        <div class="stat-value">{{ orderStats.total }}</div>
        <div class="stat-label">{{ t('orders.totalOrders') }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-value green">{{ orderStats.active }}</div>
        <div class="stat-label">{{ t('orders.activeOrders') }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-value blue">{{ orderStats.completed }}</div>
        <div class="stat-label">{{ t('orders.completedOrders') }}</div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="orders-container">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">{{ t('orders.noOrders') }}</div>
        <AppButton variant="cyan" @click="goToShop">
          {{ t('orders.goShopping') }}
        </AppButton>
      </div>
      
      <div v-else class="orders-list">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="order-card"
          @click="viewOrderDetails(order)"
        >
          <div class="order-header">
            <div class="order-info">
              <div class="order-plan">{{ order.planName }}</div>
              <div class="order-date">{{ formatDate(order.createdAt) }}</div>
            </div>
            <div class="order-status">
              <span :class="['status-badge', order.status]">
                {{ t(`orders.status.${order.status}`) }}
              </span>
            </div>
          </div>
          
          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">{{ t('orders.orderAmount') }}:</span>
              <span class="detail-value">{{ order.amount }} USDT</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ t('orders.power') }}:</span>
              <span class="detail-value">{{ order.power }} U</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ t('orders.dailyIncome') }}:</span>
              <span class="detail-value green">{{ formatNumber(order.dailyIncome) }} TIG</span>
            </div>
            <div v-if="order.status === 'active'" class="detail-row">
              <span class="detail-label">{{ t('orders.totalEarned') }}:</span>
              <span class="detail-value purple">{{ formatNumber(order.totalEarned) }} TIG</span>
            </div>
          </div>

          <div class="order-progress" v-if="order.status === 'active'">
            <div class="progress-info">
              <span class="progress-label">{{ t('orders.progress') }}</span>
              <span class="progress-text">{{ order.daysCompleted }}/{{ order.totalDays }} {{ t('orders.days') }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${(order.daysCompleted / order.totalDays) * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="order-actions">
            <AppButton 
              variant="secondary" 
              size="small" 
              @click.stop="viewOrderDetails(order)"
            >
              {{ t('orders.viewDetails') }}
            </AppButton>
            <AppButton 
              v-if="order.status === 'active' && order.canCancel" 
              variant="danger" 
              size="small"
              @click.stop="cancelOrder(order)"
            >
              {{ t('orders.cancel') }}
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <OrderDetailsModal
      :is-visible="showDetailsModal"
      :order="selectedOrder"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/utils/i18n'
import { formatDate, formatNumber } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'
import OrderDetailsModal from '@/components/OrderDetailsModal.vue'
import type { Order } from '@/types'

const router = useRouter()

const selectedStatus = ref<string>('all')
const showDetailsModal = ref(false)
const selectedOrder = ref<Order | null>(null)

// Mock order data
const orders = reactive<Order[]>([
  {
    id: 'ORD001',
    planName: 'A4 计划',
    amount: 1000,
    power: 2200,
    dailyIncome: 73.32,
    totalEarned: 1466.4,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    daysCompleted: 20,
    totalDays: 600,
    canCancel: false
  },
  {
    id: 'ORD002',
    planName: 'A3 计划',
    amount: 500,
    power: 1050,
    dailyIncome: 35.0,
    totalEarned: 2100,
    status: 'completed',
    createdAt: new Date('2023-12-15'),
    daysCompleted: 60,
    totalDays: 60,
    canCancel: false
  },
  {
    id: 'ORD003',
    planName: 'A2 计划',
    amount: 300,
    power: 600,
    dailyIncome: 20.0,
    totalEarned: 800,
    status: 'active',
    createdAt: new Date('2024-01-10'),
    daysCompleted: 40,
    totalDays: 90,
    canCancel: true
  },
  {
    id: 'ORD004',
    planName: 'A1 计划',
    amount: 100,
    power: 190,
    dailyIncome: 6.33,
    totalEarned: 0,
    status: 'cancelled',
    createdAt: new Date('2024-01-05'),
    daysCompleted: 0,
    totalDays: 30,
    canCancel: false
  }
])

const orderStats = computed(() => ({
  total: orders.length,
  active: orders.filter(order => order.status === 'active').length,
  completed: orders.filter(order => order.status === 'completed').length
}))

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders
  }
  return orders.filter(order => order.status === selectedStatus.value)
})

const filterOrders = (): void => {
  // Filter logic is handled by computed property
}

const viewOrderDetails = (order: Order): void => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const closeDetailsModal = (): void => {
  showDetailsModal.value = false
  selectedOrder.value = null
}

const cancelOrder = async (order: Order): Promise<void> => {
  const confirmed = confirm(t('orders.confirmCancel'))
  if (confirmed) {
    order.status = 'cancelled'
    alert(t('orders.cancelSuccess'))
  }
}

const goToShop = (): void => {
  router.push('/shop')
}

// All hooks must be called at the top level
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.status-filter {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.status-filter option {
  background: #1e3c72;
  color: white;
}

/* Order Statistics */
.order-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 0 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.25rem;
}

.stat-value.green {
  color: #00e676;
}

.stat-value.blue {
  color: #2196f3;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Orders Container */
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
