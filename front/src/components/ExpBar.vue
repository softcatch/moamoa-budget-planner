<script setup>
import { computed } from 'vue';

const props = defineProps({
  level: {
    type: Number,
    default: 1,
  },
  exp: {
    type: Number,
    default: 0,
  },
});

const currentExp = computed(() => props.exp % 100);
const progressWidth = computed(() => `${Math.min(currentExp.value, 100)}%`);
</script>

<template>
  <section class="rounded-[24px] bg-white p-4 shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">EXP</p>
        <h2 class="mt-1 text-base font-bold text-slate-900">성장 경험치</h2>
      </div>
      <span class="text-sm font-bold text-emerald-600">Lv. {{ level }}</span>
    </div>

    <div class="mt-4 overflow-hidden rounded-full bg-slate-100 p-1">
      <div
        class="h-4 rounded-full bg-[linear-gradient(90deg,#5ee08b_0%,#26c2a6_100%)] transition-all duration-500"
        :style="{ width: progressWidth }"
      ></div>
    </div>

    <div class="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
      <span>현재 {{ currentExp }} EXP</span>
      <span>다음 레벨까지 100 EXP</span>
    </div>
  </section>
</template>
