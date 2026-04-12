<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';
import { categoryMap } from '@/constants/momoCategories';
import { useMomoStore } from '@/stores/momo';

const momoStore = useMomoStore();
const route = useRoute();

const selectedCategory = ref('');
const isFilterOpen = ref(false);
const availableCategories = ref([]);

const categoryMetaMap = Object.values(categoryMap).flat().reduce((acc, item) => {
  acc[item.key] = item;
  acc[item.label] = item;
  return acc;
}, {});

const sortedTransactions = computed(() => {
  return [...momoStore.transactionList].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
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

const selectedCategoryLabel = computed(() => {
  if (!selectedCategory.value) {
    return '전체';
  }

  return categoryMetaMap[selectedCategory.value]?.label || selectedCategory.value;
});

const headerSubtitle = computed(() => {
  return selectedCategory.value
    ? '카테고리 내역을 날짜별로 확인할 수 있어요'
    : '전체 거래 내역을 날짜별로 확인할 수 있어요';
});

const emptyMessage = computed(() => {
  return selectedCategory.value
    ? '선택한 카테고리 내역이 아직 없어요.'
    : '거래 내역이 아직 없어요.';
});

const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const makeDateAnchorId = (dateString) => {
  return `date-${dateString}`;
};

const syncAvailableCategories = (transactions) => {
  availableCategories.value = [...new Set(
    transactions
      .map((item) => item.category)
      .filter(Boolean),
  )].sort((a, b) => a.localeCompare(b, 'ko-KR'));
};

const loadTransactions = async (userId, category = '') => {
  const transactions = await momoStore.fetchTransactionList(
    userId,
    category ? { category } : {},
  );

  return transactions ?? [];
};

const loadInitialTransactions = async (userId) => {
  const transactions = await loadTransactions(userId);
  syncAvailableCategories(transactions);

  if (
    selectedCategory.value &&
    !availableCategories.value.includes(selectedCategory.value)
  ) {
    selectedCategory.value = '';
    await loadTransactions(userId);
  }
};

const applyCategoryFilter = async (category) => {
  if (!momoStore.currentMomoUserId) {
    return;
  }

  selectedCategory.value = category;
  isFilterOpen.value = false;

  await loadTransactions(momoStore.currentMomoUserId, category);
  await scrollToHashTarget();
};

const clearCategoryFilter = async () => {
  if (!momoStore.currentMomoUserId) {
    return;
  }

  selectedCategory.value = '';
  isFilterOpen.value = false;

  await loadTransactions(momoStore.currentMomoUserId);
  await scrollToHashTarget();
};

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
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
  if (momoStore.currentMomoUserId) {
    await loadInitialTransactions(momoStore.currentMomoUserId);
  }

  await scrollToHashTarget();
});

watch(
  () => momoStore.currentMomoUserId,
  async (newUserId, oldUserId) => {
    if (!newUserId || newUserId === oldUserId) {
      return;
    }

    selectedCategory.value = '';
    isFilterOpen.value = false;

    await loadInitialTransactions(newUserId);
    await scrollToHashTarget();
  },
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

      <section class="relative mb-6 flex justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
          @click="toggleFilter"
        >
          <i class="fa-solid fa-filter text-emerald-500"></i>
          <span>{{ selectedCategoryLabel }}</span>
          <i
            class="fa-solid fa-chevron-down text-[11px] text-slate-400 transition-transform"
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
                !selectedCategory
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
                v-if="!selectedCategory"
                class="fa-solid fa-check text-xs text-emerald-500"
              ></i>
            </button>

            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              class="flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-left text-sm font-semibold transition"
              :class="
                selectedCategory === option.value
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              "
              @click="applyCategoryFilter(option.value)"
            >
              <span class="flex items-center gap-3">
                <i :class="[option.icon, option.iconClass]"></i>
                {{ option.label }}
              </span>
              <i
                v-if="selectedCategory === option.value"
                class="fa-solid fa-check text-xs text-emerald-500"
              ></i>
            </button>

            <p
              v-if="filterOptions.length === 0"
              class="rounded-[18px] bg-slate-50 px-4 py-5 text-center text-sm text-slate-400"
            >
              아직 선택할 수 있는 카테고리가 없어요.
            </p>
          </div>
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
