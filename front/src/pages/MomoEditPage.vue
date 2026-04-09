<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMomoStore } from '@/stores/momo';
import { categoryMap } from '@/constants/momoCategories';

/* =========================
 *  기본 모드 / 상태
 * ========================= */
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const momoStore = useMomoStore();

const type = ref('expense'); // expense | income
const selectedCategory = ref(null);

const showCalendar = ref(false);
const selectedDate = ref(new Date());
const amountInput = ref(null);

const amount = ref('');
const memo = ref('');
const isSubmitting = ref(false);
const inlineErrorMessage = ref('');
const formError = reactive({
  amount: '',
  category: '',
});

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

const currentCategories = computed(() => {
  return categoryMap[type.value];
});

const isEditMode = computed(() => {
  return route.query.mode === 'edit';
});

const editingTransactionId = computed(() => {
  return route.query.transactionId ?? route.query.id ?? null;
});

const formattedSubmitDate = computed(() => {
  const date = new Date(selectedDate.value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
});

const transactionPayload = computed(() => {
  const userId = authStore.currentUserId;

  if (!userId) return null;

  return {
    id: editingTransactionId.value ?? undefined,
    userId,
    date: formattedSubmitDate.value,
    type: type.value,
    amount: parseAmount(amount.value),
    desc: memo.value.trim(),
    category: selectedCategory.value,
  };
});

/* =========================
 *  이벤트 함수
 * ========================= */
const changeType = (newType) => {
  if (type.value === newType) return;
  type.value = newType;
  selectedCategory.value = null;
  formError.category = '';
  inlineErrorMessage.value = '';
};

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

const handleDateSelect = (date) => {
  selectedDate.value = date;
  showCalendar.value = false;
  inlineErrorMessage.value = '';
};

const handleAmountInput = (e) => {
  amount.value = sanitizeAmount(e.target.value);
  inlineErrorMessage.value = '';

  if (parseAmount(amount.value)) {
    formError.amount = '';
  }
};

const selectAmountOnEmpty = () => {
  if (amount.value) return;

  requestAnimationFrame(() => {
    amountInput.value?.select();
  });
};

const handleAmountBeforeInput = (e) => {
  if (!e.inputType?.startsWith('insert')) return;
  if (!e.data) return;
  if (/^\d+$/.test(e.data)) return;

  e.preventDefault();
};

const addQuickAmount = (value) => {
  const next = parseAmount(amount.value) + value;
  amount.value = String(next);
  formError.amount = '';
  inlineErrorMessage.value = '';
};

const selectCategory = (category) => {
  selectedCategory.value = category.key;
  formError.category = '';
  inlineErrorMessage.value = '';
};

const getSelectedTextClass = (className) => {
  return className.split(' ').find((token) => token.startsWith('text-'));
};

const isCategorySelected = (category) => {
  return selectedCategory.value === category.key;
};

const getCategoryTileClass = (category) => {
  if (isCategorySelected(category)) {
    return [
      category.activeClass,
      'border-2 ring-2 ring-offset-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)]',
    ];
  }

  return [
    'border border-slate-200 bg-white text-slate-400 ring-1 ring-slate-100',
    category.iconClass,
  ];
};

const getCategoryLabelClass = (category) => {
  return isCategorySelected(category)
    ? getSelectedTextClass(category.activeClass)
    : 'text-slate-400';
};

const resetForm = () => {
  type.value = 'expense';
  selectedCategory.value = null;
  selectedDate.value = new Date();
  amount.value = '';
  memo.value = '';
  inlineErrorMessage.value = '';
  formError.amount = '';
  formError.category = '';
};

const applyTransactionToForm = (transaction) => {
  type.value = transaction.type;
  selectedCategory.value = transaction.category;
  amount.value = String(transaction.amount ?? '');
  memo.value = transaction.desc ?? '';

  if (transaction.date) {
    selectedDate.value = new Date(`${transaction.date}T00:00:00`);
  }
};

const hydrateEditForm = async () => {
  if (!isEditMode.value) {
    resetForm();
    return;
  }

  if (!editingTransactionId.value || !authStore.currentUserId) {
    return;
  }

  if (!momoStore.transactionList.length) {
    await momoStore.fetchTransactionList(authStore.currentUserId);
  }

  const targetTransaction = momoStore.transactionList.find(
    (transaction) =>
      String(transaction.id) === String(editingTransactionId.value) &&
      String(transaction.userId) === String(authStore.currentUserId),
  );

  if (!targetTransaction) {
    inlineErrorMessage.value = '수정할 거래를 찾을 수 없습니다.';
    return;
  }

  inlineErrorMessage.value = '';
  applyTransactionToForm(targetTransaction);
};

const goBack = () => {
  router.back();
};

const validateForm = () => {
  formError.amount = parseAmount(amount.value)
    ? ''
    : '금액을 입력해주세요.';
  formError.category = selectedCategory.value
    ? ''
    : '카테고리를 선택해주세요.';

  return !formError.amount && !formError.category;
};

const submitForm = async () => {
  if (isSubmitting.value) return;

  inlineErrorMessage.value = '';

  if (!validateForm()) return;

  if (!authStore.currentUserId) {
    inlineErrorMessage.value = '로그인 정보가 없습니다.';
    return;
  }

  const payload = transactionPayload.value;

  if (!payload) {
    inlineErrorMessage.value = '전송할 데이터를 만들 수 없습니다.';
    return;
  }

  if (isEditMode.value && !editingTransactionId.value) {
    inlineErrorMessage.value = '수정할 거래 ID가 없습니다.';
    return;
  }

  isSubmitting.value = true;

  try {
    if (isEditMode.value) {
      await momoStore.editTransactionData(editingTransactionId.value, payload);
    } else {
      await momoStore.addTransactionData(payload);
    }

    inlineErrorMessage.value = '';
    await momoStore.fetchTransactionList(authStore.currentUserId);
    router.back();
  } catch (error) {
    console.error('submitForm error:', error);
    inlineErrorMessage.value = '저장 중 오류가 발생했습니다.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await hydrateEditForm();
});

watch(
  () => [
    route.query.mode,
    route.query.transactionId,
    route.query.id,
    authStore.currentUserId,
  ],
  async () => {
    await hydrateEditForm();
  },
);
</script>

<template>
  <div>
    <section class="flex items-center justify-between">
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[22px] text-slate-900 shadow-sm"
        @click="goBack"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <button
        type="button"
        :disabled="isSubmitting"
        class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[22px] text-slate-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        @click="submitForm"
      >
        <i class="fa-solid fa-check"></i>
      </button>
    </section>
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
            @beforeinput="handleAmountBeforeInput"
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

        <p
          v-if="formError.amount"
          class="mt-4 w-full rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500"
        >
          {{ formError.amount }}
        </p>

        <section class="mt-11 w-full">
          <h2 class="text-[28px] font-extrabold text-slate-900">카테고리</h2>

          <div class="mt-6 grid grid-cols-4 gap-x-3 gap-y-5">
            <button
              v-for="category in currentCategories"
              :key="category.key"
              type="button"
              class="flex flex-col items-center gap-2 text-center"
              @click="selectCategory(category)"
            >
              <span
                class="flex h-16 w-16 items-center justify-center rounded-[22px] text-[28px] transition"
                :class="getCategoryTileClass(category)"
              >
                <i
                  :class="[
                    category.icon,
                    isCategorySelected(category) ? '' : category.iconClass,
                  ]"
                ></i>
              </span>
              <span
                class="text-[14px] font-medium leading-tight text-slate-400"
                :class="getCategoryLabelClass(category)"
              >
                {{ category.label }}
              </span>
            </button>
          </div>

          <p
            v-if="formError.category"
            class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500"
          >
            {{ formError.category }}
          </p>
        </section>

        <!-- 메모 -->
        <section class="mt-12 w-full">
          <h2 class="text-[28px] font-extrabold text-slate-900">메모</h2>

          <div class="mt-5">
            <input
              v-model="memo"
              type="text"
              maxlength="50"
              placeholder="메모를 입력하세요"
              class="h-15 w-full rounded-[20px] border border-slate-200 bg-white px-5 text-[18px] font-medium text-slate-900 outline-none placeholder:text-slate-300 focus:border-slate-300"
            />
          </div>
        </section>

        <p
          v-if="inlineErrorMessage"
          class="mt-4 w-full rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500"
        >
          {{ inlineErrorMessage }}
        </p>

        <section v-if="isEditMode" class="mt-8 w-full">
          <button
            type="button"
            class="flex h-16 w-full items-center justify-center gap-3 rounded-[22px] bg-rose-50 text-[18px] font-bold text-rose-400 transition hover:bg-rose-100"
          >
            <i class="fa-regular fa-trash-can text-[18px]"></i>
            <span>삭제하기</span>
          </button>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
