<script setup>
import { computed, ref, watch } from 'vue';
import { categoryMap } from '@/constants/momoCategories';
import { useMomoStore } from '@/stores/momo';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  missionCategory: {
    type: String,
    default: '',
  },
  missionAssignedAt: {
    type: String,
    default: '',
  },
  needsSettlement: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: [String, Number],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const momoStore = useMomoStore();

const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const missionCategoryWhitelist = [
  '식비',
  '교통',
  '취미활동',
  '생필품',
  '미용',
  '카페/간식',
  '경조사/선물',
  '여행',
  '의류',
];
const missionCategories = categoryMap.expense
  .map((category) => category.label)
  .filter((label) => missionCategoryWhitelist.includes(label));
const rouletteRepeatCount = 8;
const rouletteItems = Array.from(
  { length: rouletteRepeatCount },
  () => missionCategories,
).flat();
const itemHeight = 56;
const visibleWindowHeight = 168;
const centerOffset = visibleWindowHeight / 2 - itemHeight / 2;
const spinBaseIndex = missionCategories.length * 4;
const spinDurationMs = 2600;

const isRolling = ref(false);
const isSettling = ref(false);
const selectedMissionCategory = ref('');
const settledMissionCategory = ref('');
const currentIndex = ref(spinBaseIndex);
const settlementStep = ref('confirm');
const settlementResult = ref(null);
const modalMode = ref('receive');

const todayString = computed(() => formatDate(new Date()));
const missionDisplayText = computed(() => {
  if (!selectedMissionCategory.value) {
    return '';
  }

  return `${selectedMissionCategory.value} 절약하기`;
});
const rouletteStyle = computed(() => {
  return {
    transform: `translateY(${centerOffset - currentIndex.value * itemHeight}px)`,
    transition: isRolling.value
      ? `transform ${spinDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
      : 'none',
  };
});
const settlementQuestion = computed(() => {
  return '소비 기록을 모두 입력하셨나요?';
});
const settlementResultTitle = computed(() => {
  if (settlementResult.value === 'success') {
    return '미션 성공';
  }

  if (settlementResult.value === 'fail') {
    return '미션 실패';
  }

  return '';
});
const settlementResultDescription = computed(() => {
  if (settlementResult.value === 'success') {
    return `${settledMissionCategory.value} 소비가 없어 미션을 성공적으로 정산했어요.`;
  }

  if (settlementResult.value === 'fail') {
    return `${settledMissionCategory.value} 소비 기록이 있어 실패 처리되었어요.`;
  }

  return '';
});

const resetRoulette = () => {
  selectedMissionCategory.value = '';
  currentIndex.value = spinBaseIndex;
  isRolling.value = false;
};

const resetSettlement = () => {
  settlementStep.value = 'confirm';
  settlementResult.value = null;
  isSettling.value = false;
  settledMissionCategory.value = '';
};

const getMissionCategoryIndex = (missionCategory) => {
  const categoryIndex = missionCategories.findIndex(
    (category) => category === missionCategory,
  );
  return categoryIndex >= 0 ? categoryIndex : 0;
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      resetRoulette();
      resetSettlement();
      modalMode.value = 'receive';
      return;
    }

    modalMode.value = props.needsSettlement ? 'settlement' : 'receive';

    if (modalMode.value === 'settlement') {
      selectedMissionCategory.value = props.missionCategory;
      settledMissionCategory.value = props.missionCategory;
      return;
    }

    if (props.missionCategory && props.missionAssignedAt === todayString.value) {
      selectedMissionCategory.value = props.missionCategory;
      currentIndex.value = spinBaseIndex + getMissionCategoryIndex(props.missionCategory);
    }
  },
  { immediate: true },
);

const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};

const assignMission = async () => {
  if (!props.userId || isRolling.value || modalMode.value === 'settlement') {
    return;
  }

  const randomIndex = Math.floor(Math.random() * missionCategories.length);
  const missionCategory = missionCategories[randomIndex];

  isRolling.value = true;
  selectedMissionCategory.value = '';
  currentIndex.value = spinBaseIndex + missionCategories.length * 2 + randomIndex;

  window.setTimeout(async () => {
    try {
      await momoStore.updateMomoMission(
        props.userId,
        missionCategory,
        todayString.value,
      );
      selectedMissionCategory.value = missionCategory;
    } catch (error) {
      console.error('assignMission error:', error);
      resetRoulette();
      return;
    }

    isRolling.value = false;
  }, spinDurationMs);
};

const completeSettlement = async () => {
  if (!props.userId || !props.missionCategory || !props.missionAssignedAt || isSettling.value) {
    return;
  }

  isSettling.value = true;
  settledMissionCategory.value = props.missionCategory;

  try {
    const result = await momoStore.settleMomoMission(props.userId, {
      missionCategory: props.missionCategory,
      missionAssignedAt: props.missionAssignedAt,
    });

    settlementResult.value = result.isSuccess ? 'success' : 'fail';
    settlementStep.value = 'result';
  } catch (error) {
    console.error('completeSettlement error:', error);
    isSettling.value = false;
    return;
  }

  isSettling.value = false;
};
</script>

<template>
  <teleport to="body">
    <div
      v-if="props.modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 py-8"
      @click.self="closeModal"
    >
      <section class="flex w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
        <div class="bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-5 py-5 text-white">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold tracking-[0.18em] text-white/70">MISSION</p>
              <h2 class="mt-1 text-xl font-bold">
                {{ props.needsSettlement ? '미션 정산하기' : '오늘의 절약 미션' }}
              </h2>
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

        <div v-if="modalMode === 'receive'" class="flex flex-1 flex-col px-5 py-4">
          <div class="rounded-[24px] bg-[#eefaf7] p-4">
            <div class="relative mx-auto h-[168px] max-w-[260px] overflow-hidden rounded-[20px] border border-emerald-100 bg-white shadow-inner">
              <div class="pointer-events-none absolute inset-x-4 top-1/2 z-10 h-14 -translate-y-1/2 rounded-[16px] border-2 border-emerald-400/70 bg-emerald-50/80"></div>
              <div class="flex w-full flex-col" :style="rouletteStyle">
                <div
                  v-for="(category, index) in rouletteItems"
                  :key="`${category}-${index}`"
                  class="flex h-14 items-center justify-center px-4 text-center text-base font-bold text-slate-700"
                >
                  {{ category }}
                </div>
              </div>
            </div>

            <p class="mt-4 text-center text-xs font-semibold tracking-[0.14em] text-emerald-600">
              {{ isRolling ? '룰렛이 돌아가는 중' : missionDisplayText ? '오늘 받은 미션이 있어요' : '룰렛을 돌려 미션 받기' }}
            </p>
          </div>

          <div class="mt-4 flex-1 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">TODAY'S MISSION</p>
            <p class="mt-3 text-2xl font-bold text-slate-900">
              {{ missionDisplayText || '아직 받은 미션이 없어요' }}
            </p>
            <p class="mt-3 text-sm leading-6 text-slate-500">
              {{ missionDisplayText ? '오늘의 미션이 결정되었습니다.' : '미션은 소비 카테고리 중 하나로 랜덤 지정됩니다.' }}
            </p>
          </div>

          <button
            type="button"
            class="mt-4 rounded-[20px] bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-5 py-4 text-base font-bold text-white shadow-[0_16px_32px_rgba(20,184,166,0.26)] transition disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
            :disabled="isRolling || missionDisplayText || !props.userId"
            @click="assignMission"
          >
            {{ missionDisplayText ? '오늘 미션 수령 완료' : isRolling ? '룰렛 돌리는 중...' : '오늘의 미션 받기' }}
          </button>
        </div>

        <div v-else class="px-5 py-5">
          <div v-if="settlementStep === 'confirm'" class="rounded-[24px] bg-slate-50 px-5 py-6 text-center">
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">SETTLEMENT</p>
            <p class="mt-3 text-2xl font-bold text-slate-900">
              {{ props.missionCategory }} 절약하기
            </p>
            <p class="mt-4 text-base font-semibold leading-7 text-slate-700">
              {{ settlementQuestion }}
            </p>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                class="rounded-[18px] bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
                @click="closeModal"
              >
                아니오
              </button>
              <button
                type="button"
                class="rounded-[18px] bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-4 py-3 text-sm font-semibold text-white"
                :disabled="isSettling"
                @click="completeSettlement"
              >
                {{ isSettling ? '정산 중...' : '네, 모두 입력했어요' }}
              </button>
            </div>
          </div>

          <div
            v-else
            class="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center"
          >
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">RESULT</p>
            <p class="mt-3 text-3xl font-bold text-slate-900">
              {{ settlementResultTitle }}
            </p>
            <p class="mt-4 text-sm leading-7 text-slate-600">
              {{ settlementResultDescription }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </teleport>
</template>
