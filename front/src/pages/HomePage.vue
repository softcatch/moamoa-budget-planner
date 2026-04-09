<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Tank from '@/components/Tank.vue';
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

const ensureSession = () => {
  authStore.restoreSession();
};

const isLoggedIn = computed(() => authStore.isLogin);
const effectiveUserId = computed(() => authStore.currentUserId);
const missionText = computed(() => momoStore.momoMission?.trim() || '');
const displayName = computed(() => authStore.currentName || '게스트');
const displayLevel = computed(() =>
  isLoggedIn.value ? momoStore.momoLevel : 1,
);
const displayExp = computed(() => (isLoggedIn.value ? momoStore.momoExp : 0));
const displayIsHappy = computed(() =>
  isLoggedIn.value ? momoStore.isMomoHappy : true,
);
const hasCheckedInToday = computed(() => {
  return momoStore.momoFinalAttendance === formatDate(new Date());
});

const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

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

const fetchHomeData = async (userId) => {
  if (!userId) {
    return;
  }

  await momoStore.fetchMomoData(userId);
};

const handleAttendance = async () => {
  if (!isLoggedIn.value || hasCheckedInToday.value || momoStore.isFetching) {
    return;
  }

  const today = new Date();
  const todayString = formatDate(today);
  const lastAttendanceDate = toDateOnly(momoStore.momoFinalAttendance);

  let nextAttendance = 1;

  if (lastAttendanceDate) {
    const diffDays = getDiffDays(lastAttendanceDate, today);

    if (diffDays === 1) {
      nextAttendance = momoStore.momoAttendance + 1;
    } else if (diffDays === 0) {
      nextAttendance = momoStore.momoAttendance;
    }
  }

  await momoStore.updateMomoAttendance(
    effectiveUserId.value,
    nextAttendance,
    todayString,
  );
};

const goToLogin = () => {
  router.push({ name: 'login' });
};

const openLogoutModal = () => {
  if (!isLoggedIn.value) {
    return;
  }

  isLogoutModalOpen.value = true;
};

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false;
};

const confirmLogout = () => {
  authStore.logout();
  momoStore.resetMomoData();
  isLogoutModalOpen.value = false;
  router.push({ name: 'login' });
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
  <main class="min-h-screen bg-[#eaf3ef] px-4 py-5 text-slate-900">
    <section
      class="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[390px] flex-col rounded-[32px] border border-white/70 bg-[#f4f7f6] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.10)]"
    >
      <header class="mb-5 flex items-center justify-between gap-4">
        <h1 class="text-[28px] font-bold leading-tight text-slate-900">
          반가워요, {{ displayName }}님
        </h1>

        <button
          v-if="isLoggedIn"
          type="button"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition active:scale-95"
          @click="openLogoutModal"
        >
          <i class="fas fa-right-from-bracket text-[18px]"></i>
        </button>
      </header>

      <Tank :level="displayLevel" :isHappy="displayIsHappy" />

      <template v-if="isLoggedIn">
        <div class="mt-5">
          <ExpBar :level="displayLevel" :exp="displayExp" />
        </div>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <Attendance
            :checkedInToday="hasCheckedInToday"
            :attendance="momoStore.momoAttendance"
            :loading="momoStore.isFetching"
            @attend="handleAttendance"
          />

          <Mission
            :missionText="missionText"
            @open="isMissionModalOpen = true"
          />
        </div>
      </template>

      <button
        v-else
        type="button"
        class="mt-5 flex min-h-[140px] w-full items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#38d39f_0%,#1fb6a6_100%)] px-6 text-center text-xl font-bold text-white shadow-[0_18px_40px_rgba(31,182,166,0.28)] transition active:scale-[0.99]"
        @click="goToLogin"
      >
        로그인하고 모모 키우기
      </button>
    </section>

    <MissionDetail
      :modelValue="isMissionModalOpen"
      :missionText="missionText"
      @close="isMissionModalOpen = false"
      @update:modelValue="isMissionModalOpen = $event"
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
