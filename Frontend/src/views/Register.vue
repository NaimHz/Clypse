<template>
  <main class="flex flex-col justify-center items-center">
    <div class="w-full max-w-md px-6 py-8">
      <PageTitle tag="h2" size="medium" centered>Inscription</PageTitle>
      <div>
        <p class="text-lg mb-4 text-center">
          Créez un nouveau compte pour continuer.
        </p>
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block mb-2 font-medium">Nom</label>
            <input type="text" v-model="name" required class="" />
          </div>

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

          <button type="submit" class="w-full btn">S'inscrire</button>
        </form>

        <p class="text-lg mt-6 text-center opacity-85">
          Déjà inscrit ?
          <router-link to="/" class="text-brand hover:underline"
            >Se connecter</router-link
          >
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import PageTitle from "../components/PageTitle.vue";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  const success = await authStore.register(
    name.value,
    email.value,
    password.value
  );
  if (success) {
    // Après inscription réussie, connecter l'utilisateur
    const loginSuccess = await authStore.login(email.value, password.value);
    if (loginSuccess) {
      router.push("/dashboard");
    }
  }
};
</script>
