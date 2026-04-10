<script setup>
import momo404Image from '@/assets/momo/momo-404.png';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <main
    class="min-h-screen bg-[radial-gradient(circle_at_top,_#dce9d9_0%,_#eff5f1_40%,_#f6f9f7_100%)] px-4 py-8"
  >
    <section
      class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[520px] flex-col items-center justify-center rounded-[32px] border border-white/70 bg-white/70 px-6 py-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-sm sm:px-8"
    >
      <span
        class="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.24em] text-emerald-600"
      >
        404 NOT FOUND
      </span>

      <img
        :src="momo404Image"
        alt="길을 잃고 슬퍼하는 모모"
        class="mt-6 w-full max-w-[360px] drop-shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
      />

      <div class="mt-7">
        <h1 class="text-[30px] font-extrabold leading-tight text-slate-900">
          모모가 길을 잃어버렸어요
        </h1>
        <p class="mt-4 text-[15px] leading-7 text-slate-500">
          찾으시는 페이지가 보이지 않아요.
          <br />
          홈으로 돌아가서 모모를 다시 만나볼까요?
        </p>
      </div>

      <button
        type="button"
        class="mt-8 inline-flex min-h-[56px] w-full max-w-[280px] items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#38d39f_0%,#1fb6a6_100%)] px-6 text-base font-bold text-white shadow-[0_16px_36px_rgba(31,182,166,0.30)] transition active:translate-y-[1px]"
        @click="goHome"
      >
        홈으로 돌아가기
      </button>
    </section>
  </main>
</template>
