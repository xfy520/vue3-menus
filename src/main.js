import { createApp } from 'vue';

import Menus from './../lib/vue3-menus.umd.min';
import App from './App.vue';

import './../lib/vue3-menus.css'

const app = createApp(App);

app.use(Menus);

app.mount(document.body);
