<template>
  <div class="bg-white/15 p-4 sm:p-6 md:p-8 rounded-default">
    <h3 class="text-base sm:text-lg font-bold mb-4 sm:mb-6">
      Statistiques d'utilisation
    </h3>

    <!-- Statistiques quotidiennes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div class="text-center">
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Bouffées aujourd'hui
        </p>
        <p class="text-xl sm:text-2xl font-bold">
          {{ dailyStats?.totalPuffs || 0 }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Sessions aujourd'hui
        </p>
        <p class="text-xl sm:text-2xl font-bold">
          {{ dailyStats?.totalSessions || 0 }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Variation par rapport à hier
        </p>
        <p class="text-xl sm:text-2xl font-bold" :class="{
          'text-green-500': dailyStats?.puffVariation > 0,
          'text-red-500': dailyStats?.puffVariation < 0
        }">
          {{ dailyStats?.puffVariation > 0 ? '+' : '' }}{{ dailyStats?.puffVariation }}%
        </p>
      </div>
    </div>

    <!-- Bouton pour voir plus de détails -->
    <button class="btn w-full mt-4 sm:mt-6" @click="$emit('show-details')">
      Voir l'historique complet
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  dailyStats: {
    type: Object,
    required: true
  }
});

defineEmits(['show-details']);
</script>
