import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMomoStore = defineStore('momo', () => {
  const BASE_URL = '/api';

  // 로딩 및 에러 상태
  const isFetching = ref(false);
  const isError = ref(false);

  // 모모 관련
  const isMomoHappy = ref(true);
  const momoExp = ref(0);
  const momoLevel = ref(1);
  const momoMission = ref('');
  const momoAttendance = ref(0);
  const momoFinalAttendance = ref('');
  const currentMomoUserId = ref(null);
  const momoDataId = ref(null);

  // 트랜잭션
  // 배열 전체를 받아와 교체하는 경우가 많으므로 ref 사용
  const transactionList = ref([]);

  const resetMomoData = () => {
    isMomoHappy.value = true;
    momoExp.value = 0;
    momoLevel.value = 1;
    momoMission.value = '';
    momoAttendance.value = 0;
    momoFinalAttendance.value = '';
    momoDataId.value = null;
  };

  const ensureMomoDataId = async (userId) => {
    if (currentMomoUserId.value === userId && momoDataId.value) {
      return momoDataId.value;
    }

    const response = await axios.get(`${BASE_URL}/momoData`, {
      params: { userId },
    });

    const momoData = response.data[0];

    currentMomoUserId.value = userId;
    momoDataId.value = momoData?.id ?? null;

    return momoDataId.value;
  };

  // fetch
  const fetchMomoData = async (userId) => {
    isFetching.value = true;
    isError.value = false;

    try {
      const response = await axios.get(`${BASE_URL}/momoData`, {
        params: { userId },
      });

      const momoData = response.data[0];
      currentMomoUserId.value = userId;

      if (!momoData) {
        resetMomoData();
        currentMomoUserId.value = userId;
        return;
      }

      momoDataId.value = momoData.id;
      isMomoHappy.value = momoData.isMomoHappy;
      momoExp.value = momoData.momoExp;
      momoLevel.value = momoData.momoLevel;
      momoMission.value = momoData.momoMission;
      momoAttendance.value = momoData.momoAttendance;
      momoFinalAttendance.value = momoData.momoFinalAttendance;
    } catch (error) {
      console.error('fetchMomoData error:', error);
      isError.value = true;
    } finally {
      isFetching.value = false;
    }
  };

  const fetchTransactionList = async (userId) => {
    isFetching.value = true;
    isError.value = false;

    try {
      const response = await axios.get(`${BASE_URL}/transactions`, {
        params: { userId },
      });
      transactionList.value = response.data;
    } catch (error) {
      console.error('fetchTransactionList error:', error);
      isError.value = true;
    } finally {
      isFetching.value = false;
    }
  };

  const createMomoData = async (payload) => {
    isError.value = false;

    try {
      const response = await axios.post(`${BASE_URL}/momoData`, payload);
      currentMomoUserId.value = response.data.userId;
      momoDataId.value = response.data.id;
      return response.data;
    } catch (error) {
      console.error('createMomoData error:', error);
      isError.value = true;
      throw error;
    }
  };

  const editMomoData = async (userId, payload) => {
    isError.value = false;

    try {
      const targetMomoDataId = await ensureMomoDataId(userId);

      if (!targetMomoDataId) {
        const createdMomoData = await createMomoData({
          userId,
          isMomoHappy: payload.isMomoHappy ?? true,
          momoExp: payload.momoExp ?? 0,
          momoLevel: payload.momoLevel ?? 1,
          momoMission: payload.momoMission ?? '',
          momoAttendance: payload.momoAttendance ?? 0,
          momoFinalAttendance: payload.momoFinalAttendance ?? '',
        });
        await fetchMomoData(userId);
        return createdMomoData;
      }

      const response = await axios.patch(`${BASE_URL}/momoData/${targetMomoDataId}`, payload);
      momoDataId.value = response.data.id;
      currentMomoUserId.value = response.data.userId;
      await fetchMomoData(userId);
      return response.data;
    } catch (error) {
      console.error('editMomoData error:', error);
      isError.value = true;
      throw error;
    }
  };

  const updateIsMomoHappy = async (userId, isHappy) => {
    return await editMomoData(userId, { isMomoHappy: isHappy });
  };

  const updateMomoExp = async (userId, exp) => {
    return await editMomoData(userId, { momoExp: exp });
  };

  const updateMomoLevel = async (userId, level) => {
    return await editMomoData(userId, { momoLevel: level });
  };

  const updateMomoMission = async (userId, mission) => {
    return await editMomoData(userId, { momoMission: mission });
  };

  const updateMomoAttendance = async (userId, attendance, finalAttendance) => {
    const payload = {
      momoAttendance: attendance,
    };

    if (finalAttendance !== undefined) {
      payload.momoFinalAttendance = finalAttendance;
    }

    return await editMomoData(userId, payload);
  };

  // CRUD actions
  const addTransactionData = async (payload) => {
    isError.value = false;

    try {
      await axios.post(`${BASE_URL}/transactions`, payload);
    } catch (error) {
      console.error('addData error:', error);
      isError.value = true;
    }
  };

  const deleteTransactionData = async (transactionId) => {
    isError.value = false;

    try {
      await axios.delete(`${BASE_URL}/transactions/${transactionId}`);
    } catch (error) {
      console.error('deleteData error:', error);
      isError.value = true;
    }
  };

  const editTransactionData = async (transactionId, payload) => {
    isError.value = false;

    try {
      await axios.put(`${BASE_URL}/transactions/${transactionId}`, payload);
    } catch (error) {
      console.error('editData error:', error);
      isError.value = true;
    }
  };

  return {
    isFetching,
    isError,
    isMomoHappy,
    momoExp,
    momoLevel,
    momoMission,
    momoAttendance,
    momoFinalAttendance,
    currentMomoUserId,
    momoDataId,
    transactionList,
    resetMomoData,
    ensureMomoDataId,
    createMomoData,
    editMomoData,
    updateIsMomoHappy,
    updateMomoExp,
    updateMomoLevel,
    updateMomoMission,
    updateMomoAttendance,
    fetchMomoData,
    fetchTransactionList,
    addTransactionData,
    deleteTransactionData,
    editTransactionData,
  };
});
