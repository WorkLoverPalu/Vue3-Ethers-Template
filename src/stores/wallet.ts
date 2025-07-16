import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { markRaw } from 'vue'

export const useWalletStore = defineStore('wallet', {
    state: (): any => ({
        provider: null,
        signer: null,
        account: '',
        chainId: 0,
        balance: '0',
        isConnected: false,
        buyShop: {},//购买详情
    }),

    actions: {
        async connectWallet() {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    // ✅ 正确方式：直接使用 window.ethereum
                    const provider = markRaw(new ethers.providers.Web3Provider(window.ethereum, 'any'))
                    this.signer = markRaw(provider.getSigner())

                    // ✅ 请求账户访问
                    await provider.send("eth_requestAccounts", []);

                    const signer = provider.getSigner();
                    this.signer = signer;

                    // ✅ 获取账户信息
                    this.account = await signer.getAddress();
                    const network = await provider.getNetwork();
                    this.chainId = network.chainId;
                    const balance = await signer.getBalance();
                    this.balance = ethers.utils.formatEther(balance);

                    this.isConnected = true;

                    // ✅ 绑定事件，确保 this 正确（使用箭头函数或 bind）
                    window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
                    window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

                } catch (error) {
                    console.error('Error connecting wallet:', error);
                    this.disconnectWallet();
                    throw error;
                }
            } else {
                throw new Error('MetaMask or compatible wallet not detected');
            }
        },

        disconnectWallet() {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged.bind(this));
                window.ethereum.removeListener('chainChanged', this.handleChainChanged.bind(this));
            }
            this.$reset();
        },

        async handleAccountsChanged(accounts: string[]) {
            if (accounts.length === 0) {
                this.disconnectWallet();
            } else {
                this.account = accounts[0];
                if (this.signer) {
                    const balance = await this.signer.getBalance();
                    this.balance = ethers.utils.formatEther(balance);
                }
            }
        },

        async handleChainChanged(chainId: string) {
            this.chainId = parseInt(chainId, 16);
            // 推荐方式是重新初始化 provider 而不是强制刷新
            window.location.reload(); // 或 this.connectWallet() 重连
        },
        async setBuyShop(shop: any) {
            console.log("buy shop", shop)
            this.buyShop = shop;
        }

    },
    mutations: {

    }
});


