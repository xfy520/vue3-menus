

<script>
import { h, defineComponent } from "vue";

export default defineComponent({
  name: "Vue3Menus",
  props: {
    options: {
      type: [Function, Object],
      default: {}
    }
  },
  render() {
    if (typeof this.$props.options === 'function') {
      return h(this.$props.options);
    } else if (typeof this.$props.options.node == 'function' || typeof this.$props.options.node == 'object') {
      return h(this.$props.options.node, this.$props.options.option);
    } else if (typeof this.$props.options === 'object' && !this.$props.options.node) {
      return h(this.$props.options);
    }
    return null;
  }
});
</script>
