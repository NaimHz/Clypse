<template>
  <div class="bg-white/15 p-4 sm:p-6 md:p-8 rounded-default">
    <VapeInfo :vape="vape" />
    <BatteryBar :level="vape.batteryLevel" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import VapeInfo from './VapeInfo.vue';
import BatteryBar from '../BatteryBar.vue';

defineProps({
  vape: {
    type: Object,
    required: true
  }
});
</script>
