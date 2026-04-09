<script setup>
import { computed, ref, watch } from 'vue';
import { categoryMap } from '@/constants/momoCategories';
import { useMomoStore } from '@/stores/momo';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  missionText: {
    type: String,
    default: '',
  },
  missionAssignedAt: {
    type: String,
    default: '',
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

// 미션에 등장할 수 있는 카테고리 종류
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

const isRolling = ref(false);
const selectedMission = ref('');
const currentIndex = ref(spinBaseIndex);
const spinDurationMs = 2600;

const todayString = computed(() => formatDate(new Date()));
const hasMissionForToday = computed(() => {
  return (
    props.missionAssignedAt === todayString.value && Boolean(props.missionText)
  );
});
const displayedMission = computed(() => {
  return hasMissionForToday.value ? props.missionText : selectedMission.value;
});
const rouletteStyle = computed(() => {
  return {
    transform: `translateY(${centerOffset - currentIndex.value * itemHeight}px)`,
    transition: isRolling.value
      ? `transform ${spinDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
      : 'none',
  };
});

const getMissionCategoryIndex = (mission) => {
  const categoryLabel = mission.replace(/ 절약하기$/, '').trim();
  const categoryIndex = missionCategories.findIndex(
    (category) => category === categoryLabel,
  );
  return categoryIndex >= 0 ? categoryIndex : 0;
};

const resetRoulette = () => {
  selectedMission.value = '';
  currentIndex.value = spinBaseIndex;
  isRolling.value = false;
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      resetRoulette();
    }
  },
);

watch(
  () => hasMissionForToday.value,
  (hasMission) => {
    if (hasMission) {
      selectedMission.value = props.missionText;
      currentIndex.value =
        spinBaseIndex + getMissionCategoryIndex(props.missionText);
      return;
    }

    currentIndex.value = spinBaseIndex;
  },
  { immediate: true },
);

const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};

const assignMission = async () => {
  if (!props.userId || isRolling.value || hasMissionForToday.value) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * missionCategories.length);
  const mission = `${missionCategories[randomIndex]} 절약하기`;

  isRolling.value = true;
  selectedMission.value = '';
  currentIndex.value =
    spinBaseIndex + missionCategories.length * 2 + randomIndex;

  window.setTimeout(async () => {
    try {
      await momoStore.updateMomoMission(
        props.userId,
        mission,
        todayString.value,
      );
      selectedMission.value = mission;
    } catch (error) {
      console.error('assignMission error:', error);
      resetRoulette();
      return;
    }

    isRolling.value = false;
  }, spinDurationMs);
};
</script>

<template>
  <teleport to="body">
    <div
      v-if="props.modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 py-8"
      @click.self="closeModal"
    >
      <section
        class="flex min-h-[404px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
      >
        <div
          class="bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-5 py-5 text-white"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold tracking-[0.18em] text-white/70">
                MISSION
              </p>
              <h2 class="mt-1 text-xl font-bold">오늘의 절약 미션</h2>
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

        <div class="flex flex-1 flex-col px-5 py-4">
          <div class="rounded-[24px] bg-[#eefaf7] p-4">
            <div
              class="relative mx-auto h-[168px] max-w-[260px] overflow-hidden rounded-[20px] border border-emerald-100 bg-white shadow-inner"
            >
              <div
                class="pointer-events-none absolute inset-x-4 top-1/2 z-10 h-14 -translate-y-1/2 rounded-[16px] border-2 border-emerald-400/70 bg-emerald-50/80"
              ></div>
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

            <p
              class="mt-4 text-center text-xs font-semibold tracking-[0.14em] text-emerald-600"
            >
              {{
                isRolling
                  ? '룰렛이 돌아가는 중'
                  : hasMissionForToday
                    ? '오늘 받은 미션이 있어요'
                    : '룰렛을 돌려 미션 받기'
              }}
            </p>
          </div>

          <div
            class="mt-4 flex-1 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center"
          >
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">
              TODAY'S MISSION
            </p>
            <p class="mt-3 text-2xl font-bold text-slate-900">
              {{ displayedMission || '아직 받은 미션이 없어요' }}
            </p>
            <p class="mt-3 text-sm leading-6 text-slate-500">
              {{
                hasMissionForToday
                  ? '오늘의 미션이 결정되었습니다.'
                  : '미션은 소비 카테고리 중 하나로 랜덤 지정됩니다.'
              }}
            </p>
          </div>

          <button
            type="button"
            class="mt-4 rounded-[20px] bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-5 py-4 text-base font-bold text-white shadow-[0_16px_32px_rgba(20,184,166,0.26)] transition disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
            :disabled="isRolling || hasMissionForToday || !props.userId"
            @click="assignMission"
          >
            {{
              hasMissionForToday
                ? '오늘 미션 수령 완료'
                : isRolling
                  ? '룰렛 돌리는 중...'
                  : '오늘의 미션 받기'
            }}
          </button>
        </div>
      </section>
    </div>
  </teleport>
</template>
