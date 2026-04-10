import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// sessionStorage에 저장할 키 이름
const STORAGE_KEY = 'moamoa-auth';

export const useAuthStore = defineStore('auth', () => {
  const BASE_URL = 'https://moamoa-budget-planner-json-server.onrender.com';

  // 공통 상태 (로딩 / 에러)
  const isFetching = ref(false);
  const isError = ref(false);
  const errorMessage = ref('');

  // 로그인 상태
  // currentUserId: 현재 로그인된 유저 id
  // currentUsername: 현재 로그인된 유저 아이디(username)
  // currentName: 현재 로그인된 유저 실명(name)
  // isLogin: 로그인 여부
  const currentUserId = ref(null);
  const currentUsername = ref('');
  const currentName = ref('');
  const isLogin = ref(false);

  // 현재 로그인된 유저 정보를 하나의 객체로 제공
  // null이면 로그인 상태가 아님
  const currentUser = computed(() => {
    if (!currentUserId.value || !currentUsername.value) {
      return null;
    }

    return {
      userId: currentUserId.value,
      username: currentUsername.value,
      name: currentName.value,
    };
  });

  const createUserId = () => {
    return `u${Date.now()}`;
  };

  const createMomoDataId = () => {
    return `m${Date.now()}`;
  };

  // 에러 상태 초기화
  const clearError = () => {
    isError.value = false;
    errorMessage.value = '';
  };

  // 로그인 상태 초기화 (메모리 상태만 초기화)
  const clearAuthState = () => {
    currentUserId.value = null;
    currentUsername.value = '';
    currentName.value = '';
    isLogin.value = false;
  };

  // 현재 로그인 상태를 sessionStorage에 저장
  // 로그인 상태가 아니면 저장하지 않고 제거
  const persistAuth = () => {
    if (!currentUserId.value || !currentUsername.value || !isLogin.value) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        userId: currentUserId.value,
        username: currentUsername.value,
        name: currentName.value,
        isLogin: isLogin.value,
      }),
    );
  };

  // 로그인 성공 시 상태 설정 + sessionStorage 반영
  const setAuthState = (user) => {
    currentUserId.value = user.id;
    currentUsername.value = user.username;
    currentName.value = user.name || user.username || '';
    isLogin.value = true;
    persistAuth();
  };

  // 로그아웃 처리 (상태 초기화 + sessionStorage 제거)
  const logout = () => {
    clearError();
    clearAuthState();
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // 브라우저 새로고침 시 sessionStorage를 기반으로 로그인 상태 복원
  const restoreSession = () => {
    clearError();

    const savedAuth = sessionStorage.getItem(STORAGE_KEY);

    if (!savedAuth) {
      clearAuthState();
      return false;
    }

    try {
      const parsedAuth = JSON.parse(savedAuth);

      if (!parsedAuth.userId || !parsedAuth.username || !parsedAuth.isLogin) {
        logout();
        return false;
      }

      currentUserId.value = parsedAuth.userId;
      currentUsername.value = parsedAuth.username;
      currentName.value = parsedAuth.name || parsedAuth.username;
      isLogin.value = true;
      return true;
    } catch (error) {
      console.error('restoreSession error:', error);
      logout();
      return false;
    }
  };

  // 회원가입
  // 1. username 중복 검사
  // 2. 사용자 생성
  // 3. 가입 후 자동 로그인 처리
  const signup = async ({ username, password, name }) => {
    isFetching.value = true;
    clearError();

    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const trimmedName = name.trim();

      if (!trimmedUsername || !trimmedPassword || !trimmedName) {
        throw new Error('아이디, 비밀번호, 사용자 이름을 모두 입력해주세요.');
      }

      // 동일 username 존재 여부 확인
      const duplicateUserResponse = await axios.get(`${BASE_URL}/users`, {
        params: { username: trimmedUsername },
      });

      if (duplicateUserResponse.data.length > 0) {
        throw new Error('이미 사용 중인 아이디입니다.');
      }

      // 신규 사용자 생성
      const nextUserId = createUserId();

      const createdUserResponse = await axios.post(`${BASE_URL}/users`, {
        id: nextUserId,
        username: trimmedUsername,
        password: trimmedPassword,
        name: trimmedName,
      });

      await axios.post(`${BASE_URL}/momoData`, {
        id: createMomoDataId(),
        userId: nextUserId,
        isMomoHappy: true,
        momoExp: 0,
        momoLevel: 1,
        momoMission: '',
        momoMissionAssignedAt: '',
        momoMissionSettled: true,
        momoAttendance: 0,
        momoFinalAttendance: '',
      });

      setAuthState(createdUserResponse.data);
      return createdUserResponse.data;
    } catch (error) {
      console.error('signup error:', error);
      isError.value = true;
      errorMessage.value = error.message || '회원가입 중 오류가 발생했습니다.';
      throw error;
    } finally {
      isFetching.value = false;
    }
  };

  // 로그인
  // 1. username으로 사용자 조회
  // 2. password 비교
  // 3. 성공 시 로그인 상태 설정
  const login = async ({ username, password }) => {
    isFetching.value = true;
    clearError();

    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedPassword) {
        throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
      }

      // username으로 사용자 조회
      const userResponse = await axios.get(`${BASE_URL}/users`, {
        params: { username: trimmedUsername },
      });

      // 해당 username의 사용자 추출
      const targetUser = userResponse.data[0];

      // 비밀번호 검증
      if (!targetUser) {
        throw new Error('존재하지 않는 아이디입니다.');
      }

      if (targetUser.password !== trimmedPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      setAuthState(targetUser);
      return targetUser;
    } catch (error) {
      console.error('login error:', error);
      isError.value = true;
      errorMessage.value = error.message || '로그인 중 오류가 발생했습니다.';
      throw error;
    } finally {
      isFetching.value = false;
    }
  };

  const updateName = async (name) => {
    isFetching.value = true;
    clearError();

    try {
      const trimmedName = name.trim();

      if (!currentUserId.value) {
        throw new Error('로그인 정보가 없습니다.');
      }

      if (!trimmedName) {
        throw new Error('이름을 입력해주세요.');
      }

      const response = await axios.patch(`${BASE_URL}/users/${currentUserId.value}`, {
        name: trimmedName,
      });

      currentName.value = response.data.name || trimmedName;
      persistAuth();

      return response.data;
    } catch (error) {
      console.error('updateName error:', error);
      isError.value = true;
      errorMessage.value = error.message || '이름 변경 중 오류가 발생했습니다.';
      throw error;
    } finally {
      isFetching.value = false;
    }
  };

  const updatePassword = async ({
    currentPassword,
    nextPassword,
    nextPasswordConfirm,
  }) => {
    isFetching.value = true;
    clearError();

    try {
      const trimmedCurrentPassword = currentPassword.trim();
      const trimmedNextPassword = nextPassword.trim();
      const trimmedNextPasswordConfirm = nextPasswordConfirm.trim();

      if (!currentUserId.value) {
        throw new Error('로그인 정보가 없습니다.');
      }

      if (
        !trimmedCurrentPassword ||
        !trimmedNextPassword ||
        !trimmedNextPasswordConfirm
      ) {
        throw new Error('현재 비밀번호와 바꿀 비밀번호를 모두 입력해주세요.');
      }

      if (trimmedNextPassword !== trimmedNextPasswordConfirm) {
        throw new Error('바꿀 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }

      const userResponse = await axios.get(`${BASE_URL}/users/${currentUserId.value}`);

      if (userResponse.data.password !== trimmedCurrentPassword) {
        throw new Error('현재 비밀번호가 일치하지 않습니다.');
      }

      const response = await axios.patch(`${BASE_URL}/users/${currentUserId.value}`, {
        password: trimmedNextPassword,
      });

      return response.data;
    } catch (error) {
      console.error('updatePassword error:', error);
      isError.value = true;
      errorMessage.value =
        error.message || '비밀번호 변경 중 오류가 발생했습니다.';
      throw error;
    } finally {
      isFetching.value = false;
    }
  };

  // 외부에서 사용할 상태 및 함수 export
  return {
    BASE_URL,
    isFetching,
    isError,
    errorMessage,
    currentUserId,
    currentUsername,
    currentName,
    isLogin,
    currentUser,
    clearError,
    clearAuthState,
    persistAuth,
    setAuthState,
    restoreSession,
    signup,
    login,
    updateName,
    updatePassword,
    logout,
  };
});
