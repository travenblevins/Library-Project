import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
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

// ...existing imports...

let isAuthChecked = false;
let authResolveQueue = []; // <-- ADDED

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (!isAuthChecked) {
    // ADDED: Queue navigation until auth state is known
    authResolveQueue.push({ to, from, next });
    if (authResolveQueue.length === 1) {
      onAuthStateChanged(auth, (user) => {
        isAuthChecked = true;
        // Process all queued navigations
        authResolveQueue.forEach(({ to, next }) => {
          if (to.matched.some(record => record.meta.requiresAuth) && !user) {
            next({ name: "Login" });
          } else if ((to.name === "Login" || to.path === "/login") && user) {
            next({ name: "Library" });
          } else {
            next();
          }
        });
        authResolveQueue = [];
      });
    }
  } else {
    const user = auth.currentUser;
    if (requiresAuth && !user) {
      next({ name: "Login" });
    } else if ((to.name === "Login" || to.path === "/login") && user) { // <-- CHANGED: also check path
      next({ name: "Library" });
    } else {
      next();
    }
  }
});

export default router;