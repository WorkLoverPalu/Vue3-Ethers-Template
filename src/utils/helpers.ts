import { currentLang } from "./i18n"

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString(currentLang.value === "zh" ? "zh-CN" : "en-US")
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy:", error)
    return false
  }
}

export const formatCurrency = (amount: number, currency = "USDT"): string => {
  return `${amount.toLocaleString()} ${currency}`
}

export const formatNumber = (num: number, decimals = 2): string => {
  return num.toFixed(decimals)
}

export const truncateAddress = (address: string, start = 6, end = 4): string => {
  if (!address) return ""
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
