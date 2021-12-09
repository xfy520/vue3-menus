import { createVNode, render, nextTick } from 'vue'
import Vue3Menus from './Vue3Menus.tsx'

function mouseEvent(menus, args, event) {
  let props = {}
  if (Array.isArray(menus)) {
    props = {
      menus,
      event,
      args,
      open: false,
    }
  } else {
    props = {
      ...menus,
      args,
      event,
      open: false
    }
  }
  const vNode = createVNode(Vue3Menus, props)
  const container = globalThis.document.createElement('div')
  render(vNode, container)
  vNode.component.props.open = true
  vNode.component.proxy.closeAll = () => {
    nextTick(() => {
      render(null, container)
    })
  }
  if (props.prevent == undefined || props.prevent) {
    event.preventDefault();
  }
}

const directive = {
  mounted(el, { value, arg }) {
    const vnode = el.__vnode || {}
    if (arg === undefined || arg === 'right') {
      el.addEventListener("contextmenu", mouseEvent.bind(el, value, vnode.props || {}));
    } else if (arg === 'left') {
      el.addEventListener("click", mouseEvent.bind(el, value, vnode.props || {}));
    } else if (arg === 'all') {
      el.addEventListener("contextmenu", mouseEvent.bind(el, value, vnode.props || {}));
      el.addEventListener("click", mouseEvent.bind(el, value, vnode.props || {}));
    }
  },
  unmounted(el) {
    el.removeEventListener("contextmenu", mouseEvent);
    el.removeEventListener("click", mouseEvent);
  }
}

const install = function (app, options = {}) {
  app.component(options.name || Vue3Menus.name, Vue3Menus)
  app.directive('menus', directive)
  app.config.globalProperties.$menusEvent = (event, menus, args) => mouseEvent(menus, args || {}, event)
}

const menusEvent = (event, menus, args) => mouseEvent(menus, args || {}, event);

export default function (app) {
  app.use(install)
}

export {
  directive, Vue3Menus, menusEvent
}
