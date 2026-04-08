import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './assets/style.css';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronRight,
  faCalendarDays,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router';

library.add(faChevronRight, faCalendarDays, faHouse);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {});

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
