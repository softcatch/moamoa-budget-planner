<script setup>
import { computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';
import { useMomoStore } from '@/stores/momo';

const momoStore = useMomoStore();
const route = useRoute();

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

const scrollToHashTarget = async () => {
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
};

onMounted(async () => {
  if (momoStore.currentMomoUserId) {
    await momoStore.fetchTransactionList(momoStore.currentMomoUserId);
  }

  await scrollToHashTarget();
});

watch(
  () => momoStore.currentMomoUserId,
  async (newUserId, oldUserId) => {
    if (!newUserId || newUserId === oldUserId) return;

    await momoStore.fetchTransactionList(newUserId);
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
        subtitle="전체 거래 내역을 날짜별로 확인할 수 있어요"
        iconClass="fa-solid fa-list"
      />

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
          거래 내역이 없습니다.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
