<template>
    <nav
        class="absolute bottom-0 w-full max-w-[480px] h-[65px] bg-white flex justify-around items-center border-t border-slate-100 z-[100]">

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

<script setup>
</script>