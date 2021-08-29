import { createApp } from 'vue';

import Menus from './../package/index';
import App from './App.vue';


import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    component: () => import('./views/main.vue'),
  },
  {
    path: '/copy',
    component: () => import('./views/copy.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.use(Menus);
app.mount(document.body);
