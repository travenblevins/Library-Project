import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../config/firebase";
import LoginComponent from "../components/LoginComponent.vue";
import SignupComponent from "../components/SignupComponent.vue";
import LibraryComponent from "../components/LibraryComponent.vue";


// Route definitions
const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginComponent,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupComponent,
  },
  {
    path: "/",
    name: "Library",
    component: LibraryComponent,
    meta: { requiresAuth: true }, // This route requires authentication
  }
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = auth.currentUser;

  if (requiresAuth && !user) {
    next({ name: "Login" });
  } else if (to.name === "Login" && user) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;