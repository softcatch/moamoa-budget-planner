<script setup>
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';
import NavBar from '@/components/NavBar.vue';
import { useMomoStore } from '@/stores/momo';
import calendarIcon from '@/assets/calendar.png';

const momoStore = useMomoStore();
const route = useRoute();

const currentUserId = ref('1111');

const sortedTransactions = computed(() => {
  return [...momoStore.transactionList].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
});

const groupedTransactions = computed(() => {
  const map = {};

  sortedTransactions.value.forEach((item) => {
    if (!map[item.date]) {
      map[item.date] = [];
    }
    map[item.date].push(item);
  });

  return Object.entries(map).map(([date, items]) => ({
    date,
    items,
  }));
});

const formatDateLabel = (dateString) => {
  const d = new Date(dateString);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const makeDateAnchorId = (dateString) => {
  return `date-${dateString}`;
};

onMounted(async () => {
  await momoStore.fetchTransactionList(currentUserId.value);

  await nextTick();

  if (route.hash) {
    const id = route.hash.replace('#', '');
    const el = document.getElementById(id);

    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 110;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  }
});
</script>

<template>
  <AppHeader
    title="목록"
    subtitle="전체 거래 내역을 날짜별로 확인할 수 있어요"
    :iconSrc="calendarIcon"
    iconAlt="list icon"
  />

  <div
    class="relative w-[480px] min-h-[844px] overflow-hidden rounded-[32px] bg-[#F4F7F6] px-6 pt-[110px] pb-[100px]"
  >
    <div class="mt-6 space-y-6">
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
              :id="item.id"
              :type="item.type"
              :category="item.category"
              :desc="item.desc"
              :amount="item.amount"
            />
          </div>
        </section>
      </template>

      <p v-else class="py-10 text-center text-sm font-medium text-slate-400">
        거래 내역이 없습니다.
      </p>
    </div>
  </div>

  <NavBar />
</template>

<style scoped></style>
