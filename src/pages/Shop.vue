<template>
  <div class="shop-page">
    <div class="shop-header">
      <h1 class="page-title">{{ t('investment.title') }}</h1>
    </div>
    <div class="plans-container">
      <div v-for="plan in shopList.value" :key="plan.Id" class="plan-card">
        <div class="plan-header">
          <div class="plan-left">
            <h3 class="plan-name">{{ plan.Name }}</h3>
            <div class="plan-usdt">{{ plan.UAmount }} USDT</div>
          </div>
          <div class="plan-right">
            <div class="plan-power">{{ plan.UAmount }} T</div>
            <div class="power-label">{{ t('investment.power') }}</div>
          </div>
        </div>

        <div class="plan-details">
          <div class="detail-row">
            <span class="detail-label">{{ t('investment.dailyAdaptation') }}:</span>
            <span class="detail-value">1/{{ plan.MaxDay }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ t('investment.收益天数') }}:</span>
            <span class="detail-value green">{{ plan.MaxDay }} </span>
          </div>
        </div>

        <!-- Special note for A4 plan -->
        <div v-if="plan.id === 'A4'" class="special-note">
          {{ t('investment.a4SpecialNote') }}
        </div>

        <AppButton variant="cyan" class="purchase-btn" @click="handlePurchaseClick(plan)">
          {{ userInfo.PAddr?t('investment.purchase'):"绑定邀请地址" }}{{ showInviteBindModal }}
        </AppButton>
      </div>
    </div>
    <!-- Invite Bind Modal -->
    
    <InviteBindModal :is-visible="showInviteBindModal" @close="closeInviteBindModal"
      @bind-success="handleBindSuccess" />
    <!-- Purchase Modal -->
    <PurchaseModal :is-visible="showPurchaseModal" :selected-plan="selectedPlan" :user-balance="userBalance"
      @close="closePurchaseModal" @confirm="handlePurchaseConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { t } from '@/utils/i18n'
import { formatNumber } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'
import PurchaseModal from '@/components/PurchaseModal.vue'
import InviteBindModal from '@/components/InviteBindModal.vue'
import type { InvestmentPlan } from '@/types'
import { useEthers } from '@/composables/useWallet'
import { userStore } from '@/stores/user'

const { walletState } = useEthers()
const useUserStore = userStore();
const showInviteBindModal = ref(false)
const showPurchaseModal = ref(false)
const selectedPlan = ref<InvestmentPlan | null>(null)
const userBalance = ref(2450.00) // This would come from your wallet/user store
const hasInviteAddress = ref(false)
const inviteAddress = ref('')
const shopList = ref<Array<Object> | []>
const userInfo = ref({});

const handlePurchaseClick = (plan: InvestmentPlan): void => {
  selectedPlan.value = plan

  // Check if user has bound invite address
  // if (!walletState.isConnected) {
  //   alert(t('header.connect'))
  //   return
  // }
  console.log(hasInviteAddress.value)
  if (!hasInviteAddress.value) {
    showInviteBindModal.value = true
  } else {
    showPurchaseModal.value = true
  }
}
const closeInviteBindModal = (): void => {
  showInviteBindModal.value = false
  selectedPlan.value = null
}

const handleBindSuccess = (address: string): void => {
  inviteAddress.value = address
  hasInviteAddress.value = true
  showInviteBindModal.value = false

  // Show success message
  alert(t('invite.bindSuccessMessage'))

  // Now show purchase modal
  if (selectedPlan.value) {
    showPurchaseModal.value = true
  }
}


const openPurchaseModal = (plan: InvestmentPlan): void => {
  // if (!walletState.isConnected) {
  //   alert(t('header.connect'))
  //   return
  // }

  selectedPlan.value = plan
  showPurchaseModal.value = true
}

const closePurchaseModal = (): void => {
  showPurchaseModal.value = false
  selectedPlan.value = null
}

const handlePurchaseConfirm = (plan: InvestmentPlan): void => {
  console.log('Purchase confirmed for plan:', plan)
  // Update user balance
  userBalance.value -= plan.usdt
  alert(`Successfully purchased ${plan.name}!`)
}


const fetchData = async () => {
  try {
    shopList.value = await useUserStore.getShopList();
    userInfo.value = await useUserStore.getUserInfo(walletState.value.account);
    hasInviteAddress.value=userInfo.value.PAddr?true:false;
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
  background-color: #00d4ff;
  color: #fff;
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
