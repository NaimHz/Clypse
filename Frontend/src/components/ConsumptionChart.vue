<template>
  <div class="w-full">
    <div class="h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'puffs',
    validator: (value) => ['puffs', 'sessions'].includes(value)
  }
});

const chartCanvas = ref(null);
let chart = null;

const createChart = (data) => {
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  const labels = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  });

  const values = data.map(item => props.type === 'puffs' ? item.puffs : item.sessions);

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: props.type === 'puffs' ? 'Bouffées' : 'Sessions',
          data: values,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#9CA3AF'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#9CA3AF'
          }
        }
      }
    }
  });
};

watch(() => props.type, () => {
  if (props.stats?.daily) {
    createChart(props.stats.daily);
  }
});

watch(() => props.stats, (newStats) => {
  if (newStats?.daily) {
    createChart(newStats.daily);
  }
}, { deep: true });

onMounted(() => {
  if (props.stats?.daily) {
    createChart(props.stats.daily);
  }
});
</script>

<style scoped>
canvas {
  background: transparent;
  border-radius: 1rem;
  box-shadow: 0 2px 8px 0 rgb(59 130 246 / 0.05);
}
</style>
