import { ref } from 'vue'

interface ToastState {
  visible: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

const toastState = ref<ToastState>({
  visible: false,
  message: '',
  type: 'success',
  duration: 3000
})

export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', duration: number = 3000) => {
    toastState.value = {
      visible: true,
      message,
      type,
      duration
    }
  }

  const hideToast = () => {
    toastState.value.visible = false
  }

  const showSuccess = (message: string, duration?: number) => {
    showToast(message, 'success', duration)
  }

  const showError = (message: string, duration?: number) => {
    showToast(message, 'error', duration)
  }

  const showWarning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration)
  }

  const showInfo = (message: string, duration?: number) => {
    showToast(message, 'info', duration)
  }

  return {
    toastState,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}