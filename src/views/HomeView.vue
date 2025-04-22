<template>
    <div class="home">
      <h1>Welcome to DApp Scaffold</h1>
      <p>A Vue3 + Ethers.js DApp starter template</p>
      
      <div class="wallet-section">
        <h2>Wallet Connection</h2>
        <ConnectWallet />
      </div>
      
      <div class="contract-section">
        <h2>Contract Interaction</h2>
        <ContractInteraction />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import ConnectWallet from '@/components/ConnectWallet.vue'
  import ContractInteraction from '@/components/ContractInteraction.vue'
  </script>
  
  <style scoped>
  .home {
    padding: 2rem 0;
  }
  
  .wallet-section, .contract-section {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 0.5rem;
  }
  </style>