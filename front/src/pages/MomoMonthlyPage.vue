<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Calendar from '@/components/Calendar.vue';
import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';
import { useMomoStore } from '@/stores/momo';
import { useAuthStore } from '@/stores/auth';

const momoStore = useMomoStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const getTodayDate = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const parseQueryDate = (dateValue) => {
  if (typeof dateValue !== 'string') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return null;

  const parsedDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

const selectedDate = ref(parseQueryDate(route.query.date) ?? getTodayDate());

watch(
  () => authStore.currentUserId,
  (userId) => {
    if (!userId) {
      momoStore.transactionList = [];
      return;
    }

    momoStore.fetchTransactionList(userId);
  },
  { immediate: true },
);

const userTransactions = computed(() => momoStore.transactionList);

const currentYearMonth = computed(() => {
  const d = selectedDate.value;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
});

const monthlyTransactions = computed(() => {
  return userTransactions.value.filter((item) =>
    item.date.startsWith(currentYearMonth.value),
  );
});

const formattedDate = computed(() => {
  const d = selectedDate.value;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

const formattedDateForPrint = computed(() => {
  const d = selectedDate.value;
  return `${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일 내역`;
});

const selectedDateTransactions = computed(() => {
  return userTransactions.value.filter(
    (item) => item.date === formattedDate.value,
  );
});

const dailyTotalsMap = computed(() => {
  const map = {};

  monthlyTransactions.value.forEach((item) => {
    if (!map[item.date]) {
      map[item.date] = 0;
    }

    if (item.type === 'income') {
      map[item.date] += item.amount;
    } else if (item.type === 'expense') {
      map[item.date] -= item.amount;
    }
  });

  return map;
});

const monthlyIncome = computed(() => {
  return monthlyTransactions.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
});

const monthlyExpense = computed(() => {
  return monthlyTransactions.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
});

const monthlyNet = computed(() => {
  return monthlyIncome.value - monthlyExpense.value;
});

const formatSignedWon = (amount) => {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}₩${Math.abs(amount).toLocaleString()}`;
};

const onSelectDate = (date) => {
  selectedDate.value = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
};

const monthLabel = computed(() => {
  return `${selectedDate.value.getMonth() + 1}월 요약`;
});

watch(
  formattedDate,
  async (date) => {
    if (route.query.date === date) return;

    await router.replace({
      name: route.name,
      query: {
        ...route.query,
        date,
      },
    });
  },
  { immediate: true },
);

watch(
  () => route.query.date,
  (date) => {
    const parsedDate = parseQueryDate(date);

    if (!parsedDate) return;
    if (formattedDate.value === date) return;

    selectedDate.value = parsedDate;
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
        title="월간"
        subtitle="날짜를 누르면 하단에 해당 일자 내역이 보여요"
        iconClass="fa-solid fa-calendar-days"
      />

      <div
        class="grid gap-4 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-start lg:gap-6"
      >
        <div class="space-y-4">
          <section class="rounded-[24px] bg-white p-6 shadow-sm">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <span class="text-base font-bold text-slate-900">
                {{ monthLabel }}
              </span>
              <span
                class="text-[24px] font-bold leading-none"
                :class="monthlyNet >= 0 ? 'text-emerald-500' : 'text-rose-500'"
              >
                {{ formatSignedWon(monthlyNet) }}
              </span>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p class="text-[13px] font-bold text-slate-900">수입</p>
                <p class="mt-2 text-[20px] font-bold text-emerald-500">
                  +₩{{ monthlyIncome.toLocaleString() }}
                </p>
              </div>

              <div>
                <p class="text-[13px] font-bold text-slate-900">지출</p>
                <p class="mt-2 text-[20px] font-bold text-rose-500">
                  -₩{{ monthlyExpense.toLocaleString() }}
                </p>
              </div>
            </div>
          </section>

          <section class="rounded-[24px] bg-white p-4 shadow-sm">
            <Calendar
              :selectedDate="selectedDate"
              :dailyTotalsMap="dailyTotalsMap"
              @select-date="onSelectDate"
            />
          </section>
        </div>

        <section
          class="rounded-[24px] bg-white p-5 shadow-sm lg:sticky lg:top-[128px] lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto"
        >
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-base font-semibold text-slate-900">
              {{ formattedDateForPrint }}
            </h2>

            <router-link
              :to="{
                name: 'momo/full-list',
                hash: `#date-${formattedDate}`,
              }"
              class="flex shrink-0 items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-600 no-underline"
            >
              <span class="text-xs">≡</span>
              목록 보기
            </router-link>
          </div>

          <div class="mt-4 space-y-3">
            <p
              v-if="selectedDateTransactions.length === 0"
              class="py-8 text-center text-sm text-slate-500"
            >
              해당 날짜 내역이 없습니다.
            </p>

            <TransactionCard
              v-for="item in selectedDateTransactions"
              :key="item.id"
              :id="item.id"
              :type="item.type"
              :category="item.category"
              :desc="item.desc"
              :amount="item.amount"
            />
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
