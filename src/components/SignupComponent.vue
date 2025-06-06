<template>
  <div class="signup-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="signupHandler" class="signup-form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
    <p>Already have an account? <router-link to="/login">Log In</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signupWithEmail } from "../config/firebase";

export default {
  name: "SignupComponent",
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const success = ref("");
    const router = useRouter();

    const signupHandler = async () => {
      error.value = "";
      success.value = "";
      try {
        await signupWithEmail(email.value, password.value);
        success.value = "Account created! Redirecting...";
        router.push("/");
      } catch (err) {
        error.value = err.message;
      }
    };

    return { email, password, error, success, signupHandler };
  },
};
</script>

<style scoped>
.signup-container {
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

.signup-form {
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

button {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  background: #2c3e50;
  color: #fff;
}

.error {
  color: red;
  margin-top: 0.5rem;
}

.success {
  color: green;
  margin-top: 0.5rem;
}
</style>