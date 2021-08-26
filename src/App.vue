<template>
  <div style="height: 98vh; width: 100%;" v-menus:left="menus">
    <div class="div" v-menus:left="menus">指令方式打开菜单</div>
    <div class="div" @contextmenu="($event) => $menusEvent($event, menus)">事件方式打开菜单</div>
    <div class="div" @contextmenu="rightClick">组件方式打开菜单</div>
    <vue3-menus v-model:open="isOpen" :event="eventVal" :menus="menus.menus" hasIcon>
      <template #label="{ item: { item } }">插槽：{{ item.label }}</template>
    </vue3-menus>
  </div>
</template>
<script>
import { defineComponent, nextTick, ref } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    const isOpen = ref(false);
    const eventVal = ref({});
    function rightClick(event) {
      isOpen.value = false;
      nextTick(() => {
        eventVal.value = event;
        isOpen.value = true;
      })
      event.preventDefault();
    }
    const menus = ref({
      hasIcon: true,
      menus: [
        {
          label: "返回(B)",
          icon: '<div>123</div>',
          click: () => {
            console.log("返回(B)");
          }
        },
        { label: "前进(F)", disabled: true },
        { label: "重新加载(R)", divided: true },
        { label: "另存为(A)..." },
        { label: "打印(P)..." },
        { label: "投射(C)...", divided: true },
        {
          label: "使用网页翻译(T)",
          divided: true,
          children: [{ label: "翻译成简体中文" }, { label: "翻译成繁体中文" }]
        },
        {
          label: "截取网页(R)",
          children: [
            {
              label: "返回(B)",
              click: () => {
                console.log("返回(B)");
              }
            },
            { label: "前进(F)", disabled: true },
            { label: "重新加载(R)", divided: true },
            { label: "另存为(A)..." },
            { label: "打印(P)..." },
            { label: "投射(C)...", divided: true },
            {
              label: "使用网页翻译(T)",
              divided: true,
              children: [
                { label: "翻译成简体中文" },
                { label: "翻译成繁体中文" }
              ]
            },
            {
              label: "截取网页(R)",
              children: [
                {
                  label: "截取可视化区域",
                  click: () => {
                    console.log("截取可视化区域");
                  }
                },
                { label: "截取全屏" }
              ]
            },
            { label: "查看网页源代码(V)" },
            { label: "检查(N)" }
          ]
        },
        { label: "查看网页源代码(V)" },
        { label: "检查(N)" }
      ]
    })
    return { menus, isOpen, rightClick, eventVal }
  },
});
</script>

<style>
.div {
  display: inline-block;
  background-color: aqua;
  margin: 0 20px;
  line-height: 200px;
  padding: 0 20px;
  height: 200px;
}
</style>
