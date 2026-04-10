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
    class="min-h-[92px] rounded-[24px] bg-white px-4 py-5 text-left text-slate-900 shadow-sm transition"
    :class="checkedInToday || loading ? 'cursor-default' : 'active:scale-[0.98]'"
    :aria-disabled="checkedInToday || loading"
    @click="handleClick"
  >
    <p class="text-xs font-semibold tracking-[0.14em] text-emerald-600">
      ATTENDANCE
    </p>
    <p class="mt-3 text-lg font-bold">
      {{ checkedInToday ? `연속 ${attendance}일 출석` : '출석하기' }}
    </p>
  </button>
</template>
