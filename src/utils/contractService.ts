import { ethers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

import { CONTRACT_ADDRESS, NOS_ADDRESS, ERC20_ABI,CONTRACT_ABI } from '@/contracts'
import { formatNumber, safeContractCall } from './formatters'
import { SysInfo, NodeData, NodeInfo, UserInfo, Redemption } from '@/types/staking'


import AES from './AES.js';


// 调用句柄在 StakingContractService.value中
export class StakingContractService {
    private StakingContract: ethers.Contract
    private ERC20Contract: ethers.Contract
    private MutilNOSContract: ethers.Contract
    private provider: ethers.providers.Web3Provider | null = null

    constructor(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
        this.StakingContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            NOS_POS_STAKING_ABI,
            signerOrProvider
        )
        this.ERC20Contract = new ethers.Contract(
            NOS_ADDRESS,
            ERC20_ABI,
            signerOrProvider
        )
        this.MutilNOSContract = new ethers.Contract(
            MutilNOS_ADDRESS,
            MutilNOS_ABI,
            signerOrProvider
        )
        if (signerOrProvider instanceof ethers.providers.Web3Provider) {
            this.provider = signerOrProvider
        }
    }

    /**
     * 获取资产和授权信息
     */
    async getAssetAndApprovalInfo(userAddress: string): Promise<{
        balance: string
        allowance: string
    }> {
        if (!userAddress) throw new Error('User address is required')
        try {
            const balance = await this.ERC20Contract.balanceOf(userAddress)
            const lockAmount = await this.ERC20Contract.lockAmount(userAddress)
            const allowance = await this.ERC20Contract.allowance(
                userAddress,
                CONTRACT_ADDRESS
            )
            return {
                balance: formatNumber(formatUnits(balance.sub(lockAmount))),
                allowance: ethers.utils.formatEther(allowance)
            }
        } catch (error) {
            console.error('Error fetching asset and approval info:', error)
            throw new Error('Failed to fetch asset and approval info')
        }
    }




    /**
     * 获取质押全局数据
     */
    async getsysInfo(): Promise<SysInfo> {
        try {
            const res = await this.StakingContract.getSysInfo()
            return {
                totalSupply: totalSupply,
                circulatingSupply: formatNumber(formatUnits(res.circulatingSupply, 18), 0),
                totalBlocks: res.totalBlocks.toString(),
                dailyOutput: dailyOutput,
                totalStaked: formatNumber(formatUnits(res.totalStake, 18), 0),
                // totalStakedOutput: formatNumber(formatUnits(res.totalStakedOutput, 18), 0)
                totalStakedOutput: '0',
            }
        } catch (error) {
            console.error('Error fetching staking data:', error)
            throw new Error('Failed to fetch staking data')
        }
    }

    /**
     * 获取质押排行榜数据
     */
    async getNodeList(): Promise<{ nodes: NodeInfo[] }> {
        try {
            // 获取链上节点列表
            const res = await this.StakingContract.getNodeList()
            const nodeList = res[1]
                .map((item: any, index: number) => ({
                    ...res[1][index],
                    totalStaked: Number(formatNumber(formatUnits(res[1][index].totalStaked, 18), 0)) * 1,
                    pendingRewards: Number(formatNumber(formatUnits(res[1][index].pendingRewards, 18))) * 5,
                    totalReward: Number(formatNumber(formatUnits(res[1][index].totalReward, 18))) * 5,
                    address: res[0][index]?.toLowerCase()
                }))
                .sort((a: any, b: any) => parseFloat(b.totalStaked) - parseFloat(a.totalStaked))

            // 获取远程节点信息
            let remoteList: any[] = []
            try {
                const response = await fetch('/nodelist.json')
                if (response.ok) {
                    remoteList = await response.json()
                }
            } catch (e) {
                console.warn('Failed to fetch remote node list:', e)
            }

            // 合并链上和远程数据
            const mergedList = nodeList.map((node: any) => {
                const remote = remoteList.find(r => r.address?.toLowerCase() === node.address?.toLowerCase())
                return remote ? { ...remote, ...node } : node
            })

            return mergedList
        } catch (error) {
            console.error('Error fetching node list:', error)
            throw new Error('Failed to fetch node list')
        }
    }

    /**
   * 获取用户信息
   */
    async getUserInfo(userAddress: string): Promise<UserInfo> {
        const [
            amount,
            rewardDebt,
            node,
            pendingRewards,
            totalReward,
            unlockedAmount,
            lockedAmount,
        ] = await this.StakingContract.users(userAddress)

        const pendingRewardsNum = await this.StakingContract.pendingRewards(userAddress)

        return {
            amount: formatNumber(formatUnits(amount, 18)),
            rewardDebt: formatNumber(formatUnits(rewardDebt, 18)),
            node,
            pendingRewards: formatNumber(formatUnits(pendingRewardsNum, 18)),
            totalReward: formatNumber(formatUnits(totalReward, 18)),
            lockedAmount: formatNumber(formatUnits(lockedAmount, 18)),
            unlockedAmount: formatNumber(formatUnits(unlockedAmount, 18)),
        }
    }

    /**
     * 获取节点信息
     */
    async getNodeInfo(nodeAddress: string): Promise<NodeInfo> {
        const [
            totalStaked,
            rewardDebt,
            pendingRewards,
            totalReward,
            isNode
        ] = await this.StakingContract.nodes(nodeAddress)

        const pendingRewardsNum = await this.StakingContract.pendingNodeRewards(nodeAddress)

        return {
            address: nodeAddress,
            totalStaked: formatNumber(formatUnits(totalStaked, 18)),
            rewardDebt: formatNumber(formatUnits(rewardDebt, 18)),
            pendingRewards: formatNumber(formatUnits(pendingRewardsNum, 18)),
            totalReward: formatNumber(formatUnits(totalReward, 18)),
            isNode
        }
    }





    /**
     * 检查是否为节点
     */
    async isNode(address: string): Promise<boolean> {
        return this.StakingContract.isNode(address)
    }
    async getRedemptionTime(): Promise<string> {
        return this.StakingContract.RedemptionTime()
    }
    async redemptions(address: string): Promise<Redemption> {
        const [amount, startTime, exists] = await this.StakingContract.redemptions(address)
        console.log('redemptions', amount, startTime, exists)
        return {
            amount: formatNumber(formatUnits(amount, 18)),
            startTime: startTime,
            exists
        }
    }


    // ==================== 写入方法 ====================

    /**
     * 绑定节点
     * @param address 节点地址
     */
    async bindNode(address: string): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.bindNode(
            address
        )
        return tx
    }
    /**
     * 授权NOS代币给质押合约
     * @param amount 授权数量(ETH单位)
     */
    async approveNos(amount: string): Promise<ethers.ContractTransaction> {
        const tx = await this.ERC20Contract.approve(
            CONTRACT_ADDRESS,
            parseUnits(amount.toString(), 18)
        )
        return tx
    }

    /**
     * 质押NOS代币
     * @param amount 质押数量(ETH单位)
     * @param nodeAddress 绑定节点地址
     */
    async stake(amount: string): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.deposit(
            parseUnits(amount.toString(), 18)
        )
        return tx
    }

    /**
     * 赎回质押的NOS代币
     * @param amount 赎回数量(ETH单位)
     */
    async unstake(amount: string): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.withdraw(parseUnits(amount.toString(), 18))
        return tx
    }

    /**
     * 领取用户收益
     */
    async claimRewards(): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.claim()
        return tx
    }

    /**
     * 节点领取收益
     */
    async claimNodeRewards(): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.claimNodeRewards()
        return tx
    }

    /**
     * 设置节点身份
     */
    async setNode(address: string): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.setNode(address)
        return tx
    }

    /**
     * 移除节点身份
     */
    async removeNode(address: string): Promise<ethers.ContractTransaction> {
        const tx = await this.StakingContract.delNode(address)
        return tx
    }


    // 迁移平台收益
    async claimBonus(_type: string,
        _amount: string,
        _totalAmount: string,
        _time: string,
        _sign: string,
        _kusd: string,
        _kto: string,
        _gdl: string,
        _mark: string,
        _bsc: string,
    ): Promise<ethers.ContractTransaction> {
        const tx = await this.MutilNOSContract.claimBonus(_type, _amount, _totalAmount, _time, _sign,
            ethers.utils.parseEther(_kusd.toString()),
            ethers.utils.parseEther(_kto.toString()),
            ethers.utils.parseEther(_gdl.toString()),
            ethers.utils.parseEther(_mark.toString()),
            ethers.utils.parseEther(_bsc.toString()))
        return tx
    }

    async decodeAes(content, account) {
        var sign = AES.decodeAes(content, account)
        return sign
    }

    //获取已经领取的收益
    async getClaimedAmount(account) {
        const res = await this.MutilNOSContract.getClaimedAmount(account);
        return {
            6: ethers.utils.formatEther(res._total),
            1: ethers.utils.formatEther(res._kusd),
            2: ethers.utils.formatEther(res._kto),
            3: ethers.utils.formatEther(res._gdl),
            4: ethers.utils.formatEther(res._mark),
            5: ethers.utils.formatEther(res._bsc),
        }
    }
}