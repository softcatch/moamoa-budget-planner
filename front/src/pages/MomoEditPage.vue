<script setup>
import { computed, ref } from 'vue';

/* =========================
 *  기본 모드 / 상태
 * ========================= */
const type = ref('expense'); // expense | income
const selectedCategory = ref(null);

const showCalendar = ref(false);
const selectedDate = ref(new Date());
const amountInput = ref(null);

const amount = ref('');

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
 * 유틸 함수
 * ========================= */
const sanitizeAmount = (value) => {
  return String(value)
    .replace(/[^0-9]/g, '')
    .replace(/^0+(?=\d)/, '');
};

const parseAmount = (value) => {
  return Number(sanitizeAmount(value)) || 0;
};

const displayAmount = computed(() => {
  return amount.value ? parseAmount(amount.value).toLocaleString() : '0';
});

const amountInputWidth = computed(() => {
  return `${Math.max(displayAmount.value.length, 1)}ch`;
});

/* =========================
 *  이벤트 함수
 * ========================= */
const changeType = (newType) => {
  if (type.value === newType) return;
  type.value = newType;
  selectedCategory.value = null;
};

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const handleDateSelect = (date) => {
  selectedDate.value = date;
  showCalendar.value = false;
};

const handleAmountInput = (e) => {
  amount.value = sanitizeAmount(e.target.value);
};

const selectAmountOnEmpty = () => {
  if (amount.value) return;

  requestAnimationFrame(() => {
    amountInput.value?.select();
  });
};

const blockNonNumericKey = (e) => {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab',
    'Home',
    'End',
  ];

  if (e.ctrlKey || e.metaKey) return;
  if (allowedKeys.includes(e.key)) return;
  if (/^[0-9]$/.test(e.key)) return;

  e.preventDefault();
};

const addQuickAmount = (value) => {
  const next = parseAmount(amount.value) + value;
  amount.value = String(next);
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
          <i class="fa-regular fa-calendar-days"></i>
          <span>{{ formattedDate }}</span>
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <!-- 달력 -->
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

    <!-- 금액 표시 -->
    <section class="mt-7 px-4 sm:px-0">
      <div class="mx-auto flex w-full max-w-[420px] flex-col items-center">
        <div class="inline-flex items-center justify-center">
          <input
            ref="amountInput"
            :value="displayAmount"
            type="text"
            inputmode="numeric"
            :style="{ width: amountInputWidth }"
            class="min-w-[1ch] border-none bg-transparent p-0 text-center text-[40px] leading-[1] font-normal text-slate-900 outline-none"
            @input="handleAmountInput"
            @keydown="blockNonNumericKey"
            @focus="selectAmountOnEmpty"
            @click="selectAmountOnEmpty"
          />
          <span
            class="-ml-[0.04em] inline-flex items-center text-[40px] leading-[1] font-normal text-slate-900"
          >
            원
          </span>
        </div>

        <!-- 빠른 금액 추가 버튼 -->
        <div
          class="mt-5 flex w-full flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            class="h-[48px] min-w-[92px] rounded-[16px] border border-slate-300 bg-white px-4 text-[16px] font-medium text-slate-700"
            @click="addQuickAmount(10000)"
          >
            +1만원
          </button>
          <button
            type="button"
            class="h-[48px] min-w-[92px] rounded-[16px] border border-slate-300 bg-white px-4 text-[16px] font-medium text-slate-700"
            @click="addQuickAmount(50000)"
          >
            +5만원
          </button>
          <button
            type="button"
            class="h-[48px] min-w-[92px] rounded-[16px] border border-slate-300 bg-white px-4 text-[16px] font-medium text-slate-700"
            @click="addQuickAmount(100000)"
          >
            +10만원
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
