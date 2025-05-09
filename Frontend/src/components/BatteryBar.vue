<template>
  <div class="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
    <div
      class="h-full transition-all duration-500"
      :class="{
        'bg-red-500': level <= 20,
        'bg-yellow-500': level > 20 && level <= 50,
        'bg-green-500': level > 50,
      }"
      :style="{ width: `${level || 0}%` }"
    ></div>
  </div>
</template>
<script setup>
const props = defineProps({
  level: { type: Number, required: true },
});
</script>
