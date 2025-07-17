import { ethers } from "ethers"
import { computed } from 'vue'
import { useWalletStore } from "@/stores/wallet"
import { StakingContractService } from '@/utils/contractService'

export function useEthers() {
  const walletStore = useWalletStore()

  //获取操作实例
  const Instance = computed(() => {
    if (!walletStore.signer) return null
    return new StakingContractService(walletStore.signer)
  })

  return {
    parseInviteFromURL: walletStore.parseInviteFromURL,
    connectWallet: walletStore.connectWallet,
    disconnectWallet: walletStore.disconnectWallet,
    setApiUserInfo: walletStore.setApiUserInfo,
    clearUseProfit: walletStore.clearUseProfit,
    walletState: computed(() => ({
      account: walletStore.account,
      chainId: walletStore.chainId,
      balance: walletStore.balance,
      isConnected: walletStore.isConnected,
      inviteAddress: walletStore.inviteAddress,
      apiUserInfo: walletStore.apiUserInfo,
      chainUserInfo: walletStore.chainUserInfo,
    })),
    Instance
  }
}