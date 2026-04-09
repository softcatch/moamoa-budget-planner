<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  iconSrc: {
    type: String,
    required: true,
  },
  iconAlt: {
    type: String,
    default: 'header icon',
  },
});
</script>

<template>
  <div class="flex items-start justify-between">
    <div class="pr-4">
      <h1 class="text-[28px] leading-none font-bold text-slate-900">
        {{ title }}
      </h1>
      <p class="mt-2 text-xs text-slate-500">
        {{ subtitle }}
      </p>
    </div>

    <div
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100"
    >
      <img :src="iconSrc" :alt="iconAlt" class="h-6 w-6 object-contain" />
    </div>
  </div>
</template>
