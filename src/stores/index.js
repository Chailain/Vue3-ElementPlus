// pinia独立维护 减少与main的耦合 作为store的核心出口
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// 使用pinia.use()方法来使用这个持久化插件
pinia.use(persist)

export default pinia

// 统一导出modules 中间商
// import { useUserStore } from './modules/user'
// 将名为 useUserStore 的函数从当前模块导出
// export { useUserStore }
export * from './modules/counter'
// 将 ./modules/user 这个模块中所有没有标记为 private 的成员都视为公开接口
export * from './modules/user'
