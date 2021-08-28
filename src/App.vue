<template>
  <div>
    <router-link to="/">所有使用方式</router-link>
    <router-link style="margin-left: 30px;" to="/copy">简单复制实现</router-link>
  </div>
  <div style=" margin-top: 30px;">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';

export default defineComponent({
  name: 'app',
  setup() {
    return {
    };
  },
});
</script>

<style>
</style>
