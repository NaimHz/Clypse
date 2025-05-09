<template>
  <div class="bg-white/15 p-4 sm:p-6 md:p-8 rounded-default">
    <h3 class="text-base sm:text-lg font-bold mb-4 sm:mb-6">
      Maintenance
    </h3>
    <div class="space-y-2 sm:space-y-4">
      <div>
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Dernière maintenance
        </p>
        <p class="text-base sm:text-lg font-bold">
          {{ formatDate(lastMaintenance) }}
        </p>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Prochaine maintenance
        </p>
        <p class="text-base sm:text-lg font-bold">
          {{ formatDate(nextMaintenance) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  lastMaintenance: {
    type: String,
    required: true
  },
  nextMaintenance: {
    type: String,
    required: true
  }
});

const formatDate = (date) => {
  if (!date) return "Non disponible";
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
