import { createApp } from 'vue';
import Menus from './Menus.vue';

let lastInstance = null;

function mouseEvent() {
  if (lastInstance) {
    lastInstance.close();
    lastInstance = null;
  }
  globalThis.document.removeEventListener("click", mouseEvent);
  globalThis.document.removeEventListener("contextmenu", mouseEvent);
  globalThis.document.removeEventListener("wheel", mouseEvent);
}

function $menusEvent(menus, event) {
  const temp = menus || {};
  if (lastInstance) {
    lastInstance.close();
    lastInstance = null;
    globalThis.document.removeEventListener("click", mouseEvent);
    globalThis.document.removeEventListener("contextmenu", mouseEvent);
    globalThis.document.removeEventListener("wheel", mouseEvent);
  }
  let instance = createApp(Menus, {
    event,
    ...temp
  });
  lastInstance = instance.mount(globalThis.document.createElement("div"));
  lastInstance.$unmount = instance.unmount;
  if (temp.prevent == undefined || temp.prevent) {
    event.preventDefault();
  }
  setTimeout(() => {
    globalThis.document.addEventListener("click", mouseEvent);
    globalThis.document.addEventListener("contextmenu", mouseEvent);
    globalThis.document.addEventListener("wheel", mouseEvent);
  }, 0);
  return lastInstance;
}

export default $menusEvent;
