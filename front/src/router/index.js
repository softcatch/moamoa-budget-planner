import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home', 
      component: () => import('@/pages/HomePage.vue')
    },
    {
      path: '/login', 
      name: 'login', 
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/momo/monthly',
      name: 'momo/monthly',
      component: () => import('@/pages/MomoMonthlyPage.vue'),
    },
    {
      path: '/momo/edit',
      name: 'momo/edit',
      component: () => import('@/pages/MomoEditPage.vue'),
    },
    {
      path: '/momo/full-list',
      name: 'momo/full-list',
      component: () => import('@/pages/MomoFullListPage.vue'),
    },
    {
      path: '/momo/statistics',
      name: 'momo/statistics',
      component: () => import('@/pages/MomoStatisticsPage.vue'),
    },
  ],
})

export default router;
