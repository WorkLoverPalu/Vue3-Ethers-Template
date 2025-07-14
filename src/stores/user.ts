
import { reactive } from "vue"
import type {
    UserStats,
    UserLevel,
} from "@/types"

// 用户状态
export const userStore = reactive<{
  stats: UserStats
  level: UserLevel
}>({
  stats: {
    power: 1050,
    dailyOutput: 35.2,
    balance: 1275.5,
    teamMembers: 4,
    availableEarnings: 156.8,
    teamEarnings: 89.2,
    tigPrice: 0.052,
    personalEarnings: 156.8,
    teamEarningsTotal: 1245.6,
  },
  level: {
    current: 1,
    progress: 20,
  },
})
