

<script>
import { h, defineComponent, resolveComponent } from "vue";

export default defineComponent({
  name: "Vue3Menus",
  props: {
    iconName: {
      type: String,
    },
    options: {
      type: [Object, String],
      default: {}
    }
  },
  render() {
    if (this.$props.iconName) {
      const component = resolveComponent(this.$props.iconName);
      if (typeof component === 'object') {
        return h(component, typeof this.$props.options === 'object' ? { ...this.$props.options } : this.$props.options)
      }
    }
    return null;
  }
});
</script>
