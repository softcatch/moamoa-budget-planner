import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home', 
      component: ()=>import('@/pages/HomePage.vue'),
    },
    {
      path: '/login', 
      name: 'login', 
      component: ()=>import('@/pages/LoginPage.vue'),
    },
    {
      path: '/mission',
      name: 'mission',
      component: ()=>import('@/components/Mission.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/todo/detail/:id',
      name: 'todo/detail',
      component: ()=>import('@/pages/todo-pinia/TodoDetailPage.vue'),
      meta: {requiresAuth: true},
      props: true,
    },
    {
      path: '/todo/write',
      name: 'todo/write',
      component: ()=>import('@/pages/todo-pinia/TodoWritePage.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/todo/edit/:id',
      name: 'todo/edit',
      component: () => import('@/pages/todo-pinia/TodoEditPage.vue'),
      meta: {requiresAuth: true},
      props: true,
    },
  ],
})

router.beforeEach((to, from)=> {
  if(to.matched.some((record)=>record.meta.requiresAuth)){
    if(localStorage.getItem('auth') !== 'true'){
      alert('로그인이 필요한 서비스입니다');
      return { name: 'login'};
    }
  }
  return true;
})

export default router;
