import { defineStore } from "pinia";
import { ref } from "vue";
import { API_BASE_URL, getAuthHeader } from "../config/api";

export const useConsumptionStore = defineStore("consumption", () => {
  const consumptions = ref([]);
  const loading = ref(false);
  const error = ref("");

  const fetchConsumptions = async () => {
    loading.value = true;
    error.value = "";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Utilisateur non connecté");
      const response = await fetch(`${API_BASE_URL}/consumption`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la récupération de la consommation"
        );
      }
      const data = await response.json();
      console.log("Fetched consumptions:", data);
      consumptions.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching consumptions:", err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchConsumptionByVapeId = async (vapeId) => {
    loading.value = true;
    error.value = "";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Utilisateur non connecté");
      const response = await fetch(`${API_BASE_URL}/consumption/vape/${vapeId}`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la récupération de la consommation"
        );
      }
      const data = await response.json();
      console.log("Fetched consumption by vapeId:", data);
      return data;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching consumption by vapeId:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const transformToDailyData = (stats) => {
    if (!stats || !stats.sessions || !Array.isArray(stats.sessions)) {
      return { ...stats, daily: [] };
    }

    const dailyData = {};

    stats.sessions.forEach(session => {
      try {
        if (!session.startTime) return;

        const date = new Date(session.startTime);
        if (isNaN(date.getTime())) return;

        const formattedDate = date.toISOString().split('T')[0];

        if (!dailyData[formattedDate]) {
          dailyData[formattedDate] = {
            date: formattedDate,
            puffs: 0
          };
        }
        dailyData[formattedDate].puffs += session.puffCount || 0;
      } catch (error) {
        console.error('Erreur lors du traitement de la session:', error);
      }
    });

    const daily = Object.values(dailyData).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    return {
      ...stats,
      daily
    };
  };

  const fetchDailyStats = async (vapeId, date = new Date()) => {
    loading.value = true;
    error.value = "";
    try {
      if (!vapeId) {
        console.warn("fetchDailyStats appelé avec un ID undefined ou null");
        return null;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Utilisateur non connecté");
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/consumption/vape/${vapeId}/stats/daily?date=${formattedDate}`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la récupération des statistiques"
        );
      }
      const data = await response.json();
      console.log("Fetched daily stats:", data);
      return transformToDailyData(data);
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching daily stats:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createPuff = async (vapeId) => {
    loading.value = true;
    error.value = "";
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Utilisateur non connecté");
      const response = await fetch(
        `${API_BASE_URL}/consumption/vape/${vapeId}/puff`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la création de la consommation"
        );
      }
      const session = await response.json();
      console.log("Created puff session:", session);

      // Rafraîchir les données après création
      if (vapeId) {
        const [sessions, stats] = await Promise.all([
          fetchConsumptionByVapeId(vapeId),
          fetchDailyStats(vapeId),
        ]);
        return { sessions, stats };
      } else {
        return await fetchConsumptions();
      }
    } catch (err) {
      error.value = err.message;
      console.error("Error creating puff:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    consumptions,
    loading,
    error,
    fetchConsumptions,
    fetchConsumptionByVapeId,
    fetchDailyStats,
    createPuff,
  };
});
