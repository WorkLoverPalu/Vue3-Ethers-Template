
import { reactive } from "vue"
import type {
    InvestmentPlan
} from "@/types"

// 投资计划
export const investmentStore = reactive<{
    plans: InvestmentPlan[]
}>({
    plans: [
        {
            id: "A4",
            name: "A4 计划",
            amount: 2200,
            usdt: 1000,
            dailyOutput: 3666,
            totalOutput: 73.12,
        },
        {
            id: "A3",
            name: "A3 计划",
            amount: 1050,
            usdt: 500,
            dailyOutput: 175,
            totalOutput: 35.0,
        },
        {
            id: "A2",
            name: "A2 计划",
            amount: 600,
            usdt: 300,
            dailyOutput: 1,
            totalOutput: 20.0,
        },
        {
            id: "A1",
            name: "A1 计划",
            amount: 190,
            usdt: 100,
            dailyOutput: 0.3166,
            totalOutput: 6.33,
        },
        {
            id: "A0",
            name: "A0 计划",
            amount: 36,
            usdt: 20,
            dailyOutput: 0.06,
            totalOutput: 1.2,
        },
    ],
})
