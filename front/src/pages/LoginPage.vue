<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const mode = ref('login');

const form = reactive({
  username: '',
  password: '',
  passwordConfirm: '',
});

const submit = async () => {
  authStore.clearError();

  try {
    if (mode.value === 'login') {
      await authStore.login({
        username: form.username,
        password: form.password,
      });
    } else {
      if (form.password !== form.passwordConfirm) {
        throw new Error('비밀번호 확인이 일치하지 않습니다.');
      }

      await authStore.signup({
        username: form.username,
        password: form.password,
      });
    }

    // router.push('/');
  } catch (error) {
    console.error('LoginPage submit error:', error);
  }
};

const switchMode = () => {
  authStore.clearError();
  mode.value = mode.value === 'login' ? 'signup' : 'login';
  form.password = '';
  form.passwordConfirm = '';
};
</script>

<template>
  <main>
    <h1>{{ mode === 'login' ? '로그인' : '회원가입' }}</h1>

    <form @submit.prevent="submit">
      <div>
        <label for="username">아이디</label>
        <input id="username" v-model="form.username" type="text" />
      </div>

      <div>
        <label for="password">비밀번호</label>
        <input id="password" v-model="form.password" type="password" />
      </div>

      <div v-if="mode === 'signup'">
        <label for="passwordConfirm">비밀번호 확인</label>
        <input id="passwordConfirm" v-model="form.passwordConfirm" type="password" />
      </div>

      <p v-if="authStore.isError">{{ authStore.errorMessage }}</p>

      <button type="submit" :disabled="authStore.isFetching">
        {{ authStore.isFetching ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입' }}
      </button>
    </form>

    <button type="button" @click="switchMode">
      {{ mode === 'login' ? '회원가입으로 전환' : '로그인으로 전환' }}
    </button>
</main>

    <hr />

    <section>
      <h2>현재 로그인 상태 (테스트용)</h2>
      <p><strong>isLogin:</strong> {{ authStore.isLogin }}</p>
      <p><strong>userId:</strong> {{ authStore.currentUserId ?? '없음' }}</p>
      <p><strong>username:</strong> {{ authStore.currentUsername || '없음' }}</p>
    </section>
</template>

<style scoped></style>