<template>
  <div class="auth-container">
    <h1>Inscription</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" v-model="password" required>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit">S'inscrire</button>
    </form>
    <p>Déjà inscrit ? <router-link to="/login">Se connecter</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await fetch('http://localhost:3000/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            name: this.email.split('@')[0] // Utilisation de la partie avant @ comme nom par défaut
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Échec de l'inscription");
        }

        // Stockage des tokens
        localStorage.setItem('accessToken', data.tokens.access.token);
        localStorage.setItem('refreshToken', data.tokens.refresh.token);

        this.$router.push('/');
      } catch (err) {
        console.error("Erreur d'inscription:", err);
        this.error = err.message;
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
.error {
  color: red;
  margin-bottom: 10px;
}
</style>
