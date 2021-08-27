<template>
  <Teleport to="body">
    <transition name="menus-fade">
      <div
        v-if="open"
        ref="menusRef"
        class="menus"
        :style="{ ...menusStyle, top: `${style.top}px`, left: `${style.left}px`, minWidth: style.minWidth, maxWidth: style.maxWidth, zIndex: style.zIndex }"
        @contextmenu="(e) => e.preventDefault()"
        @mousewheel.stop
      >
        <div class="menus_body">
          <template v-for="(item, index) of menus" :key="index">
            <template v-if="!item.hidden">
              <MenusItem
                :item="item"
                :index="index"
                :activeIndex="activeIndex"
                @menusEnter="menusEnter"
                :menusItemClass="menusItemClass"
                :hasIcon="hasIcon"
              >
                <template v-if="slots.default" #default="{ item }">
                  <slot :item="item"></slot>
                </template>
                <template v-if="!slots.default && slots.icon" #icon="{ item }">
                  <slot name="icon" :item="item"></slot>
                </template>
                <template v-if="!slots.default && slots.label" #label="{ item }">
                  <slot name="label" :item="item"></slot>
                </template>
                <template v-if="!slots.default && slots.suffix" #suffix="{ item }">
                  <slot name="suffix" :item="item"></slot>
                </template>
              </MenusItem>
            </template>
          </template>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import { ref, h, defineComponent, onMounted, createApp, nextTick } from "vue";
import Menus from './Menus.vue';
import MenusItem from './MenusItem.vue'

export default defineComponent({
  name: "menus",
  components: {
    MenusItem
  },
  props: {
    menus: {
      type: Array,
      default: []
    },
    menusStyle: {
      type: Object,
      default: {}
    },
    menusItemClass: {
      type: String,
      default: null
    },
    event: {
      type: Object,
      default: {}
    },
    position: {
      type: Object,
      default: {}
    },
    minWidth: {
      type: [Number, String],
      default: 150
    },
    maxWidth: {
      type: [Number, String],
      default: 'none'
    },
    zIndex: {
      type: [Number, String],
      default: 3
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  setup(props, { slots }) {
    const ctx = {};
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const _position = props.position.x && props.position.y ? ref(props.position) : ref({
      x: props.event.clientX,
      y: props.event.clientY,
      width: 0,
      height: 0
    });
    const menusRef = ref(null);
    const style = ref({
      left: 0,
      top: 0,
      minWidth: `${props.minWidth}px`,
      maxWidth: props.maxWidth == 'none' ? props.maxWidth : `${props.maxWidth}px`,
      zIndex: props.zIndex
    })
    const _direction = ref(props.direction);
    const activeIndex = ref(-1);
    const open = ref(false);
    const hasIcon = ref(false);

    function leftOpen(menusWidth) {
      style.value.left = _position.value.x - menusWidth;
      _direction.value = 'left';
      if (style.value.left < 0) {
        _direction.value = 'right';
        if (_position.value.width === 0 || _position.value.width === undefined) {
          style.value.left = 0;
        } else {
          style.value.left = _position.valuen.x + _position.value.width;
        }
      }
    }

    function rightOpen(windowWidth, menusWidth) {
      style.value.left = _position.value.x + _position.value.width;
      _direction.value = 'right';
      if (style.value.left + menusWidth > windowWidth) {
        _direction.value = 'left';
        if (_position.value.width === 0 || _position.value.width === undefined) {
          style.value.left = windowWidth - menusWidth;
        } else {
          style.value.left = _position.value.x - menusWidth;
        }
      }
    }

    onMounted(() => {
      open.value = true;
      props.menus.forEach(menu => {
        hasIcon.value = hasIcon.value || menu.icon !== undefined;
        if (hasIcon.value) {
          return;
        }
      });
      nextTick(() => {
        const menusWidth = menusRef.value.offsetWidth;
        const menusHeight = menusRef.value.offsetHeight;
        if (_direction.value === 'left') {
          leftOpen(menusWidth);
        } else {
          rightOpen(windowWidth, menusWidth);
        }
        style.value.top = _position.value.y;
        if (_position.value.y + menusHeight > windowHeight) {
          if (_position.value.height === 0 || _position.value.height === undefined) {
            style.value.top = _position.value.y - menusHeight;
          } else {
            style.value.top = windowHeight - menusHeight;
          }
        }
      })
    })

    function menusEnter(event, item, index) {
      if (item.disabled) {
        return;
      }
      activeIndex.value = index;
      if (ctx.instance) {
        if (ctx.index === index) {
          return;
        }
        ctx.instance.close.bind(ctx.instance)();
        ctx.instance = null;
        ctx.index = null;
      }
      if (!item.children) {
        return;
      }
      const menuItemClientRect = event.target.getBoundingClientRect();
      const node = h(Menus, {
        menusItemClass: item.menusItemClass,
        menus: item.children || [],
        direction: _direction.value,
        position: {
          x: menuItemClientRect.x + 3,
          y: menuItemClientRect.y - 8,
          width: menuItemClientRect.width - 2 * 3,
          height: menuItemClientRect.width
        },
        menusStyle: props.menusStyle,
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        zIndex: props.zIndex,
      }, slots);
      const app = createApp(node);
      ctx.instance = app.mount(document.createElement("div"));
      ctx.instance.$unmount = app.unmount;
      ctx.index = index;
      event.preventDefault();
    }
    function close() {
      open.value = false;
      if (this && this.ctx && this.ctx.instance) {
        this.ctx.instance.close();
      }
      nextTick(() => {
        this.$unmount() && this.$unmount();
      });
    }

    return {
      open,
      hasIcon,
      menusRef,
      style,
      close,
      menusEnter,
      ctx,
      activeIndex,
      slots
    };
  },
});
</script>

<style scoped>
.menus {
  position: fixed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background: #fff;
  border-radius: 4px;
  padding: 8px 0;
  user-select: none;
  box-sizing: border-box;
}

.menus_body {
  display: block;
}

.menus-fade-enter-active,
.menus-fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}
.menus-fade-enter-from,
.menus-fade-leave-to {
  opacity: 0;
}
</style>
