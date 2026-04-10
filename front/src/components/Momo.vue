<script setup>
import { computed } from 'vue';
import babyHappyImage from '@/assets/momo/baby-happy.png';
import babySadImage from '@/assets/momo/baby-sad.png';
import teenHappyImage from '@/assets/momo/teen-happy.png';
import teenSadImage from '@/assets/momo/teen-sad.png';
import adultHappyImage from '@/assets/momo/adult-happy.png';
import adultSadImage from '@/assets/momo/adult-sad.png';

const props = defineProps({
  level: {
    type: Number,
    default: 1,
  },
  isHappy: {
    type: Boolean,
    default: true,
  },
  monthlyState: {
    type: String,
    default: 'steady',
    validator: (value) => ['float', 'steady', 'sink'].includes(value),
  },
});

const MOMO_STAGE_THRESHOLDS = {
  teen: 2,
  adult: 3,
};

const imageMap = {
  baby: {
    happy: babyHappyImage,
    sad: babySadImage,
  },
  teen: {
    happy: teenHappyImage,
    sad: teenSadImage,
  },
  adult: {
    happy: adultHappyImage,
    sad: adultSadImage,
  },
};

const momoTopMap = {
  baby: {
    float: '-17%',
    steady: '18%',
    sink: '52%',
  },
  teen: {
    float: '-14%',
    steady: '16%',
    sink: '45%',
  },
  adult: {
    float: '-13%',
    steady: '9%',
    sink: '30%',
  },
};

const momoStage = computed(() => {
  if (props.level >= MOMO_STAGE_THRESHOLDS.adult) {
    return 'adult';
  }

  if (props.level >= MOMO_STAGE_THRESHOLDS.teen) {
    return 'teen';
  }

  return 'baby';
});

const moodKey = computed(() => {
  return props.isHappy ? 'happy' : 'sad';
});

const momoImageSrc = computed(() => {
  return imageMap[momoStage.value][moodKey.value];
});

const momoImageAlt = computed(() => {
  return `${momoStage.value}-${moodKey.value}-momo`;
});

const wrapperClass = computed(() => {
  return [
    `momo--${props.monthlyState}`,
    props.isHappy ? 'momo--happy' : 'momo--sad',
  ];
});

const wrapperStyle = computed(() => {
  return {
    top: momoTopMap[momoStage.value][props.monthlyState],
  };
});

const spriteClass = computed(() => {
  if (momoStage.value === 'adult') {
    return 'w-[340px] max-w-[92%]';
  }

  if (momoStage.value === 'teen') {
    return 'w-[280px] max-w-[76%]';
  }

  return 'w-[276px] max-w-[74%]';
});
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
    <div class="momo-wrap" :class="wrapperClass" :style="wrapperStyle">
      <img
        :src="momoImageSrc"
        :alt="momoImageAlt"
        class="momo-sprite"
        :class="spriteClass"
        draggable="false"
      />
    </div>
  </div>
</template>

<style scoped>
.momo-wrap {
  position: absolute;
  inset-inline: 0;
  display: flex;
  justify-content: center;
  transition:
    top 0.45s steps(6),
    filter 0.3s ease;
}

.momo--float {
  animation: momo-float 3.2s steps(2) infinite;
}

.momo--steady {
  animation: momo-steady 3.4s steps(2) infinite;
}

.momo--sink {
  animation: momo-sink 3.8s steps(2) infinite;
}

.momo--happy {
  filter: drop-shadow(0 16px 28px rgba(62, 177, 98, 0.26));
}

.momo--sad {
  filter: drop-shadow(0 16px 28px rgba(31, 56, 47, 0.24));
}

.momo-sprite {
  display: block;
  flex: none;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  user-select: none;
}

@keyframes momo-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes momo-steady {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

@keyframes momo-sink {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(5px);
  }
}
</style>
