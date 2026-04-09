<template>
    <template v-if="showNavBar">
        <router-link :to="{ name: 'momo/edit' }"
            class="fixed bottom-[85px] left-1/2 -translate-x-1/2 w-[56px] h-[56px] bg-emerald-500 rounded-full flex justify-center items-center text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)] z-[110] transition-transform duration-300 hover:scale-110 active:scale-95">
            <i class="fas fa-plus text-[24px]"></i>
        </router-link>
        <nav
            class="fixed bottom-0 w-full max-w-[480px] h-[65px] bg-white flex justify-around items-center border-t border-slate-100 z-[100] left-1/2 -translate-x-1/2">
            <router-link :to="{ name: 'home' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                exact-active-class="active">
                <i
                    class="fas fa-home text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15]"></i>
                <span>홈</span>
            </router-link>

            <router-link :to="{ name: 'momo/monthly' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                active-class="active">
                <i
                    class="fas fa-calendar-alt text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15]"></i>
                <span>월간</span>
            </router-link>

            <router-link :to="{ name: 'momo/statistics' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                active-class="active">
                <i
                    class="fas fa-chart-pie text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15]"></i>
                <span>통계</span>
            </router-link>

            <router-link :to="{ name: 'momo/full-list' }"
                class="group flex flex-col items-center text-slate-400 text-xs transition-all duration-300 [&.active]:text-emerald-500 [&.active]:font-bold"
                active-class="active">
                <i
                    class="fas fa-list text-[20px] mb-1 transition-transform duration-300 group-[.active]:-translate-y-[3px] group-[.active]:scale-[1.15]"></i>
                <span>목록</span>
            </router-link>
        </nav>
    </template>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 숨기고 싶은 라우트 이름들
const hideNavBarRoutes = ['momo/edit', 'notfound'];

// 현재 라우트가 숨김 목록에 없을 때만 true 반환
const showNavBar = computed(() => {
    return !hideNavBarRoutes.includes(route.name);
});
</script>
