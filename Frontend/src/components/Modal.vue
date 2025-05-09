<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div
      class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-full w-[95vw] sm:w-[400px] md:w-[600px] p-0 relative overflow-hidden"
    >
      <div class="flex flex-col">
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-500/10 to-blue-400/10"
        >
          <slot name="header">
            <span class="text-lg font-bold text-gray-800 dark:text-white"
              >Détail</span
            >
          </slot>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-blue-500 dark:hover:text-white text-2xl font-bold ml-2"
          >
            &times;
          </button>
        </div>
        <div class="px-4 py-6 sm:px-8 bg-white dark:bg-gray-900">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean });
defineEmits(["close"]);
</script>
