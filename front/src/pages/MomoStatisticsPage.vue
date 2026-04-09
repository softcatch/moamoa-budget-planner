<template>
    <div class="max-w-[480px] mx-auto bg-[#F8F9FA] min-h-screen px-5 pt-5 pb-[80px] relative font-sans">

        <AppHeader title="통계" subtitle="누구누구의 통계를 확인해보세요" icon-src="www" icon-alt="마리모입니다" />

        <section class="flex justify-between items-center mb-6 relative">
            <div class="mt-7 flex justify-center">
                <div class="flex w-[140px] h-11 rounded-[18px] bg-slate-100 overflow-hidden shadow-inner">
                    <button type="button" class="w-1/2 text-sm font-bold transition-colors duration-200"
                        :class="type === 'expense' ? 'bg-[#E96B5F] text-white rounded-[18px] shadow-md' : 'text-zinc-400'"
                        @click="changeType('expense')">
                        지출
                    </button>
                    <button type="button" class="w-1/2 text-sm font-bold transition-colors duration-200"
                        :class="type === 'income' ? 'bg-emerald-500 text-white rounded-[18px] shadow-md' : 'text-zinc-400'"
                        @click="changeType('income')">
                        수입
                    </button>
                </div>
            </div>

            <div v-if="showCalendar"
                class="absolute top-20 right-0 z-50 mt-2 w-[300px] rounded-[24px] border border-slate-200 bg-white p-2 shadow-lg">
                <div class="flex justify-center">
                    <VDatePicker v-model="selectedDate" type="month" @update:model-value="handleDateSelect" locale="ko"
                        color="green" borderless transparent is-expanded />
                </div>
            </div>

            <div class="bg-white px-4 py-2.5 mt-7 rounded-full font-semibold flex items-center gap-2 cursor-pointer shadow-sm hover:bg-gray-50"
                @click="openMonthPicker">
                <span>{{ currentYear }}년 {{ currentMonth }}월</span>
                <i class="fa-solid fa-chevron-down text-sm"
                    :class="{ 'rotate-180 transition-transform': showCalendar }"></i>
            </div>
        </section>

        <section class="bg-white rounded-3xl p-6 mb-5 shadow-sm">
            <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-700 font-medium">이번 달 총 {{ type === 'expense' ? '지출' : '수입' }}</span>
                <span class="text-sm text-gray-400">카테고리 {{ topCategories.length }}개</span>
            </div>
            <div class="flex justify-between items-end">
                <h2 :class="['text-3xl font-extrabold', type === 'expense' ? 'text-[#E96B5F]' : 'text-emerald-500']">
                    ₩{{ totalAmount.toLocaleString() }}
                </h2>
                <span class="text-sm font-bold text-slate-800">지출 높은 순</span>
            </div>
        </section>

        <section class="bg-white rounded-3xl p-6 mb-8 shadow-sm">
            <div class="h-[220px] mb-6 relative flex justify-center items-center">
                <Doughnut :data="chartData" :options="chartOptions" />
            </div>
            <div class="flex justify-center flex-wrap gap-4">
                <div v-for="item in topCategories" :key="item.id"
                    class="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                    <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></span>
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </section>

        <section>
            <div class="flex justify-between items-center mb-4 px-1">
                <h3 class="text-lg font-bold text-slate-900">{{ type === 'expense' ? '지출' : '수입' }} 상세 내역</h3>
                <span class="text-[13px] font-medium text-slate-400">금액 높은 순</span>
            </div>

            <div class="flex flex-col gap-3">
                <TransactionCard v-for="topCategory in sortedCategories" :key="topCategory.id" :type="type"
                    :category="topCategory.name" :desc="topCategory.name + ' 합계'" :amount="topCategory.amount" />
            </div>
        </section>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import TransactionCard from '@/components/TransactionCard.vue';

// Chart.js 관련 임포트
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS 모듈 등록 필수!
ChartJS.register(ArcElement, Tooltip, Legend);

// ==========================================
// 상태 및 뷰 로직
// ==========================================
const type = ref('expense');
const selectedDate = ref(new Date());
const showCalendar = ref(false);

const changeType = (newType) => {
    type.value = newType;
    // 추후 서버에서 데이터를 다시 불러오는 함수 호출
};

const openMonthPicker = () => {
    showCalendar.value = !showCalendar.value;
};

const handleDateSelect = (newDate) => {
    selectedDate.value = newDate;
    showCalendar.value = false;
    // 추후 서버에서 월별 데이터를 다시 불러오는 함수 호출
};

const currentYear = computed(() => selectedDate.value.getFullYear());
const currentMonth = computed(() => selectedDate.value.getMonth() + 1);

// ==========================================
// 데이터 통계 로직 (추후 스토어에서 받아올 데이터)
// ==========================================
const topCategories = ref([
    { id: 1, name: '식비', percentage: 34, count: 12, amount: 140000, color: '#00C875' },
    { id: 2, name: '카페', percentage: 21.8, count: 8, amount: 89800, color: '#FFB300' },
    { id: 3, name: '쇼핑', percentage: 17, count: 3, amount: 70000, color: '#FF3D71' },
    { id: 4, name: '교통', percentage: 11.9, count: 15, amount: 49000, color: '#3366FF' },
    { id: 5, name: '구독', percentage: 10.3, count: 4, amount: 42500, color: '#8F9BB3' },
]);

// 배열 내 amount들의 총합을 계산합니다.
const totalAmount = computed(() => {
    return topCategories.value.reduce((sum, item) => sum + item.amount, 0);
});

// 금액 기준 내림차순 정렬된 카테고리
const sortedCategories = computed(() => {
    return [...topCategories.value].sort((a, b) => b.amount - a.amount);
});

// ==========================================
// 차트.js 데이터 및 옵션 세팅
// ==========================================
const chartData = computed(() => ({
    labels: topCategories.value.map(c => c.name),
    datasets: [
        {
            backgroundColor: topCategories.value.map(c => c.color),
            data: topCategories.value.map(c => c.percentage),
            borderWidth: 0,
            hoverOffset: 4, // 마우스 오버 시 살짝 튀어나오는 효과
            cutout: '65%',  // 가운데 구멍 크기 조절 (디자인 시안에 맞춤)
        }
    ]
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false // 우리가 직접 만든 하단 범례를 사용할 것이므로 기본 범례 끄기
        },
        tooltip: {
            callbacks: {
                // 툴팁에 퍼센트 기호 추가
                label: function (context) {
                    return ` ${context.label}: ${context.raw}%`;
                }
            }
        }
    }
};
</script>

<style scoped>
/* 테일윈드로 거의 모든 스타일을 처리했으므로 빈 상태로 둡니다 */
</style>