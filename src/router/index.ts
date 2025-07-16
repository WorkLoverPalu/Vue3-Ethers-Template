import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import Home from "@/pages/Home.vue"
import Shop from "@/pages/Shop.vue"
import Wallet from "@/pages/Wallet.vue"
import Team from "@/pages/Team.vue"
import Community from "@/pages/Community.vue"
import Orders from "@/pages/Orders.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "/shop",
        name: "Shop",
        component: Shop,
      },
      {
        path: "/wallet",
        name: "Wallet",
        component: Wallet,
      },
      {
        path: "/team",
        name: "Team",
        component: Team,
      },
      {
        path: "/community",
        name: "Community",
        component: Community,
      },
      {
        path: "/orders",
        name: "Orders",
        component: Orders,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
