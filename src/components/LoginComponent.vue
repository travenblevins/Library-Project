<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="loginWithEmailHandler" class="login-form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login with Email</button>
    </form>
    <button class="google-btn" @click="loginWithGoogleHandler">Login with Google</button>
    <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginWithEmail, loginWithGoogle } from "../config/firebase";

export default {
  name: 'LoginComponent',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();

    const loginWithEmailHandler = async () => {
      try {
        await loginWithEmail(email.value, password.value);
        error.value = '';
        router.push('/');
      } catch (err) {
        error.value = err.message;
      }
    };

    const loginWithGoogleHandler = async () => {
      try {
        await loginWithGoogle();
        error.value = '';
        router.push('/');
      } catch (err) {
        error.value = err.message;
      }
    };

    return { email, password, error, loginWithEmailHandler, loginWithGoogleHandler };
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button,
.google-btn {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button[type="submit"] {
  background: #2c3e50;
  color: #fff;
}

.google-btn {
  background: #4285F4;
  color: #fff;
  margin-bottom: 1rem;
}

.error {
  color: red;
  margin-top: 0.5rem;
}
</style>