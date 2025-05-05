import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../views/SignIn.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", name: "SignIn", component: SignIn },
  { path: "/register", name: "Register", component: Register },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    // beforeEnter: (to, from, next) => {
    //   const authStore = useAuthStore();
    //   if (authStore.isAuthenticated) {
    //     next();
    //   } else {
    //     next("/");
    //   }
    // },
  },
  // Redirection de l'ancien chemin /login vers /
  { path: "/login", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
