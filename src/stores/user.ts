
import { ref } from "vue"
import request from '@/utils/request'
import { defineStore } from 'pinia'

export const userStore = defineStore('user', () => {
  const userInfo = ref({})
  const shopInfo = ref([])

  /**
   * @dev 获取用户信息
   * @param address 
   * @returns 
   */
  const getUserInfo = async (address: string) => {
    if (!address) return
    const response = await request.post(`/UserInfo?addr=${address}`)
    userInfo.value = response.data;
    console.log("UserInfo response", response)
    return response.data
  }


  /**
   * @dev 获取共享手续费分红
   */
  const getAvailableFee = async () => {
    const response = await request.post(`/AvailableFee`)
    return response.data
  }


  /**
   * @dev 获取价格
   */
  const getPrice = async () => {
    const response = await request.post(`/GetPledgePrice`)
    return response.data
  }

  /**
   * @dev 获取能源包信息
   */
  const getShopList = async () => {
    const response = await request.post(`/VoteInfo`)
    console.log("getShopList", response.data)
    shopInfo.value = response.data
    return response.data
  }

  /**
   * @dev 绑定邀请地址
   */
  const bindAddress = async (address, bindAddress, sign) => {
    console.log("参数：", address, bindAddress, sign)
    const response = await request.post(`/BindAddress?address=${address}&bindAddress=${bindAddress}&sign=${sign}`)
    console.log("bindAddress", response.data)
    return response
  }

  /**
   * @dev 获取
   */

  return {
    getUserInfo,
    getAvailableFee,
    getPrice,
    getShopList,
    userInfo,
    bindAddress,
    shopInfo
  }
})