<template>
  <div class="stat-card" :class="cardClass">
    <h3 v-if="title">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  cardClass?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  cardClass: ''
})
</script>

<style scoped>
.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card h3 {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}
</style>
