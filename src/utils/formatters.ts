import { ethers } from 'ethers'

/**
 * 格式化大数字显示
 * @param num 数字字符串
 * @param decimals 保留小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(num: string, decimals: number = 4): string {
    // return num;
    if (!num) return '0'
    num=num.toString();
    // 如果是科学计数法表示的数字
    if (num.includes('e')) {
        num = ethers.utils.formatUnits(num, 0)
    }

    const number = parseFloat(num)
    if (isNaN(number)) return '0'

    // 格式化大数字
    const truncate = (n: number, d: number) => {
        const factor = Math.pow(10, d)
        return Math.floor(n * factor) / factor
    }

    if (number >= 1e12) {
        return truncate(number / 1e12, decimals).toFixed(decimals) + 'T'
    }
    if (number >= 1e9) {
        return truncate(number / 1e9, decimals).toFixed(decimals) + 'B'
    }
    // if (number >= 1e6) {
    //     return truncate(number / 1e6, decimals).toFixed(decimals) + 'M'
    // }
    // if (number >= 1e3) {
    //     return truncate(number / 1e3, decimals).toFixed(decimals) + 'K'
    // }

    // 处理小数位数
    const parts = num.split('.')
    if (parts.length === 1 || decimals === 0) {
        return Math.floor(number).toString()
    }

    return truncate(number, decimals).toFixed(decimals)
}

/**
 * 从合约读取数据并处理错误
 */
export async function safeContractCall(
    contract: any,
    method: string,
    args: any[] = [],
    defaultValue: any = '0'
) {
    try {
        const result = await contract[method](...args)
        return result
    } catch (err) {
        console.error(`Contract call ${method} failed:`, err)
        return defaultValue
    }
}

export function shortAddress(address: string): string {
    if (!address) return ''
    const addr = address
    return `${addr.substring(0, 3)}...${addr.substring(addr.length - 4)}`
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}