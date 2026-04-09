<template>
    <div class="flex flex-col justify-center items-center h-screen px-6 bg-slate-50 text-center">

        <div class="mb-6">
            <div class="text-[80px] animate-bounce">🟢💦</div>
        </div>

        <div class="mb-10">
            <h1 class="text-[22px] font-extrabold text-gray-800 mb-3">앗! 마리모가 길을 잃었어요!</h1>
            <p class="text-[15px] text-gray-500 leading-relaxed">
                존재하지 않는 공간에 떨어졌습니다.<br />
                수조 밖은 마리모에게 너무 위험해요!
            </p>
        </div>

        <button @click="goHome"
            class="w-full max-w-[300px] p-4 bg-emerald-500 text-white text-base font-bold rounded-2xl shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-all duration-200 active:bg-emerald-600 active:translate-y-0.5">
            안전한 마리모 수조로 돌아가기
        </button>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    // 홈 라우트로 이동
    router.push('/');
};
</script>