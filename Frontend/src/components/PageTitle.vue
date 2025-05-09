<template>
  <component
    :is="tag"
    :class="[
      'font-bold mb-8 title-gradient',
      {
        'text-3xl': size === 'large',
        'text-xl': size === 'medium',
        'text-lg': size === 'small',
        'text-center w-full': centered
      }
    ]"
  >
    <slot></slot>
  </component>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    default: 'h2',
    validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['large', 'medium', 'small'].includes(value)
  },
  centered: {
    type: Boolean,
    default: false
  }
});
</script>
