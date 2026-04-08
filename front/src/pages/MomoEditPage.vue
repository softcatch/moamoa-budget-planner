<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';

/* =========================
 *  기본 모드 / 상태
 * ========================= */
const type = ref('expense'); // expense | income
const selectedCategory = ref(null);

const showCalendar = ref(false);
const selectedDate = ref(new Date());

/* =========================
 * computed
 * ========================= */
const formattedDate = computed(() => {
  const date = new Date(selectedDate.value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  return `${yyyy}.${mm}.${dd} ${days[date.getDay()]}`;
});

/* =========================
 *  이벤트 함수
 * ========================= */
const changeType = (newType) => {
  if (type.value === newType) return;
  type.value = newType;
  selectedCategory = null;
};

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const handleDateSelect = (date) => {
  selectedDate.value = date;
  showCalendar.value = false;
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

    <!-- 날짜 선택 -->
    <section class="relative mt-5">
      <div class="flex justify-center">
        <button
          type="button"
          class="flex items-center justify-center gap-2 text-[18px] font-medium text-zinc-400"
          @click="toggleCalendar"
        >
          <font-awesome-icon icon="calendar-days" class="text-[18px]" />
          <span>{{ formattedDate }}</span>
          <font-awesome-icon
            icon="chevron-right"
            class="text-[18px] text-zinc-300"
          />
        </button>
      </div>

      <div
        v-if="showCalendar"
        class="absolute top-full left-1/2 z-50 mt-4 w-[340px] max-w-[calc(100vw-48px)] -translate-x-1/2 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="flex justify-center">
          <VDatePicker
            v-model="selectedDate"
            @update:model-value="handleDateSelect"
            locale="ko"
            color="green"
            borderless
            transparent
            is-expanded
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
