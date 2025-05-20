<script setup>
import { useAuthStore } from "./stores/auth";
import { onMounted, onUnmounted, computed } from "vue";
import "./css/tailwind.css";
import Header from './components/Header.vue';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

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
  <div class="min-h-screen bg-default text-white">
    <div :class="{ 'pb-20': isAuthenticated }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <Header v-if="isAuthenticated" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
