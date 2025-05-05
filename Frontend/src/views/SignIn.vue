<template>
  <main class="flex flex-col justify-center items-center">
    <div class="w-full max-w-md px-6 py-8">
      <h1 class="font-roboto text-3xl text-center mb-4">Connexion</h1>
      <div>
        <p class="text-lg mb-4 text-center">
          Veuillez vous connecter pour continuer.
        </p>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block mb-2 font-medium">Email</label>
            <input type="email" v-model="email" required class="" />
          </div>

          <div class="mb-10">
            <label class="block mb-2 font-medium">Mot de passe</label>
            <input type="password" v-model="password" required class="" />
          </div>

          <div v-if="authStore.error" class="text-red-500 text-sm">
            {{ authStore.error }}
          </div>

          <button type="submit" class="w-full btn">Se connecter</button>
        </form>

        <p class="text-lg mt-6 text-center opacity-85">
          Pas encore de compte ?
          <router-link to="/register" class="text-brand hover:underline"
            >S'inscrire</router-link
          >
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    router.push("/dashboard");
  }
};

onMounted(() => {
  authStore.checkAuth();
});
</script>
