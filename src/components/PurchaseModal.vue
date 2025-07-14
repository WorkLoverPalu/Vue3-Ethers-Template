<template>
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
            <h2 class="modal-title">{{ t('purchase.confirmPurchase') }}</h2>

            <div class="purchase-details">
                <!-- Plan Details -->
                <div class="details-section">
                    <h3 class="section-title cyan">{{ t('purchase.planDetails') }}</h3>
                    <div class="detail-item">
                        <span class="detail-label">{{ t('purchase.plan') }}:</span>
                        <span class="detail-value">{{ selectedPlan?.name }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">{{ t('purchase.power') }}:</span>
                        <span class="detail-value">{{ selectedPlan?.amount }} U</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">{{ t('purchase.expectedDailyIncome') }}:</span>
                        <span class="detail-value">{{ formatNumber(selectedPlan?.totalOutput || 0) }} TIG</span>
                    </div>
                </div>

                <!-- Payment Information -->
                <div class="details-section">
                    <h3 class="section-title green">{{ t('purchase.paymentInfo') }}</h3>
                    <div class="detail-item">
                        <span class="detail-label">{{ t('purchase.needToPay') }}:</span>
                        <span class="detail-value">{{ selectedPlan?.usdt }} NOS</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">{{ t('purchase.myNOS') }}:</span>
                        <span class="detail-value">{{ formatNumber(userBalance) }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">{{ t('purchase.nosPrice') }}:</span>
                        <span class="detail-value">$1.00</span>
                    </div>
                </div>
            </div>

            <!-- Balance After Payment -->
            <div class="balance-section">
                <div class="balance-item">
                    <span class="balance-label">{{ t('purchase.balanceAfterPayment') }}:</span>
                    <span class="balance-value">{{ formatNumber(balanceAfterPayment) }} NOS</span>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-actions">
                <AppButton variant="secondary" class="cancel-btn" @click="handleCancel">
                    {{ t('purchase.cancel') }}
                </AppButton>
                <AppButton variant="cyan" class="confirm-btn" :loading="isProcessing" :disabled="!canPurchase"
                    @click="handleConfirm">
                    {{ t('purchase.confirmPurchase') }}
                </AppButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { t } from '@/utils/i18n'
import { formatNumber, sleep } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'
import type { InvestmentPlan } from '@/types'

interface Props {
    isVisible: boolean
    selectedPlan: InvestmentPlan | null
    userBalance?: number
}

interface Emits {
    (e: 'close'): void
    (e: 'confirm', plan: InvestmentPlan): void
}

const props = withDefaults(defineProps<Props>(), {
    userBalance: 2450.00
})

const emit = defineEmits<Emits>()

const isProcessing = ref(false)

const balanceAfterPayment = computed(() => {
    if (!props.selectedPlan) return props.userBalance
    return props.userBalance - props.selectedPlan.usdt
})

const canPurchase = computed(() => {
    if (!props.selectedPlan) return false
    return props.userBalance >= props.selectedPlan.usdt
})

const handleOverlayClick = (): void => {
    if (!isProcessing.value) {
        emit('close')
    }
}

const handleCancel = (): void => {
    if (!isProcessing.value) {
        emit('close')
    }
}

const handleConfirm = async (): Promise<void> => {
    if (!props.selectedPlan || !canPurchase.value || isProcessing.value) return

    isProcessing.value = true

    try {
        // Simulate purchase process
        await sleep(2000)
        emit('confirm', props.selectedPlan)
        emit('close')
    } catch (error) {
        console.error('Purchase failed:', error)
        alert('Purchase failed!')
    } finally {
        isProcessing.value = false
    }
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
    padding: 2rem;
    width: 100%;
    max-width: 480px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    text-align: center;
    margin: 0 0 2rem 0;
}

.purchase-details {
    display: flex;
    /* display: grid; */
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.details-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.section-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
}

.section-title.cyan {
    color: #00d4ff;
}

.section-title.green {
    color: #00e676;
}

.detail-item {
    display: flex;
    /* flex-direction: column; */
    /* justify-content: space-between; */
    gap: 0.25rem;
}

.detail-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.detail-value {
    font-size: 1rem;
    color: white;
    font-weight: 600;
}

.balance-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.balance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.balance-label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
}

.balance-value {
    font-size: 1.2rem;
    color: white;
    font-weight: bold;
}

.modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.cancel-btn,
.confirm-btn {
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
}

.cancel-btn {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
}

.cancel-btn:hover {
    background: rgba(255, 255, 255, 0.3) !important;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .modal-content {
        padding: 1.5rem;
        margin: 1rem;
    }

    .purchase-details {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .modal-actions {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .modal-title {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
    }
}

@media (max-width: 480px) {
    .modal-overlay {
        padding: 0.5rem;
    }

    .modal-content {
        padding: 1.25rem;
    }

    .balance-section {
        padding: 1.25rem;
    }
}
</style>
