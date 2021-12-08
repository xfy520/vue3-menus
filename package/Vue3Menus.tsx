import {
  defineComponent, Teleport, Transition, computed, createVNode,
  ref, watch, nextTick, PropType, render, getCurrentInstance
} from 'vue'
import { menusItemType } from '../index'
import './style.css'

type ctxType = {
  $attrs: {
    [key: string]: unknown
  }
  style: {
    [key: string]: unknown
  }
  $slots: {
    [key: string]: any
  }
  activeIndex: number
  itemClass: string | null
  hasIcon: boolean
  show: boolean
  menus: Array<menusItemType>
  mouseEnter: (event: MouseEvent, menu: menusItemType, index: number) => void
  mouseClick: (event: MouseEvent, menu: menusItemType) => void
}

const props = {
  menus: {
    type: Array as PropType<Array<menusItemType>>,
    required: true
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
  click: {
    type: Function
  },
  enter: {
    type: Function
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
  emits: ['on-click', 'on-enter'],
  setup(props, { slots, emit, attrs }) {
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
        if (menu.icon !== undefined) {
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
      emit('on-enter', menu, props.args)
      event.preventDefault();
      activeIndex.value = index
      if (!menu || menu.disabled || menu.hidden) {
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
      let enter = props.enter && typeof props.enter === 'function' ? props.enter : null
      enter = menu.enter && typeof menu.enter === 'function' ? menu.enter : enter
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
      const container = document.createElement('div')
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
      emit('on-click', menu, props.args)
      event.preventDefault();
      if (!menu || menu.disabled) {
        event.stopPropagation();
        return;
      }
      let click = props.click && typeof props.click === 'function' ? props.click : null
      click = menu.click && typeof menu.click === 'function' ? menu.click : click
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
    const { default: $default, label, icon, suffix } = slots
    const $class = ['v3-menus', attrs.class]
    return () => (
      <Teleport to='body'>
        <Transition name='menus-fade'>
          {
            !show.value ? null :
              <div ref={menusRef} class={$class} style={style.value} onWheel={(e) => e.preventDefault()} onContextmenu={(e) => e.preventDefault()}>
                <div class='v3-menus-body'>
                  {
                    props.menus.map((menu, index) => {
                      if (menu.hidden) {
                        return null
                      }
                      if ($default) {
                        return (
                          <div onContextmenu={($event) => mouseClick($event, menu)}
                            onClick={($event) => mouseClick($event, menu)} onMouseenter={($event) => mouseEnter($event, menu, index)}>{$default({ menu, activeIndex, index })}</div>
                        )
                      } else {
                        let $class = [props.itemClass, 'v3-menus-item', menu.disabled ? 'v3-menus-disabled' : 'v3-menus-available']
                        $class = $class.concat([menu.divided ? 'v3-menus-divided' : null, (!menu.disabled && activeIndex.value === index) ? 'v3-menus-active' : null])
                        return (
                          <div style={menu.style} class={$class.join(' ')} onClick={($event) => mouseClick($event, menu)}
                            onMouseenter={($event) => mouseEnter($event, menu, index)} onContextmenu={($event) => mouseClick($event, menu)}
                          >
                            {hasIcon ? <div class='v3-menus-icon '>{icon ? icon({ menu, activeIndex, index }) : <span v-html={menu.icon}></span>}</div> : null}
                            {label ? <span class='v3-menus-label'>{label({ menu, activeIndex, index })}</span> : <span class='v3-menus-label'>{menu.label}</span>}
                            {
                              menu.children || menu.tip ?
                                <div class='v3-menus-suffix'>
                                  {suffix ? suffix({ menu, activeIndex, index }) : menu.children ? '▶' : menu.tip ? <span class='v3-menus-tip'>{menu.tip}</span> : null}
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
