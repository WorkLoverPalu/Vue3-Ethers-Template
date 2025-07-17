<template>
  <div>
    <router-view />
    <Toast 
      v-model:visible="toastState.visible"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
    />
  </div>
</template>

<script setup lang="ts">
import router from './router'
import Toast from '@/components/Toast.vue'
import { useToast } from '@/stores/useToast'
const { toastState, showSuccess, showError } = useToast()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>