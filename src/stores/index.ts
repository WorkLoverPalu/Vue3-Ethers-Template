import { reactive } from "vue"
import type {
  UserStats,
  UserLevel,
  InvestmentPlan,
  EarningsRecord,
  TeamStats,
  TeamMember,
  LevelRequirement,
  CommunityStats,
  WalletState,
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

// 团队数据
export const teamStore = reactive<{
  stats: TeamStats
  members: TeamMember[]
  invitationLink: string
}>({
  stats: {
    totalMembers: 720,
    totalEarnings: 245.6,
  },
  members: [
    {
      id: 1,
      name: "user_aib2",
      joinDate: new Date("2024-06-15"),
      level: "A3",
      amount: 500,
    },
    {
      id: 2,
      name: "user_c344",
      joinDate: new Date("2024-04-12"),
      level: "A1",
      amount: 100,
    },
    {
      id: 3,
      name: "user_e516",
      joinDate: new Date("2024-05-10"),
      level: "A1",
      amount: 100,
    },
    {
      id: 4,
      name: "user_g7h8",
      joinDate: new Date("2024-05-28"),
      level: "A0",
      amount: 20,
    },
  ],
  invitationLink: "https://tig.com/invite/aB1c2D3e",
})

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

// 社区数据
export const communityStore = reactive<{
  levelRequirements: LevelRequirement[]
  stats: CommunityStats
}>({
  levelRequirements: [
    { level: 1, reward: 20, description: "直推3个有效用户" },
    { level: 2, reward: 10, description: "团队业绩达到指定要求" },
    { level: 3, reward: 10, description: "团队业绩达到指定要求" },
    { level: 4, reward: 10, description: "团队业绩达到指定要求" },
    { level: 5, reward: 10, description: "团队业绩达到指定要求" },
  ],
  stats: {
    totalRewards: 245.6,
    monthlyRewards: 18.3,
  },
})

// 钱包连接状态
export const walletStore = reactive<WalletState>({
  connected: false,
  provider: null,
  signer: null,
  address: "",
})
