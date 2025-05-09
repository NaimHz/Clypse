<template>
  <div
    @click="$emit('click', vape._id)"
    class="bg-white/15 p-6 rounded-default cursor-pointer hover:bg-white/20 transition-all relative"
  >
    <button
      @click.stop="handleUnlink"
      class="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
      title="Détacher la vape"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-bold">{{ vape.brand }} {{ vape.model }}</h3>
        <p class="text-sm text-gray-400">Code: {{ vape.code }}</p>
      </div>
      <div class="flex flex-col items-end">
        <span
          :class="{
            'text-red-500': vape.batteryLevel <= 20,
            'text-yellow-500':
              vape.batteryLevel > 20 && vape.batteryLevel <= 50,
            'text-green-500': vape.batteryLevel > 50,
          }"
          class="text-lg font-bold"
        >
          {{ vape.batteryLevel }}%
        </span>
        <span class="text-sm text-gray-400">Batterie</span>
      </div>
    </div>
    <BatteryBar :level="vape.batteryLevel" />
    <div class="flex justify-between items-center mt-4">
      <div class="flex items-center gap-2">
        <img src="../assets/Vape.svg" alt="" class="size-5" />
        <span class="text-sm">Consommation</span>
      </div>
      <span
        :class="{
          'text-green-500': vape.stats?.puffVariation > 0,
          'text-red-500': vape.stats?.puffVariation < 0,
          'text-gray-50': vape.stats?.puffVariation === 0,
        }"
        class="text-sm font-medium"
      >
        {{ (vape.stats?.puffVariation || 0) > 0 ? "+" : "" }}
        {{ vape.stats?.puffVariation || 0 }}%
      </span>
    </div>
    <div class="text-sm text-gray-400 mt-2">
      Dernière synchro: {{ formatDate(vape.lastSyncDate) }}
    </div>
  </div>
</template>
<script setup>
import { useVapeStore } from "../stores/vape";
import BatteryBar from "./BatteryBar.vue";

const props = defineProps({ vape: { type: Object, required: true } });
const emit = defineEmits(['click', 'unlinked']);
const vapeStore = useVapeStore();

const formatDate = (dateString) => {
  if (!dateString) return "Jamais";
  const date = new Date(dateString);
  return date.toLocaleString();
};

const handleUnlink = async () => {
  try {
    const vapeId = props.vape._id || props.vape.id;
    if (!vapeId) return;

    await vapeStore.unlinkVape(vapeId);
    emit('unlinked', vapeId);
  } catch (error) {
    console.error('Erreur lors du détachement:', error);
  }
};
</script>
