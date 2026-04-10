<script setup>
import momoCuriousImage from '@/assets/momo/momo-curious.png';
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

const emit = defineEmits(['open-guide']);

const LEVEL_EXP_UNIT = 1000;
const currentExp = computed(() => props.exp % LEVEL_EXP_UNIT);
const remainingExp = computed(() => LEVEL_EXP_UNIT - currentExp.value);
const progressWidth = computed(
  () => `${Math.min((currentExp.value / LEVEL_EXP_UNIT) * 100, 100)}%`,
);

const openGuide = () => {
  emit('open-guide');
};
</script>

<template>
  <section class="rounded-[24px] bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div>
          <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">EXP</p>
          <h2 class="mt-1 text-3xl font-bold text-emerald-600">Lv. {{ level }}</h2>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full bg-emerald-50 p-1.5 transition hover:bg-emerald-100 active:scale-[0.98]"
        @click="openGuide"
        aria-label="모모 상태 안내 열기"
      >
        <img
          :src="momoCuriousImage"
          alt="궁금한 모모"
          class="h-11 w-11 image-rendering-pixel"
        />
      </button>
    </div>

    <div class="mt-4 overflow-hidden rounded-full bg-slate-100 p-1">
      <div
        class="h-4 rounded-full bg-[linear-gradient(90deg,#5ee08b_0%,#26c2a6_100%)] transition-all duration-500"
        :style="{ width: progressWidth }"
      ></div>
    </div>

    <div class="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
      <span>현재 {{ currentExp }} EXP</span>
      <span>다음 레벨까지 {{ remainingExp }} EXP</span>
    </div>
  </section>
</template>

<style scoped>
.image-rendering-pixel {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
