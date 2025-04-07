<script>
export default {
  data() {
    return {
      isAuthenticated: false
    }
  },
  mounted() {
    this.checkAuth();
    window.addEventListener('storage', this.checkAuth);
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = !!localStorage.getItem('accessToken');
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
        this.$router.push('/login');
      }
    }
  },
  unmounted() {
    window.removeEventListener('storage', this.checkAuth);
  }
}
</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">Accueil</router-link> |
      <template v-if="!isAuthenticated">
        <router-link to="/login">Connexion</router-link> |
        <router-link to="/register">Inscription</router-link>
      </template>
      <template v-else>
        <a href="#" @click.prevent="logout">Déconnexion</a>
      </template>
    </nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
