<template>
  <div class="relative w-full">
    <div class="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
      <div
        class="absolute top-0 left-0 h-full transition-all duration-500 ease-in-out"
        :class="{
          'bg-red-500': level <= 20,
          'bg-yellow-500': level > 20 && level <= 50,
          'bg-green-500': level > 50,
        }"
        :style="{ width: `${level || 0}%` }"
      ></div>
    </div>
    <div class="absolute -top-5 right-0 text-xs text-gray-400">
      {{ level }}%
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  level: { type: Number, required: true },
});
</script>

<style scoped>
.bg-red-500 {
  background-color: rgb(239, 68, 68);
}
.bg-yellow-500 {
  background-color: rgb(234, 179, 8);
}
.bg-green-500 {
  background-color: rgb(34, 197, 94);
}
</style>
