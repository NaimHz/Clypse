<template>
  <button @click="goBack" class="text-brand hover:underline mb-2">
    ← {{ label || "Retour" }}
  </button>
</template>
<script setup>
import { useRouter } from "vue-router";
const props = defineProps({
  to: { type: String, default: null },
  label: { type: String, default: "" },
});
const router = useRouter();
const goBack = () => {
  if (props.to) router.push(props.to);
  else router.back();
};
</script>
