<script setup>
import babyHappyImage from '@/assets/momo/baby-happy.png';
import babySadImage from '@/assets/momo/baby-sad.png';
import teenHappyImage from '@/assets/momo/teen-happy.png';
import teenSadImage from '@/assets/momo/teen-sad.png';
import adultHappyImage from '@/assets/momo/adult-happy.png';
import adultSadImage from '@/assets/momo/adult-sad.png';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
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
      <section
        class="flex max-h-[88vh] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
      >
        <div
          class="bg-[linear-gradient(135deg,#34d399_0%,#14b8a6_100%)] px-5 py-5 text-white"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold tracking-[0.18em] text-white/70">
                MOMO GUIDE
              </p>
              <h2 class="mt-1 text-xl font-bold">모모 상태 안내서</h2>
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

        <div class="overflow-y-auto px-5 py-5">
          <section class="rounded-[24px] bg-[#eefaf7] p-4">
            <p class="text-xs font-semibold tracking-[0.14em] text-emerald-600">
              CHARACTER
            </p>
            <h3 class="mt-2 text-xl font-bold text-slate-900">
              모모를 한눈에 살펴봐요
            </h3>
            <p class="mt-3 text-sm leading-6 text-slate-600">
              모모는 레벨에 따라 쑥쑥 성장하고, 오늘 출석 여부와 이번 달 소비
              흐름에 따라 표정과 위치가 달라집니다.
            </p>
          </section>

          <section class="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">
                  EVOLUTION
                </p>
                <h3 class="mt-2 text-lg font-bold text-slate-900">
                  쑥쑥 자라는 모모
                </h3>
              </div>
              <span
                class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600"
              >
                레벨 기준
              </span>
            </div>

            <div class="mt-4 space-y-3">
              <div class="rounded-[18px] bg-slate-50 px-4 py-4">
                <div class="flex items-start justify-between gap-4">
                  <p class="text-base font-bold text-slate-900">아기 모모</p>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500"
                  >
                    Lv. 1-2
                  </span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-3">
                  <div class="rounded-[16px] bg-white px-3 py-3 text-center shadow-sm">
                    <img
                      :src="babyHappyImage"
                      alt="baby happy momo"
                      class="mx-auto h-14 w-14 image-rendering-pixel"
                    />
                    <p class="mt-2 text-xs font-semibold text-emerald-600">
                      방긋방긋
                    </p>
                  </div>
                  <div class="rounded-[16px] bg-white px-3 py-3 text-center shadow-sm">
                    <img
                      :src="babySadImage"
                      alt="baby sad momo"
                      class="mx-auto h-14 w-14 image-rendering-pixel"
                    />
                    <p class="mt-2 text-xs font-semibold text-slate-500">
                      시무룩
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  처음 만나는 아기 모모 단계예요.
                </p>
              </div>

              <div class="rounded-[18px] bg-slate-50 px-4 py-4">
                <div class="flex items-start justify-between gap-4">
                  <p class="text-base font-bold text-slate-900">성장 모모</p>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500"
                  >
                    Lv. 3-4
                  </span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-3">
                  <div class="rounded-[16px] bg-white px-3 py-3 text-center shadow-sm">
                    <img
                      :src="teenHappyImage"
                      alt="teen happy momo"
                      class="mx-auto h-14 w-14 image-rendering-pixel"
                    />
                    <p class="mt-2 text-xs font-semibold text-emerald-600">
                      방긋방긋
                    </p>
                  </div>
                  <div class="rounded-[16px] bg-white px-3 py-3 text-center shadow-sm">
                    <img
                      :src="teenSadImage"
                      alt="teen sad momo"
                      class="mx-auto h-14 w-14 image-rendering-pixel"
                    />
                    <p class="mt-2 text-xs font-semibold text-slate-500">
                      시무룩
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  제법 자라난 중간 단계의 모모예요.
                </p>
              </div>

              <div class="rounded-[18px] bg-slate-50 px-4 py-4">
                <div class="flex items-start justify-between gap-4">
                  <p class="text-base font-bold text-slate-900">완성 모모</p>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500"
                  >
                    Lv. 5+
                  </span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-3">
                  <div class="rounded-[16px] bg-white px-3 py-3 text-center shadow-sm">
                    <img
                      :src="adultHappyImage"
                      alt="adult happy momo"
                      class="mx-auto h-14 w-14 image-rendering-pixel"
                    />
                    <p class="mt-2 text-xs font-semibold text-emerald-600">
                      방긋방긋
                    </p>
                  </div>
                  <div class="rounded-[16px] bg-white px-3 py-3 text-center shadow-sm">
                    <img
                      :src="adultSadImage"
                      alt="adult sad momo"
                      class="mx-auto h-14 w-14 image-rendering-pixel"
                    />
                    <p class="mt-2 text-xs font-semibold text-slate-500">
                      시무룩
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  가장 크게 성장한 완성형 모모예요.
                </p>
              </div>
            </div>
          </section>

          <section class="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">
              POSITION
            </p>
            <h3 class="mt-2 text-lg font-bold text-slate-900">
              물속 위치가 달라지는 순간
            </h3>

            <div class="mt-4 grid grid-cols-3 gap-3">
              <div class="rounded-[18px] bg-sky-50 px-3 py-4 text-center">
                <p class="text-sm font-bold text-sky-700">둥실둥실</p>
                <p class="mt-2 text-xs leading-5 text-sky-700/80">
                  수입이 더 많을 때
                </p>
              </div>

              <div class="rounded-[18px] bg-slate-100 px-3 py-4 text-center">
                <p class="text-sm font-bold text-slate-700">잔잔모드</p>
                <p class="mt-2 text-xs leading-5 text-slate-600">
                  수입과 지출이
                  <br />
                  비슷할 때
                </p>
              </div>

              <div class="rounded-[18px] bg-rose-50 px-3 py-4 text-center">
                <p class="text-sm font-bold text-rose-700">꼬르륵</p>
                <p class="mt-2 text-xs leading-5 text-rose-700/80">
                  지출이 더 많을 때
                </p>
              </div>
            </div>

            <p class="mt-4 text-sm leading-6 text-slate-600">
              모모는 마리모의 특성을 반영해서 소비 흐름이 좋을수록 위로 떠오르고,
              지출이 많을수록 아래로 가라앉아요.
            </p>
          </section>

          <section class="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">
              MOOD
            </p>
            <h3 class="mt-2 text-lg font-bold text-slate-900">
              오늘 기분이 바뀌는 순간
            </h3>

            <div class="mt-4 grid grid-cols-2 gap-3">
              <div class="rounded-[18px] bg-emerald-50 px-4 py-4">
                <p class="text-sm font-bold text-emerald-700">방긋방긋</p>
                <p class="mt-2 text-sm leading-6 text-emerald-700/85">
                  오늘 출석 체크를 완료하면 기분 좋은 상태가 돼요.
                </p>
              </div>

              <div class="rounded-[18px] bg-slate-100 px-4 py-4">
                <p class="text-sm font-bold text-slate-700">시무룩</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  오늘 아직 출석 체크를 하지 않았다면 시무룩한 상태예요.
                </p>
              </div>
            </div>
          </section>

          <section
            class="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5"
          >
            <p class="text-xs font-semibold tracking-[0.14em] text-slate-400">
              TIP
            </p>
            <p class="mt-3 text-sm leading-6 text-slate-600">
              매일 출석하고, 이번 달 수입과 지출 흐름을 건강하게 관리하면 모모의
              표정과 위치 변화를 더 쉽게 확인할 수 있어요.
            </p>
          </section>
        </div>
      </section>
    </div>
  </teleport>
</template>

<style scoped>
.image-rendering-pixel {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
