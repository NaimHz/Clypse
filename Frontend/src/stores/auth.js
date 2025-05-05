import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const error = ref("");

  const checkAuth = () => {
    isAuthenticated.value = !!localStorage.getItem("accessToken");
  };

  const login = async (email, password) => {
    error.value = "";
    try {
      const response = await fetch("http://localhost:3000/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de connexion");
      }

      localStorage.setItem("accessToken", data.tokens.access.token);
      localStorage.setItem("refreshToken", data.tokens.refresh.token);

      checkAuth();
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      isAuthenticated.value = false;
    }
  };

  const register = async (name, email, password) => {
    error.value = "";
    try {
      const response = await fetch("http://localhost:3000/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de l'inscription");
      }

      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    }
  };

  return {
    isAuthenticated,
    error,
    checkAuth,
    login,
    logout,
    register,
  };
});
