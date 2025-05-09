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
      console.log("Token présent:", !!token);
      if (!token) {
        throw new Error("Utilisateur non connecté");
      }

      console.log("Récupération des vapes avec le token:", token);
      const response = await fetch(`${apiBaseUrl}/vape/user/vapes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Réponse de l'API:", response.status);
      if (!response.ok) {
        const data = await response.json();
        console.error("Erreur API:", data);
        throw new Error(
          data.message || "Erreur lors de la récupération des vapes"
        );
      }

      const data = await response.json();
      console.log("Données reçues:", data);
      vapes.value = data;
      return vapes.value;
    } catch (err) {
      console.error("Erreur complète:", err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  const getVapeById = async (vapeId) => {
    loading.value = true;
    error.value = "";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !authStore.isAuthenticated) {
        throw new Error("Session expirée");
      }

      const response = await fetch(`${apiBaseUrl}/vape/user/vapes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des vapes");
      }

      const vapes = await response.json();

      if (!Array.isArray(vapes) || vapes.length === 0) {
        throw new Error("Vous n'avez pas de vape");
      }

      const vape = vapes.find((v) => String(v.id) === String(vapeId));
      if (!vape) {
        throw new Error("Vous n'avez pas accès à cette vape");
      }

      return vape;
    } catch (err) {
      error.value = err.message;
      throw err;
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
    getVapeById,
    linkVape,
    unlinkVape,
  };
});
