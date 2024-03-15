import axios from 'axios'
// 从统一的出口 导入需要的方法
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么 token pinia里
    const userStore = useUserStore()
    if (userStore.token) {
      // config.headers.? 看接口文档
      // 请求头携带token
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(err)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0) {
      return res
    }
    // 给出错误提示
    ElMessage.error(res.data.message || '服务异常')
    // 抛出错误信息
    return Promise.reject(res.data)
  },
  (err) => {
    console.log(err)
    if (err.response?.status === 401) {
      router.push('/login')
    }
    ElMessage({
      message: err.response.data.message || '服务异常',
      type: 'error'
    })
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
