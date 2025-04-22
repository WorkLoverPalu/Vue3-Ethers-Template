<template>
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/">DApp Scaffold</router-link>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </div>
      <div class="navbar-actions">
        <ConnectWallet />
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import ConnectWallet from './ConnectWallet.vue'
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
  }
  
  .navbar-brand a {
    font-weight: bold;
    font-size: 1.2rem;
    text-decoration: none;
    color: #333;
  }
  
  .navbar-menu {
    display: flex;
    gap: 1rem;
  }
  
  .nav-link {
    text-decoration: none;
    color: #333;
    padding: 0.5rem;
  }
  
  .nav-link:hover {
    color: #4CAF50;
  }
  
  .navbar-actions {
    display: flex;
    align-items: center;
  }
  </style>