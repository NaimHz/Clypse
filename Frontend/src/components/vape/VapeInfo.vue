<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <div>
        <h4 class="text-sm text-gray-400">Marque</h4>
        <p class="text-lg font-bold">{{ vape.brand }}</p>
      </div>
      <div>
        <h4 class="text-sm text-gray-400">Modèle</h4>
        <p class="text-lg font-bold">{{ vape.model }}</p>
      </div>
    </div>
    <div>
      <h4 class="text-sm text-gray-400">Numéro de série</h4>
      <p class="text-lg font-bold">{{ vape.serialNumber }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  vape: {
    type: Object,
    required: true
  }
});
</script>
