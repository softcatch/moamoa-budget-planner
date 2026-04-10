<template>
  <template v-if="showNavBar">
    <nav
      class="fixed bottom-4 left-1/2 z-[100] flex h-[65px] w-[calc(100%-32px)] max-w-[448px] -translate-x-1/2 items-center justify-around rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_34px_rgba(15,23,42,0.10)] lg:bottom-auto lg:left-auto lg:right-5 lg:top-1/2 lg:h-auto lg:w-[80px] lg:max-w-none lg:-translate-y-1/2 lg:translate-x-0 lg:flex-col lg:justify-center lg:gap-y-10 lg:border-none lg:rounded-[32px] lg:py-8 lg:shadow-[0_10px_40px_rgba(0,0,0,0.06)] xl:right-[calc((100vw-1180px)/2)]"
    >
      <router-link
        :to="{ name: 'momo/edit' }"
        class="order-3 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-110 active:scale-95 lg:order-none"
      >
        <i class="fas fa-plus text-[24px]"></i>
      </router-link>

      <router-link
        :to="{ name: 'home' }"
        class="group order-1 flex flex-col items-center text-slate-400 text-xs transition-all duration-300 lg:order-none [&.active]:text-emerald-500 [&.active]:font-bold"
        exact-active-class="active"
      >
        <i
          class="fas fa-home text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:text-[24px] lg:mb-2"
        ></i>
        <span>홈</span>
      </router-link>

      <router-link
        :to="{ name: 'momo/monthly' }"
        class="group order-2 flex flex-col items-center text-slate-400 text-xs transition-all duration-300 lg:order-none [&.active]:text-emerald-500 [&.active]:font-bold"
        active-class="active"
      >
        <i
          class="fas fa-calendar-alt text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:text-[24px] lg:mb-2"
        ></i>
        <span>월간</span>
      </router-link>

      <router-link
        :to="{ name: 'momo/statistics' }"
        class="group order-4 flex flex-col items-center text-slate-400 text-xs transition-all duration-300 lg:order-none [&.active]:text-emerald-500 [&.active]:font-bold"
        active-class="active"
      >
        <i
          class="fas fa-chart-pie text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:text-[24px] lg:mb-2"
        ></i>
        <span>통계</span>
      </router-link>

      <router-link
        :to="{ name: 'momo/full-list' }"
        class="group order-5 flex flex-col items-center text-slate-400 text-xs transition-all duration-300 lg:order-none [&.active]:text-emerald-500 [&.active]:font-bold"
        active-class="active"
      >
        <i
          class="fas fa-list text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:text-[24px] lg:mb-2"
        ></i>
        <span>목록</span>
      </router-link>
    </nav>
  </template>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const hideNavBarRoutes = ['momo/edit', 'notfound'];

const showNavBar = computed(() => {
  return !hideNavBarRoutes.includes(route.name);
});
</script>
