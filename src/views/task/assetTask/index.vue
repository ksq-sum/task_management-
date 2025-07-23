<template>
  <div class="card content-box">
    <div class="card-interior">
      <div class="button-group">
        <div>
          <button class="tab-button active">我的</button>
          <button class="tab-button">全部</button>
        </div>
        <button class="add-button" @click="addPro">+ Project</button>
      </div>
      <div class="projects">
        <div
          v-for="project in projects"
          :key="project.id"
          @mouseover="project.isHovered = true"
          @mouseleave="project.isHovered = false"
          class="project-card"
          :style="{ backgroundColor: project.isHovered ? 'rgb(255 255 255 / 20%)' : 'rgb(255 255 255 / 45.9%)' }"
          @click="handleTask"
        >
          <div class="date">{{ project.date }}</div>
          <h2>{{ project.name }}</h2>
          <p>Owner: {{ project.owner }}</p>
          <div v-if="project.progress" :class="`status ${project.status.toLowerCase()}`">{{ project.status }}</div>
          <div v-else>
            <el-progress :percentage="progress" class="status-progress"></el-progress>
          </div>
          <div class="separator"></div>
          <div class="card-footer">
            <button class="edit"><i class="iconfont icon-bianji"></i></button>
            <div>
              <button class="xq" @click="cgIsDialogVisible"><i class="iconfont icon-icon-"></i></button>
              <button class="delete"><i class="iconfont icon-shanchu"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 创建项目弹窗 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="createPro">
          <h2>创建项目</h2>
          <button class="cancelpro" @click="showModal = false">
            <i class="iconfont icon-shanchu1"></i>
          </button>
        </div>
        <form @submit.prevent="addProject">
          <div class="form-group">
            <label for="projectCode">项目代号</label>
            <input type="text" v-model="projectCode" id="projectCode" required />
          </div>
          <div class="form-group">
            <label for="projectName">项目名称</label>
            <input type="text" v-model="projectName" id="projectName" required />
          </div>
          <!-- 项目模板选择 -->
          <div class="form-group">
            <div style="display: flex">
              <label for="projectName">选择模板</label>
              <button class="cancelpro" @click="showModal = false">
                <i class="iconfont icon-shanchu1"></i>
              </button>
            </div>
            <el-button type="primary" :icon="Star"> 标准 </el-button>
            <el-button type="primary" :icon="Star"> 其他 </el-button>
            <!-- <input type="text" v-model="projectName" id="projectName" required /> -->
          </div>
        </form>
        <div class="modal-footer">
          <button type="button" @click="showModal = false">取消</button>
          <button type="submit" class="modal-submit">确认</button>
        </div>
      </div>
    </div>
    <!-- 项目详情弹窗 -->
    <xqDialog ref="xqDialogf" :value="isDialogVisible" />
  </div>
</template>

<script setup lang="ts" name="assetTask">
import { ref } from "vue";
import xqDialog from "@/views/task/dialog/index.vue";
import { Star } from "@element-plus/icons-vue";
import { fa } from "element-plus/es/locale";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/modules/global";
const projects = ref([
  {
    id: 1,
    date: "10 Dec 2023",
    name: "Aurora Analytics",
    owner: "Ted Mosby",
    members: ["J", "T"],
    extraMembers: 1,
    status: "IN PROGRESS",
    progress: false,
    isHovered: false
  },
  {
    id: 2,
    date: "22 Nov 2023",
    name: "Quantum Leap",
    owner: "Emilio Bruen",
    members: ["L"],
    extraMembers: 1,
    status: "PLANNING",
    progress: true,
    isHovered: false
  },
  {
    id: 3,
    date: "20 Nov 2023",
    name: "Vuestic",
    owner: "Forrest Schmidt Jr.",
    members: ["L", "T"],
    extraMembers: 5,
    status: "IN PROGRESS",
    progress: false,
    isHovered: false
  },
  {
    id: 4,
    date: "15 Nov 2023",
    name: "Deep Dive Research",
    owner: "Maksim Nedo",
    members: ["D"],
    extraMembers: 1,
    status: "IMPORTANT",
    progress: true,
    isHovered: false
  },
  {
    id: 5,
    date: "1 Nov 2023",
    name: "Sky High Architecture",
    owner: "Mack Boyle",
    members: ["M"],
    extraMembers: 0,
    status: "COMPLETED",
    isHovered: false
  },
  {
    id: 6,
    date: "28 Oct 2023",
    name: "Tech Horizon",
    owner: "Dmitry Kuzmenko",
    members: ["D"],
    extraMembers: 0,
    status: "IN PROGRESS",
    progress: false,
    isHovered: false
  },
  {
    id: 4,
    date: "15 Nov 2023",
    name: "Deep Dive Research",
    owner: "Maksim Nedo",
    members: ["D"],
    extraMembers: 1,
    status: "IMPORTANT",
    progress: true,
    isHovered: false
  }
]);
const showModal = ref(false);
const projectName = ref("");
const projectCode = ref("");
const progress = ref(10);
const isDialogVisible = ref(false);
const xqDialogf = ref({});
const router = useRouter();
const globalStore = useGlobalStore();
const addPro = () => {
  // 处理确认逻辑
  console.log("Confirmed!");
  // 在这里关闭弹窗
  showModal.value = true;
};

const increaseProgress = () => {
  if (progress.value < 100) {
    progress.value += 10;
  }
};

// 添加项目的函数
const addProject = () => {
  console.log("Project Added:", {});
  projectName: projectName.value;
  // 清空输入框并关闭弹窗
};

const cgIsDialogVisible = event => {
  event.stopPropagation(); // 阻止事件冒泡
  if (xqDialogf.value) {
    // isDialogVisible.value = true;
    xqDialogf.value.resetValue(); // 调用子组件的方法
  }
};

// 打开详情
const handleTask = () => {
  // 打开详情页
  // router.push(`/task/progressionTask`);
  // router.push(`/task/secondTask`);
  // router.push(`/task/supervisorTask`);
  router.push(`/task/makeTask`);
  //当前页面全屏
  globalStore.setGlobalState("maximize", !globalStore.maximize);
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
