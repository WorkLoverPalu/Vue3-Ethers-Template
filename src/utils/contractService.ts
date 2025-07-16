import { ethers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

import { CONTRACT_ADDRESS, NOS_ADDRESS, ERC20_ABI, CONTRACT_ABI } from '@/contracts'
import { formatNumber, safeContractCall } from './formatters'
import { SysInfo, NodeData, NodeInfo, UserInfo, Redemption } from '@/types/staking'


import AES from './AES.js';


// 调用句柄在 StakingContractService.value中
export class StakingContractService {
    private StakingContract: ethers.Contract
    private ERC20Contract: ethers.Contract
    private provider: ethers.providers.Web3Provider | null = null
    private signer: ethers.Signer | null = null

    constructor(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
        this.StakingContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signerOrProvider
        )
        this.ERC20Contract = new ethers.Contract(
            NOS_ADDRESS,
            ERC20_ABI,
            signerOrProvider
        )

        if (signerOrProvider instanceof ethers.providers.Web3Provider) {
            this.provider = signerOrProvider
            this.signer = this.provider.getSigner()
        } else if (signerOrProvider instanceof ethers.Signer) {
            this.signer = signerOrProvider
        }
    }

    /**
     * 获取资产和授权信息
     */
    async getAssetAndApprovalInfo(userAddress: string): Promise<{
        nosBalance: string
        nosAllowance: string
        tigBalance: string
        tigAllowance: string
    }> {
        if (!userAddress) throw new Error('User address is required')
        try {
            const res = await this.StakingContract.argInfo(userAddress);

            return {
                nosBalance: formatNumber(formatUnits(res._nosBalance)),
                nosAllowance: formatNumber(formatUnits(res._nosAllowance)),
                tigBalance: formatNumber(formatUnits(res._tigBalance)),
                tigAllowance: formatNumber(formatUnits(res._tigAllowance)),
            }
        } catch (error) {
            console.error('Error fetching asset and approval info:', error)
            throw new Error('Failed to fetch asset and approval info')
        }
    }

    /**
     * @dev 获取tig/nos 的价格
     */
    async getTokenPrice(): Promise<{ price: string }> {
        try {
            const res = await this.StakingContract.getTokenPrice();
            return {
                price: formatNumber(formatUnits(res))
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async buy(
        _id: string,
        _uAmount: string,
        _nosAmount: string,
        _time: string,
        _sign: string,
    ): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.buy(
            _id,
            _uAmount,
            _nosAmount,
            _time,
            _sign
        )
        return tx
    }
    async harvestEarningsToken(
        _amount: string,
        _totalAmount: string,
        _fee: string,
        _time: string,
        _sign: string,
    ): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.harvestEarningsToken(
            _amount,
            _totalAmount,
            _fee,
            _time,
            _sign
        )
        return tx
    }
}