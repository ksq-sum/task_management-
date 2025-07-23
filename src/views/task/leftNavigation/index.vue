<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <!-- <button @click="toggleSidebar">{{ isCollapsed ? "展开" : "收起" }}</button> -->
    <div class="expand">
      <i class="iconfont icon-expand" @click="toggleSidebar"></i>
    </div>
    <nav v-if="!isCollapsed">
      <button class="add-button" @click="cgIsDialogVisible">+ Task</button>
    </nav>
    <div v-if="!isCollapsed">
      <div :class="['button-container above', { collapsed: cgCollapsed }]">
        <button class="button" v-for="item in bumenBt" :key="item.dpname">{{ item.dpname }}</button>
      </div>

      <!-- 下拉菜单 -->
      <div>
        <div class="separator"></div>
        <div v-if="!cgCollapsed" class="xlexpand" @click="cgAbove">
          <i class="iconfont icon-xiala1"></i>
        </div>
        <div v-if="cgCollapsed" class="xlexpand" @click="cgAbove">
          <i class="iconfont icon-shangla"></i>
        </div>
      </div>

      <!-- 标签 -->
      <div class="button-container under" style="margin: 5px">
        <button class="button-gx" v-for="item in gx" :key="item.gxname">{{ item.gxname }}</button>
      </div>
    </div>
    <leftdialog ref="leftDialogf"></leftdialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import leftdialog from "../leftdialog/index.vue";
const leftDialogf = ref({});
const isCollapsed = ref(false);
const cgCollapsed = ref(false);

const bumenBt = ref([
  { dpname: "美术组-AI组" },
  { dpname: "技术组" },
  { dpname: "资产组" },
  { dpname: "绑定组" },
  { dpname: "动画组" },
  { dpname: "解算组" },
  { dpname: "特效组" },
  { dpname: "渲染" }
]);
const gx = ref([
  { gxname: "Design" },
  { gxname: "Mod" },
  { gxname: "Textrue" },
  { gxname: "Rig" },
  { gxname: "Chars" },
  { gxname: "Props" },
  { gxname: "Sets" }
]);
// 示例菜单项
// 切换侧边栏的状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
const cgIsDialogVisible = event => {
  if (leftDialogf.value) {
    // isDialogVisible.value = true;
    leftDialogf.value.resetValue(); // 调用子组件的方法
  }
};

const cgAbove = () => {
  cgCollapsed.value = !cgCollapsed.value;
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
