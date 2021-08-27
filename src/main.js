import { createApp } from 'vue';

import Menus from 'vue3-menus';
import App from './App.vue';


const app = createApp(App);
app.use(Menus);

app.mount(document.body);
