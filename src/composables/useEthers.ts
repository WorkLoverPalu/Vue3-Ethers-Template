import { ethers } from 'ethers'
import { computed } from 'vue'
import { useWalletStore } from '@/stores/wallet'

export function useEthers() {
  const walletStore = useWalletStore()
  
  const connectWallet = async () => {
    await walletStore.connectWallet()
  }
  
  const disconnectWallet = () => {
    walletStore.disconnectWallet()
  }
  
  const getContract = (address: string, abi: any) => {
    if (!walletStore.signer) {
      throw new Error('Wallet not connected')
    }
    return new ethers.Contract(address, abi, walletStore.signer)
  }
  
  const walletState = computed(() => ({
    account: walletStore.account,
    chainId: walletStore.chainId,
    balance: walletStore.balance,
    isConnected: walletStore.isConnected
  }))
  
  return {
    connectWallet,
    disconnectWallet,
    getContract,
    walletState
  }
}