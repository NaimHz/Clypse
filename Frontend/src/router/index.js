import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: to => {
        const authStore = useAuthStore();
        return authStore.isAuthenticated ? '/dashboard' : '/signin';
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/SignIn.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/Onboarding.vue'),
      meta: { requiresAuth: true, requiresOnboarding: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true, requiresOnboarding: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { requiresAuth: true, requiresOnboarding: true }
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/Stats.vue'),
      meta: { requiresAuth: true, requiresOnboarding: true }
    },
    {
      path: '/vape/:vapeId',
      name: 'vape-details',
      component: () => import('../views/VapeDetails.vue'),
      meta: { requiresAuth: true, requiresOnboarding: true }
    },
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresOnboarding = to.matched.some(record => record.meta.requiresOnboarding);

  // Si l'utilisateur n'est pas connecté et que la route nécessite une authentification
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/signin');
    return;
  }

  // Si l'utilisateur est connecté mais n'a pas complété l'onboarding
  if (requiresOnboarding && !authStore.hasCompletedOnboarding) {
    next('/onboarding');
    return;
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages de connexion/inscription
  if (!requiresAuth && authStore.isAuthenticated && (to.name === 'signin' || to.name === 'register')) {
    next('/dashboard');
    return;
  }

  // Si l'utilisateur a déjà complété l'onboarding et essaie d'y accéder
  if (to.name === 'onboarding' && authStore.hasCompletedOnboarding) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
