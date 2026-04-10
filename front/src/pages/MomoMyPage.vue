<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMomoStore } from '@/stores/momo';

const router = useRouter();
const authStore = useAuthStore();
const momoStore = useMomoStore();

const name = ref('');
const localMessage = ref('');
const localErrorMessage = ref('');
const currentPassword = ref('');
const nextPassword = ref('');
const nextPasswordConfirm = ref('');
const passwordMessage = ref('');
const passwordErrorMessage = ref('');

const currentUsername = computed(() => authStore.currentUsername || '');
const submitLabel = computed(() =>
  authStore.isFetching ? '저장 중...' : '이름 변경',
);
const passwordSubmitLabel = computed(() =>
  authStore.isFetching ? '저장 중...' : '비밀번호 변경',
);

const hydrateForm = () => {
  name.value = authStore.currentName || '';
};

const submitName = async () => {
  localMessage.value = '';
  localErrorMessage.value = '';

  try {
    await authStore.updateName(name.value);
    hydrateForm();
    localMessage.value = '이름을 변경했습니다.';
  } catch (error) {
    localErrorMessage.value =
      authStore.errorMessage ||
      error.message ||
      '이름 변경 중 오류가 발생했습니다.';
  }
};

const resetPasswordForm = () => {
  currentPassword.value = '';
  nextPassword.value = '';
  nextPasswordConfirm.value = '';
};

const submitPassword = async () => {
  passwordMessage.value = '';
  passwordErrorMessage.value = '';

  try {
    await authStore.updatePassword({
      currentPassword: currentPassword.value,
      nextPassword: nextPassword.value,
      nextPasswordConfirm: nextPasswordConfirm.value,
    });
    resetPasswordForm();
    passwordMessage.value = '비밀번호를 변경했습니다.';
  } catch (error) {
    passwordErrorMessage.value =
      authStore.errorMessage ||
      error.message ||
      '비밀번호 변경 중 오류가 발생했습니다.';
  }
};

const logout = () => {
  authStore.logout();
  momoStore.resetMomoData();
  router.push({ name: 'login' });
};

onMounted(() => {
  authStore.restoreSession();
  hydrateForm();
});
</script>

<template>
  <main
    class="min-h-screen bg-[#eaf3ef] px-4 py-5 pb-[112px] text-slate-900 md:px-8 lg:pb-10 lg:pr-[120px]"
  >
    <section
      class="mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-[480px] rounded-[32px] bg-[#F4F7F6] px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] lg:max-w-[720px] lg:px-8 lg:py-8"
    >
      <header class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-[28px] font-bold leading-none text-slate-900">
            마이페이지
          </h1>
          <p class="mt-2 text-xs text-slate-500">
            이름을 바꾸거나 로그아웃할 수 있어요
          </p>
        </div>

        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-[22px] text-emerald-600"
        >
          <i class="fa-solid fa-user"></i>
        </div>
      </header>

      <section class="mt-6 rounded-[24px] bg-white p-5 shadow-sm">
        <p class="text-sm font-semibold text-slate-400">아이디</p>
        <p class="mt-1 text-lg font-bold text-slate-900">
          {{ currentUsername }}
        </p>
      </section>

      <form
        class="mt-4 rounded-[24px] bg-white p-5 shadow-sm"
        @submit.prevent="submitName"
      >
        <label for="profile-name" class="text-sm font-semibold text-slate-900">
          이름
        </label>
        <input
          id="profile-name"
          v-model="name"
          type="text"
          maxlength="30"
          class="mt-3 h-14 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:bg-white"
          placeholder="이름을 입력하세요"
        />

        <p
          v-if="localMessage"
          class="mt-4 rounded-[18px] bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600"
        >
          {{ localMessage }}
        </p>

        <p
          v-if="localErrorMessage"
          class="mt-4 rounded-[18px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-500"
        >
          {{ localErrorMessage }}
        </p>

        <button
          type="submit"
          :disabled="authStore.isFetching"
          class="mt-5 flex h-14 w-full items-center justify-center rounded-[18px] bg-emerald-500 text-base font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {{ submitLabel }}
        </button>
      </form>

      <form
        class="mt-4 rounded-[24px] bg-white p-5 shadow-sm"
        @submit.prevent="submitPassword"
      >
        <h2 class="text-sm font-semibold text-slate-900">비밀번호 변경</h2>

        <label
          for="current-password"
          class="mt-4 block text-sm font-semibold text-slate-700"
        >
          현재 비밀번호
        </label>
        <input
          id="current-password"
          v-model="currentPassword"
          type="password"
          autocomplete="current-password"
          class="mt-2 h-14 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:bg-white"
          placeholder="현재 비밀번호"
        />

        <label
          for="next-password"
          class="mt-4 block text-sm font-semibold text-slate-700"
        >
          새 비밀번호
        </label>
        <input
          id="next-password"
          v-model="nextPassword"
          type="password"
          autocomplete="new-password"
          class="mt-2 h-14 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:bg-white"
          placeholder="새 비밀번호"
        />

        <label
          for="next-password-confirm"
          class="mt-4 block text-sm font-semibold text-slate-700"
        >
          새 비밀번호 확인
        </label>
        <input
          id="next-password-confirm"
          v-model="nextPasswordConfirm"
          type="password"
          autocomplete="new-password"
          class="mt-2 h-14 w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:bg-white"
          placeholder="새 비밀번호 확인"
        />

        <p
          v-if="passwordMessage"
          class="mt-4 rounded-[18px] bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600"
        >
          {{ passwordMessage }}
        </p>

        <p
          v-if="passwordErrorMessage"
          class="mt-4 rounded-[18px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-500"
        >
          {{ passwordErrorMessage }}
        </p>

        <button
          type="submit"
          :disabled="authStore.isFetching"
          class="mt-5 flex h-14 w-full items-center justify-center rounded-[18px] bg-emerald-500 text-base font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {{ passwordSubmitLabel }}
        </button>
      </form>

      <button
        type="button"
        class="mt-4 flex h-14 w-full items-center justify-center rounded-[18px] bg-rose-50 text-base font-bold text-rose-500 transition active:scale-[0.99]"
        @click="logout"
      >
        로그아웃
      </button>
    </section>
  </main>
</template>
