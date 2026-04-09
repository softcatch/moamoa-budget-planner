<script setup>
import { computed } from 'vue';
import { categoryMap } from '@/constants/momoCategories.js';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const amountText = computed(() => {
  const sign = props.type === 'income' ? '+' : '-';
  return `${sign}₩${props.amount.toLocaleString()}`;
});

const amountClass = computed(() => {
  return props.type === 'income' ? 'text-emerald-500' : 'text-rose-500';
});

const matchedCategory = computed(() => {
  const list = categoryMap[props.type] || [];

  return (
    list.find((item) => item.label === props.category) || {
      icon: 'fa-solid fa-circle-question',
      iconClass: 'text-slate-400',
    }
  );
});

const categoryIcon = computed(() => matchedCategory.value.icon);
const categoryIconClass = computed(() => matchedCategory.value.iconClass);

const handleClick = () => {
  console.log({
    id: props.id,
    type: props.type,
    category: props.category,
    desc: props.desc,
    amount: props.amount,
  });
};
</script>

<template>
  <div
    class="flex cursor-pointer items-center justify-between rounded-[28px] bg-white px-5 py-5 shadow-sm"
    @click="handleClick"
  >
    <div class="flex items-center gap-4">
      <div
        class="flex h-[30px] w-[30px] items-center justify-center rounded-[20px] bg-slate-50 text-[20px]"
      >
        <i :class="[categoryIcon, categoryIconClass]"></i>
      </div>

      <div>
        <div class="flex items-center gap-4">
          <span class="text-[14px] font-extrabold text-slate-900">
            {{ desc }}
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-400">
          {{ category }}
        </p>
      </div>
    </div>

    <div class="text-[18px] font-extrabold" :class="amountClass">
      {{ amountText }}
    </div>
  </div>
</template>

<style scoped></style>
