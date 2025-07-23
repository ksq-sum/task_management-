<template>
  <!-- 创建任务操作界面 -->
  <div
    :class="['main-task', { collapsed: isCollapsed, 'another-class': !tableIfshow }]"
    v-for="item in task"
    :key="item.taskname"
  >
    <div class="taskTop" v-if="!isCollapsed">
      <div style="display: flex">
        <span class="taskName">task01</span>
        <div class="expand" style="margin-left: 10px">
          <i class="iconfont icon-qingkong"></i>
        </div>
        <div class="expand" style="margin-left: 10px">
          <i class="iconfont icon-piliangbianji"></i>
        </div>
      </div>
      <div class="expand">
        <i class="iconfont icon-expand" @click="toggleSidebar"></i>
      </div>
    </div>
    <div class="expand-isCollapsed" v-if="isCollapsed">
      <i class="iconfont icon-expand" @click="toggleSidebar"></i>
    </div>

    <div class="button-container" v-if="!isCollapsed">
      <div class="button-addGx" v-for="(item, index) in addGx" :key="item.gxname">
        <button class="button-gx" @click="buttonGx">
          <span>{{ item.gxname }}</span>
          <div class="expand-lianxiancopy">
            <i class="iconfont icon-chahao-copy"></i>
          </div>
        </button>

        <div class="lx">
          <div class="expand-lianxian" v-if="index < addGx.length - 1">
            <i class="iconfont icon-lianxian"></i>
          </div>
          <div class="expand-hover" v-if="index < addGx.length - 1">
            <i class="iconfont icon-cuowutishichahao_cuowutishichahao"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 上拉下拉 -->
  <div class="copytd" v-if="!isCollapsed" @click="toggleSidebar">
    <i class="iconfont icon-shangla-copy"></i>
  </div>
  <div class="copytd" v-if="isCollapsed" @click="toggleTableIfshow">
    <i class="iconfont icon-xiala-copy-right"></i>
  </div>
  <!-- 横向导航栏 -->
  <div v-if="tableIfshow">
    <!-- <nav class="navbar">
      <ul class="navbar-menu">
        <li v-for="item in navItems" :key="item.text" class="navbar-item">
          <a :href="item.link" class="navbar-link">{{ item.text }}</a>
        </li>
      </ul>
    </nav> -->

    <!-- 个人任务表格 -->
    <canvaTable v-if="canvaTabShow"></canvaTable>
    <taskForm v-if="!canvaTabShow"></taskForm>
  </div>
</template>
<script setup>
import { ref } from "vue";
import canvaTable from "@/views/task/canvaTable/index.vue";
import taskForm from "@/views/task/taskForm/index.vue";
const task = ref([
  {
    taskname: "girl"
  }
]);
const canvaTabShow = ref(true);
const navItems = ref([
  { text: "全部", redColor: true },
  { text: "我的", redColor: false },
  { text: "美术", redColor: false },
  { text: "资产", redColor: false },
  { text: "动画", redColor: false }
]);
const addGx = ref([{ gxname: "Design" }, { gxname: "Mod" }, { gxname: "Textrue" }, { gxname: "Rig" }]);
const isCollapsed = ref(false);
const tableIfshow = ref(true);

// 切换顶边栏的状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  tableIfshow.value = true;
};

const toggleTableIfshow = () => {
  tableIfshow.value = !tableIfshow.value;
  isCollapsed.value = !isCollapsed.value;
};

const buttonGx = () => {
  canvaTabShow.value = !canvaTabShow.value;
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
