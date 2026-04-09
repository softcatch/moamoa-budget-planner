<script setup>
import { computed } from 'vue';

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true,
  },
  dailyTotalsMap: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['select-date']);

const masks = {
  title: 'YYYY년 M월',
};

const onDayClick = (day) => {
  emit('select-date', day.date);
};

const calendarAttributes = computed(() => {
  const attrs = [];

  Object.entries(props.dailyTotalsMap).forEach(([date, total]) => {
    if (total > 0) {
      attrs.push({
        key: `dot-${date}`,
        dates: new Date(date),
        dot: 'green',
      });
    } else if (total < 0) {
      attrs.push({
        key: `dot-${date}`,
        dates: new Date(date),
        dot: 'red',
      });
    }
  });

  attrs.push({
    key: 'selected',
    dates: props.selectedDate,
    highlight: {
      color: 'green',
      fillMode: 'light',
    },
  });

  return attrs;
});

const getDayTotal = (day) => {
  const dateStr = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
  const total = props.dailyTotalsMap[dateStr];

  if (!total) return '';
  if (total > 0) return `+${total.toLocaleString()}`;
  return `${total.toLocaleString()}`;
};

const getDayTotalClass = (day) => {
  const dateStr = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
  const total = props.dailyTotalsMap[dateStr];

  if (!total) return '';
  return total > 0 ? 'plus' : 'minus';
};
</script>

<template>
  <div class="calendar-wrap flex justify-center">
    <VCalendar
      :attributes="calendarAttributes"
      :masks="masks"
      color="green"
      borderless
      transparent
      title-position="left"
    >
      <template #day-content="{ day }">
        <div class="day-cell" @click="onDayClick(day)">
          <span class="day-number">{{ day.day }}</span>
          <span class="day-total" :class="getDayTotalClass(day)">
            {{ getDayTotal(day) || '\u00A0' }}
          </span>
        </div>
      </template>
    </VCalendar>
  </div>
</template>

<style scoped>
.day-cell {
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.1;
  cursor: pointer;
  position: relative;
}

.day-number {
  font-size: 14px;
}

.day-total {
  margin-top: 2px;
  font-size: 6px;
  font-weight: 600;
  min-height: 12px;
}

.day-total.plus {
  color: #16a34a;
}

.day-total.minus {
  color: #dc2626;
}

:deep(.vc-dot) {
  position: absolute;
  top: 4px;
  right: 6px;
}
:deep(.vc-container) {
  transform: scale(1.4);
  transform-origin: top center;
}
</style>
