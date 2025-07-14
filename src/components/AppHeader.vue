<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <img src="@/assets/img/logo.png"  class="logo-icon" alt="">
        <span class="logo-text">{{ t('header.title') }}</span>
      </div>
      <div class="header-actions">
        <select v-model="selectedLang" @change="handleLanguageChange" class="lang-select">
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
        <button class="connect-btn" @click="handleWalletConnection">
          {{ walletStore.connected ? t('header.connected') : t('header.connect') }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { t, changeLanguage } from '@/utils/i18n'
import { useWallet } from '@/composables/useWallet'
import type { Language } from '@/types'

const { connectWallet, walletStore } = useWallet()
const selectedLang = ref<Language>('zh')

const handleLanguageChange = (): void => {
  changeLanguage(selectedLang.value)
}

const handleWalletConnection = async (): Promise<void> => {
  if (!walletStore.connected) {
    try {
      await connectWallet()
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }
}

onMounted(() => {
  // Any additional setup can be done here
})
</script>

<style scoped>
.header {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  backdrop-filter: blur(10px);
}
.logo-text{
  font-size: 18px;
  font-weight: bold;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 50px;
  height: 50px;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.lang-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
}

.connect-btn {
  background: linear-gradient(45deg, #00d4ff, #5b86e5);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
</style>
