<script setup>
const props = defineProps({
  checkedInToday: {
    type: Boolean,
    default: false,
  },
  attendance: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['attend']);

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
    class="min-h-[92px] rounded-[24px] px-4 py-5 text-left shadow-sm transition"
    :class="checkedInToday
      ? 'cursor-not-allowed bg-slate-200 text-slate-500'
      : 'bg-white text-slate-900 active:scale-[0.98]'"
    :disabled="checkedInToday || loading"
    @click="handleClick"
  >
    <p class="text-xs font-semibold tracking-[0.14em]" :class="checkedInToday ? 'text-slate-500' : 'text-emerald-600'">
      ATTENDANCE
    </p>
    <p class="mt-3 text-lg font-bold">
      {{ checkedInToday ? `연속 ${attendance}일 출석` : '출석하기' }}
    </p>
  </button>
</template>
