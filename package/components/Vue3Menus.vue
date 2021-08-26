

<script>
import { watch, h, defineComponent, createApp, nextTick } from "vue";
import Menus from './Menus.vue';

export default defineComponent({
  name: "Vue3Menus",
  props: {
    hasIcon: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String
    },
    menus: {
      type: Array,
      default: []
    },
    menusStyle: {
      type: Object,
      default: {}
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
      default: 'none'
    },
    maxWidth: {
      type: [Number, String],
      default: 'none'
    },
    zIndex: {
      type: [Number, String],
      default: 2
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, slots }) {
    let lastInstance = null;

    function mouseEvent() {
      emit("update:open", false);
      if (lastInstance) {
        lastInstance.close();
        lastInstance = null;
      }
    }
    watch(() => props.open, (newVal) => {
      if (newVal) {
        if (lastInstance) {
          lastInstance.close();
          lastInstance = null;
        }
        const node = h(Menus, {
          hasIcon: props.hasIcon,
          iconName: props.iconName,
          menus: props.menus,
          menusStyle: props.menusStyle,
          event: props.event,
          position: props.position,
          minWidth: props.minWidth,
          maxWidth: props.maxWidth,
          zIndex: props.zIndex,
        }, slots);
        const app = createApp(node);
        lastInstance = app.mount(document.createElement("div"));
        lastInstance.$unmount = app.unmount;
        document.addEventListener("click", mouseEvent);
      } else {
        document.removeEventListener("click", mouseEvent)
      }
    })
    return {}
  },
  render() {
    return null;
  }
});
</script>
