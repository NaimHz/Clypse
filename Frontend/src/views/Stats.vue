<template>
  <main class="flex flex-col items-center">
    <div class="w-full max-w-md mx-auto px-4 py-8">
      <BackButton to="/dashboard" />
      <PageTitle tag="h1" size="medium" centered>Mes Statistiques</PageTitle>

      <!-- Statistiques journalières -->
      <div class="bg-white/15 p-6 rounded-default mb-6">
        <h3 class="text-base font-bold mb-4">Statistiques journalières</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Bouffées aujourd'hui</span>
            <span class="text-lg font-bold">{{ totalPuffs }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Sessions aujourd'hui</span>
            <span class="text-lg font-bold">{{ totalSessions }}</span>
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
            <span class="text-sm text-gray-400">Moyenne journalière nécessaire</span>
            <span class="text-lg font-bold">{{ dailyAverageNeeded }} bouffées/jour</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Bouffées restantes</span>
            <span class="text-lg font-bold">{{ remainingPuffs }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">Jours restants</span>
            <span class="text-lg font-bold">{{ daysRemaining }}</span>
          </div>
          <div class="w-full bg-white/10 rounded-full h-2 mt-2">
            <div
              class="h-2 rounded-full transition-all duration-300"
              :class="{
                'bg-green-500': monthlyProgress < 80,
                'bg-yellow-500': monthlyProgress >= 80 && monthlyProgress < 100,
                'bg-red-500': monthlyProgress >= 100
              }"
              :style="{ width: `${Math.min(monthlyProgress, 100)}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-400 text-center">
            {{ getProgressMessage() }}
          </p>
        </div>
      </div>

      <!-- Historique des 7 derniers jours -->
      <div class="bg-white/15 p-6 rounded-default">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-base font-bold">Historique des 7 derniers jours</h3>
          <div class="flex gap-2">
            <button
              @click="chartType = 'puffs'"
              class="px-3 py-1 rounded-full text-sm"
              :class="chartType === 'puffs' ? 'bg-brand text-white' : 'bg-white/10 text-gray-400'"
            >
              Bouffées
            </button>
            <button
              @click="chartType = 'sessions'"
              class="px-3 py-1 rounded-full text-sm"
              :class="chartType === 'sessions' ? 'bg-brand text-white' : 'bg-white/10 text-gray-400'"
            >
              Sessions
            </button>
          </div>
        </div>
        <ConsumptionChart v-if="stats" :stats="stats" :type="chartType" />
        <div v-else class="text-center text-gray-400 py-8">
          Chargement des données...
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useConsumptionStore } from '../stores/consumption';
import { useVapeStore } from '../stores/vape';
import PageTitle from '../components/PageTitle.vue';
import BackButton from '../components/BackButton.vue';
import ConsumptionChart from '../components/ConsumptionChart.vue';

const consumptionStore = useConsumptionStore();
const vapeStore = useVapeStore();
const vapes = ref([]);
const stats = ref(null);
const chartType = ref('puffs');

const totalPuffs = computed(() => {
  return vapes.value.reduce((total, vape) => {
    return total + (vape.stats?.totalPuffs || 0);
  }, 0);
});

const totalSessions = computed(() => {
  return vapes.value.reduce((total, vape) => {
    return total + (vape.stats?.totalSessions || 0);
  }, 0);
});

const puffVariation = computed(() => {
  return (
    vapes.value.reduce((total, vape) => {
      return total + (vape.stats?.puffVariation || 0);
    }, 0) / (vapes.value.length || 1)
  );
});

const monthlyTotal = computed(() => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return vapes.value.reduce((total, vape) => {
    if (!vape.stats?.sessions) return total;

    return total + vape.stats.sessions.reduce((sessionTotal, session) => {
      const sessionDate = new Date(session.startTime);
      if (sessionDate >= firstDayOfMonth && sessionDate <= today) {
        return sessionTotal + (session.puffCount || 0);
      }
      return sessionTotal;
    }, 0);
  }, 0);
});

const monthlyProgress = computed(() => {
  const total = monthlyTotal.value;
  const limit = 1000; // Limite fixe pour l'instant
  return Math.round((total / limit) * 100);
});

const daysRemaining = computed(() => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate();
});

const dailyAverageNeeded = computed(() => {
  const limit = 1000; // Limite fixe pour l'instant
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysRemaining = lastDay.getDate() - today.getDate();
  const remainingPuffs = limit - monthlyTotal.value;

  return Math.ceil(remainingPuffs / daysRemaining);
});

const remainingPuffs = computed(() => {
  const limit = 1000; // Limite fixe pour l'instant
  return Math.max(0, limit - monthlyTotal.value);
});

const getProgressMessage = () => {
  if (monthlyProgress.value >= 100) {
    return "Vous avez dépassé votre limite mensuelle !";
  } else if (monthlyProgress.value >= 80) {
    return "Attention, vous approchez de votre limite mensuelle !";
  } else if (monthlyProgress.value >= 50) {
    return "Vous êtes à mi-chemin de votre objectif mensuel";
  } else {
    return "Vous êtes en bonne voie pour atteindre votre objectif";
  }
};

onMounted(async () => {
  await loadVapes();
});

const loadVapes = async () => {
  try {
    const userVapes = await vapeStore.getUserVapes();
    if (!userVapes || userVapes.length === 0) {
      vapes.value = [];
      return;
    }
    const vapesWithStats = await Promise.all(
      userVapes.map(async (vape) => {
        try {
          const vapeId = vape._id || vape.id;
          if (!vapeId) return null;
          const stats = await consumptionStore.fetchDailyStats(vapeId);
          return {
            ...vape,
            _id: vapeId,
            stats,
          };
        } catch (error) {
          console.error('Erreur lors de la récupération des stats pour la vape:', vapeId, error);
          return {
            ...vape,
            _id: vape._id || vape.id,
            stats: null,
          };
        }
      })
    );
    vapes.value = vapesWithStats.filter((vape) => vape !== null);

    // Combiner les statistiques de toutes les vapes
    const combinedStats = {
      daily: [],
      totalPuffs: totalPuffs.value,
      totalSessions: totalSessions.value,
      puffVariation: puffVariation.value,
      monthlyTotal: monthlyTotal.value
    };

    // Créer un objet pour stocker les données par jour
    const dailyData = {};

    // Parcourir toutes les vapes et leurs statistiques
    vapes.value.forEach(vape => {
      if (vape.stats?.sessions) {
        vape.stats.sessions.forEach(session => {
          const date = new Date(session.startTime).toISOString().split('T')[0];
          if (!dailyData[date]) {
            dailyData[date] = {
              date,
              puffs: 0,
              sessions: 0
            };
          }
          dailyData[date].puffs += session.puffCount || 0;
          dailyData[date].sessions += 1;
        });
      }
    });

    // Convertir en tableau et trier par date
    combinedStats.daily = Object.values(dailyData).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    stats.value = combinedStats;
  } catch (error) {
    console.error('Erreur lors du chargement des vapes:', error);
    vapes.value = [];
  }
};
</script>
