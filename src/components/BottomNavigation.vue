<template>
  <nav class="bottom-nav">
    <router-link 
      v-for="tab in tabs" 
      :key="tab.id"
      :to="tab.path"
      :class="['nav-item']"
      active-class="active"
    >
      <i :class="tab.icon"></i>
      <span>{{ t(`nav.${tab.id}`) }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { t } from '@/utils/i18n'
import type { NavigationTab } from '@/types'

const tabs: NavigationTab[] = [
  { id: 'home', path: '/', icon: 'fas fa-home' },
  { id: 'shop', path: '/shop', icon: 'fas fa-shopping-cart' },
  { id: 'wallet', path: '/wallet', icon: 'fas fa-wallet' },
  { id: 'team', path: '/team', icon: 'fas fa-users' },
  { id: 'community', path: '/community', icon: 'fas fa-trophy' }
]
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  padding: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.nav-item.active {
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
}

.nav-item i {
  font-size: 1.2rem;
}

/* Font Awesome Icons */
.fas {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.fa-home::before { content: '🏠'; }
.fa-shopping-cart::before { content: '🛒'; }
.fa-wallet::before { content: '💳'; }
.fa-users::before { content: '👥'; }
.fa-trophy::before { content: '🏆'; }
</style>
