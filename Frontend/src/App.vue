<script setup>
import { useAuthStore } from "./stores/auth";
import { onMounted, onUnmounted } from "vue";
import Navbar from "./components/Navbar.vue";
import "./css/tailwind.css";

const authStore = useAuthStore();

const checkAuth = () => {
  authStore.checkAuth();
};

onMounted(() => {
  checkAuth();
  window.addEventListener("storage", checkAuth);
});

onUnmounted(() => {
  window.removeEventListener("storage", checkAuth);
});
</script>

<template>
  <Navbar />
  <router-view />
</template>

<style></style>
