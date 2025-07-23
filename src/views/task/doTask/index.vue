<template>
  <!-- 创建任务操作界面 -->
  <div
    :class="['main-task', { collapsed: isCollapsed, 'another-class': !tableIfshow }]"
    v-for="item in task"
    :key="item.taskname"
  >
    <div style="display: flex">
      <span class="taskName">Aurora Analytics</span>
      <div class="expand" style="margin-left: 10px">
        <i class="iconfont icon-xiala1"></i>
      </div>
    </div>

    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-success="handleSuccess"
      :on-error="handleError"
      v-if="uploadShow"
      class="elUpload"
    >
      <el-button type="primary">点击上传</el-button>
    </el-upload>
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
    <nav class="navbar">
      <ul class="navbar-menu">
        <li v-for="item in navItems" :key="item.text" class="navbar-item">
          <a :href="item.link" class="navbar-link" :style="{ color: item.text === '我的' ? '#ff6347' : 'inherit' }">{{
            item.text
          }}</a>
        </li>
      </ul>
    </nav>

    <!-- 个人任务表格 -->
    <doTable v-if="canvaTabShow" @updateValue="updateParentValue"></doTable>
  </div>
</template>
<script setup>
import { ref } from "vue";
import doTable from "@/views/task/doTable/index.vue";
import { ElUpload, ElButton } from "element-plus";
import "element-plus/dist/index.css";

const uploadShow = ref(false);

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
const isCollapsed = ref(true);
const tableIfshow = ref(true);
const updateParentValue = () => {
  isCollapsed.value = false;
  uploadShow.value = true;
};
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

const handleSuccess = (response, file, fileList) => {
  console.log("上传成功:", response);
};

const handleError = (err, file, fileList) => {
  console.log("上传失败:", err);
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
