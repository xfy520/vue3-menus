<template>
  <div>
    <div class="item" v-menus:left="menusOtions">指令方式左击打开菜单</div>
    <div class="item" v-menus:right="menusOtions">指令方式右击打开菜单</div>
    <div class="item" v-menus:all="menusOtions">指令方式左右击打开菜单</div>
    <div class="item" v-menus:all="menusStyleOtions">设置背景打开菜单</div>
    <div class="item" v-menus:all="menusItemClassOtions">设置背景且指定菜单项class打开菜单</div>
    <div class="item" v-menus:all="menusMinWidthOtions">设置最小宽度打开菜单</div>
    <div class="item" v-menus:all="menusMaxWidthOtions">设置最大宽度打开菜单</div>
    <div class="item" @contextmenu="($event) => $menusEvent($event, menusOtions)">事件右击方式打开菜单</div>
    <div class="item" @contextmenu="rightClick1">组件右击方式打开菜单</div>
    <vue3-menus v-model:open="isOpen1" :event="eventVal" :menus="menusOtions.menus"></vue3-menus>
    <div class="item" @contextmenu="rightClick2">组件右击默认插槽完全自定义样式方打开菜单</div>
    <vue3-menus v-model:open="isOpen2" :event="eventVal" :menus="menusOtions.menus">
      <template #default="{ item }">
        <div
          :class="['my-menus-item', item.item.disabled ? 'my-menus-item-disabled' : 'my-menus-item-available',]"
        >
          <div style="color: red; margin-right: 5px;">完全自定义</div>
          <div>{{ item.item.label }}</div>
          <div v-if="item.item.children">▶</div>
        </div>
      </template>
    </vue3-menus>
    <div class="item" @contextmenu="rightClick3">组件右击添加label插槽方打开菜单</div>
    <vue3-menus v-model:open="isOpen3" :event="eventVal" :menus="menusOtions.menus">
      <template #label="{ item }">label插槽:{{ item.item.label }}</template>
    </vue3-menus>
  </div>
</template>
<script>
import { defineComponent, nextTick, ref, shallowRef } from "vue";
import menus from './../utils/menus'

export default defineComponent({
  name: "App",
  setup() {
    const isOpen1 = ref(false);
    const isOpen2 = ref(false);
    const isOpen3 = ref(false);
    const eventVal = ref({});
    function rightClick1(event) {
      isOpen1.value = false;
      nextTick(() => {
        eventVal.value = event;
        isOpen1.value = true;
      })
      event.preventDefault();
    }
    function rightClick2(event) {
      isOpen2.value = false;
      nextTick(() => {
        eventVal.value = event;
        isOpen2.value = true;
      })
      event.preventDefault();
    }
    function rightClick3(event) {
      isOpen3.value = false;
      nextTick(() => {
        eventVal.value = event;
        isOpen3.value = true;
      })
      event.preventDefault();
    }
    const menusOtions = shallowRef({
      menus: menus
    });
    const menusStyleOtions = shallowRef({
      menus: menus,
      menusStyle: {
        background: "#343131"
      }
    });
    const menusItemClassOtions = shallowRef({
      menus: menus,
      menusStyle: {
        background: "#343131"
      },
      menusItemClass: "menus-item-class"
    });
    const menusMinWidthOtions = shallowRef({
      menus: menus,
      minWidth: 300,
    });
    const menusMaxWidthOtions = shallowRef({
      menus: menus,
      maxWidth: 200,
    });
    return {
      menusOtions, menusStyleOtions, menusItemClassOtions, menusMinWidthOtions,
      menusMaxWidthOtions, isOpen1, isOpen2, isOpen3, rightClick1, rightClick2, rightClick3, eventVal
    }
  },
});
</script>

<style>
.item {
  display: inline-block;
  background-color: aqua;
  margin: 20px;
  line-height: 200px;
  padding: 0 20px;
  height: 200px;
}

.menus-item-class:hover {
  background: #090a0b;
  color: #ff0202;
}

.my-menus-item {
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

.my-menus-item-divided {
  border-bottom-color: #ebeef5;
}

.my-menus-item-available {
  color: #606266;
  cursor: pointer;
}

.my-menus-item-available:hover {
  background: #ecf5ff;
  color: #409eff;
}

.my-menus-item-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
