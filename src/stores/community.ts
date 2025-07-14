
import { reactive } from "vue"
import type {
    LevelRequirement,
    CommunityStats,
} from "@/types"

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
