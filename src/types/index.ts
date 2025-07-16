export interface UserStats {
  power: number
  dailyOutput: number
  balance: number
  teamMembers: number
  availableEarnings: number
  teamEarnings: number
  tigPrice: number
  personalEarnings: number
  teamEarningsTotal: number
}

export interface UserLevel {
  current: number
  progress: number
}


export interface EarningsRecord {
  id: number
  type: string
  amount: number
  date: Date
  status: string
}

export interface TeamStats {
  totalMembers: number
  totalEarnings: number
}

export interface TeamMember {
  id: number
  name: string
  joinDate: Date
  level: string
  amount: number
}

export interface LevelRequirement {
  level: number
  reward: number
  description: string
}

export interface CommunityStats {
  totalRewards: number
  monthlyRewards: number
}

export interface WalletState {
  connected: boolean
  provider: any
  signer: any
  address: string
}

export interface NavigationTab {
  id: string
  path: string
  icon: string
}

export interface Translation {
  [key: string]: string | Translation
}

export interface Translations {
  zh: Translation
  en: Translation
}

export type Language = "zh" | "en"

export type ButtonVariant = "primary" | "secondary" | "success" | "purple" | "cyan" | "danger"

export interface RouteConfig {
  path: string
  name: string
  component: any
  children?: RouteConfig[]
}

export interface Order {
  id: string
  planName: string
  amount: number
  power: number
  dailyIncome: number
  totalEarned: number
  status: "active" | "completed" | "cancelled"
  createdAt: Date
  daysCompleted: number
  totalDays: number
  canCancel: boolean
  needAmount:number
}
