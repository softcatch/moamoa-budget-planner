<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  missionText: {
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 py-8"
      @click.self="closeModal"
    >
      <section class="flex min-h-[380px] w-full max-w-[390px] flex-col rounded-[28px] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">MISSION</p>
            <h2 class="mt-1 text-xl font-bold text-slate-900">모모의 미션</h2>
          </div>
          <button
            type="button"
            class="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-500"
            @click="closeModal"
          >
            닫기
          </button>
        </div>

        <div class="mt-6 flex flex-1 items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
          {{ missionText || '추후 미션 내용이 이 영역에 표시됩니다.' }}
        </div>
      </section>
    </div>
  </teleport>
</template>
