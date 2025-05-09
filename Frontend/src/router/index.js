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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/Stats.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vape/:vapeId',
      name: 'vape-details',
      component: () => import('../views/VapeDetails.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/link',
      name: 'link',
      component: () => import('../views/Link.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/signin');
  } else if (!requiresAuth && authStore.isAuthenticated && (to.name === 'signin' || to.name === 'register')) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
