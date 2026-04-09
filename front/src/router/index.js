import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
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
      meta: { requiresAuth: true },
    },
    {
      path: '/momo/edit',
      name: 'momo/edit',
      component: () => import('@/pages/MomoEditPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/momo/full-list',
      name: 'momo/full-list',
      component: () => import('@/pages/MomoFullListPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/momo/statistics',
      name: 'momo/statistics',
      component: () => import('@/pages/MomoStatisticsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
});

// 인증 가드
router.beforeEach((to) => {
  const authStore = useAuthStore();

  // 인증이 필요한 페이지
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isLogin) {
      return { name: 'login' };
    }
  }

  // 로그인 상태에서 login 페이지 접근 방지
  if (to.name === 'login' && authStore.isLogin) {
    return { name: 'home' };
  }

  return true;
});

export default router;
