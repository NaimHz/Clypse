<template>
  <main class="flex flex-col items-center">
    <div class="w-full max-w-md mx-auto px-4 py-8">
      <BackButton to="/dashboard" />
      <PageTitle tag="h1" size="medium" centered>Paramètres</PageTitle>

      <!-- Informations personnelles -->
      <div class="bg-white/15 p-6 rounded-default mb-6">
        <h3 class="text-base font-bold mb-4">Informations personnelles</h3>
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Nom</label>
            <input
              v-model="name"
              type="text"
              class="input w-full"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              class="input w-full"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <button type="submit" class="btn w-full" :disabled="loading">
            {{ loading ? "Mise à jour..." : "Mettre à jour" }}
          </button>
        </form>
      </div>

      <!-- Paramètres de consommation -->
      <div class="bg-white/15 p-6 rounded-default mb-6">
        <h3 class="text-base font-bold mb-4">Paramètres de consommation</h3>
        <form @submit.prevent="handleUpdateConsumption" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Niveau de vapotage</label>
            <select
              v-model="vapingLevel"
              class="input w-full"
              :class="{ 'border-red-500': errors.vapingLevel }"
              @change="handleVapingLevelChange"
            >
              <option value="occasional">Vapoteur occasionnel (500 bouffées/mois)</option>
              <option value="moderate">Vapoteur modéré (1000 bouffées/mois)</option>
              <option value="frequent">Vapoteur fréquent (2000 bouffées/mois)</option>
              <option value="heavy">Vapoteur intensif (3000 bouffées/mois)</option>
              <option value="custom">Personnalisé</option>
            </select>
            <p v-if="errors.vapingLevel" class="text-red-500 text-xs mt-1">{{ errors.vapingLevel }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Limite mensuelle de bouffées</label>
            <input
              v-model="monthlyPuffLimit"
              type="number"
              min="0"
              class="input w-full"
              :class="{ 'border-red-500': errors.monthlyPuffLimit }"
              :disabled="vapingLevel !== 'custom'"
            />
            <p v-if="errors.monthlyPuffLimit" class="text-red-500 text-xs mt-1">{{ errors.monthlyPuffLimit }}</p>
          </div>

          <button type="submit" class="btn w-full" :disabled="loading">
            {{ loading ? "Mise à jour..." : "Mettre à jour" }}
          </button>
        </form>
      </div>

      <!-- Changement de mot de passe -->
      <div class="bg-white/15 p-6 rounded-default mb-6">
        <h3 class="text-base font-bold mb-4">Changer le mot de passe</h3>
        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Mot de passe actuel</label>
            <input
              v-model="currentPassword"
              type="password"
              class="input w-full"
              :class="{ 'border-red-500': errors.currentPassword }"
            />
            <p v-if="errors.currentPassword" class="text-red-500 text-xs mt-1">{{ errors.currentPassword }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Nouveau mot de passe</label>
            <input
              v-model="newPassword"
              type="password"
              class="input w-full"
              :class="{ 'border-red-500': errors.newPassword }"
            />
            <p v-if="errors.newPassword" class="text-red-500 text-xs mt-1">{{ errors.newPassword }}</p>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Confirmer le nouveau mot de passe</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="input w-full"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <button type="submit" class="btn w-full" :disabled="loading">
            {{ loading ? "Mise à jour..." : "Mettre à jour" }}
          </button>
        </form>
      </div>

      <!-- Déconnexion -->
      <button
        @click="handleLogout"
        class="btn btn-danger w-full"
        :disabled="loading"
      >
        Se déconnecter
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import PageTitle from '../components/PageTitle.vue';
import BackButton from '../components/BackButton.vue';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const errors = ref({});

// Informations personnelles
const name = ref('');
const email = ref('');

// Paramètres de consommation
const monthlyPuffLimit = ref(1000);
const vapingLevel = ref('moderate');

const vapingLevelLimits = {
  occasional: 500,
  moderate: 1000,
  frequent: 2000,
  heavy: 3000
};

const handleVapingLevelChange = () => {
  if (vapingLevel.value !== 'custom') {
    monthlyPuffLimit.value = vapingLevelLimits[vapingLevel.value];
  }
};

// Changement de mot de passe
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

onMounted(() => {
  const user = authStore.user;
  if (user) {
    name.value = user.name;
    email.value = user.email;
    monthlyPuffLimit.value = user.monthlyPuffLimit;
    vapingLevel.value = user.vapingLevel;
  }
});

const handleUpdateProfile = async () => {
  loading.value = true;
  errors.value = {};
  try {
    // Appel API pour mettre à jour le profil
    await authStore.updateProfile({
      name: name.value,
      email: email.value,
    });
  } catch (error) {
    errors.value = error.response?.data?.errors || { general: error.message };
  } finally {
    loading.value = false;
  }
};

const handleUpdateConsumption = async () => {
  loading.value = true;
  errors.value = {};
  try {
    // Appel API pour mettre à jour les paramètres de consommation
    await authStore.updateConsumption({
      monthlyPuffLimit: monthlyPuffLimit.value,
      vapingLevel: vapingLevel.value,
    });
  } catch (error) {
    errors.value = error.response?.data?.errors || { general: error.message };
  } finally {
    loading.value = false;
  }
};

const handleChangePassword = async () => {
  loading.value = true;
  errors.value = {};
  try {
    if (newPassword.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Les mots de passe ne correspondent pas';
      return;
    }
    // Appel API pour changer le mot de passe
    await authStore.updatePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    // Réinitialiser les champs
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    errors.value = error.response?.data?.errors || { general: error.message };
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  loading.value = true;
  try {
    await authStore.logout();
    router.push('/signin');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    loading.value = false;
  }
};
</script>
