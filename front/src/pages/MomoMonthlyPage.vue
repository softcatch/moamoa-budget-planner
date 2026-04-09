<script setup>
import { ref, computed, watch } from 'vue';

import Calendar from '@/components/Calendar.vue';
import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';
import calendarIcon from '@/assets/calendar.png';
import { useMomoStore } from '@/stores/momo';
import { useAuthStore } from '@/stores/auth';

const momoStore = useMomoStore();
const authStore = useAuthStore();

const selectedDate = ref(new Date(2026, 3, 8));

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

  userTransactions.value.forEach((item) => {
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
  return userTransactions.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
});

const monthlyExpense = computed(() => {
  return userTransactions.value
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
</script>

<template>
  <div
    class="w-[390px] min-h-[844px] rounded-[32px] bg-[#F4F7F6] overflow-hidden relative p-6"
  >
    <AppHeader
      title="월간"
      subtitle="날짜를 누르면 하단에 해당 일자 내역이 보여요"
      :iconSrc="calendarIcon"
      iconAlt="calendar icon"
    />

    <div class="mt-4 rounded-[24px] bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <span class="text-base font-bold text-slate-900">월별 요약</span>
        <span
          class="text-[24px] font-bold"
          :class="monthlyNet >= 0 ? 'text-emerald-500' : 'text-rose-500'"
        >
          {{ formatSignedWon(monthlyNet) }}
        </span>
      </div>

      <div class="mt-5 grid grid-cols-2 gap-6">
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

      <div class="flex justify-between items-center">
        <h2 class="text-base font-semibold text-slate-900 ml-4">
          {{ formattedDateForPrint }}
        </h2>

        <button
          class="mr-2 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-600 font-semibold text-xs"
        >
          <span class="text-xs">≡</span>
          목록 보기
        </button>
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
</template>

<style scoped></style>
