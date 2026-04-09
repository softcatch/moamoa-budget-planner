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
    return 'h-32 w-32';
  }

  if (props.level >= 5) {
    return 'h-28 w-28';
  }

  return 'h-24 w-24';
});

const momoPositionClass = computed(() => {
  return props.isHappy ? 'translate-y-[8%]' : 'translate-y-[14%]';
});

const waterToneClass = computed(() => {
  return props.isHappy
    ? 'from-[#F6FFFD] via-[#DFF7F1] to-[#BEE7E2]'
    : 'from-[#F8FEFD] via-[#E4F3F0] to-[#CAE1DE]';
});
</script>

<template>
  <section class="relative isolate h-[408px]">
    <div
      class="pointer-events-none absolute inset-x-7 top-0 z-20 h-4 border-x-[4px] border-t-[4px] border-[#585f67] bg-[#9aa2ab]"
    >
      <div class="absolute inset-x-0 top-0 h-[4px] bg-[#cfd5db]"></div>
    </div>

    <div
      class="absolute inset-x-0 bottom-0 top-3 overflow-hidden border-[4px] border-[#4b5f67] bg-[#dff8fb] shadow-[10px_10px_0_rgba(88,136,142,0.16)]"
    >
      <div class="absolute inset-x-0 top-0 h-[6px] bg-[#f8ffff]"></div>
      <div class="absolute left-0 top-0 h-full w-[6px] bg-[#f1ffff]/85"></div>
      <div class="absolute right-0 top-0 h-full w-[6px] bg-[#8fbcc4]/45"></div>

      <div class="absolute inset-x-[8px] top-[18px] z-10 h-[4px] bg-[#d7fbff]"></div>
      <div class="absolute inset-x-[16px] top-[22px] z-10 h-[2px] bg-[#f5ffff]"></div>

      <div
        class="absolute inset-x-[4px] bottom-[4px] top-[20px] bg-gradient-to-b"
        :class="waterToneClass"
      ></div>

      <div class="absolute inset-x-6 top-7 h-8 bg-[#f6ffff]/35"></div>
      <div class="absolute left-5 top-14 h-[64%] w-4 bg-[#ffffff]/20"></div>
      <div class="absolute right-6 top-16 h-[48%] w-3 bg-[#99d2dc]/22"></div>

      <div
        class="absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,rgba(116,224,220,0)_0%,rgba(116,224,220,0.12)_40%,rgba(116,224,220,0.34)_100%)]"
      ></div>

      <div
        class="absolute left-7 top-28 h-4 w-4 border-[3px] border-[#d9fbff] bg-[#9adcea]/20"
      ></div>
      <div
        class="absolute left-20 top-[4.5rem] h-3 w-3 border-[3px] border-[#d9fbff] bg-[#9adcea]/20"
      ></div>
      <div
        class="absolute right-10 top-20 h-4 w-4 border-[3px] border-[#d9fbff] bg-[#9adcea]/20"
      ></div>
      <div
        class="absolute right-28 top-32 h-5 w-5 border-[3px] border-[#d9fbff] bg-[#9adcea]/20"
      ></div>

      <div
        class="absolute inset-x-0 bottom-0 h-[82px] bg-[linear-gradient(180deg,rgba(87,183,171,0)_0%,rgba(87,183,171,0.18)_100%)]"
      ></div>
      <div class="absolute inset-x-0 bottom-0 h-[20px] bg-[#7b858d]"></div>
      <div class="absolute inset-x-0 bottom-[20px] h-[4px] bg-[#ced7dd]/45"></div>

      <div
        class="absolute bottom-[20px] left-5 h-16 w-7 bg-[#49bf72] [clip-path:polygon(0_100%,0_86%,28%_86%,28%_64%,42%_64%,42%_46%,57%_46%,57%_24%,71%_24%,71%_0,100%_0,100%_20%,85%_20%,85%_42%,71%_42%,71%_64%,57%_64%,57%_84%,28%_84%,28%_100%)]"
      ></div>
      <div
        class="absolute bottom-[20px] left-12 h-28 w-8 bg-[#53c97b] [clip-path:polygon(0_100%,0_88%,25%_88%,25%_74%,37%_74%,37%_58%,50%_58%,50%_40%,62%_40%,62%_22%,75%_22%,75%_0,100%_0,100%_18%,87%_18%,87%_38%,75%_38%,75%_56%,62%_56%,62%_72%,50%_72%,50%_88%,25%_88%,25%_100%)]"
      ></div>
      <div
        class="absolute bottom-[20px] right-12 h-[118px] w-8 bg-[#4ab86f] [clip-path:polygon(100%_100%,100%_88%,75%_88%,75%_72%,62%_72%,62%_54%,50%_54%,50%_36%,37%_36%,37%_18%,25%_18%,25%_0,0_0,0_20%,12%_20%,12%_40%,25%_40%,25%_58%,37%_58%,37%_76%,50%_76%,50%_90%,75%_90%,75%_100%)]"
      ></div>
      <div
        class="absolute bottom-[20px] right-5 h-24 w-7 bg-[#63cf86] [clip-path:polygon(100%_100%,100%_86%,71%_86%,71%_68%,57%_68%,57%_48%,42%_48%,42%_26%,28%_26%,28%_0,0_0,0_18%,14%_18%,14%_40%,28%_40%,28%_60%,42%_60%,42%_80%,71%_80%,71%_100%)]"
      ></div>

      <div class="absolute bottom-[20px] left-5 h-3 w-8 bg-[#2f8751]"></div>
      <div class="absolute bottom-[20px] left-12 h-3 w-9 bg-[#318955]"></div>
      <div class="absolute bottom-[20px] right-12 h-3 w-9 bg-[#2b7d4a]"></div>
      <div class="absolute bottom-[20px] right-5 h-3 w-8 bg-[#3f9860]"></div>

      <div class="absolute inset-x-3 bottom-[20px] flex items-end gap-[6px]">
        <div class="h-3 w-3 bg-[#e7ddd5]"></div>
        <div class="h-4 w-4 bg-[#d5d0cb]"></div>
        <div class="h-5 w-7 bg-[#b1aea9]"></div>
        <div class="h-6 w-6 bg-[#9f9996]"></div>
        <div class="h-5 w-6 bg-[#b9b4ae]"></div>
        <div class="h-3 w-3 bg-[#ddd8d2]"></div>
        <div class="h-4 w-6 bg-[#8f8a86]"></div>
        <div class="h-6 w-7 bg-[#b3afa8]"></div>
        <div class="h-3 w-3 bg-[#ddd5cf]"></div>
        <div class="h-5 w-5 bg-[#8c8885]"></div>
        <div class="h-3 w-3 bg-[#e3ddd7]"></div>
      </div>

      <div
        class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-500"
        :class="momoPositionClass"
      >
        <div
          class="rounded-full bg-[radial-gradient(circle_at_30%_30%,#77f38e_0%,#49d86c_58%,#23b74d_100%)] shadow-[0_18px_40px_rgba(39,174,96,0.28)]"
          :class="momoSizeClass"
        ></div>
      </div>
    </div>
  </section>
</template>
