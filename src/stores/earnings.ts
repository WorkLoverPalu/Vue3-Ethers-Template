import { reactive } from "vue"
import type {
  EarningsRecord,
  WalletState,
} from "@/types"

// 收益历史
export const earningsStore = reactive<{
  history: EarningsRecord[]
}>({
  history: [
    {
      id: 1,
      type: "个人收益",
      amount: 125.6,
      date: new Date("2024-01-15"),
      status: "completed",
    },
    {
      id: 2,
      type: "团队收益",
      amount: 87.8,
      date: new Date("2024-01-12"),
      status: "completed",
    },
    {
      id: 3,
      type: "个人收益",
      amount: 93.3,
      date: new Date("2024-01-10"),
      status: "completed",
    },
  ],
})
