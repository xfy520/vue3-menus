import Vue3Menus from './components/Vue3Menus.vue';

import menusEvent from './event';

Vue3Menus.install = (app, options = {}) => {
  app.component(options.name || Vue3Menus.name, Vue3Menus);
};

const directive = {
  mounted(el, { value, arg, instance }) {
    if (arg == undefined || arg == 'right') {
      el.addEventListener("contextmenu", menusEvent.bind(instance, value));
    } else if (arg == 'left') {
      el.addEventListener("click", menusEvent.bind(instance, value));
    }
  },
  unmounted(el, { arg }) {
    if (arg == undefined || arg == 'right') {
      el.removeEventListener("contextmenu", menusEvent);
    } else if (arg == 'left') {
      el.removeEventListener("click", menusEvent);
    }
  }
}

const install = function (app, options = {}) {
  app.component(options.name || Vue3Menus.name, Vue3Menus);
  app.directive('menus', directive);
  app.config.globalProperties.$menusEvent = (event, value) => menusEvent(value, event);
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const $menusEvent = menusEvent;

export default install;

export {
  Vue3Menus,
  directive,
  $menusEvent
}
