<script setup>
const props = defineProps({
  missionText: {
    type: String,
    default: '',
  },
  showGuideButton: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(['open', 'open-guide']);

const handleClick = () => {
  if (props.disabled) {
    return;
  }

  emit('open');
};

const handleGuideClick = (event) => {
  event.stopPropagation();
  emit('open-guide');
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
    <div class="flex items-center justify-between gap-3">
      <p class="text-xs font-semibold tracking-[0.14em] text-emerald-600">MISSION</p>

      <button
        v-if="showGuideButton"
        type="button"
        class="-mt-2 flex h-8 shrink-0 items-center justify-center gap-1 rounded-full bg-emerald-50 px-2 text-emerald-600 transition active:scale-95"
        aria-label="미션 도움말 보기"
        @click="handleGuideClick"
      >
        <i class="fa-solid fa-book-open text-[15px]"></i>
        <i class="fa-solid fa-circle-question text-[14px]"></i>
      </button>
    </div>

    <div class="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
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
