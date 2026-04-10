<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const mode = ref('login');
const localErrorMessage = ref('');
const showSecurityModal = ref(false);

const form = reactive({
  username: '',
  password: '',
  passwordConfirm: '',
  name: '',
});

const pageTitle = computed(() => {
  return mode.value === 'login' ? '로그인' : '회원가입';
});

const pageDescription = computed(() => {
  return mode.value === 'login'
    ? '모아모아에 로그인하고 월간 소비 흐름을 확인해보세요.'
    : '새 계정을 만들고 나만의 소비 기록을 시작해보세요.';
});

const submitLabel = computed(() => {
  if (authStore.isFetching) {
    return '처리 중...';
  }

  return mode.value === 'login' ? '로그인' : '회원가입 완료';
});

const resetForm = () => {
  form.username = '';
  form.password = '';
  form.passwordConfirm = '';
  form.name = '';
  localErrorMessage.value = '';
};

const submit = async () => {
  authStore.clearError();
  localErrorMessage.value = '';

  try {
    if (mode.value === 'login') {
      await authStore.login({
        username: form.username,
        password: form.password,
      });
    } else {
      if (
        !form.name.trim() ||
        !form.username.trim() ||
        !form.password.trim() ||
        !form.passwordConfirm.trim()
      ) {
        localErrorMessage.value =
          '사용자 이름, 아이디, 비밀번호, 비밀번호 확인을 모두 입력해주세요.';
        return;
      }

      if (form.password !== form.passwordConfirm) {
        localErrorMessage.value =
          '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
        return;
      }

      await authStore.signup({
        username: form.username,
        password: form.password,
        name: form.name,
      });
    }

    router.push('/');
  } catch (error) {
    console.error('LoginPage submit error:', error);
  }
};

const switchMode = (nextMode) => {
  authStore.clearError();
  localErrorMessage.value = '';
  mode.value = nextMode;
  resetForm();

  if (nextMode === 'signup') {
    showSecurityModal.value = true;
  }
};

const closeSecurityModal = () => {
  showSecurityModal.value = false;
};
</script>

<template>
  <main class="min-h-screen bg-[#eaf3ef] px-4 py-6 sm:px-6 lg:px-8">
    <div
      class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1180px] items-center justify-center"
    >
      <section
        class="relative w-full max-w-[430px] overflow-hidden rounded-[36px] bg-[#F4F7F6] px-6 pb-8 pt-7 shadow-[0_20px_80px_rgba(0,0,0,0.22)] sm:px-7"
      >
        <div
          class="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_right,_rgba(49,196,141,0.22),_transparent_58%)]"
        ></div>

        <div class="relative">
          <header class="rounded-[28px] bg-white px-6 py-7 shadow-sm">
            <p
              class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500"
            >
              Budget Planner
            </p>
            <h1
              class="mt-3 text-[32px] font-bold leading-none tracking-[-0.04em] text-slate-900"
            >
              {{ pageTitle }}
            </h1>
            <p class="mt-3 text-sm leading-6 text-slate-500">
              {{ pageDescription }}
            </p>
          </header>

          <form
            class="mt-5 rounded-[28px] bg-white px-5 py-6 shadow-sm"
            @submit.prevent="submit"
          >
            <div class="space-y-4">
              <div v-if="mode === 'signup'">
                <label
                  for="name"
                  class="mb-2 block text-sm font-semibold text-slate-900"
                >
                  사용자 이름
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  placeholder="예: 김모아"
                  class="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                />
              </div>

              <div>
                <label
                  for="username"
                  class="mb-2 block text-sm font-semibold text-slate-900"
                >
                  아이디
                </label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  autocomplete="username"
                  placeholder="아이디를 입력하세요"
                  class="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                />
              </div>

              <div>
                <label
                  for="password"
                  class="mb-2 block text-sm font-semibold text-slate-900"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  class="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                />
              </div>

              <div v-if="mode === 'signup'">
                <label
                  for="passwordConfirm"
                  class="mb-2 block text-sm font-semibold text-slate-900"
                >
                  비밀번호 확인
                </label>
                <input
                  id="passwordConfirm"
                  v-model="form.passwordConfirm"
                  type="password"
                  autocomplete="new-password"
                  placeholder="비밀번호를 다시 입력하세요"
                  class="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
                />
              </div>
            </div>

            <p
              v-if="localErrorMessage || authStore.isError"
              class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500"
            >
              {{ localErrorMessage || authStore.errorMessage }}
            </p>

            <button
              type="submit"
              :disabled="authStore.isFetching"
              class="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-emerald-500 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {{ submitLabel }}
            </button>
          </form>

          <div class="mt-5 rounded-[28px] bg-[#E7FAF2] px-5 py-5 shadow-sm">
            <p class="text-sm font-semibold text-slate-900">
              {{
                mode === 'login'
                  ? '처음 이용하시나요?'
                  : '이미 계정이 있으신가요?'
              }}
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              {{
                mode === 'login'
                  ? '새 계정을 만들고 나만의 소비 기록을 시작해보세요.'
                  : '모아모아에 로그인하고 나의 소비를 확인해보세요.'
              }}
            </p>
            <button
              type="button"
              class="mt-4 text-sm font-bold text-emerald-600"
              @click="switchMode(mode === 'login' ? 'signup' : 'login')"
            >
              {{
                mode === 'login' ? '회원가입 하러가기' : '로그인으로 돌아가기'
              }}
            </button>
          </div>
        </div>
      </section>
    </div>

    <div
      v-if="showSecurityModal"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/45 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
    >
      <section
        class="w-full max-w-[360px] rounded-[28px] bg-white px-6 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.28)]"
      >
        <h2
          id="security-modal-title"
          class="text-[20px] font-extrabold text-slate-900"
        >
          [보안 주의]
        </h2>
        <p class="mt-4 text-[15px] font-medium leading-6 text-slate-600">
          평소 사용하시는 중요한 비밀번호를 사용하지 마세요.
        </p>
        <button
          type="button"
          class="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-emerald-500 text-[15px] font-bold text-white"
          @click="closeSecurityModal"
        >
          확인
        </button>
      </section>
    </div>
  </main>
</template>
