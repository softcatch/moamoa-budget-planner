<script setup>
defineProps({
  missionText: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['open']);
</script>

<template>
  <button
    type="button"
    class="min-h-[92px] rounded-[24px] bg-white px-4 py-5 text-left text-slate-900 shadow-sm transition active:scale-[0.98]"
    @click="emit('open')"
  >
    <p class="text-xs font-semibold tracking-[0.14em] text-emerald-600">MISSION</p>
    <p class="mt-3 line-clamp-2 text-lg font-bold">
      {{ missionText || '미션 받기' }}
    </p>
  </button>
</template>
