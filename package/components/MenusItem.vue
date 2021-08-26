<template>
  <div v-if="item.disabled" @click.stop>
    <template v-if="slots.default">
      <slot :item="item"></slot>
    </template>
    <template v-else>
      <div class="menus-item menus-item-disabled" :class="item.divided ? 'menus-divided' : null">
        <div v-if="hasIcon" class="menus-item-icon">
          <slot v-if="slots.before" name="before" :item="{ activeIndex, item }"></slot>
          <template v-else-if="item.icon">
            <MenusIcon :iconName="iconName" :options="item.icon"></MenusIcon>
          </template>
        </div>
        <span class="menus-item-label">
          <slot v-if="slots.label" name="label" :item="{ activeIndex, item }"></slot>
          <template v-else>{{ item.label }}</template>
        </span>
      </div>
    </template>
  </div>
  <div @mouseenter="($event) => menusEnter($event, item)" @click.stop v-else-if="item.children">
    <template v-if="slots.default">
      <slot :item="item"></slot>
    </template>
    <template v-else>
      <div
        class="menus-item menus-item-available"
        :class="[item.divided ? 'menus-item-divided' : null, activeIndex === index ? 'menus-item-expand' : null,]"
      >
        <div v-if="hasIcon" class="menus-item-icon">
          <slot v-if="slots.before" name="before" :item="{ activeIndex, item }"></slot>
          <template v-else-if="item.icon">
            <MenusIcon :iconName="iconName" :options="item.icon"></MenusIcon>
          </template>
        </div>
        <span class="menus-item-label">
          <slot v-if="slots.label" name="label" :item="{ activeIndex, item }"></slot>
          <template v-else>{{ item.label }}</template>
        </span>
        <div class="menus-item-expand-icon">
          <slot v-if="slots.after" name="after" :item="{ activeIndex, item }"></slot>
          <template v-else>▶</template>
        </div>
      </div>
    </template>
  </div>
  <div @mouseenter="($event) => menusEnter($event, item)" @click="menusClick(item)" v-else>
    <template v-if="slots.default">
      <slot :item="item"></slot>
    </template>
    <template v-else>
      <div
        class="menus-item menus-item-available"
        :class="item.divided ? 'menus-item-divided' : null"
      >
        <div v-if="hasIcon" class="menus-item-icon">
          <slot v-if="slots.before" name="before" :item="{ activeIndex, item }"></slot>
          <template v-else-if="item.icon">
            <MenusIcon :iconName="iconName" :options="item.icon"></MenusIcon>
          </template>
        </div>
        <span class="menus-item-label">
          <slot v-if="slots.label" name="label" :item="{ activeIndex, item }"></slot>
          <template v-else>{{ item.label }}</template>
        </span>
        <div class="menus-item-expand-icon">
          <slot v-if="slots.after" name="after" :item="{ activeIndex, item }"></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import MenusIcon from './MenusIcon.vue'

export default defineComponent({
  name: "menus-item",
  components: {
    MenusIcon
  },
  props: {
    hasIcon: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String
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
    function menusClick(item) {
      if (
        item &&
        !item.disabled &&
        !item.hidden &&
        typeof item.click === "function"
      ) {
        return item.click(item);
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
  box-sizing: border-box;
  list-style: none;
  line-height: 2rem;
  padding: 0 1rem;
  margin: 0;
  font-size: 0.8rem;
  outline: 0;
  display: flex;
  align-items: center;
  transition: 0.2s;
  border-bottom: 1px solid #00000000;
}

.menus-item-divided {
  border-bottom-color: #ebeef5;
}

.menus-item .menus-item-icon {
  margin-right: 0.5rem;
  width: 0.9rem;
}

.menus-item .menus-item-label {
  flex: 1;
}

.menus-item .menus-item-expand-icon {
  margin-left: 1rem;
  font-size: 0.4rem;
  width: 0.6rem;
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

.menus-item-expand {
  background: #ecf5ff;
  color: #409eff;
}
</style>
