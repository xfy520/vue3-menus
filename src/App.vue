<template>
  <div style="height: 98vh; width: 100%;" v-menus:left="menus">
    <div class="div" v-menus:left="menus">指令方式打开菜单</div>
    <div class="div" @click.stop @contextmenu="($event) => $menusEvent($event, menus)">事件方式打开菜单</div>
    <div class="div" @click.stop @contextmenu="rightClick">组件方式打开菜单</div>
    <vue3-menus v-model:open="isOpen" :event="eventVal" :menus="menus.menus" hasIcon>
      <template #icon>1</template>
      <template #label="{ item: { item } }">插槽：{{ item.label }}</template>
    </vue3-menus>
  </div>
</template>
<script>
import { defineComponent, nextTick, ref, shallowRef } from "vue";
import { SyncOutlined, WindowsOutlined, QrcodeOutlined } from '@ant-design/icons-vue';
import { Printer } from '@element-plus/icons'

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
    const menus = shallowRef({
      menus: [
        {
          label: "返回(B)",
          tip: 'Alt+向左箭头',
          click: () => {
            window.history.back(-1);
          }
        },
        {
          label: "点击不关闭菜单",
          tip: '不关闭菜单',
          click: () => {
            return false;
          }
        },
        {
          label: "前进(F)",
          tip: 'Alt+向右箭头',
          disabled: true
        },
        {
          label: "重新加载(R)",
          tip: 'Ctrl+R',
          icon: {
            node: SyncOutlined,
            option: {
              spin: true
            }
          },
          click: () => location.reload(),
          divided: true
        },
        {
          label: "另存为(A)...",
          tip: 'Ctrl+S'
        },
        {
          label: "打印(P)...",
          tip: 'Ctrl+P',
          icon: {
            node: Printer,
            option: {
              color: 'red'
            }
          },
          click: () => window.print(),
        },
        {
          label: "投射(C)...",
          divided: true,
          children: [
            {
              label: "返回(B)",
              tip: 'Alt+向左箭头',
              click: () => {
                window.history.back(-1);
              }
            },
            {
              label: "点击不关闭菜单",
              tip: '不关闭菜单',
              click: () => {
                return false;
              }
            },
            {
              label: "前进(F)",
              tip: 'Alt+向右箭头',
              disabled: true
            },
            {
              label: "重新加载(R)",
              tip: 'Ctrl+R',
              icon: {
                node: SyncOutlined,
                option: {
                  spin: true,
                  color: 'aqua'
                }
              },
              click: () => location.reload(),
              divided: true
            },
            {
              label: "另存为(A)...",
              tip: 'Ctrl+S'
            },
            {
              label: "打印(P)...",
              tip: 'Ctrl+P',
              icon: {
                node: Printer,
                option: {
                  color: 'aqua'
                }
              },
              click: () => window.print(),
            },
            {
              label: "投射(C)...",
              divided: true
            },
            {
              label: '发送到你的设备',
              icon: WindowsOutlined,
              children: [
                {
                  label: 'iPhone',
                },
                {
                  label: 'iPad'
                },
                {
                  label: 'Windows 11'
                }
              ]
            },
            {
              label: "为此页面创建二维码",
              divided: true,
              icon: {
                node: QrcodeOutlined,
                option: {
                  style: {
                    color: 'aqua'
                  }
                }
              }
            },
            {
              label: "使用网页翻译(F)",
              divided: true,
              children: [
                { label: "翻译成繁体中文" },
                { label: "翻译成繁体中文" },
                {
                  label: "百度翻译", children: [
                    { label: "翻译成繁体中文" },
                    { label: "翻译成繁体中文" },]
                },
                {
                  label: "搜狗翻译", children: [
                    { label: "翻译成繁体中文" },
                    { label: "翻译成繁体中文" },
                  ]
                },
                {
                  label: "有道翻译", children: [
                    { label: "翻译成繁体中文" },
                    { label: "翻译成繁体中文" },
                  ]
                },
              ]
            },
            {
              label: "截取网页(R)"
            },
            { label: "查看网页源代码(U)", tip: 'Ctrl+U' },
            { label: "检查(N)", tip: 'Ctrl+Shift+I' }
          ]
        },
        {
          label: '发送到你的设备',
          icon: WindowsOutlined,
          children: [
            {
              label: 'iPhone',
            },
            {
              label: 'iPad'
            },
            {
              label: 'Windows 11'
            }
          ]
        },
        {
          label: "为此页面创建二维码",
          divided: true,
          icon: {
            node: QrcodeOutlined,
            option: {
              style: {
                color: 'aqua'
              }
            }
          }
        },
        {
          label: "使用网页翻译(F)",
          divided: true,
          children: [
            { label: "翻译成繁体中文" },
            { label: "翻译成繁体中文" },
            {
              label: "百度翻译", children: [
                { label: "翻译成繁体中文" },
                { label: "翻译成繁体中文" },]
            },
            {
              label: "搜狗翻译", children: [
                { label: "翻译成繁体中文" },
                { label: "翻译成繁体中文" },
              ]
            },
            {
              label: "有道翻译", children: [
                { label: "翻译成繁体中文" },
                { label: "翻译成繁体中文" },
              ]
            },
          ]
        },
        {
          label: "截取网页(R)",
          children: [
            {
              label: "返回(B)",
              tip: 'Alt+向左箭头',
              click: () => {
                window.history.back(-1);
              }
            },
            {
              label: "点击不关闭菜单",
              tip: '不关闭菜单',
              click: () => {
                return false;
              }
            },
            {
              label: "前进(F)",
              tip: 'Alt+向右箭头',
              disabled: true
            },
            {
              label: "重新加载(R)",
              tip: 'Ctrl+R',
              icon: {
                node: SyncOutlined,
                option: {
                  spin: true,
                  color: 'aqua'
                }
              },
              click: () => location.reload(),
              divided: true
            },
            {
              label: "另存为(A)...",
              tip: 'Ctrl+S'
            },
            {
              label: "打印(P)...",
              tip: 'Ctrl+P',
              icon: {
                node: Printer,
                option: {
                  color: 'aqua'
                }
              },
              click: () => window.print(),
            },
            {
              label: "投射(C)...",
              divided: true
            },
            {
              label: '发送到你的设备',
              icon: WindowsOutlined,
              children: [
                {
                  label: 'iPhone',
                },
                {
                  label: 'iPad'
                },
                {
                  label: 'Windows 11'
                }
              ]
            },
            {
              label: "为此页面创建二维码",
              divided: true,
              icon: {
                node: QrcodeOutlined,
                option: {
                  style: {
                    color: 'aqua'
                  }
                }
              }
            },
            {
              label: "使用网页翻译(F)",
              divided: true,
              children: [
                { label: "翻译成繁体中文" },
                { label: "翻译成繁体中文" },
                {
                  label: "百度翻译", children: [
                    { label: "翻译成繁体中文" },
                    { label: "翻译成繁体中文" },]
                },
                {
                  label: "搜狗翻译", children: [
                    { label: "翻译成繁体中文" },
                    { label: "翻译成繁体中文" },
                  ]
                },
                {
                  label: "有道翻译", children: [
                    { label: "翻译成繁体中文" },
                    { label: "翻译成繁体中文" },
                  ]
                },
              ]
            },
            {
              label: "截取网页(R)"
            },
            { label: "查看网页源代码(U)", tip: 'Ctrl+U' },
            { label: "检查(N)", tip: 'Ctrl+Shift+I' }
          ]
        },
        { label: "查看网页源代码(U)", tip: 'Ctrl+U' },
        { label: "检查(N)", tip: 'Ctrl+Shift+I' }
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
