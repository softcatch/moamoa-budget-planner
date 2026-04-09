<script setup>
import { ref } from 'vue';

/* =========================
 *  기본 모드 / 상태
 * ========================= */
const type = ref('expense'); // expense | income
const selectedCategory = ref(null);

/* =========================
 *  이벤트 함수
 * ========================= */
const changeType = (newType) => {
  if (type.value === newType) return;
  type.value = newType;
  selectedCategory = null;
};
</script>

<template>
  <div>
    <!-- 지출 / 수입 토글 -->
    <div class="mt-7 flex justify-center">
      <div class="flex w-[140px] h-11 rounded-[18px] bg-white overflow-hidden">
        <button
          type="button"
          class="w-1/2 text-sm font-bold"
          :class="
            type === 'expense'
              ? 'bg-[#E96B5F] text-white'
              : 'bg-white text-zinc-300'
          "
          @click="changeType('expense')"
        >
          지출
        </button>
        <button
          type="button"
          class="w-1/2 text-sm font-bold"
          :class="
            type === 'income'
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-zinc-300'
          "
          @click="changeType('income')"
        >
          수입
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
