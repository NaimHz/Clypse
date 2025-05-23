<template>
  <main class="flex flex-col items-center">
    <div class="w-full max-w-md mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-brand to-brand/80 bg-clip-text text-transparent mb-4">
          Bienvenue sur Clyps
        </h1>
        <p class="text-xl text-gray-300 max-w-lg mx-auto">
          Répondez à quelques questions pour personnaliser votre expérience
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between mb-2">
          <span class="text-sm text-gray-400">Progression</span>
          <span class="text-sm text-brand">{{ currentStep }}/{{ questions.length }}</span>
        </div>
        <div class="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-brand to-brand/80 transition-all duration-500 ease-out"
            :style="{ width: `${(currentStep / questions.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Questions Container -->
      <div class="relative min-h-[400px]">
        <TransitionGroup
          name="slide-fade"
          tag="div"
          class="relative"
        >
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            v-show="currentStep === index + 1"
            class="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/10 w-full"
            :class="{ 'opacity-0': currentStep !== index + 1 }"
          >
            <div class="space-y-6">
              <h2 class="text-2xl font-semibold text-white mb-2">{{ question.title }}</h2>
              <p class="text-gray-300 mb-6">{{ question.description }}</p>

              <div class="space-y-4">
                <button
                  v-for="option in question.options"
                  :key="option.value"
                  @click="selectOption(question.id, option.value)"
                  class="w-full p-4 text-left rounded-xl transition-all duration-300"
                  :class="[
                    answers[question.id] === option.value
                      ? 'bg-brand/20 border-brand text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10',
                    'border-2'
                  ]"
                >
                  <div class="flex items-center">
                    <div class="flex-1">
                      <div class="font-medium">{{ option.label }}</div>
                      <div class="text-sm opacity-75">{{ option.description }}</div>
                    </div>
                    <div
                      v-if="answers[question.id] === option.value"
                      class="ml-4 text-brand"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8">
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
        >
          Précédent
        </button>
        <div v-else class="w-24"></div>

        <button
          v-if="currentStep < questions.length"
          @click="nextStep"
          :disabled="!answers[questions[currentStep - 1].id]"
          class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-brand/80 text-white hover:from-brand/90 hover:to-brand/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
        <button
          v-else
          @click="handleSubmit"
          :disabled="!isFormComplete || loading"
          class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-brand/80 text-white hover:from-brand/90 hover:to-brand/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enregistrement...
          </span>
          <span v-else>Terminer</span>
        </button>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mt-6 text-red-400 text-sm text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20"
      >
        {{ error }}
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const error = ref("");
const currentStep = ref(1);
const answers = ref({});

const questions = [
  {
    id: 'dailyPuffs',
    title: 'Votre consommation quotidienne',
    description: 'Combien de bouffées prenez-vous par jour en moyenne ?',
    options: [
      {
        value: '0-10',
        label: 'Moins de 10 bouffées',
        description: 'Une consommation occasionnelle'
      },
      {
        value: '10-30',
        label: '10 à 30 bouffées',
        description: 'Une consommation modérée'
      },
      {
        value: '30-50',
        label: '30 à 50 bouffées',
        description: 'Une consommation régulière'
      },
      {
        value: '50+',
        label: 'Plus de 50 bouffées',
        description: 'Une consommation intensive'
      }
    ]
  },
  {
    id: 'vapingFrequency',
    title: 'Votre fréquence de vapotage',
    description: 'À quelle fréquence vapotez-vous ?',
    options: [
      {
        value: 'rarely',
        label: 'Rarement',
        description: 'Quelques fois par semaine'
      },
      {
        value: 'sometimes',
        label: 'Parfois',
        description: 'Quelques fois par jour'
      },
      {
        value: 'often',
        label: 'Souvent',
        description: 'Plusieurs fois par jour'
      },
      {
        value: 'very_often',
        label: 'Très souvent',
        description: 'Presque constamment'
      }
    ]
  },
  {
    id: 'vapingDuration',
    title: 'Votre expérience',
    description: 'Depuis combien de temps vapotez-vous ?',
    options: [
      {
        value: 'new',
        label: 'Débutant',
        description: 'Moins de 3 mois'
      },
      {
        value: 'few_months',
        label: 'Intermédiaire',
        description: '3 à 6 mois'
      },
      {
        value: 'several_months',
        label: 'Expérimenté',
        description: '6 mois à 1 an'
      },
      {
        value: 'long_time',
        label: 'Expert',
        description: 'Plus d\'un an'
      }
    ]
  },
  {
    id: 'vapingGoal',
    title: 'Votre objectif',
    description: 'Quel est votre objectif avec le vapotage ?',
    options: [
      {
        value: 'reduce',
        label: 'Réduire ma consommation',
        description: 'Je souhaite vapoter moins'
      },
      {
        value: 'maintain',
        label: 'Maintenir ma consommation',
        description: 'Je suis satisfait de mon niveau actuel'
      },
      {
        value: 'enjoy',
        label: 'Profiter du vapotage',
        description: 'Je veux optimiser mon expérience'
      },
      {
        value: 'quit',
        label: 'Arrêter progressivement',
        description: 'Je souhaite arrêter à terme'
      }
    ]
  }
];

const isFormComplete = computed(() => {
  return questions.every(q => answers.value[q.id]);
});

const selectOption = (questionId, value) => {
  answers.value[questionId] = value;
};

const nextStep = () => {
  if (currentStep.value < questions.length) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const calculateVapingLevel = () => {
  let score = 0;

  // Score basé sur le nombre de bouffées quotidiennes
  switch (answers.value.dailyPuffs) {
    case "0-10": score += 1; break;
    case "10-30": score += 2; break;
    case "30-50": score += 3; break;
    case "50+": score += 4; break;
  }

  // Score basé sur la fréquence
  switch (answers.value.vapingFrequency) {
    case "rarely": score += 1; break;
    case "sometimes": score += 2; break;
    case "often": score += 3; break;
    case "very_often": score += 4; break;
  }

  // Score basé sur la durée
  switch (answers.value.vapingDuration) {
    case "new": score += 1; break;
    case "few_months": score += 2; break;
    case "several_months": score += 3; break;
    case "long_time": score += 4; break;
  }

  // Ajustement basé sur l'objectif
  if (answers.value.vapingGoal === "reduce" || answers.value.vapingGoal === "quit") {
    score = Math.max(1, score - 1);
  }

  // Détermination du niveau final
  if (score <= 4) return { level: "occasional", limit: 500 };
  if (score <= 7) return { level: "moderate", limit: 1000 };
  if (score <= 10) return { level: "frequent", limit: 2000 };
  return { level: "heavy", limit: 3000 };
};

const handleSubmit = async () => {
  if (!isFormComplete.value) {
    error.value = "Veuillez répondre à toutes les questions";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const { level, limit } = calculateVapingLevel();

    await authStore.updateConsumption({
      vapingLevel: level,
      monthlyPuffLimit: limit
    });

    router.push("/dashboard");
  } catch (err) {
    error.value = "Une erreur est survenue lors de l'enregistrement de vos préférences";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
