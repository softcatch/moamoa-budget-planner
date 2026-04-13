<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';
import { categoryMap } from '@/constants/momoCategories';
import { useMomoStore } from '@/stores/momo';

const momoStore = useMomoStore();
const route = useRoute();

const allTransactions = ref([]);
const selectedCategories = ref([]);
const isFilterOpen = ref(false);
const showCalendar = ref(false);
const calendarContainerRef = ref(null);
const filterContainerRef = ref(null);

const getTodayDate = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const getMonthRange = (date = getTodayDate()) => ({
  start: new Date(date.getFullYear(), date.getMonth(), 1),
  end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
});

const calendarMasks = {
  title: 'YYYY년 M월',
};

const parseDateString = (dateString) => {
  if (typeof dateString !== 'string') {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const normalizeDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatDateKey = (date) => {
  const normalized = normalizeDate(date);

  if (!normalized) {
    return '';
  }

  return `${normalized.getFullYear()}-${String(normalized.getMonth() + 1).padStart(2, '0')}-${String(normalized.getDate()).padStart(2, '0')}`;
};

const formatRangeLabelDate = (date) => {
  const normalized = normalizeDate(date);

  if (!normalized) {
    return '';
  }

  return `${normalized.getFullYear()}.${String(normalized.getMonth() + 1).padStart(2, '0')}.${String(normalized.getDate()).padStart(2, '0')}`;
};

const selectedRange = ref(getMonthRange());

const normalizedRange = computed(() => {
  if (!selectedRange.value?.start && !selectedRange.value?.end) {
    return null;
  }

  const start = normalizeDate(selectedRange.value?.start);
  const end = normalizeDate(selectedRange.value?.end ?? selectedRange.value?.start);

  if (!start && !end) {
    return null;
  }

  if (!start) {
    return {
      start: end,
      end,
    };
  }

  if (!end) {
    return {
      start,
      end: start,
    };
  }

  return start <= end
    ? { start, end }
    : { start: end, end: start };
});

const rangeLabel = computed(() => {
  if (!normalizedRange.value) {
    return '전체 기간';
  }

  const { start, end } = normalizedRange.value;
  const startLabel = formatRangeLabelDate(start);
  const endLabel = formatRangeLabelDate(end);

  if (startLabel === endLabel) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
});

const categoryMetaMap = Object.values(categoryMap).flat().reduce((acc, item) => {
  acc[item.key] = item;
  acc[item.label] = item;
  return acc;
}, {});

const rangeFilteredTransactions = computed(() => {
  if (!normalizedRange.value) {
    return allTransactions.value;
  }

  return allTransactions.value.filter((item) => {
    const targetDate = parseDateString(item.date);

    if (!targetDate) {
      return false;
    }

    const { start, end } = normalizedRange.value;
    return targetDate >= start && targetDate <= end;
  });
});

const availableCategories = computed(() => {
  return [...new Set(
    rangeFilteredTransactions.value
      .map((item) => item.category)
      .filter(Boolean),
  )].sort((a, b) => a.localeCompare(b, 'ko-KR'));
});

const filterOptions = computed(() => {
  return availableCategories.value.map((category) => {
    const meta = categoryMetaMap[category];

    return {
      value: category,
      label: meta?.label ?? category,
      icon: meta?.icon ?? 'fa-solid fa-tag',
      iconClass: meta?.iconClass ?? 'text-slate-400',
    };
  });
});

const hasActiveRange = computed(() => Boolean(normalizedRange.value));

const hasActiveCategory = computed(() => selectedCategories.value.length > 0);

const selectedCategoryChips = computed(() => {
  return selectedCategories.value.map((category) => {
    const meta = categoryMetaMap[category];

    return {
      value: category,
      label: meta?.label ?? category,
      icon: meta?.icon ?? 'fa-solid fa-tag',
      iconClass: meta?.iconClass ?? 'text-slate-400',
    };
  });
});

const filteredTransactions = computed(() => {
  if (!selectedCategories.value.length) {
    return rangeFilteredTransactions.value;
  }

  return rangeFilteredTransactions.value.filter(
    (item) => selectedCategories.value.includes(item.category),
  );
});

const sortedTransactions = computed(() => {
  return [...filteredTransactions.value].sort(
    (a, b) => parseDateString(b.date) - parseDateString(a.date),
  );
});

const groupedTransactions = computed(() => {
  const groupedMap = {};

  sortedTransactions.value.forEach((item) => {
    if (!groupedMap[item.date]) {
      groupedMap[item.date] = [];
    }

    groupedMap[item.date].push(item);
  });

  return Object.entries(groupedMap).map(([date, items]) => ({
    date,
    items,
  }));
});

const headerSubtitle = computed(() => {
  return selectedCategories.value.length
    ? '선택한 기간 안에서 카테고리 내역을 날짜별로 볼 수 있어요.'
    : '선택한 기간의 전체 거래 내역을 날짜별로 볼 수 있어요.';
});

const emptyMessage = computed(() => {
  return selectedCategories.value.length
    ? '선택한 기간에 해당 카테고리 거래가 없어요.'
    : '선택한 기간에 거래 내역이 없어요.';
});

const formatDateLabel = (dateString) => {
  const date = parseDateString(dateString);

  if (!date) {
    return dateString;
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const makeDateAnchorId = (dateString) => {
  return `date-${dateString}`;
};

const toggleCalendar = () => {
  if (!showCalendar.value) {
    isFilterOpen.value = false;
  }

  showCalendar.value = !showCalendar.value;
};

const closeCalendar = () => {
  showCalendar.value = false;
};

const clearDateRange = () => {
  selectedRange.value = null;
  showCalendar.value = false;
};

const resetToCurrentMonth = () => {
  selectedRange.value = getMonthRange();
};

const loadTransactions = async (userId) => {
  const transactions = await momoStore.fetchTransactionList(userId);
  allTransactions.value = transactions ?? [];
  return allTransactions.value;
};

const loadInitialTransactions = async (userId) => {
  await loadTransactions(userId);
};

const toggleCategoryFilter = async (category) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(
      (item) => item !== category,
    );
  } else {
    selectedCategories.value = [...selectedCategories.value, category];
  }

  await scrollToHashTarget();
};

const clearCategoryFilter = async () => {
  selectedCategories.value = [];
  isFilterOpen.value = false;
  await scrollToHashTarget();
};

const removeCategoryFilter = async (category) => {
  selectedCategories.value = selectedCategories.value.filter(
    (item) => item !== category,
  );
  await scrollToHashTarget();
};

const toggleFilter = () => {
  if (!isFilterOpen.value) {
    showCalendar.value = false;
  }

  isFilterOpen.value = !isFilterOpen.value;
};

const handleClickOutside = (event) => {
  const target = event.target;

  if (
    showCalendar.value &&
    calendarContainerRef.value &&
    !calendarContainerRef.value.contains(target)
  ) {
    closeCalendar();
  }

  if (
    isFilterOpen.value &&
    filterContainerRef.value &&
    !filterContainerRef.value.contains(target)
  ) {
    isFilterOpen.value = false;
  }
};

const scrollToHashTarget = async () => {
  await nextTick();

  if (!route.hash) {
    return;
  }

  const id = route.hash.replace('#', '');
  const el = document.getElementById(id);

  if (!el) {
    return;
  }

  const y = el.getBoundingClientRect().top + window.scrollY - 110;

  window.scrollTo({
    top: y,
    behavior: 'smooth',
  });
};

onMounted(async () => {
  document.addEventListener('pointerdown', handleClickOutside);

  if (momoStore.currentMomoUserId) {
    await loadInitialTransactions(momoStore.currentMomoUserId);
  }

  await scrollToHashTarget();
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleClickOutside);
});

watch(
  () => momoStore.currentMomoUserId,
  async (newUserId, oldUserId) => {
    if (!newUserId || newUserId === oldUserId) {
      return;
    }

    selectedCategories.value = [];
    isFilterOpen.value = false;
    showCalendar.value = false;
    selectedRange.value = getMonthRange();

    await loadInitialTransactions(newUserId);
    await scrollToHashTarget();
  },
);

watch(availableCategories, (categories) => {
  if (!selectedCategories.value.length) {
    return;
  }

  selectedCategories.value = selectedCategories.value.filter((category) =>
    categories.includes(category),
  );
});

watch(
  normalizedRange,
  async (range, previousRange) => {
    if (!range && !previousRange) {
      return;
    }

    if (
      range &&
      previousRange &&
      formatDateKey(range.start) === formatDateKey(previousRange.start) &&
      formatDateKey(range.end) === formatDateKey(previousRange.end)
    ) {
      return;
    }

    if (!range || (selectedRange.value?.start && selectedRange.value?.end)) {
      showCalendar.value = false;
    }

    await scrollToHashTarget();
  },
  { deep: true },
);
</script>

<template>
  <main
    class="min-h-screen bg-[#eaf3ef] px-4 py-5 pb-[112px] text-slate-900 md:px-8 lg:pb-10 lg:pr-[120px]"
  >
    <div
      class="mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-[480px] rounded-[32px] bg-[#F4F7F6] px-5 pt-5 pb-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] lg:max-w-[1040px] lg:px-8 lg:pt-7 lg:pb-8"
    >
      <AppHeader
        title="목록"
        :subtitle="headerSubtitle"
        iconClass="fa-solid fa-list"
      />

      <section class="relative mb-6 space-y-3">
        <div class="flex items-center gap-3">
          <div
            ref="calendarContainerRef"
            class="relative min-w-0 flex-1"
          >
            <button
              type="button"
              class="inline-flex w-full items-center justify-between gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
              @click="toggleCalendar"
            >
              <span class="flex min-w-0 items-center gap-2">
                <i class="fa-solid fa-calendar-days shrink-0 text-emerald-500"></i>
                <span class="truncate">기간</span>
              </span>
              <i
                class="fa-solid fa-chevron-down shrink-0 text-[11px] text-slate-400 transition-transform"
                :class="{ 'rotate-180': showCalendar }"
              ></i>
            </button>

            <div
              v-if="showCalendar"
              class="absolute top-full left-0 z-20 mt-3 w-[320px] max-w-[calc(100vw-48px)] rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
            >
              <section class="space-y-4 rounded-[20px]">
                <div class="flex items-center justify-between gap-2 px-1">
                  <div>
                    <strong class="text-sm font-bold text-slate-900">
                      기간 선택
                    </strong>
                    <p class="mt-1 text-xs text-slate-400">
                      시작일과 종료일을 선택해 주세요.
                    </p>
                  </div>

                  <button
                    type="button"
                    class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200"
                    @click="resetToCurrentMonth"
                  >
                    이번 달
                  </button>
                </div>

                <VDatePicker
                  v-model.range="selectedRange"
                  :masks="calendarMasks"
                  color="green"
                  borderless
                  transparent
                  title-position="left"
                  :max-date="getTodayDate()"
                />

                <div class="flex items-center justify-between gap-2 px-1">
                  <span class="text-xs font-medium text-slate-500">
                    {{ rangeLabel }}
                  </span>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      class="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                      @click="clearDateRange"
                    >
                      전체 보기
                    </button>

                    <button
                      type="button"
                      class="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                      @click="closeCalendar"
                    >
                      완료
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div
            ref="filterContainerRef"
            class="relative min-w-0 flex-1"
          >
            <button
              type="button"
              class="inline-flex w-full items-center justify-between gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
              @click="toggleFilter"
            >
              <span class="flex min-w-0 items-center gap-2">
                <i class="fa-solid fa-filter shrink-0 text-emerald-500"></i>
                <span class="truncate">필터</span>
              </span>
              <i
                class="fa-solid fa-chevron-down shrink-0 text-[11px] text-slate-400 transition-transform"
                :class="{ 'rotate-180': isFilterOpen }"
              ></i>
            </button>

            <div
              v-if="isFilterOpen"
              class="absolute top-full right-0 z-20 mt-3 w-[280px] rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
            >
              <div class="mb-3 flex items-center justify-between px-2">
                <strong class="text-sm font-bold text-slate-900">
                  카테고리 선택
                </strong>
                <button
                  type="button"
                  class="text-xs font-medium text-slate-400 transition hover:text-slate-600"
                  @click="isFilterOpen = false"
                >
                  닫기
                </button>
              </div>

              <div class="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-sm font-semibold transition"
                  :class="
                    !hasActiveCategory
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  "
                  @click="clearCategoryFilter"
                >
                  <span class="flex items-center gap-3">
                    <i class="fa-solid fa-layer-group text-emerald-500"></i>
                    전체 보기
                  </span>
                  <i
                    v-if="!hasActiveCategory"
                    class="fa-solid fa-check text-xs text-emerald-500"
                  ></i>
                </button>

                <button
                  v-for="option in filterOptions"
                  :key="option.value"
                  type="button"
                  class="flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-sm font-semibold transition"
                  :class="
                    selectedCategories.includes(option.value)
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  "
                  @click="toggleCategoryFilter(option.value)"
                >
                  <span class="flex items-center gap-3">
                    <i :class="[option.icon, option.iconClass]"></i>
                    {{ option.label }}
                  </span>
                  <i
                    v-if="selectedCategories.includes(option.value)"
                    class="fa-solid fa-check text-xs text-emerald-500"
                  ></i>
                </button>

                <p
                  v-if="filterOptions.length === 0"
                  class="rounded-[18px] bg-slate-50 px-4 py-5 text-center text-sm text-slate-400"
                >
                  선택한 기간에 해당하는 카테고리가 없어요.
                </p>
              </div>


            </div>
          </div>
        </div>

        <div
          v-if="hasActiveRange || hasActiveCategory"
          class="flex flex-wrap items-center gap-2 px-1"
        >
          <button
            v-if="hasActiveRange"
            type="button"
            class="inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
            @click="clearDateRange"
          >
            <i class="fa-solid fa-calendar-days shrink-0 text-[11px]"></i>
            <span class="truncate">{{ rangeLabel }}</span>
            <i class="fa-solid fa-xmark shrink-0 text-[11px]"></i>
          </button>

          <button
            v-for="category in selectedCategoryChips"
            :key="category.value"
            type="button"
            class="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
            @click="removeCategoryFilter(category.value)"
          >
            <i :class="[category.icon, category.iconClass, 'shrink-0 text-[11px]']"></i>
            <span class="truncate">{{ category.label }}</span>
            <i class="fa-solid fa-xmark shrink-0 text-[11px]"></i>
          </button>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-2 lg:items-start">
        <template v-if="groupedTransactions.length > 0">
          <section
            v-for="group in groupedTransactions"
            :key="group.date"
            class="space-y-4"
          >
            <div
              :id="makeDateAnchorId(group.date)"
              class="inline-flex rounded-full bg-[#EDECF3] px-5 py-3 text-[18px] font-bold text-slate-500"
            >
              {{ formatDateLabel(group.date) }}
            </div>

            <div class="space-y-4">
              <TransactionCard
                v-for="item in group.items"
                :key="item.id"
                :id="item.id"
                :type="item.type"
                :category="item.category"
                :desc="item.desc"
                :amount="item.amount"
              />
            </div>
          </section>
        </template>

        <p
          v-else
          class="py-10 text-center text-sm font-medium text-slate-400 lg:col-span-2"
        >
          {{ emptyMessage }}
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>




