<template>
  <template v-if="showNavBar">
    <nav
      class="fixed bottom-4 left-1/2 z-[100] flex h-[65px] w-[calc(100%-32px)] max-w-[448px] -translate-x-1/2 items-center justify-around rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_34px_rgba(15,23,42,0.10)] lg:bottom-auto lg:left-auto lg:right-5 lg:top-1/2 lg:h-auto lg:w-[80px] lg:max-w-none lg:-translate-y-1/2 lg:translate-x-0 lg:flex-col lg:justify-center lg:gap-y-10 lg:border-none lg:rounded-[32px] lg:py-8 lg:shadow-[0_10px_40px_rgba(0,0,0,0.06)] xl:right-[calc((100vw-1180px)/2)]"
    >
      <router-link
        :to="plusButtonRoute"
        class="absolute bottom-[78px] left-1/2 flex h-[56px] w-[56px] -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-110 active:scale-95 lg:static lg:translate-x-0"
      >
        <i class="fas fa-plus text-[24px]"></i>
      </router-link>

      <router-link
        :to="{ name: 'home' }"
        class="group flex flex-col items-center text-xs text-slate-400 transition-all duration-300 [&.active]:font-bold [&.active]:text-emerald-500"
        exact-active-class="active"
      >
        <i
          class="fas fa-home mb-1 text-[20px] transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:mb-2 lg:text-[24px]"
        ></i>
        <span>홈</span>
      </router-link>

      <router-link
        :to="{ name: 'momo/monthly' }"
        class="group flex flex-col items-center text-xs text-slate-400 transition-all duration-300 [&.active]:font-bold [&.active]:text-emerald-500"
        active-class="active"
      >
        <i
          class="fas fa-calendar-alt mb-1 text-[20px] transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:mb-2 lg:text-[24px]"
        ></i>
        <span>월간</span>
      </router-link>

      <router-link
        :to="{ name: 'momo/statistics' }"
        class="group flex flex-col items-center text-xs text-slate-400 transition-all duration-300 [&.active]:font-bold [&.active]:text-emerald-500"
        active-class="active"
      >
        <i
          class="fas fa-chart-pie mb-1 text-[20px] transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:mb-2 lg:text-[24px]"
        ></i>
        <span>통계</span>
      </router-link>

      <router-link
        :to="{ name: 'momo/full-list' }"
        class="group flex flex-col items-center text-xs text-slate-400 transition-all duration-300 [&.active]:font-bold [&.active]:text-emerald-500"
        active-class="active"
      >
        <i
          class="fas fa-list mb-1 text-[20px] transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] lg:mb-2 lg:text-[24px]"
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

const plusButtonRoute = computed(() => {
  if (
    route.name === 'momo/monthly' &&
    typeof route.query.date === 'string' &&
    route.query.date
  ) {
    return {
      name: 'momo/edit',
      query: {
        date: route.query.date,
      },
    };
  }

  return { name: 'momo/edit' };
});
</script>
