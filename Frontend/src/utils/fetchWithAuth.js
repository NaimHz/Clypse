import { useAuthStore } from "../stores/auth";
import router from "../router";

export async function fetchWithAuth(url, options = {}) {
  const authStore = useAuthStore();
  const response = await fetch(url, options);
  if (response.status === 401) {
    await authStore.logout();
    router.push("/signin");
    throw new Error("Session expirée, veuillez vous reconnecter.");
  }
  return response;
}


