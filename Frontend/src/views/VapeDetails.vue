<template>
  <main class="flex flex-col items-center">
    <div
      class="w-full px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-2xl mx-auto"
    >
      <BackButton to="/dashboard" />
      <h2 class="text-xl sm:text-2xl font-bold text-center my-4 sm:my-6">
        {{ vape?.brand }} {{ vape?.model }}
      </h2>
      <div v-if="loading" class="text-center py-8">Chargement...</div>
      <div v-else-if="vape" class="space-y-6 sm:space-y-8">
        <VapeHeader :vape="vape" />
        <TemperatureCard :temperature-settings="vape.temperatureSettings" />
        <VapeStats
          :usage-stats="vape.usageStats"
          :daily-stats="stats"
          @show-details="handleShowStats"
        />
        <HardwareInfoCard
          :hardware-info="vape.hardwareInfo"
          :coil="vape.coil"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <MaintenanceCard
            :last-maintenance="vape.lastMaintenance"
            :next-maintenance="vape.nextMaintenance"
          />
          <WarrantyCard :warranty="vape.warranty" />
        </div>
        <button class="btn w-full" @click="handleCreatePuff" :disabled="loading">
          Créer une bouffée (puff)
        </button>
      </div>
      <div v-else class="text-center py-8 bg-white/15 rounded-default mt-4">
        <p class="text-gray-500">{{ error || "Vape non trouvée" }}</p>
        <button
          @click="router.push('/dashboard')"
          class="mt-4 text-brand hover:underline"
        >
          Retour au dashboard
        </button>
      </div>
    </div>
    <Modal :show="showModal" @close="showModal = false">
      <template #header>
        <span
          class="text-lg font-bold text-blue-600 dark:text-blue-300 w-full text-center block"
          >Consommation des derniers jours</span
        >
      </template>
      <div v-if="loadingStats" class="text-center py-8">
        Chargement des statistiques...
      </div>
      <ConsumptionChart v-else :stats="stats" />
    </Modal>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVapeStore } from "../stores/vape";
import { useConsumptionStore } from "../stores/consumption";
import BackButton from "../components/BackButton.vue";
import VapeHeader from "../components/vape/VapeHeader.vue";
import TemperatureCard from "../components/vape/TemperatureCard.vue";
import VapeStats from "../components/vape/VapeStats.vue";
import HardwareInfoCard from "../components/vape/HardwareInfoCard.vue";
import MaintenanceCard from "../components/vape/MaintenanceCard.vue";
import WarrantyCard from "../components/vape/WarrantyCard.vue";
import Modal from "../components/Modal.vue";
import ConsumptionChart from "../components/ConsumptionChart.vue";

const route = useRoute();
const router = useRouter();
const vapeStore = useVapeStore();
const consumptionStore = useConsumptionStore();

const vape = ref(null);
const stats = ref(null);
const loading = ref(true);
const loadingStats = ref(false);
const error = ref("");
const showModal = ref(false);

const formatDate = (date) => {
  if (!date) return "Non disponible";
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(async () => {
  await loadVapeData();
});

const loadVapeData = async () => {
  loading.value = true;
  error.value = "";
  try {
    const vapeId = route.params.vapeId;
    if (!vapeId) {
      throw new Error("ID de vape manquant");
    }
    const vapeData = await vapeStore.getVapeById(vapeId);
    vape.value = vapeData;
    if (vapeData) {
      const statsData = await consumptionStore.fetchDailyStats(vapeId);
      stats.value = statsData;
    }
  } catch (err) {
    error.value = err.message;
    if (err.message === "Session expirée") {
      router.push("/signin");
    }
  } finally {
    loading.value = false;
  }
};

const handleShowStats = async () => {
  loadingStats.value = true;
  try {
    const vapeId = route.params.vapeId;
    if (!vapeId) {
      throw new Error("ID de vape manquant");
    }
    const statsData = await consumptionStore.fetchDailyStats(vapeId);
    stats.value = statsData;
    showModal.value = true;
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingStats.value = false;
  }
};

const handleCreatePuff = async () => {
  loading.value = true;
  try {
    await consumptionStore.createPuff(route.params.vapeId);
    await loadVapeData();
  } catch (error) {
    // Gérer l'erreur si nécessaire
  } finally {
    loading.value = false;
  }
};
</script>
