<template>
  <div
    class="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4"
  >
    <div>
      <h3 class="text-base sm:text-lg font-bold mb-1 sm:mb-2">Informations</h3>
      <p class="text-xs sm:text-sm text-gray-400">Code: {{ vape.code }}</p>
      <p class="text-xs sm:text-sm text-gray-400">
        N° Série: {{ vape.serialNumber }}
      </p>
      <p class="text-xs sm:text-sm text-gray-400">
        Statut:
        <span
          :class="{
            'text-green-500': vape.status === 'active',
            'text-yellow-500': vape.status === 'maintenance',
            'text-red-500': vape.status === 'repair',
            'text-gray-500': vape.status === 'retired',
          }"
          >{{ vape.status }}</span
        >
      </p>
    </div>
    <div class="flex flex-col items-end">
      <span
        :class="{
          'text-red-500': vape.batteryLevel <= 20,
          'text-yellow-500': vape.batteryLevel > 20 && vape.batteryLevel <= 50,
          'text-green-500': vape.batteryLevel > 50,
        }"
        class="text-xl sm:text-2xl font-bold"
      >
        {{ vape.batteryLevel }}%
      </span>
      <span class="text-xs sm:text-sm text-gray-400">Batterie</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ vape: Object });
</script>
