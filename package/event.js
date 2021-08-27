import { createApp } from 'vue';
import Menus from './components/Menus.vue';

let lastInstance = null;

function mouseEvent() {
  if (lastInstance) {
    lastInstance.close();
    lastInstance = null;
  }
  document.removeEventListener("click", mouseEvent);
  document.removeEventListener("wheel", mouseEvent);
}

function menusEvent(value, event) {
  const temp = value || {};
  if (lastInstance) {
    lastInstance.close();
    lastInstance = null;
    document.removeEventListener("click", mouseEvent);
    document.removeEventListener("wheel", mouseEvent);
  }

  let instance = createApp(Menus, {
    iconName: temp.iconName,
    menus: temp.menus || [],
    menusStyle: temp.menusStyle || {},
    event,
    minWidth: temp.minWidth,
    maxWidth: temp.maxWidth,
    zIndex: temp.zIndex || 2
  });
  lastInstance = instance.mount(document.createElement("div"));
  lastInstance.$unmount = instance.unmount;
  event.preventDefault();
  setTimeout(() => {
    document.addEventListener("click", mouseEvent);
    document.addEventListener("wheel", mouseEvent);
  }, 0);
}

export default menusEvent;
