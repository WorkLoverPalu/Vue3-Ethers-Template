<script setup lang="ts">
import { ref, watch } from 'vue'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  visible?: boolean
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'success',
  duration: 3000,
  visible: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const show = ref(false)

watch(() => props.visible, (newVal) => {
  if (newVal) {
    show.value = true
    // 自动关闭
    setTimeout(() => {
      close()
    }, props.duration)
  }
})

const close = () => {
  show.value = false
  emit('update:visible', false)
}

// 获取图标SVG路径
const getIconPath = () => {
  switch (props.type) {
    case 'success':
      return 'M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
    case 'error':
      return 'M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
    case 'warning':
      return 'M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.64 21H20.36A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z'
    case 'info':
      return 'M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
    default:
      return 'M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
  }
}

// 获取主题类名
const getThemeClass = () => {
  return `toast-${props.type}`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="show" class="toast-overlay" @click="close">
        <div class="toast" :class="getThemeClass()" @click.stop>
          <div class="toast-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :d="getIconPath()" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="toast-message">{{ message }}</span>
          <button class="toast-close" @click="close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
  pointer-events: none;
  z-index: 9999;
}

.toast {
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 350px;
  min-width: 280px;
  pointer-events: auto;
}

.toast-success {
  background: linear-gradient(135deg, #409EFF 0%, #409EFF 100%);
}

.toast-error {
  background: linear-gradient(135deg, #f56c6c 0%, #f56c6c 100%);
}

.toast-warning {
  background: linear-gradient(135deg, #e6a23c 0%, #e6a23c 100%);
}

.toast-info {
  background: linear-gradient(135deg, #909399 0%, #909399 100%);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  flex-shrink: 0;
}

.toast-message {
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

/* Toast 动画 */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateY(-50px) scale(0.8);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>