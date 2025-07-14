
import { reactive } from "vue"
import type {
    TeamStats,
    TeamMember,
} from "@/types"


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