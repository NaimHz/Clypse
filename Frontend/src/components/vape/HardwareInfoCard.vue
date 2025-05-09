<template>
  <div class="bg-white/15 p-4 sm:p-6 md:p-8 rounded-default">
    <h3 class="text-base sm:text-lg font-bold mb-4 sm:mb-6">
      Informations matérielles
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Version du firmware
        </p>
        <p class="text-base sm:text-lg font-bold">
          {{ hardwareInfo.firmwareVersion }}
        </p>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Résistance actuelle
        </p>
        <p class="text-base sm:text-lg font-bold">
          {{ coil?.resistance ? `${coil.resistance} Ω` : 'Aucune résistance' }}
        </p>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Durée de vie de la résistance
        </p>
        <p class="text-base sm:text-lg font-bold">
          {{ coil?.lifespan ? `${coil.lifespan} jours` : 'Non disponible' }}
        </p>
      </div>
      <div>
        <p class="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          Installation de la résistance
        </p>
        <p class="text-base sm:text-lg font-bold">
          {{ formatDate(coil?.installedAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  hardwareInfo: {
    type: Object,
    required: true
  },
  coil: {
    type: Object,
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
