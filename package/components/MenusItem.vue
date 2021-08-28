<template>
  <template v-if="slots.default">
    <div
      @mouseenter="($event) => menusEnter($event, item)"
      @click="($event) => menusClick($event, item)"
      @contextmenu="($event) => menusClick($event, item)"
    >
      <slot :item="{ activeIndex, item }"></slot>
    </div>
  </template>
  <template v-else>
    <div
      @mouseenter="($event) => menusEnter($event, item)"
      @click="($event) => menusClick($event, item)"
      @contextmenu="($event) => menusClick($event, item)"
      :style="item.style ? item.style : {}"
      :class="['menus-item', item.disabled ? 'menus-item-disabled' : 'menus-item-available',
      item.divided ? 'menus-divided' : null, activeIndex === index ? 'menus-item-active' : null,
      menusItemClass]"
    >
      <div v-if="hasIcon" class="menus-item-icon">
        <slot v-if="slots.icon" name="icon" :item="{ activeIndex, item }"></slot>
        <template v-else-if="item.icon">
          <span v-if="typeof item.icon === 'string'" v-html="item.icon"></span>
          <MenusIcon v-else :options="item.icon"></MenusIcon>
        </template>
      </div>
      <span class="menus-item-label">
        <slot v-if="slots.label" name="label" :item="{ activeIndex, item }"></slot>
        <template v-else>{{ item.label }}</template>
      </span>
      <div class="menus-item-suffix">
        <slot v-if="item.children && slots.suffix" name="suffix" :item="{ activeIndex, item }"></slot>
        <template v-else-if="item.children">▶</template>
        <slot v-else-if="item.tip && slots.suffix" name="suffix" :item="{ activeIndex, item }"></slot>
        <span v-else-if="item.tip" class="menus-item-tip">{{ item.tip }}</span>
      </div>
    </div>
  </template>
</template>

<script>
import { defineComponent } from "vue";

import MenusIcon from './MenusIcon.vue';

export default defineComponent({
  name: "menus-item",
  components: {
    MenusIcon
  },
  props: {
    menusItemClass: {
      type: String,
      default: null
    },
    hasIcon: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: {}
    },
    index: {
      type: Number,
      default: 0
    },
    activeIndex: {
      type: Number,
      default: -1,
    }
  },
  setup(props, { emit, slots }) {
    function menusEnter(event, item) {
      emit("menusEnter", event, item, props.index)
      event.preventDefault();
    }
    function menusClick(event, item) {
      event.preventDefault();
      if (item.disabled) {
        event.stopPropagation();
        return;
      }
      if (
        item &&
        !item.disabled &&
        !item.hidden &&
        typeof item.click === "function"
      ) {
        const val = item.click(item);
        if (val === false || val === null) {
          event.stopPropagation();
        }
      }
    }
    return {
      slots,
      menusEnter,
      menusClick
    };
  },
});
</script>

<style>
.menus-item {
  display: flex;
  line-height: 2rem;
  padding: 0 1rem;
  margin: 0;
  font-size: 0.8rem;
  outline: 0;
  align-items: center;
  transition: 0.2s;
  box-sizing: border-box;
  list-style: none;
  border-bottom: 1px solid #00000000;
}

.menus-item-divided {
  border-bottom-color: #ebeef5;
}

.menus-item .menus-item-icon {
  display: flex;
  margin-right: 0.6rem;
  width: 1rem;
}

.menus-item .menus-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menus-item .menus-item-suffix {
  margin-left: 1.5rem;
  font-size: 0.39rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menus-item-available {
  color: #606266;
  cursor: pointer;
}

.menus-item-available:hover {
  background: #ecf5ff;
  color: #409eff;
}

.menus-item-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.menus-item-active {
  background: #ecf5ff;
  color: #409eff;
}

.menus-item-tip {
  font-size: 9px;
  color: #999;
}
</style>
