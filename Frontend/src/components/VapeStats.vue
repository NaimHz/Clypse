<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="space-y-2">
      <p class="text-sm text-gray-400">Variation aujourd'hui</p>
      <div class="flex items-center gap-2">
        <span
          :class="{
            'text-green-500': stats?.puffVariation > 0,
            'text-red-500': stats?.puffVariation < 0,
            'text-gray-50': stats?.puffVariation === 0,
          }"
          class="text-2xl font-bold"
        >
          {{ (stats?.puffVariation || 0) > 0 ? "+" : "" }}
          {{ stats?.puffVariation || 0 }}%
        </span>
        <span class="text-sm text-gray-400">
          {{
            stats?.puffVariation > 0
              ? "en augmentation"
              : stats?.puffVariation < 0
              ? "en diminution"
              : "stable"
          }}
        </span>
      </div>
    </div>
    <div class="space-y-2">
      <p class="text-sm text-gray-400">Bouffées aujourd'hui</p>
      <p class="text-2xl font-bold">{{ stats?.totalPuffs || 0 }}</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ stats: { type: Object, required: true } });
</script>
