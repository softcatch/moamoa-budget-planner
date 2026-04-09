<script setup>
import { ref, computed, onMounted } from 'vue';

import Calendar from '@/components/Calendar.vue';
import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';
import calendarIcon from '@/assets/calendar.png';
import { useMomoStore } from '@/stores/momo';
import NavBar from '@/components/NavBar.vue';

const momoStore = useMomoStore();

const selectedDate = ref(new Date(2026, 3, 8));
const currentUserId = ref('1111');

onMounted(() => {
  momoStore.fetchTransactionList(currentUserId.value);
});

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
  selectedDate.value = date;
};

const monthLabel = computed(() => {
  return `${selectedDate.value.getMonth() + 1}월 요약`;
});
</script>

<template>
  <AppHeader
    title="월간"
    subtitle="날짜를 누르면 하단에 해당 일자 내역이 보여요"
    :iconSrc="calendarIcon"
    iconAlt="calendar icon"
  />
  <div
    class="relative w-[480px] min-h-[844px] overflow-hidden rounded-[32px] bg-[#F4F7F6] px-6 pt-[110px] pb-[100px]"
  >
    <div class="mt-4 rounded-[24px] bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <span class="text-base font-bold text-slate-900 ml-10">
          {{ monthLabel }}
        </span>
        <span
          class="text-[24px] font-bold mr-10"
          :class="monthlyNet >= 0 ? 'text-emerald-500' : 'text-rose-500'"
        >
          {{ formatSignedWon(monthlyNet) }}
        </span>
      </div>

      <div class="mt-5 grid grid-cols-2 gap-6 ml-10">
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
    </div>

    <div class="mt-4 rounded-[24px] bg-white p-4 shadow-sm">
      <Calendar
        :selectedDate="selectedDate"
        :dailyTotalsMap="dailyTotalsMap"
        @select-date="onSelectDate"
      />

      <div class="mt-35 flex items-center justify-between">
        <h2 class="ml-4 text-base font-semibold text-slate-900">
          {{ formattedDateForPrint }}
        </h2>

        <router-link
          :to="{
            name: 'momo/full-list',
            hash: `#date-${formattedDate}`,
          }"
          class="mr-2 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-600 no-underline"
        >
          <span class="text-xs">≡</span>
          목록 보기
        </router-link>
      </div>

      <div class="mt-4 space-y-3">
        <p
          v-if="selectedDateTransactions.length === 0"
          class="text-center text-sm text-slate-500"
        >
          해당 날짜 내역이 없습니다.
        </p>

        <TransactionCard
          v-for="item in selectedDateTransactions"
          :key="item.id"
          :type="item.type"
          :category="item.category"
          :desc="item.desc"
          :amount="item.amount"
        />
      </div>
    </div>
  </div>

  <NavBar />
</template>

<style scoped></style>
