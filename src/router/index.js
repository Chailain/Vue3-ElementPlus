import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由规则的配置
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 => 默认是直接放行的 不会拦截
// to from两个参数
// 1. undefined / true 直接放行
// router.beforeEach(() => {}) // return undefined 直接放行 不会拦截
// 2. return false拦截   拦回from的地址页面
// 3. 具体路径 或 路径对象 拦截到 对应的地址
// return '/login' 或 return { name: 'login', 传参 }
// router.beforeEach((to) => {
//   const userStore = useUserStore()
//   // 没有token 要去的路径（需要授权才可以访问的页面）
//   if (!userStore.token && to.path !== '/login') return '/login'
//   // return true // 其他情况
// })

export default router
