<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ t('orders.orderDetails') }}</h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div v-if="order" class="order-details">
        <!-- Order Info -->
        <div class="details-section">
          <h3 class="section-title">{{ t('orders.basicInfo') }}</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">{{ t('orders.orderId') }}:</span>
              <span class="info-value">{{ order.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orders.planName') }}:</span>
              <span class="info-value">{{ order.planName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orders.orderAmount') }}:</span>
              <span class="info-value">{{ order.amount }} USDT</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orders.power') }}:</span>
              <span class="info-value">{{ order.power }} U</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orders.status.label') }}:</span>
              <span :class="['status-badge', order.status]">
                {{ t(`orders.status.${order.status}`) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orders.createTime') }}:</span>
              <span class="info-value">{{ formatDate(order.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Earnings Info -->
        <div class="details-section">
          <h3 class="section-title">{{ t('orders.earningsInfo') }}</h3>
          <div class="earnings-grid">
            <div class="earning-card">
              <div class="earning-label">{{ t('orders.dailyIncome') }}</div>
              <div class="earning-value green">{{ formatNumber(order.dailyIncome) }} TIG</div>
            </div>
            <div class="earning-card">
              <div class="earning-label">{{ t('orders.totalEarned') }}</div>
              <div class="earning-value purple">{{ formatNumber(order.totalEarned) }} TIG</div>
            </div>
            <div class="earning-card">
              <div class="earning-label">{{ t('orders.expectedTotal') }}</div>
              <div class="earning-value blue">{{ formatNumber(order.dailyIncome * order.totalDays) }} TIG</div>
            </div>
          </div>
        </div>

        <!-- Progress Info -->
        <div v-if="order.status === 'active'" class="details-section">
          <h3 class="section-title">{{ t('orders.progressInfo') }}</h3>
          <div class="progress-details">
            <div class="progress-stats">
              <div class="progress-stat">
                <span class="stat-label">{{ t('orders.completedDays') }}:</span>
                <span class="stat-value">{{ order.daysCompleted }} {{ t('orders.days') }}</span>
              </div>
              <div class="progress-stat">
                <span class="stat-label">{{ t('orders.remainingDays') }}:</span>
                <span class="stat-value">{{ order.totalDays - order.daysCompleted }} {{ t('orders.days') }}</span>
              </div>
              <div class="progress-stat">
                <span class="stat-label">{{ t('orders.completionRate') }}:</span>
                <span class="stat-value">{{ Math.round((order.daysCompleted / order.totalDays) * 100) }}%</span>
              </div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${(order.daysCompleted / order.totalDays) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <AppButton 
            v-if="order.status === 'active' && order.canCancel" 
            variant="danger"
            @click="handleCancelOrder"
          >
            {{ t('orders.cancel') }}
          </AppButton>
          <AppButton variant="secondary" @click="$emit('close')">
            {{ t('orders.close') }}
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/utils/i18n'
import { formatDate, formatNumber } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'
import type { Order } from '@/types'

interface Props {
  isVisible: boolean
  order: Order | null
}

interface Emits {
  (e: 'close'): void
  (e: 'cancel-order', order: Order): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleOverlayClick = (): void => {
  emit('close')
}

const handleCancelOrder = (): void => {
  // Emit cancel order event to parent
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: white;
}

.order-details {
  padding: 2rem;
}

.details-section {
  margin-bottom: 2rem;
}

.details-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #00d4ff;
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.info-value {
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
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

.earnings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.earning-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.earning-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.earning-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.earning-value.green {
  color: #00e676;
}

.earning-value.purple {
  color: #e91e63;
}

.earning-value.blue {
  color: #2196f3;
}

.progress-details {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.progress-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.stat-value {
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
}

.progress-bar-container {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #00a8cc);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .order-details {
    padding: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .earnings-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-stats {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
