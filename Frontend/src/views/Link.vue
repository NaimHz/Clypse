<template>
  <main class="flex flex-col items-center">
    <div class="w-full max-w-md px-6 py-8">
      <h2 class="text-xl mb-4 letter-sp font-bebas tracking-wide">
        LIER UNE <span class="text-brand">CLYPS</span>
      </h2>

      <div class="bg-white/15 p-8 rounded-default">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-200 mb-2"
              >Code de votre Clyps</label
            >
            <input
              type="text"
              id="code"
              v-model="code"
              class="w-full px-4 py-2 bg-white/10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Entrez le code"
              required
            />
          </div>

          <button
            type="submit"
            class="btn w-full"
            :disabled="loading"
          >
            {{ loading ? "Liaison en cours..." : "Lier ma Clyps" }}
          </button>
        </form>
          </div>

      <div class="mt-8 text-center">
        <router-link to="/dashboard" class="text-brand hover:underline"
          >Retour au dashboard</router-link
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVapeStore } from "../stores/vape";

const router = useRouter();
const vapeStore = useVapeStore();
const code = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await vapeStore.linkVape(code.value);
    router.push("/dashboard");
  } catch (error) {
    console.error("Error linking vape:", error);
  } finally {
    loading.value = false;
  }
};
</script>
