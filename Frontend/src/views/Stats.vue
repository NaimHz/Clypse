<template>
  <main class="flex flex-col items-center pb-20">
    <div class="w-full max-w-md mx-auto px-4 py-8">
      <PageTitle tag="h1" size="medium">Mes Statistiques</PageTitle>

      <!-- Statistiques journalières -->
      <div class="bg-white/15 p-6 rounded-default mb-6">
        <h3 class="text-base font-bold mb-4">Statistiques journalières</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Bouffées aujourd'hui</span>
            <span class="text-lg font-bold">{{ totalPuffs }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Moyenne par jour</span>
            <span class="text-lg font-bold">{{ dailyAverage }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Variation journalière</span>
            <span
              class="text-lg font-bold"
              :class="{
                'text-green-500': puffVariation > 0,
                'text-red-500': puffVariation < 0,
              }"
            >
              {{ puffVariation > 0 ? '+' : '' }}{{ puffVariation }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Statistiques mensuelles -->
      <div class="bg-white/15 p-6 rounded-default mb-6">
        <h3 class="text-base font-bold mb-4">Statistiques mensuelles</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Total du mois</span>
            <span class="text-lg font-bold">{{ monthlyTotal }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Progression mensuelle</span>
            <span
              class="text-lg font-bold"
              :class="{
                'text-green-500': monthlyProgress < 80,
                'text-yellow-500': monthlyProgress >= 80 && monthlyProgress < 100,
                'text-red-500': monthlyProgress >= 100
              }"
            >
              {{ monthlyProgress }}%
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Jours restants</span>
            <span class="text-lg font-bold">{{ daysRemaining }}</span>
          </div>
        </div>
      </div>

      <!-- Historique des 7 derniers jours -->
      <div class="bg-white/15 p-6 rounded-default">
        <h3 class="text-base font-bold mb-4">Historique des 7 derniers jours</h3>
        <div class="space-y-4">
          <div v-for="(day, index) in last7Days" :key="index" class="flex justify-between items-center">
            <span class="text-sm text-gray-400">{{ formatDate(day.date) }}</span>
            <span class="text-lg font-bold">{{ day.puffs }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useConsumptionStore } from '../stores/consumption';
import PageTitle from '../components/PageTitle.vue';

const authStore = useAuthStore();
const totalPuffs = ref(0);
const dailyAverage = ref(0);
const puffVariation = ref(0);
const monthlyTotal = ref(0);
const monthlyProgress = ref(0);
const daysRemaining = ref(0);
const last7Days = ref([]);

onMounted(async () => {
  try {
    // Appel API pour récupérer les statistiques
    const stats = await authStore.getStats();
    totalPuffs.value = stats.totalPuffs;
    dailyAverage.value = stats.dailyAverage;
    puffVariation.value = stats.puffVariation;
    monthlyTotal.value = stats.monthlyTotal;
    monthlyProgress.value = stats.monthlyProgress;
    daysRemaining.value = stats.daysRemaining;
    last7Days.value = stats.last7Days;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};
</script>
