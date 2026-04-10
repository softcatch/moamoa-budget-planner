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
    default: '',
  },
  iconAlt: {
    type: String,
    default: 'header icon',
  },
  iconClass: {
    type: String,
    default: 'fa-solid fa-chart-pie',
  },
});
</script>

<template>
  <header
    class="sticky top-0 z-30 -mx-5 -mt-5 mb-5 flex items-start justify-between rounded-t-[32px] bg-inherit px-5 pt-5 pb-4 lg:-mx-8 lg:-mt-7 lg:mb-6 lg:px-8 lg:pt-7"
  >
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
      <img
        v-if="iconSrc"
        :src="iconSrc"
        :alt="iconAlt"
        class="h-6 w-6 object-contain"
      />
      <i v-else :class="[iconClass, 'text-[22px] text-emerald-600']"></i>
    </div>
  </header>
</template>
