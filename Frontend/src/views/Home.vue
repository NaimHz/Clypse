<template>
  <div class="home">
    <h1>Bienvenue sur l'application</h1>
    <div v-if="isAuthenticated">
      <p>Vous êtes connecté!</p>
      <button @click="logout">Déconnexion</button>
    </div>
    <div v-else>
      <p>Veuillez vous <router-link to="/login">connecter</router-link> pour accéder à l'application</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false
    }
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = !!localStorage.getItem('token');
    },
    async logout() {
      try {
        await fetch('http://localhost:3000/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem('refreshToken')
          })
        });
      } catch (err) {
        console.error("Erreur lors de la déconnexion:", err);
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.isAuthenticated = false;
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
</style>
