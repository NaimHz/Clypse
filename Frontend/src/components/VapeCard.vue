<template>
  <div
    @click="$emit('click', vape._id)"
    class="bg-white/15 p-4 rounded-default relative cursor-pointer transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-brand/50"
  >
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-bold">{{ vape.brand }} {{ vape.model }}</h3>
        <p class="text-sm text-gray-400">{{ vape.code }}</p>
      </div>
      <button
        @click.stop="handleUnlink"
        class="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-500/10"
        title="Détacher la vape"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="18" height="10" rx="2" ry="2"></rect>
            <line x1="22" y1="11" x2="22" y2="13"></line>
          </svg>
          <span class="text-sm text-gray-400">Batterie</span>
        </div>
        <div class="w-24">
          <BatteryBar :level="vape.batteryLevel" />
        </div>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
          </svg>
          <span class="text-sm text-gray-400">Consommation</span>
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
    </div>

    <div class="text-sm text-gray-400 mt-4">
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
