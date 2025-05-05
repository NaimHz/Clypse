<script setup>
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/");
};
</script>

<template>
  <nav>
    <router-link to="/dashboard">Dashboard</router-link> |
    <template v-if="!isAuthenticated">
      <router-link to="/">Connexion</router-link> |
      <router-link to="/register">Inscription</router-link>
    </template>
    <template v-else>
      <a href="#" @click.prevent="handleLogout">Déconnexion</a>
    </template>
  </nav>
</template>
