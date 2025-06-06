import { createApp } from 'vue'
import App from './App.vue'
import router from './routing' // <-- Import your router

createApp(App).use(router).mount('#app') // <-- Use the router
