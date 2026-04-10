<script setup>
const props = defineProps({
  missionText: {
    type: String,
    default: '',
  },
  rewardLabel: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['open']);

const handleClick = () => {
  if (props.disabled) {
    return;
  }

  emit('open');
};
</script>

<template>
  <button
    type="button"
    class="min-h-[92px] rounded-[24px] bg-white px-4 py-5 text-left text-slate-900 shadow-sm transition"
    :class="disabled ? 'cursor-default' : 'active:scale-[0.98]'"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <p class="text-xs font-semibold tracking-[0.14em] text-emerald-600">MISSION</p>

    <div class="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
      <p class="line-clamp-2 text-lg font-bold leading-snug">
        {{ missionText || '\uBBF8\uC158 \uBC1B\uAE30' }}
      </p>

      <span
        v-if="rewardLabel"
        class="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600"
      >
        {{ rewardLabel }}
      </span>
    </div>
  </button>
</template>
