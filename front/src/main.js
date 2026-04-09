import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/style.css';

import App from './App.vue';
import router from './router';

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(VCalendar, {});
app.use(pinia);
app.use(router);

const authStore = useAuthStore(pinia);
authStore.restoreSession();

app.mount('#app');
