<template>
    <div>
      <button 
        v-if="!walletState.isConnected" 
        @click="connectWallet"
        class="btn btn-primary"
      >
        Connect Wallet
      </button>
      
      <div v-else class="wallet-info">
        <div class="account-info">
          <span class="account-address">{{ shortenAddress(walletState.account) }}</span>
          <span class="network-id">Network: {{ walletState.chainId }}</span>
          <span class="balance">{{ walletState.balance }} ETH</span>
        </div>
        <button @click="disconnectWallet" class="btn btn-secondary">
          Disconnect
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useEthers } from '@/composables/useEthers'
  import { computed } from 'vue'
  
  const { connectWallet, disconnectWallet, walletState } = useEthers()
  
  const shortenAddress = (address: string) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
  </script>
  
  <style scoped>
  .wallet-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .account-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    border: none;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
  }
  
  .btn-secondary {
    background-color: #f44336;
    color: white;
  }
  
  .account-address {
    font-weight: bold;
  }
  </style>