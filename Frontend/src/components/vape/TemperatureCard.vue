<template>
  <div class="bg-white/15 p-4 sm:p-6 md:p-8 rounded-default">
    <h3 class="text-base sm:text-lg font-bold mb-2 sm:mb-4">
      Température
    </h3>
    <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
      <span class="text-xl sm:text-2xl font-bold">
        {{ temperatureSettings.current }}°C
      </span>
      <div class="text-xs sm:text-sm text-gray-400">
        Min: {{ temperatureSettings.min }}°C / Max: {{ temperatureSettings.max }}°C
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  temperatureSettings: {
    type: Object,
    required: true
  }
});
</script>
