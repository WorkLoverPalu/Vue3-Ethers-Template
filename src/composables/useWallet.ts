import { ethers } from "ethers"
import { walletStore } from "@/stores"

export interface UseWalletReturn {
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  walletStore: typeof walletStore
}

export function useWallet(): UseWalletReturn {
  const connectWallet = async (): Promise<void> => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        walletStore.provider = new ethers.BrowserProvider(window.ethereum)
        walletStore.signer = await walletStore.provider.getSigner()
        walletStore.address = await walletStore.signer.getAddress()
        walletStore.connected = true
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        throw error
      }
    } else {
      const message = "Please install MetaMask!"
      alert(message)
      throw new Error(message)
    }
  }

  const disconnectWallet = (): void => {
    walletStore.connected = false
    walletStore.provider = null
    walletStore.signer = null
    walletStore.address = ""
  }

  return {
    connectWallet,
    disconnectWallet,
    walletStore,
  }
}
