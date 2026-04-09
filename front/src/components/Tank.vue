<script setup>
import { computed } from 'vue';

const props = defineProps({
  level: {
    type: Number,
    default: 1,
  },
  isHappy: {
    type: Boolean,
    default: true,
  },
});

const momoSizeClass = computed(() => {
  if (props.level >= 10) {
    return 'h-28 w-28';
  }

  if (props.level >= 5) {
    return 'h-24 w-24';
  }

  return 'h-20 w-20';
});

const momoPositionClass = computed(() => {
  return props.isHappy ? 'translate-y-[-10%]' : 'translate-y-[12%]';
});
</script>

<template>
  <section class="relative h-[380px] overflow-hidden rounded-[28px] border-[3px] border-[#9cd7d1] bg-[linear-gradient(180deg,#f7fffd_0%,#dff6f0_48%,#c4ebe6_100%)] shadow-sm">
      <div class="absolute inset-x-4 top-3 h-5 rounded-full bg-white/70 blur-md"></div>
      <div class="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(95,172,158,0)_0%,rgba(95,172,158,0.18)_100%)]"></div>

      <div class="absolute left-4 top-6 h-3 w-3 rounded-full bg-white/70"></div>
      <div class="absolute right-7 top-14 h-2 w-2 rounded-full bg-white/60"></div>
      <div class="absolute left-8 top-24 h-2 w-2 rounded-full bg-white/60"></div>

      <div
        class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-500"
        :class="momoPositionClass"
      >
        <div
          class="rounded-full bg-[radial-gradient(circle_at_30%_30%,#77f38e_0%,#49d86c_58%,#23b74d_100%)] shadow-[0_18px_40px_rgba(39,174,96,0.28)]"
          :class="momoSizeClass"
        ></div>
      </div>
  </section>
</template>
