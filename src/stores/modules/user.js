import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'
export const useUserStore = defineStore('my-user', () => {
  const token = ref('')
  // 存token的
  function setToken(newToken) { // 设置token
    token.value = newToken
  }
  const removeToken = () => { // 移除token
    token.value = ''
  }

  const user = ref({}) // 个人信息
  // 存用户信息的
  // 个人中心 获取-用户基本资料（信息）-- userGetInfoService
  const getUser = async () => { // 获取用户信息
    const res = await userGetInfoService() //获取个人信息
    user.value = res.data.data
  }
  // 传个空对象 重置
  const setUser = (obj) => { // 设置用户信息
    user.value = obj
  }
  
  return { token, setToken, removeToken, user, getUser, setUser }
}, {
  // 值为对象/布尔  自己额外配置/按照默认来 持久化
  persist: true,
})
