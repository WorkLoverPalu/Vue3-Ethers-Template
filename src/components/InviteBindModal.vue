<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ t('invite.bindTitle') }}</h2>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>
      
      <div class="modal-body">
        <!-- Info Section -->
        <div class="info-section">
          <div class="info-icon">🔗</div>
          <div class="info-text">
            <h3 class="info-title">{{ t('invite.bindRequired') }}</h3>
            <p class="info-desc">{{ t('invite.bindDescription') }}</p>
          </div>
        </div>

        <!-- Input Section -->
        <div class="input-section">
          <label class="input-label">{{ t('invite.inviteAddress') }}</label>
          <div class="input-container">
            <input
              v-model="inviteAddress"
              type="text"
              :placeholder="t('invite.addressPlaceholder')"
              class="address-input"
              :class="{ 'error': hasError }"
              @input="clearError"
              @paste="handlePaste"
            />
            <button 
              v-if="inviteAddress" 
              class="clear-btn" 
              @click="clearInput"
            >
              ✕
            </button>
          </div>
          <div v-if="hasError" class="error-message">
            {{ errorMessage }}
          </div>
          <div class="input-hint">
            {{ t('invite.inputHint') }}
          </div>
        </div>

        <!-- Validation Status -->
        <div v-if="isValidating" class="validation-status">
          <div class="loading-spinner"></div>
          <span>{{ t('invite.validating') }}</span>
        </div>

        <div v-if="validationResult" class="validation-result">
          <div v-if="validationResult.valid" class="validation-success">
            <div class="success-icon">✓</div>
            <div class="success-info">
              <div class="success-title">{{ t('invite.validAddress') }}</div>
              <div class="success-desc">
                {{ t('invite.inviterInfo') }}: {{ validationResult.inviterName }}
              </div>
            </div>
          </div>
          <div v-else class="validation-error">
            <div class="error-icon">✗</div>
            <div class="error-info">
              <div class="error-title">{{ t('invite.invalidAddress') }}</div>
              <div class="error-desc">{{ validationResult.message }}</div>
            </div>
          </div>
        </div>

        <!-- Benefits Section -->
        <div class="benefits-section">
          <h4 class="benefits-title">{{ t('invite.bindBenefits') }}</h4>
          <ul class="benefits-list">
            <li>{{ t('invite.benefit1') }}</li>
            <li>{{ t('invite.benefit2') }}</li>
            <li>{{ t('invite.benefit3') }}</li>
          </ul>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions">
        <AppButton 
          variant="secondary" 
          @click="handleClose"
          :disabled="isBinding"
        >
          {{ t('invite.cancel') }}
        </AppButton>
        <AppButton 
          variant="cyan" 
          @click="handleBind"
          :loading="isBinding"
          :disabled="!canBind"
        >
          {{ t('invite.confirmBind') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { t } from '@/utils/i18n'
import { sleep, truncateAddress } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'

interface ValidationResult {
  valid: boolean
  inviterName?: string
  message?: string
}

interface Props {
  isVisible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'bind-success', address: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const inviteAddress = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const isValidating = ref(false)
const isBinding = ref(false)
const validationResult = ref<ValidationResult | null>(null)

const canBind = computed(() => {
  return inviteAddress.value.length > 0 && 
         validationResult.value?.valid && 
         !isValidating.value && 
         !isBinding.value
})

// Watch for address changes to trigger validation
watch(inviteAddress, async (newAddress) => {
  if (newAddress.length === 0) {
    validationResult.value = null
    return
  }
  
  if (newAddress.length < 10) {
    return // Wait for more input
  }
  
  await validateAddress(newAddress)
})

const validateAddress = async (address: string): Promise<void> => {
  if (isValidating.value) return
  
  isValidating.value = true
  validationResult.value = null
  
  try {
    // Simulate API call to validate invite address
    await sleep(1500)
    
    // Mock validation logic
    if (address.length < 20) {
      validationResult.value = {
        valid: false,
        message: t('invite.addressTooShort')
      }
    } else if (address.includes('invalid')) {
      validationResult.value = {
        valid: false,
        message: t('invite.addressNotFound')
      }
    } else {
      validationResult.value = {
        valid: true,
        inviterName: `user_${address.slice(-6)}`
      }
    }
  } catch (error) {
    validationResult.value = {
      valid: false,
      message: t('invite.validationError')
    }
  } finally {
    isValidating.value = false
  }
}

const handlePaste = async (event: ClipboardEvent): Promise<void> => {
  // Handle paste event for better UX
  await sleep(100) // Wait for paste to complete
  if (inviteAddress.value) {
    await validateAddress(inviteAddress.value)
  }
}

const clearInput = (): void => {
  inviteAddress.value = ''
  validationResult.value = null
  clearError()
}

const clearError = (): void => {
  hasError.value = false
  errorMessage.value = ''
}

const handleOverlayClick = (): void => {
  if (!isBinding.value) {
    handleClose()
  }
}

const handleClose = (): void => {
  if (!isBinding.value) {
    emit('close')
    resetForm()
  }
}

const handleBind = async (): Promise<void> => {
  if (!canBind.value) return
  
  isBinding.value = true
  
  try {
    // Simulate binding API call
    await sleep(2000)
    
    // Success
    emit('bind-success', inviteAddress.value)
    resetForm()
  } catch (error) {
    hasError.value = true
    errorMessage.value = t('invite.bindError')
  } finally {
    isBinding.value = false
  }
}

const resetForm = (): void => {
  inviteAddress.value = ''
  hasError.value = false
  errorMessage.value = ''
  validationResult.value = null
  isValidating.value = false
  isBinding.value = false
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
  max-width: 500px;
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

.modal-body {
  padding: 2rem;
}

/* Info Section */
.info-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-text {
  flex: 1;
}

.info-title {
  font-size: 1rem;
  font-weight: 600;
  color: #00d4ff;
  margin: 0 0 0.5rem 0;
}

.info-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
}

/* Input Section */
.input-section {
  margin-bottom: 2rem;
}

.input-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.address-input {
  width: 100%;
  padding: 1rem;
  padding-right: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.address-input:focus {
  outline: none;
  border-color: #00d4ff;
  background: rgba(255, 255, 255, 0.15);
}

.address-input.error {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.address-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.error-message {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.input-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
  line-height: 1.4;
}

/* Validation Status */
.validation-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.validation-result {
  margin-bottom: 1.5rem;
}

.validation-success,
.validation-error {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.validation-success {
  background: rgba(0, 230, 118, 0.1);
  border: 1px solid rgba(0, 230, 118, 0.3);
}

.validation-error {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.success-icon,
.error-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.success-icon {
  background: #00e676;
  color: white;
}

.error-icon {
  background: #f44336;
  color: white;
}

.success-info,
.error-info {
  flex: 1;
}

.success-title,
.error-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.success-title {
  color: #00e676;
}

.error-title {
  color: #f44336;
}

.success-desc,
.error-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Benefits Section */
.benefits-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.benefits-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.benefits-list li::before {
  content: '✓';
  color: #00e676;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.benefits-list li:last-child {
  margin-bottom: 0;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
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
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-actions {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }
  
  .info-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
