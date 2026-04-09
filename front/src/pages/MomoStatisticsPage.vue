<template>
    <div class="max-w-[480px] mx-auto bg-[#F8F9FA] min-h-screen px-5 pt-5 pb-[80px] relative font-sans">

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
                <section class="rounded-[20px] p-3">
                    <div class="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                            @click="movePickerYear(-1)"
                        >
                            <i class="fa-solid fa-chevron-left text-xs"></i>
                        </button>
                        <strong class="text-base font-bold text-slate-900">{{ pickerYear }}년</strong>
                        <button
                            type="button"
                            class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                            @click="movePickerYear(1)"
                        >
                            <i class="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                        <button
                            v-for="month in monthOptions"
                            :key="month.value"
                            type="button"
                            class="rounded-[16px] px-3 py-3 text-sm font-semibold transition"
                            :class="getMonthButtonClass(month.value)"
                            @click="selectMonth(month.value)"
                        >
                            {{ month.label }}
                        </button>
                    </div>
                </section>
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
                <!-- <span class="text-sm font-bold text-slate-800">금액 높은 순</span> -->
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
                <!-- <span class="text-[13px] font-medium text-slate-400">금액 높은 순</span> -->
            </div>

            <div class="flex flex-col gap-3">
                <TransactionCard v-for="topCategory in sortedCategories" :key="topCategory.id" :type="type"
                    :category="topCategory.name" :desc="topCategory.name + ' 합계'" :amount="topCategory.amount" />
            </div>
        </section>

    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import TransactionCard from '@/components/TransactionCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useMomoStore } from '@/stores/momo';
import { categoryMap } from '@/constants/momoCategories';

// Chart.js 관련 임포트
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS 모듈 등록 필수!
ChartJS.register(ArcElement, Tooltip, Legend);

// ==========================================
// 상태 및 뷰 로직
// ==========================================
const authStore = useAuthStore();
const momoStore = useMomoStore();

const type = ref('expense');
const selectedDate = ref(new Date());
const showCalendar = ref(false);
const pickerYear = ref(selectedDate.value.getFullYear());

const CATEGORY_COLORS = [
    '#00C875',
    '#FFB300',
    '#FF3D71',
    '#3366FF',
    '#8F9BB3',
    '#7C4DFF',
    '#00B8D9',
    '#FF6F61',
    '#2E7D32',
    '#C2185B',
    '#5D4037',
    '#3949AB',
    '#00897B',
    '#F4511E',
    '#6D4C41',
    '#546E7A',
];
const monthOptions = [
    { value: 1, label: '1월' },
    { value: 2, label: '2월' },
    { value: 3, label: '3월' },
    { value: 4, label: '4월' },
    { value: 5, label: '5월' },
    { value: 6, label: '6월' },
    { value: 7, label: '7월' },
    { value: 8, label: '8월' },
    { value: 9, label: '9월' },
    { value: 10, label: '10월' },
    { value: 11, label: '11월' },
    { value: 12, label: '12월' },
];

const changeType = (newType) => {
    type.value = newType;
};

const openMonthPicker = () => {
    showCalendar.value = !showCalendar.value;

    pickerYear.value = selectedDate.value.getFullYear();
};

const handleDateSelect = (newDate) => {
    selectedDate.value = newDate;
    pickerYear.value = newDate.getFullYear();
    showCalendar.value = false;
};

const movePickerYear = (diff) => {
    pickerYear.value += diff;
};

const selectMonth = (month) => {
    handleDateSelect(new Date(pickerYear.value, month - 1, 1));
};

const getMonthButtonClass = (month) => {
    const isSelected =
        pickerYear.value === selectedDate.value.getFullYear() &&
        month === selectedDate.value.getMonth() + 1;

    if (isSelected) {
        return 'bg-emerald-500 text-white shadow-sm';
    }

    return 'bg-slate-50 text-slate-600 hover:bg-slate-100';
};

const currentYear = computed(() => selectedDate.value.getFullYear());
const currentMonth = computed(() => selectedDate.value.getMonth() + 1);
const currentYearMonth = computed(() => {
    return `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`;
});

watch(
    () => authStore.currentUserId,
    async (userId) => {
        if (!userId) {
            momoStore.transactionList = [];
            return;
        }

        await momoStore.fetchTransactionList(userId);
    },
    { immediate: true },
);

// ==========================================
// 데이터 통계 로직
// ==========================================
const currentCategoryMeta = computed(() => {
    return categoryMap[type.value].reduce((metaMap, category, index) => {
        const meta = {
            label: category.label,
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        };

        metaMap[category.key] = meta;
        metaMap[category.label] = meta;

        return metaMap;
    }, {});
});

const filteredTransactions = computed(() => {
    return momoStore.transactionList.filter((transaction) => {
        return (
            transaction.type === type.value &&
            transaction.date?.startsWith(currentYearMonth.value)
        );
    });
});

const totalAmount = computed(() => {
    return filteredTransactions.value.reduce((sum, item) => {
        return sum + (Number(item.amount) || 0);
    }, 0);
});

const topCategories = computed(() => {
    const categoryStats = filteredTransactions.value.reduce((statsMap, transaction) => {
        const rawCategory = transaction.category || '기타';
        const meta = currentCategoryMeta.value[rawCategory];
        const categoryId = meta?.label || rawCategory;

        if (!statsMap[categoryId]) {
            statsMap[categoryId] = {
                id: categoryId,
                name: meta?.label || rawCategory,
                count: 0,
                amount: 0,
                color: meta?.color || CATEGORY_COLORS[Object.keys(statsMap).length % CATEGORY_COLORS.length],
            };
        }

        statsMap[categoryId].count += 1;
        statsMap[categoryId].amount += Number(transaction.amount) || 0;

        return statsMap;
    }, {});

    return Object.values(categoryStats)
        .sort((a, b) => b.amount - a.amount)
        .map((item) => ({
            ...item,
            percentage: totalAmount.value
                ? Number(((item.amount / totalAmount.value) * 100).toFixed(1))
                : 0,
        }));
});

const sortedCategories = computed(() => {
    return topCategories.value;
});

// ==========================================
// 차트.js 데이터 및 옵션 세팅
// ==========================================
const chartData = computed(() => ({
    labels: topCategories.value.length
        ? topCategories.value.map(c => c.name)
        : ['내역 없음'],
    datasets: [
        {
            backgroundColor: topCategories.value.length
                ? topCategories.value.map(c => c.color)
                : ['#E5E7EB'],
            data: topCategories.value.length
                ? topCategories.value.map(c => c.percentage)
                : [100],
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
                    if (!topCategories.value.length) {
                        return ' 내역 없음';
                    }
                    return ` ${context.label}: ${context.raw}%`;
                }
            }
        }
    }
};
</script>

<style scoped></style>
