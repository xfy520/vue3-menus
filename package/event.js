import { createApp } from 'vue';
import Menus from './components/Menus.vue';

let lastInstance = null;

function mouseEvent() {
  if (lastInstance) {
    lastInstance.close();
    lastInstance = null;
  }
  document.removeEventListener("click", mouseEvent);
  document.removeEventListener("contextmenu", mouseEvent);
  document.removeEventListener("wheel", mouseEvent);
}

function $menusEvent(menus, event) {
  const temp = menus || {};
  if (lastInstance) {
    lastInstance.close();
    lastInstance = null;
    document.removeEventListener("click", mouseEvent);
    document.removeEventListener("contextmenu", mouseEvent);
    document.removeEventListener("wheel", mouseEvent);
  }

  let instance = createApp(Menus, {
    menus: temp.menus || [],
    menusStyle: temp.menusStyle || {},
    event,
    minWidth: temp.minWidth,
    maxWidth: temp.maxWidth,
    zIndex: temp.zIndex || 2
  });
  lastInstance = instance.mount(document.createElement("div"));
  lastInstance.$unmount = instance.unmount;
  if (temp.prevent == undefined || temp.prevent) {
    event.preventDefault();
  }
  setTimeout(() => {
    document.addEventListener("click", mouseEvent);
    document.addEventListener("contextmenu", mouseEvent);
    document.addEventListener("wheel", mouseEvent);
  }, 0);
  return lastInstance;
}

export default $menusEvent;
