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

  // 트렌젝션
  // 배열 전체를 받아 와 수정하는 경우가 많으므로 reactive보단 ref 채탱.. 추후 필요해 따라 변경 가능
  const transactionList = ref([]);

  // fetch
  const fetchData = async () => {
    isFetching.value = true;
    isError.value = false;

    try {
      await fetchTransactionList();
      await fetchMission();
      await fetchMomoStatus();
      await fetchAttendance();
    } catch (error) {
      console.error('fetchData error:', error);
      isError.value = true;
    } finally {
      isFetching.value = false;
    }
  };

  const fetchTransactionList = async () => {
    try {
      // TODO: 내역 조회
      // const response = await axios.get(`${BASE_URL}/transactions`);
      // transactionList.value = response.data;
    } catch (error) {
      console.error('fetchList error:', error);
      isError.value = true;
    }
  };

  const fetchMission = async () => {
    try {
      // TODO: 모모 미션 조회
      // const response = await axios.get(`${BASE_URL}/momo/mission`);
      // momoMission.value = response.data.momoMission;
    } catch (error) {
      console.error('fetchMission error:', error);
      isError.value = true;
    }
  };

  const fetchMomoStatus = async () => {
    try {
      // TODO: 모모 상태 조회
      // const response = await axios.get(`${BASE_URL}/momo/status`);
      // isMomoHappy.value = response.data.isMomoHappy;
      // momoExp.value = response.data.momoExp;
      // momoLevel.value = response.data.momoLevel;
    } catch (error) {
      console.error('fetchMomoStatus error:', error);
      isError.value = true;
    }
  };

  const fetchAttendance = async () => {
    try {
      // TODO: 출석 정보 조회 (마지막 출석일, 연속 출석 기록)
      // const response = await axios.get(`${BASE_URL}/momo/attendance`);
      // momoAttendance.value = response.data.momoAttendance;
      // momoFinalAttendance.value = response.data.momoFinalAttendance;
    } catch (error) {
      console.error('fetchAttendance error:', error);
      isError.value = true;
    }
  };

  // CRUD actions
  const addData = async (payload) => {
    try {
      // TODO: 트랜젝션 데이터 추가
      // await axios.post(`${BASE_URL}/transactions`, payload);
    } catch (error) {
      console.error('addData error:', error);
      isError.value = true;
    }
  };

  const deleteData = async (transactionId) => {
    try {
      // TODO: 트랜젝션 데이터 삭제
      // await axios.delete(`${BASE_URL}/transactions/${transactionId}`);
    } catch (error) {
      console.error('deleteData error:', error);
      isError.value = true;
    }
  };

  const editData = async (transactionId, payload) => {
    try {
      // TODO: 트랜젝션 데이터 수정
      // await axios.put(`${BASE_URL}/transactions/${transactionId}`, payload);
    } catch (error) {
      console.error('editData error:', error);
      isError.value = true;
    }
  };

  return {
    BASE_URL,
    isFetching,
    isError,
    isMomoHappy,
    momoExp,
    momoLevel,
    momoMission,
    momoAttendance,
    momoFinalAttendance,
    transactionList,
    fetchData,
    fetchTransactionList,
    fetchMission,
    fetchMomoStatus,
    fetchAttendance,
    addData,
    deleteData,
    editData,
  };
});
