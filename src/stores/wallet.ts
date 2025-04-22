import { defineStore } from 'pinia'
import { ethers } from 'ethers'

interface WalletState {
    provider: ethers.providers.Web3Provider | null  // v5 使用 Web3Provider
    signer: ethers.Signer | null
    account: string
    chainId: number  // v5 使用 number 而不是 bigint
    balance: string
    isConnected: boolean
}

export const useWalletStore = defineStore('wallet', {
    state: (): WalletState => ({
        provider: null,
        signer: null,
        account: '',
        chainId: 0,
        balance: '0',
        isConnected: false
    }),
    actions: {
        async connectWallet() {
            if (window.ethereum) {
                try {
                    // 1. 创建原始以太坊提供者副本避免 Proxy 问题
                    const ethereum = { ...window.ethereum };

                    // 2. 初始化 Web3Provider
                    this.provider = new ethers.providers.Web3Provider(
                        ethereum,
                        "any" // 明确指定网络类型
                    );

                    // 3. 获取账户
                    await this.provider.send("eth_requestAccounts", []);

                    // 4. 获取 Signer
                    this.signer = this.provider.getSigner();

                    // 5. 获取账户信息
                    this.account = await this.signer.getAddress();
                    this.chainId = (await this.provider.getNetwork()).chainId;
                    const balance = await this.signer.getBalance();
                    this.balance = ethers.utils.formatEther(balance);

                    this.isConnected = true;

                    // 6. 事件监听使用原始 window.ethereum
                    window.ethereum.on('accountsChanged', this.handleAccountsChanged);
                    window.ethereum.on('chainChanged', this.handleChainChanged);

                } catch (error) {
                    console.error('Error connecting wallet:', error);
                    this.disconnectWallet();
                    throw error;
                }
            } else {
                throw new Error('MetaMask not detected');
            }
        },
        disconnectWallet() {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
                window.ethereum.removeListener('chainChanged', this.handleChainChanged)
            }

            this.$reset()
        },

        async handleAccountsChanged(accounts: string[]) {
            if (accounts.length === 0) {
                this.disconnectWallet()
            } else {
                this.account = accounts[0]
                if (this.signer) {
                    const balance = await this.signer.getBalance()
                    this.balance = ethers.utils.formatEther(balance)
                }
            }
        },

        async handleChainChanged(chainId: string) {
            this.chainId = parseInt(chainId, 16)  // v5 处理方式
            window.location.reload()
        }
    }
})