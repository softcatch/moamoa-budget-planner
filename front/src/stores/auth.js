import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// sessionStorage에 저장할 키 이름
const STORAGE_KEY = 'moamoa-auth';

export const useAuthStore = defineStore('auth', () => {
  const BASE_URL = '/api';

  // 공통 상태 (로딩 / 에러)
  const isFetching = ref(false);
  const isError = ref(false);
  const errorMessage = ref('');

  // 로그인 상태
  // currentUserId: 현재 로그인한 유저 id
  // currentUsername: 현재 로그인한 유저 아이디(username)
  // currentName: 현재 로그인한 유저 이름(name)
  // isLogin: 로그인 여부
  const currentUserId = ref(null);
  const currentUsername = ref('');
  const currentName = ref('');
  const isLogin = ref(false);

  // 현재 로그인한 유저 정보를 하나의 객체로 제공
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

  // 로그인 성공 후 상태 설정 + sessionStorage 반영
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

  // 브라우저 재로고침 후 sessionStorage를 기반으로 로그인 상태 복원
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
        throw new Error(
          '?꾩씠?? 鍮꾨?踰덊샇, ?ъ슜???대쫫??紐⑤몢 ?낅젰?댁＜?몄슂.',
        );
      }

      // 동일 username 존재 여부 확인
      const duplicateUserResponse = await axios.get(`${BASE_URL}/users`, {
        params: { username: trimmedUsername },
      });

      if (duplicateUserResponse.data.length > 0) {
        throw new Error('?대? ?ъ슜 以묒씤 ?꾩씠?붿엯?덈떎.');
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
      errorMessage.value =
        error.message || '?뚯썝媛??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.';
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
        throw new Error('?꾩씠?붿? 鍮꾨?踰덊샇瑜?紐⑤몢 ?낅젰?댁＜?몄슂.');
      }

      // username으로 사용자 조회
      const userResponse = await axios.get(`${BASE_URL}/users`, {
        params: { username: trimmedUsername },
      });

      // 해당 username의 사용자 추출
      const targetUser = userResponse.data[0];

      // 비밀번호 검증
      if (!targetUser) {
        throw new Error('議댁옱?섏? ?딅뒗 ?꾩씠?붿엯?덈떎.');
      }

      if (targetUser.password !== trimmedPassword) {
        throw new Error('鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎.');
      }

      setAuthState(targetUser);
      return targetUser;
    } catch (error) {
      console.error('login error:', error);
      isError.value = true;
      errorMessage.value =
        error.message || '濡쒓렇??以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.';
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
        throw new Error('濡쒓렇???뺣낫媛 ?놁뒿?덈떎.');
      }

      if (!trimmedName) {
        throw new Error('?대쫫???낅젰?댁＜?몄슂.');
      }

      const response = await axios.patch(
        `${BASE_URL}/users/${currentUserId.value}`,
        {
          name: trimmedName,
        },
      );

      currentName.value = response.data.name || trimmedName;
      persistAuth();

      return response.data;
    } catch (error) {
      console.error('updateName error:', error);
      isError.value = true;
      errorMessage.value =
        error.message || '?대쫫 蹂寃?以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.';
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
        throw new Error('濡쒓렇???뺣낫媛 ?놁뒿?덈떎.');
      }

      if (
        !trimmedCurrentPassword ||
        !trimmedNextPassword ||
        !trimmedNextPasswordConfirm
      ) {
        throw new Error(
          '?꾩옱 鍮꾨?踰덊샇? 諛붽? 鍮꾨?踰덊샇瑜?紐⑤몢 ?낅젰?댁＜?몄슂.',
        );
      }

      if (trimmedNextPassword !== trimmedNextPasswordConfirm) {
        throw new Error(
          '諛붽? 鍮꾨?踰덊샇? 鍮꾨?踰덊샇 ?뺤씤???쇱튂?섏? ?딆뒿?덈떎.',
        );
      }

      const userResponse = await axios.get(
        `${BASE_URL}/users/${currentUserId.value}`,
      );

      if (userResponse.data.password !== trimmedCurrentPassword) {
        throw new Error('?꾩옱 鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎.');
      }

      const response = await axios.patch(
        `${BASE_URL}/users/${currentUserId.value}`,
        {
          password: trimmedNextPassword,
        },
      );

      return response.data;
    } catch (error) {
      console.error('updatePassword error:', error);
      isError.value = true;
      errorMessage.value =
        error.message || '鍮꾨?踰덊샇 蹂寃?以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.';
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
