<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Tank from '@/components/Tank.vue';
import Momo from '@/components/Momo.vue';
import MomoGuideModal from '@/components/MomoGuideModal.vue';
import ExpBar from '@/components/ExpBar.vue';
import Attendance from '@/components/Attendance.vue';
import Mission from '@/components/Mission.vue';
import MissionDetail from '@/components/MissionDetail.vue';
import { useAuthStore } from '@/stores/auth';
import { useMomoStore } from '@/stores/momo';

const router = useRouter();
const authStore = useAuthStore();
const momoStore = useMomoStore();

const isMissionModalOpen = ref(false);
const isLogoutModalOpen = ref(false);
const isMomoGuideModalOpen = ref(false);

const ensureSession = () => {
  authStore.restoreSession();
};

const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const isLoggedIn = computed(() => authStore.isLogin);
const effectiveUserId = computed(() => authStore.currentUserId);
const displayName = computed(() => authStore.currentName || '게스트');
const displayLevel = computed(() =>
  isLoggedIn.value ? momoStore.momoLevel : 1,
);
const displayExp = computed(() => (isLoggedIn.value ? momoStore.momoExp : 0));
const displayIsHappy = computed(() => {
  if (!isLoggedIn.value) {
    return true;
  }

  return hasCheckedInToday.value;
});
const hasActiveMission = computed(() => {
  return Boolean(
    momoStore.momoMission?.trim() && momoStore.momoMissionAssignedAt,
  );
});
const todayString = computed(() => formatDate(new Date()));
const hasMissionForToday = computed(() => {
  return (
    hasActiveMission.value &&
    !momoStore.momoMissionSettled &&
    momoStore.momoMissionAssignedAt === todayString.value &&
    Boolean(momoStore.momoMission?.trim())
  );
});
const needsMissionSettlement = computed(() => {
  return (
    hasActiveMission.value &&
    !momoStore.momoMissionSettled &&
    momoStore.momoMissionAssignedAt < todayString.value
  );
});
const missionText = computed(() => {
  if (needsMissionSettlement.value) {
    return '미션 정산하기';
  }

  if (hasMissionForToday.value) {
    return `${momoStore.momoMission.trim()} 절약하기`;
  }

  return '';
});
const hasCheckedInToday = computed(() => {
  return momoStore.momoFinalAttendance === formatDate(new Date());
});
const currentMonthKey = computed(() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
});
const monthlyBalanceState = computed(() => {
  if (!isLoggedIn.value) {
    return 'steady';
  }

  const totals = momoStore.transactionList.reduce(
    (acc, transaction) => {
      if (!transaction?.date?.startsWith(currentMonthKey.value)) {
        return acc;
      }

      const normalizedType = String(transaction.type || '').toLowerCase();
      const amount = Number(transaction.amount) || 0;

      if (normalizedType === 'income') {
        acc.income += amount;
      } else if (normalizedType === 'expense') {
        acc.expense += amount;
      }

      return acc;
    },
    { income: 0, expense: 0 },
  );

  if (totals.income > totals.expense) {
    return 'float';
  }

  if (totals.expense > totals.income) {
    return 'sink';
  }

  return 'steady';
});

const toDateOnly = (dateString) => {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const getDiffDays = (fromDate, toDate) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const from = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
  );
  const to = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate(),
  );
  return Math.round((to - from) / msPerDay);
};

const getAttendanceRewardExp = (attendance, isFirstAttendance = false) => {
  if (isFirstAttendance) {
    return 990;
  }

  if (attendance <= 1) {
    return 200;
  }

  if (attendance === 2) {
    return 220;
  }

  if (attendance === 3) {
    return 240;
  }

  if (attendance === 4) {
    return 260;
  }

  if (attendance === 5) {
    return 270;
  }

  if (attendance === 6) {
    return 280;
  }

  return 290;
};

const fetchHomeData = async (userId) => {
  if (!userId) {
    return;
  }

  await momoStore.fetchMomoData(userId);
  await momoStore.fetchTransactionList(userId);
};

const handleAttendance = async () => {
  if (!isLoggedIn.value || hasCheckedInToday.value || momoStore.isFetching) {
    return;
  }

  const today = new Date();
  const todayString = formatDate(today);
  const lastAttendanceDate = toDateOnly(momoStore.momoFinalAttendance);
  const isFirstAttendance = !momoStore.momoFinalAttendance;

  let nextAttendance = 1;

  if (lastAttendanceDate) {
    const diffDays = getDiffDays(lastAttendanceDate, today);

    if (diffDays === 1) {
      nextAttendance = momoStore.momoAttendance + 1;
    } else if (diffDays === 0) {
      nextAttendance = momoStore.momoAttendance;
    }
  }

  const nextExp =
    momoStore.momoExp +
    getAttendanceRewardExp(nextAttendance, isFirstAttendance);

  await momoStore.updateMomoAttendance(
    effectiveUserId.value,
    nextAttendance,
    todayString,
    nextExp,
  );
};

const openMissionModal = () => {
  if (hasMissionForToday.value) {
    return;
  }

  isMissionModalOpen.value = true;
};

const goToLogin = () => {
  router.push({ name: 'login' });
};

const goToMyPage = () => {
  if (!isLoggedIn.value) {
    return;
  }

  router.push({ name: 'momo/mypage' });
};

watch(
  effectiveUserId,
  async (userId) => {
    if (!isLoggedIn.value) {
      momoStore.resetMomoData();
      return;
    }

    await fetchHomeData(userId);
  },
  { immediate: true },
);

onMounted(() => {
  ensureSession();
});
</script>

<template>
  <main class="min-h-screen bg-[#eaf3ef] px-4 py-5 pb-[112px] text-slate-900 md:px-8 lg:pb-10 lg:pr-[120px]">
    <section
      class="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[480px] flex-col rounded-[32px] border border-white/70 bg-[#f4f7f6] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.10)] lg:max-w-[1040px] lg:p-8"
    >
      <header class="mb-5 flex items-center justify-between gap-4">
        <h1 class="text-[28px] font-bold leading-tight text-slate-900">
          반가워요, {{ displayName }}님
        </h1>

        <button
          v-if="isLoggedIn"
          type="button"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition active:scale-95"
          @click="goToMyPage"
        >
          <i class="fas fa-user text-[18px]"></i>
        </button>
      </header>

      <div class="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:items-start lg:gap-6">
        <section class="space-y-5">
          <Tank :level="displayLevel" :isHappy="displayIsHappy">
            <Momo
              :level="displayLevel"
              :isHappy="displayIsHappy"
              :monthly-state="monthlyBalanceState"
            />
          </Tank>

          <div v-if="isLoggedIn" class="lg:hidden">
            <ExpBar
              :level="displayLevel"
              :exp="displayExp"
              @open-guide="isMomoGuideModalOpen = true"
            />
          </div>
        </section>

        <section class="space-y-5 lg:pt-1">
          <template v-if="isLoggedIn">
            <div class="hidden lg:block">
              <ExpBar
                :level="displayLevel"
                :exp="displayExp"
                @open-guide="isMomoGuideModalOpen = true"
              />
            </div>

            <div class="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <Attendance
                :checkedInToday="hasCheckedInToday"
                :attendance="momoStore.momoAttendance"
                :loading="momoStore.isFetching"
                @attend="handleAttendance"
              />

              <Mission
                :missionText="missionText"
                :disabled="hasMissionForToday"
                @open="openMissionModal"
              />
            </div>
          </template>

          <button
            v-else
            type="button"
            class="flex min-h-[140px] w-full items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#38d39f_0%,#1fb6a6_100%)] px-6 text-center text-xl font-bold text-white shadow-[0_18px_40px_rgba(31,182,166,0.28)] transition active:scale-[0.99]"
            @click="goToLogin"
          >
            로그인하고 모모 키우기
          </button>
        </section>
      </div>
    </section>

    <MissionDetail
      :modelValue="isMissionModalOpen"
      :missionCategory="momoStore.momoMission"
      :missionAssignedAt="momoStore.momoMissionAssignedAt"
      :needsSettlement="needsMissionSettlement"
      :userId="effectiveUserId"
      @close="isMissionModalOpen = false"
      @update:modelValue="isMissionModalOpen = $event"
    />

    <MomoGuideModal
      :modelValue="isMomoGuideModalOpen"
      @close="isMomoGuideModalOpen = false"
      @update:modelValue="isMomoGuideModalOpen = $event"
    />

    <teleport to="body">
      <div
        v-if="isLogoutModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4"
        @click.self="closeLogoutModal"
      >
        <section class="w-full max-w-[340px] rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
          <h2 class="text-xl font-bold text-slate-900">로그아웃 하시겠습니까?</h2>
          <p class="mt-2 text-sm text-slate-500">
            현재 세션이 종료되고 로그인 화면으로 이동합니다.
          </p>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-[18px] bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600"
              @click="closeLogoutModal"
            >
              취소
            </button>
            <button
              type="button"
              class="rounded-[18px] bg-[linear-gradient(135deg,#38d39f_0%,#1fb6a6_100%)] px-4 py-3 text-sm font-semibold text-white"
              @click="confirmLogout"
            >
              로그아웃
            </button>
          </div>
        </section>
      </div>
    </teleport>
  </main>
</template>
