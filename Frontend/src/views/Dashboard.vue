<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Tableau de bord</h1>

    <!-- Section pour lier une nouvelle vape -->
    <div class=" p-6 rounded-lg shadow mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        Lier une cigarette électronique
      </h2>
      <div class="max-w-md">
        <form @submit.prevent="handleLinkVape" class="space-y-4">
          <div>
            <label class="block mb-2 font-medium"
              >Code de la cigarette électronique</label
            >
            <input
              type="text"
              v-model="vapeCode"
              placeholder="Entrez le code de votre appareil"
              required
              class="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div v-if="vapeStore.error" class="text-red-500 text-sm">
            {{ vapeStore.error }}
          </div>

          <button
            type="submit"
            class="btn w-full"
            :disabled="vapeStore.loading"
          >
            <span v-if="vapeStore.loading">Liaison en cours...</span>
            <span v-else>Lier l'appareil</span>
          </button>
        </form>
      </div>
    </div>

    <div class="p-6 rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-4">Mes cigarettes électroniques</h2>

      <div v-if="vapeStore.loading" class="text-center py-4">Chargement...</div>

      <div
        v-else-if="vapeStore.vapes.length === 0"
        class="text-center py-4 text-gray-500"
      >
        Aucune cigarette électronique liée à votre compte.
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="vape in vapeStore.vapes"
          :key="vape.id"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg">
                {{ vape.brand }} {{ vape.model }}
              </h3>
              <p class="text-sm text-gray-600">Code: {{ vape.code }}</p>
              <p class="text-sm text-gray-600">
                N° Série: {{ vape.serialNumber }}
              </p>
              <p class="mt-2">
                <span class="font-medium">Batterie:</span>
                <span :class="getBatteryColorClass(vape.batteryLevel)">
                  {{ vape.batteryLevel }}%
                </span>
              </p>
              <p class="text-sm text-gray-600 mt-1">
                Dernière synchronisation: {{ formatDate(vape.lastSyncDate) }}
              </p>
            </div>

            <button
              @click="handleUnlinkVape(vape.id)"
              class="text-red-500 hover:text-red-700"
              :disabled="vapeStore.loading"
            >
              Détacher
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useVapeStore } from "../stores/vape";

const authStore = useAuthStore();
const vapeStore = useVapeStore();
const vapeCode = ref("");

onMounted(async () => {
  authStore.checkAuth();
  await vapeStore.getUserVapes();
});

const handleLinkVape = async () => {
  if (vapeCode.value.trim()) {
    const success = await vapeStore.linkVape(vapeCode.value);
    if (success) {
      vapeCode.value = "";
    }
  }
};

const handleUnlinkVape = async (vapeId) => {
  if (confirm("Êtes-vous sûr de vouloir détacher cet appareil ?")) {
    await vapeStore.unlinkVape(vapeId);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Jamais";
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getBatteryColorClass = (level) => {
  if (level <= 20) return "text-red-600";
  if (level <= 50) return "text-yellow-600";
  return "text-green-600";
};
</script>
