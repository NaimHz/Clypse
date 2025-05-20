<template>
  <main class="flex flex-col items-center">
    <div class="w-full max-w-md mx-auto px-2 py-4 sm:px-4 sm:py-8">
      <PageTitle tag="h1" size="medium">Mes Clyps</PageTitle>

      <!-- Formulaire de liaison -->
      <div v-if="!addVape" class="mb-6 bg-white/15 p-4 rounded-default">
        <button class="btn" @click="addVape = true">Ajouter une Clyps</button>
      </div>
      <div v-else class="mb-6 bg-white/15 p-4 rounded-default">
        <h3 class="text-base font-bold mb-3 text-center">
          Lier une nouvelle Clyps
        </h3>
        <form @submit.prevent="handleLink" class="flex flex-col gap-3">
          <input
            v-model="linkCode"
            type="text"
            placeholder="Code de la Clyps"
            class="input w-full text-sm"
            :class="{ 'border-red-500': linkError }"
          />
          <button type="submit" class="btn w-full" :disabled="loading">
            {{ loading ? "Liaison..." : "Lier" }}
          </button>
          <button type="submit" class="btn btn-secondary w-full" @click="addVape = false">
             Réduire
          </button>
        </form>
        <p v-if="linkError" class="text-red-500 text-xs mt-2 text-center">
          {{ linkError }}
        </p>
      </div>

      <!-- Liste des vapes -->
      <div
        v-if="vapes.length === 0"
        class="text-center py-8 bg-white/15 rounded-default"
      >
        <p class="text-gray-500">Aucune vape liée à votre compte</p>
      </div>
      <div v-else class="flex flex-col gap-4">
        <VapeCard
          v-for="vape in vapes"
          :key="vape._id"
          :vape="vape"
          @click="goToVapeDetails"
          @unlinked="handleUnlinked"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useConsumptionStore } from "../stores/consumption";
import { useVapeStore } from "../stores/vape";
import VapeCard from "../components/VapeCard.vue";
import PageTitle from "../components/PageTitle.vue";

const router = useRouter();
const authStore = useAuthStore();
const consumptionStore = useConsumptionStore();
const vapeStore = useVapeStore();
const vapes = ref([]);
const linkCode = ref("");
const linkError = ref("");
const loading = ref(false);
const user = ref(null);
const addVape = ref(false);

// Calcul des statistiques globales
const totalPuffs = computed(() => {
  return vapes.value.reduce((total, vape) => {
    return total + (vape.stats?.totalPuffs || 0);
  }, 0);
});

const dailyAverage = computed(() => {
  return vapes.value.reduce((total, vape) => {
    return total + (vape.stats?.dailyAverage || 0);
  }, 0);
});

const puffVariation = computed(() => {
  return (
    vapes.value.reduce((total, vape) => {
      return total + (vape.stats?.puffVariation || 0);
    }, 0) / (vapes.value.length || 1)
  );
});

const monthlyProgress = computed(() => {
  if (!user.value?.monthlyPuffLimit) return 0;
  return Math.round((totalPuffs.value / user.value.monthlyPuffLimit) * 100);
});

const getVapingLevelLabel = (level) => {
  const labels = {
    occasional: 'Vapoteur occasionnel',
    moderate: 'Vapoteur modéré',
    frequent: 'Vapoteur fréquent',
    heavy: 'Vapoteur intensif'
  };
  return labels[level] || 'Non défini';
};

onMounted(async () => {
  authStore.checkAuth();
  user.value = authStore.user;
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
          return {
            ...vape,
            _id: vape._id || vape.id,
            stats: null,
          };
        }
      })
    );
    vapes.value = vapesWithStats.filter((vape) => vape !== null);
  } catch (error) {
    vapes.value = [];
  }
};

const handleLink = async () => {
  if (!linkCode.value) {
    linkError.value = "Veuillez entrer un code";
    return;
  }

  loading.value = true;
  linkError.value = "";

  try {
    await vapeStore.linkVape(linkCode.value);
    linkCode.value = "";
    await loadVapes();
  } catch (error) {
    linkError.value = error.message || "Erreur lors de la liaison";
  } finally {
    loading.value = false;
  }
};

const goToVapeDetails = (vapeId) => {
  if (!vapeId) return;
  router.push({ name: "vape-details", params: { vapeId: String(vapeId) } });
};

const handleUnlinked = async (vapeId) => {
  await loadVapes();
};
</script>
