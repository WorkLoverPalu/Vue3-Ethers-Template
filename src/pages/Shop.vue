<template>
  <div class="shop-page">
    <div class="shop-header">
      <h1 class="page-title">{{ t('investment.title') }}</h1>
    </div>
    
    <div class="plans-container">
      <div v-for="plan in investmentStore.plans" :key="plan.id" class="plan-card">
        <div class="plan-header">
          <div class="plan-left">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-usdt">{{ plan.usdt }} USDT</div>
          </div>
          <div class="plan-right">
            <div class="plan-power">{{ plan.amount }} U</div>
            <div class="power-label">{{ t('investment.power') }}</div>
          </div>
        </div>
        
        <div class="plan-details">
          <div class="detail-row">
            <span class="detail-label">{{ t('investment.dailyAdaptation') }}:</span>
            <span class="detail-value">{{ formatNumber(plan.dailyOutput) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ t('investment.expectedDailyIncome') }}:</span>
            <span class="detail-value green">{{ formatNumber(plan.totalOutput) }} TIG</span>
          </div>
        </div>
        
        <!-- Special note for A4 plan -->
        <div v-if="plan.id === 'A4'" class="special-note">
          {{ t('investment.a4SpecialNote') }}
        </div>
        
        <AppButton 
          variant="cyan" 
          class="purchase-btn" 
          :loading="purchaseLoading === plan.id"
          @click="purchasePlan(plan)"
        >
          {{ t('investment.purchase') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { investmentStore } from '@/stores'
import { t } from '@/utils/i18n'
import { formatNumber, sleep } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'
import type { InvestmentPlan } from '@/types'
import { useWallet } from '@/composables/useWallet'

const { walletStore } = useWallet()
const purchaseLoading = ref<string | null>(null)

const purchasePlan = async (plan: InvestmentPlan): Promise<void> => {
  if (!walletStore.connected) {
    alert(t('header.connect'))
    return
  }
  
  purchaseLoading.value = plan.id
  
  try {
    // Simulate purchase process
    await sleep(2000)
    console.log('Purchasing plan:', plan)
    alert(`Successfully purchased ${plan.name}!`)
  } catch (error) {
    console.error('Purchase failed:', error)
    alert('Purchase failed!')
  } finally {
    purchaseLoading.value = null
  }
}
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  padding: 0;
}

.shop-header {
  padding: 1.5rem 1rem 1rem;
  background: transparent;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.plans-container {
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.plan-left {
  display: flex;
  flex-direction: column;
}

.plan-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #00d4ff;
  margin: 0 0 0.5rem 0;
}

.plan-usdt {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.plan-right {
  text-align: right;
}

.plan-power {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  line-height: 1.2;
}

.power-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
}

.plan-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.detail-value {
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
}

.detail-value.green {
  color: #00e676;
}

.special-note {
  background: rgba(0, 230, 118, 0.1);
  border: 1px solid rgba(0, 230, 118, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
  color: #00e676;
  line-height: 1.4;
}

.purchase-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .shop-header {
    padding: 1rem;
  }
  
  .plans-container {
    padding: 0 0.5rem 2rem;
    gap: 0.75rem;
  }
  
  .plan-card {
    padding: 1.25rem;
  }
  
  .plan-power {
    font-size: 1.3rem;
  }
}
</style>
