import {
  defineComponent, Teleport, Transition, computed, createVNode,
  ref, watch, nextTick, PropType, render, getCurrentInstance
} from 'vue'
import { menusItemType } from '../index'
import './style.css'

const props = {
  menus: {
    type: Array as PropType<Array<menusItemType>>,
    required: true
  },
  menusClass: {
    type: String,
    default: null
  },
  itemClass: {
    type: String,
    default: null
  },
  event: {
    type: Object as PropType<MouseEvent & {
      width: number,
      height: number
    }>,
    required: true
  },
  minWidth: {
    type: [Number, String],
    default: 'none'
  },
  maxWidth: {
    type: [Number, String],
    default: 'none'
  },
  zIndex: {
    type: Number,
    default: 3
  },
  direction: {
    type: String,
    default: 'right'
  },
  open: {
    type: Boolean,
    default: false
  },
  args: {
    type: [Object, Function, Array, Boolean, String],
    default: {}
  }
}

const vue3MenusComponent = defineComponent({
  name: 'vue3-menus',
  inheritAttrs: false,
  props,
  setup(props, { slots, attrs }) {
    const windowWidth = globalThis.document.documentElement.clientWidth
    const windowHeight = globalThis.document.documentElement.clientHeight
    const { proxy } = getCurrentInstance()
    const show = ref(props.open)
    const self: any = {}
    const menusRef = ref(null)
    const activeIndex = ref(-1)
    const left = ref(0)
    const top = ref(0)
    let direction = props.direction
    const hasIcon = computed(() => {
      for (let index = 0; index < props.menus.length; index++) {
        const menu = props.menus[index]
        const icon = getStrVal(menu, 'icon')
        if (icon !== undefined) {
          return true
        }
      }
    })
    const position = computed(() => {
      return {
        x: props.event.clientX,
        y: props.event.clientY,
        width: props.event.width || 0,
        height: props.event.height || 0
      }
    })
    const style = computed(() => {
      return {
        left: `${left.value}px`,
        top: `${top.value}px`,
        minWidth: `${props.minWidth}px`,
        maxWidth: props.maxWidth == 'none' ? props.maxWidth : `${props.maxWidth}px`,
        zIndex: props.zIndex,
      }
    })
    function leftOpen(menusWidth: number) {
      left.value = position.value.x - menusWidth
      direction = 'left'
      if (left.value < 0) {
        direction = 'right'
        if (position.value.width === 0 || position.value.width === undefined) {
          left.value = 0
        } else {
          left.value = position.value.x + position.value.width
        }
      }
    }
    function rightOpen(windowWidth: number, menusWidth: number) {
      left.value = position.value.x + position.value.width
      direction = 'right'
      if (left.value + menusWidth > windowWidth) {
        direction = 'left'
        if (position.value.width === 0 || position.value.width === undefined) {
          left.value = windowWidth - menusWidth
        } else {
          left.value = position.value.x - menusWidth
        }
      }
    }
    function closeEvent() {
      activeIndex.value = -1
      show.value = false
      if (self && self.instance) {
        self.instance.close.bind(self.instance)()
        self.instance = null
        self.index = null
        // @ts-ignore
        if (proxy.closeAll) {
          // @ts-ignore
          proxy.closeAll()
        }
      }
    }
    watch(() => props.open, (newVal) => show.value = newVal)
    watch(show, (newVal) => {
      if (newVal) {
        nextTick(() => {
          const menusWidth = menusRef.value.offsetWidth
          const menusHeight = menusRef.value.offsetHeight
          if (direction === 'left') {
            leftOpen(menusWidth)
          } else {
            rightOpen(windowWidth, menusWidth)
          }
          top.value = position.value.y
          if (position.value.y + menusHeight > windowHeight) {
            if (position.value.height === 0 || position.value.height === undefined) {
              top.value = position.value.y - menusHeight
            } else {
              top.value = windowHeight - menusHeight
            }
          }
          setTimeout(() => {
            globalThis.document.addEventListener('click', closeEvent);
            globalThis.document.addEventListener('contextmenu', closeEvent);
            globalThis.document.addEventListener('wheel', closeEvent);
          }, 0);
        })
      } else {
        activeIndex.value = -1
        globalThis.document.removeEventListener('click', closeEvent);
        globalThis.document.removeEventListener('contextmenu', closeEvent);
        globalThis.document.removeEventListener('wheel', closeEvent);
      }
    }, {
      immediate: true
    })

    function mouseEnter(event: any, menu: menusItemType, index: number) {
      event.preventDefault();
      activeIndex.value = index
      if (!menu || getBoolVal(menu, 'disabled') || getBoolVal(menu, 'hidden')) {
        return;
      }
      if (self.instance) {
        if (self.index === index) {
          return;
        }
        self.instance.close.bind(self.instance)();
        self.instance = null;
        self.index = null;
      }
      if (!menu.children) {
        return;
      }
      const enter = menu.enter && typeof menu.enter === 'function' ? menu.enter : null
      if (enter) {
        const val = enter(menu, props.args);
        if (val === false || val === null) {
          return;
        }
      }
      const menuItemClientRect = event.target.getBoundingClientRect();
      const vm = createVNode(
        vue3MenusComponent,
        {
          ...props,
          menus: menu.children,
          direction: direction,
          event: {
            clientX: menuItemClientRect.x + 3,
            clientY: menuItemClientRect.y - 8,
            width: menuItemClientRect.width - 2 * 3,
            height: menuItemClientRect.width
          },
          open: false,
        },
        slots
      )
      const container = globalThis.document.createElement('div')
      render(vm, container)
      vm.component.props.open = true
      // @ts-ignore
      vm.component.proxy.close = close
      self.instance = vm.component.proxy
      self.instance.container = container
      self.instance.props = vm.component.props
      self.index = index;
    }
    function mouseClick(event: any, menu: menusItemType) {
      event.preventDefault();
      if (!menu || getBoolVal(menu, 'disabled')) {
        event.stopPropagation();
        return;
      }
      const click = menu.click && typeof menu.click === 'function' ? menu.click : null
      if (click) {
        const val = click(menu, props.args);
        if (val === false || val === null) {
          event.stopPropagation();
        }
      }
      if (menu.children) {
        event.stopPropagation();
      }
    }
    function close() {
      this.show = false
      if (this.self && this.self.instance) {
        this.self.instance.close();
      }
      nextTick(() => {
        render(null, this.container)
      })
    }
    function getBoolVal(menuItem: menusItemType, prop: 'disabled'|'divided'|'hidden'): boolean {
        const val = menuItem[prop]
        if(!val) {
            return false
        }
        if(typeof val === 'function') {
            return val(menuItem.key)
        }
        return val
    }
    function getStrVal(menuItem: menusItemType, prop: 'label'|'tip'): string {
        const val = menuItem[prop]
        if(!val) {
            return 
        }
        if(typeof val === 'function') {
            return val(menuItem.key)
        }
        return val
    }

    function getIcon(menuItem: menusItemType): string|unknown {
        const val = menuItem.icon
        if(!val) {
            return 
        }
        if(typeof val === 'function') {
            return val(menuItem.key)
        }
        return val
    }

    const { default: $default, label, icon, suffix } = slots
    const $class = ['v3-menus', attrs.class, props.menusClass]
    return () => (
      <Teleport to='body'>
        <Transition name='menus-fade'>
          {
            !show.value ? null :
              <div ref={menusRef} class={$class} style={style.value} onWheel={(e) => e.preventDefault()} onContextmenu={(e) => e.preventDefault()}>
                <div class='v3-menus-body'>
                  {
                    props.menus.map((menu, index) => {
                      if (getBoolVal(menu, 'hidden')) {
                        return null
                      }
                      if ($default) {
                        return (
                          <div onContextmenu={($event) => mouseClick($event, menu)}
                            onClick={($event) => mouseClick($event, menu)} onMouseenter={($event) => mouseEnter($event, menu, index)}>{$default({ menu, activeIndex: activeIndex.value, index })}</div>
                        )
                      } else {
                        const disabled = getBoolVal(menu, 'disabled')
                        const divided = getBoolVal(menu, 'divided')
                        const tip = getStrVal(menu, 'tip')
                        const lab = getStrVal(menu, 'label')
                        const ico = getIcon(menu)

                        let $class = [props.itemClass, 'v3-menus-item', disabled ? 'v3-menus-disabled' : 'v3-menus-available']
                        $class = $class.concat([divided ? 'v3-menus-divided' : null, (!disabled && activeIndex.value === index) ? 'v3-menus-active' : null])
                        return (
                          <div style={menu.style} class={$class.join(' ')} onClick={($event) => mouseClick($event, menu)}
                            onMouseenter={($event) => mouseEnter($event, menu, index)} onContextmenu={($event) => mouseClick($event, menu)}
                          >
                            {hasIcon.value ? <div class='v3-menus-icon '>{icon ? icon({ menu, activeIndex: activeIndex.value, index }) : <span v-html={ico}></span>}</div> : null}
                            {label ? <span class='v3-menus-label'>{label({ menu, activeIndex: activeIndex.value, index })}</span> : <span class='v3-menus-label'>{lab}</span>}
                            {
                              menu.children || tip ?
                                <div class='v3-menus-suffix'>
                                  {suffix ? suffix({ menu, activeIndex: activeIndex.value, index }) : menu.children ? '▶' : tip ? <span class='v3-menus-tip'>{tip}</span> : null}
                                </div> : null
                            }
                          </div >
                        )
                      }
                    })
                  }
                </div>
              </div>
          }
        </Transition>
      </Teleport>
    )
  },
})

export default vue3MenusComponent
