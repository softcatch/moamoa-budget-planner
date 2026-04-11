<script setup>
import { computed } from 'vue';

const props = defineProps({
  checkedInToday: {
    type: Boolean,
    default: false,
  },
  attendance: {
    type: Number,
    default: 0,
  },
  rewardExp: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['attend']);

const titleText = computed(() => {
  if (props.checkedInToday) {
    return `\uC5F0\uC18D ${props.attendance}\uC77C \uCD9C\uC11D`;
  }

  return '\uCD9C\uC11D\uD558\uAE30';
});

const handleClick = () => {
  if (props.checkedInToday || props.loading) {
    return;
  }

  emit('attend');
};
</script>

<template>
  <button
    type="button"
    class="min-h-[92px] rounded-[24px] bg-white px-4 py-5 text-left text-slate-900 shadow-sm transition"
    :class="checkedInToday || loading ? 'cursor-default' : 'active:scale-[0.98]'"
    :aria-disabled="checkedInToday || loading"
    @click="handleClick"
  >
    <p class="text-xs font-semibold tracking-[0.14em] text-emerald-600">
      ATTENDANCE
    </p>

    <div class="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
      <p class="text-lg font-bold leading-snug">
        {{ titleText }}
      </p>

      <span
        v-if="rewardExp > 0"
        class="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600"
      >
        +{{ rewardExp.toLocaleString() }} EXP
      </span>
    </div>
  </button>
</template>
