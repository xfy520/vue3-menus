<template>
  <div class="content" id="app">
    <div style="margin: 0 20px;">
      <h2>指令方式实现</h2>
      <div class="block">
        <h2>复制区</h2>
        <div class="area">
          <div class="body" @contextmenu="onCopy1" v-menus="menus1">
            Vue3.0 自定义右键菜单
            Vue3.0 原生实现完全自定义右键菜单组件, 零依赖，可根据可视区域自动调节显示位置，可支持插槽完全重写每一项菜单
          </div>
        </div>
      </div>
      <div class="block">
        <h2>粘贴区</h2>
        <div class="area">
          <div class="body" @contextmenu="onPaste1" v-menus="menus1">{{ pasteValue1 }}</div>
        </div>
      </div>
    </div>
    <div style="margin: 0 20px;">
      <h2>事件方式实现</h2>
      <div class="block">
        <h2>复制区</h2>
        <div class="area">
          <div class="body" @contextmenu="onCopy2">
            Vue3.0 自定义右键菜单
            Vue3.0 原生实现完全自定义右键菜单组件, 零依赖，可根据可视区域自动调节显示位置，可支持插槽完全重写每一项菜单
          </div>
        </div>
      </div>
      <div class="block">
        <h2>粘贴区</h2>
        <div class="area">
          <div class="body" @contextmenu="onPaste2">{{ pasteValue2 }}</div>
        </div>
      </div>
    </div>
    <div style="margin: 0 20px;">
      <h2>组件方式实现</h2>
      <div class="block">
        <h2>复制区</h2>
        <div class="area">
          <div class="body" @contextmenu="onCopy3">
            Vue3.0 自定义右键菜单
            Vue3.0 原生实现完全自定义右键菜单组件, 零依赖，可根据可视区域自动调节显示位置，可支持插槽完全重写每一项菜单
          </div>
        </div>
      </div>
      <div class="block">
        <h2>粘贴区</h2>
        <div class="area">
          <div class="body" @contextmenu="onPaste3">{{ pasteValue3 }}</div>
        </div>
      </div>
    </div>
    <vue3-menus v-model:open="isOpen" :event="eventVal" :menus="menus3"></vue3-menus>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, shallowRef
} from 'vue';

import { menusEvent } from './../../lib/index';

export default defineComponent({
  name: 'copy',
  setup() {
    const clipboardValue1 = ref("");
    const pasteValue1 = ref("");
    const clipboardValue2 = ref("");
    const pasteValue2 = ref("");
    const clipboardValue3 = ref("");
    const pasteValue3 = ref("");
    const isOpen = ref(false);
    const eventVal = ref({});
    function getSelection() {
      const selection = window.getSelection();
      if (selection.anchorNode == null) {
        return null;
      }
      const text = selection.anchorNode.wholeText;
      return (
        text && text.substring(selection.anchorOffset, selection.focusOffset)
      );
    }
    const menus1 = shallowRef({
      menus: [
        {
          label: "复制",
          disabled: !getSelection(),
          click: () => {
            clipboardValue1.value = getSelection();
          }
        },
        {
          label: "粘贴",
          disabled: true,
          click: () => {
            pasteValue1.value += clipboardValue1.value;
          }
        }
      ]
    });
    const menus2 = shallowRef({
      menus: [
        {
          label: "复制",
          disabled: !getSelection(),
          click: () => {
            clipboardValue2.value = getSelection();
          }
        },
        {
          label: "粘贴",
          disabled: true,
          click: () => {
            pasteValue2.value += clipboardValue2.value;
          }
        }
      ]
    });
    const menus3 = shallowRef([
      {
        label: "复制",
        disabled: !getSelection(),
        click: () => {
          clipboardValue3.value = getSelection();
        }
      },
      {
        label: "粘贴",
        disabled: true,
        click: () => {
          pasteValue3.value += clipboardValue3.value;
        }
      }
    ]);
    function onCopy1(event) {
      const content = getSelection();
      menus1.value.menus[0].disabled = !content;
      menus1.value.menus[1].disabled = true;
      event.preventDefault();
    }
    function onCopy2(event) {
      const content = getSelection();
      menus2.value.menus[0].disabled = !content;
      menus2.value.menus[1].disabled = true;
      event.preventDefault();
      menusEvent(event, menus2.value);
    }
    function onCopy3(event) {
      const content = getSelection();
      menus3.value[0].disabled = !content;
      menus3.value[1].disabled = true;
      eventVal.value = event;
      isOpen.value = true;
      event.preventDefault();
    }
    function onPaste1(event) {
      const content = getSelection();
      menus1.value.menus[0].disabled = !content;
      menus1.value.menus[1].disabled = !clipboardValue1.value;
      event.preventDefault();
    }
    function onPaste2(event) {
      const content = getSelection();
      menus2.value.menus[0].disabled = !content;
      menus2.value.menus[1].disabled = !clipboardValue1.value;
      event.preventDefault();
      menusEvent(event, menus2.value);
    }
    function onPaste3(event) {
      const content = getSelection();
      menus3.value[0].disabled = !content;
      menus3.value[1].disabled = !clipboardValue1.value;
      eventVal.value = event;
      isOpen.value = true;
      event.preventDefault();
    }
    return {
      menus1,
      menus3,
      onCopy1,
      onCopy2,
      onCopy3,
      onPaste1,
      onPaste2,
      onPaste3,
      pasteValue1,
      pasteValue2,
      pasteValue3,
      isOpen,
      eventVal,
    };
  }
});
</script>

<style>
.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.area {
  width: 360px;
  height: 360px;
  border: 1px solid #999;
  border-radius: 4px;
  overflow: hidden;
}

.body {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 8px 16px;
  box-sizing: border-box;
}
</style>
