

<script>
import { h } from "vue";

export default {
  name: "menus-icon",
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
};
</script>
