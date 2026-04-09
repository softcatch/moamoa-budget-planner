<script setup>
import { computed } from 'vue';

const props = defineProps({
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

const typeClass = computed(() => {
  return props.type === 'income' ? 'text-gray-300' : 'text-slate-900';
});

const iconText = computed(() => {
  if (props.category === '식비') return '🍽️';
  if (props.category === '임금') return '💼';
  return '💰';
});
</script>

<template>
  <div
    class="flex items-center justify-between rounded-[28px] bg-white px-5 py-5 shadow-sm"
  >
    <div class="flex items-center gap-4">
      <div
        class="flex h-[30px] w-[30px] items-center justify-center rounded-[20px] bg-slate-50 text-[28px]"
      >
        {{ iconText }}
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
