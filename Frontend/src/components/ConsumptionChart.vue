<template>
  <div>
    <canvas ref="chartRef" class="w-full h-56 sm:h-64 md:h-72"></canvas>
    <div v-if="!hasData" class="text-center text-gray-400 mt-4">
      Aucune donnée de consommation récente.
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
});

const chartRef = ref(null);
let chartInstance = null;

const hasData = computed(() => {
  return (
    props.stats &&
    props.stats.daily &&
    props.stats.daily.length > 0 &&
    props.stats.daily.some((item) => item.puffs > 0)
  );
});

const renderChart = () => {
  if (!hasData.value) return;
  const labels = props.stats.daily.map((item) => item.date);
  const data = props.stats.daily.map((item) => item.puffs);
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Bouffées par jour",
          data,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderRadius: 8,
          maxBarThickness: 32,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.parsed.y} bouffée${ctx.parsed.y > 1 ? "s" : ""}`,
          },
        },
      },
      scales: {
        x: {
          title: { display: false },
          grid: { display: false },
          ticks: { color: "#64748b", font: { size: 12 } },
        },
        y: {
          title: { display: false },
          beginAtZero: true,
          grid: { color: "#e5e7eb" },
          ticks: { color: "#64748b", font: { size: 12 }, stepSize: 1 },
        },
      },
    },
  });
};

onMounted(renderChart);
watch(() => props.stats, renderChart, { deep: true });
</script>

<style scoped>
canvas {
  background: transparent;
  border-radius: 1rem;
  box-shadow: 0 2px 8px 0 rgb(59 130 246 / 0.05);
}
</style>
