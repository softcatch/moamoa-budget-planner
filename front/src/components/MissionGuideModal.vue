<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  missionCategory: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>

<template>
  <teleport to="body">
    <div
      v-if="props.modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/35 px-4 py-8"
      @click.self="closeModal"
    >
      <section
        class="w-full max-w-[360px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
      >
        <div class="bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-5 py-5 text-white">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold tracking-[0.18em] text-white/70">MISSION GUIDE</p>
              <h2 class="mt-1 text-xl font-bold">미션 정산 안내</h2>
            </div>
            <button
              type="button"
              class="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl font-semibold text-white"
              @click="closeModal"
            >
              X
            </button>
          </div>
        </div>

        <div class="px-5 py-5">
          <div class="rounded-[24px] bg-emerald-50 px-4 py-4">
            <p class="text-sm font-semibold text-emerald-700">현재 미션</p>
            <p class="mt-2 text-xl font-bold text-slate-900">
              {{ missionCategory ? `${missionCategory} 절약하기` : '오늘의 미션 진행 중' }}
            </p>
          </div>

          <div class="mt-4 space-y-3 rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-600">
            <p>1. 오늘 받은 미션 카테고리의 지출을 기록하지 않으면 성공이야.</p>
            <p>2. 해당 카테고리 지출이 있으면 미션은 실패로 정산돼!</p>
            <p>3. 다음날 미션 카드가 `미션 정산하기`로 바뀌면 눌러서 결과를 확인하면 돼.</p>
          </div>

          <button
            type="button"
            class="mt-5 w-full rounded-[18px] bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-4 py-3 text-sm font-bold text-white"
            @click="closeModal"
          >
            확인했어요
          </button>
        </div>
      </section>
    </div>
  </teleport>
</template>
