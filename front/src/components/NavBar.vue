<template>
    <template v-if="showNavBar">
        <nav
            class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[65px] bg-white flex justify-around items-center border-t border-slate-100 z-[100]
                   md:top-1/2 md:-translate-y-1/2 md:bottom-auto md:left-[calc(50%+260px)] md:translate-x-0 md:w-[80px] md:max-w-none md:h-auto md:py-8 md:flex-col md:justify-center md:gap-y-10 md:border-none md:rounded-[32px] md:shadow-[0_10px_40px_rgba(0,0,0,0.06)]">

            <router-link :to="{ name: 'momo/edit' }" class="absolute bottom-[85px] left-1/2 -translate-x-1/2 w-[56px] h-[56px] bg-emerald-500 rounded-full flex justify-center items-center text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-110 active:scale-95
                       md:static md:translate-x-0">
                <i class="fas fa-plus text-[24px]"></i>
            </router-link>

            <router-link :to="{ name: 'home' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                exact-active-class="active">
                <i
                    class="fas fa-home text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] md:text-[24px] md:mb-2"></i>
                <span>홈</span>
            </router-link>

            <router-link :to="{ name: 'momo/monthly' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                active-class="active">
                <i
                    class="fas fa-calendar-alt text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] md:text-[24px] md:mb-2"></i>
                <span>월간</span>
            </router-link>

            <router-link :to="{ name: 'momo/statistics' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                active-class="active">
                <i
                    class="fas fa-chart-pie text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] md:text-[24px] md:mb-2"></i>
                <span>통계</span>
            </router-link>

            <router-link :to="{ name: 'momo/full-list' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                active-class="active">
                <i
                    class="fas fa-list text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15] md:text-[24px] md:mb-2"></i>
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