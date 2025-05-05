import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";

export const useVapeStore = defineStore("vape", () => {
  const vapes = ref([]);
  const loading = ref(false);
  const error = ref("");

  // URL de l'API backend
  const apiBaseUrl = "http://localhost:3000/v1";
  const authStore = useAuthStore();

  const getUserVapes = async () => {
    loading.value = true;
    error.value = "";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Utilisateur non connecté");
      }

      const response = await fetch(`${apiBaseUrl}/vape/user/vapes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la récupération des vapes"
        );
      }

      vapes.value = await response.json();
      return vapes.value;
    } catch (err) {
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  const linkVape = async (code) => {
    loading.value = true;
    error.value = "";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Utilisateur non connecté");
      }

      const response = await fetch(`${apiBaseUrl}/vape/user/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la liaison de la vape");
      }

      // Mettre à jour la liste des vapes
      await getUserVapes();
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const unlinkVape = async (vapeId) => {
    loading.value = true;
    error.value = "";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Utilisateur non connecté");
      }

      const response = await fetch(`${apiBaseUrl}/vape/user/${vapeId}/unlink`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors du détachement de la vape"
        );
      }

      // Mettre à jour la liste des vapes
      await getUserVapes();
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    vapes,
    loading,
    error,
    getUserVapes,
    linkVape,
    unlinkVape,
  };
});
