<template>
  <div>
    <div class="body">
      <div class="container">
        <!-- 表头 -->
        <div class="header">
          <div>
            <a :class="{ active: !ifActive }" @click="setActive"> 我参与的项目 </a>
            <!-- <a :class="{ active: ifActive }" @click="setActive"> 我关注的项目 </a> -->
          </div>
          <button @click="cgShowModal">创建项目</button>
        </div>

        <!-- 项目内容 -->
        <div v-for="(project, index) in projects" :key="index" class="project" @click="handleTask(index)">
          <img
            :alt="project.imageAlt"
            :height="project.imageHeight"
            src="@/assets/task_img/1728982314813.png"
            :width="project.imageWidth"
          />
          <div class="project-details">
            <div class="project-title">{{ project.title }}</div>
            <div class="project-info">
              <span> 项目倒计时: {{ project.countdown }}天 </span>
              <div class="project-progress">
                <span> 项目已完成: </span>
                <div class="progress-circle">
                  <span> {{ project.progress }}% </span>
                </div>
              </div>
            </div>
            <div class="project-meta">
              <div>创建时间: {{ project.createTime }}</div>
              <div>导演: {{ project.director }}</div>
              <div>创建人: {{ project.creator }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 创建项目弹窗 -->
    <div v-if="showModal" class="modal-overlay">
      <dialogmainPro :titleData="proName" :onCallParentMethod="cgShowModal" :anotherMethod="getMypros"></dialogmainPro>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElUpload, ElButton } from "element-plus";
import "element-plus/dist/index.css";
import dialogmainPro from "@/views/task/dialogmainPro/index.vue";
import { useUserStore } from "@/stores/modules/user"; // 导入你的 store
import { web_getMyPros, web_getTaskProgress } from "@/api/modules/task";
import { useRoute, useRouter } from "vue-router";

// 定义响应式状态
const ifActive = ref(false);
const showModal = ref(false);
const zzname = ref("");
const projects = ref<any[]>([]);
const proName = ref("");
const router = useRouter();

// 方法
const handleSuccess = (response: any, file: any, fileList: any) => {
  console.log("上传成功:", response);
};

const handleError = (err: any, file: any, fileList: any) => {
  console.log("上传失败:", err);
};

const setActive = () => {
  ifActive.value = !ifActive.value;
};

const cgShowModal = () => {
  router.push(`/task/secondTask`);
  // showModal.value = !showModal.value;
};

const getMypros = async () => {
  projects.value = [];
  const userStore = useUserStore();

  try {
    const response = await web_getMyPros(userStore.getName);

    for (const resp in response) {
      const progress = await web_getTaskProgress(response[resp].pro_name);

      projects.value.push({
        imageAlt: "",
        imageHeight: "150",
        imageSrc: "@/assets/task_img/1728982314813.png",
        imageWidth: "200",
        title: response[resp].pro_name,
        countdown: 65,
        progress: progress,
        createTime: response[resp].create_time,
        director: response[resp].pro_director,
        creator: response[resp].pro_p
      });
    }
  } catch (error) {
    console.error("获取项目失败:", error);
  }
};

const handleTask = (index: number) => {
  proName.value = projects.value[index].title;
  console.log("this.proName:", proName.value);
  // 打开详情页
  router.push(`/task/secondTask`);
};

// 在组件挂载时获取数据
// 在组件挂载时调用 getMypros
onMounted(() => {
  getMypros();
});
</script>

<style>
.body {
  padding: 0;
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}
.container {
  width: 80%;
  padding: 20px;
  margin: 0 auto;
  background-color: #ffffff;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #dddddd;
}
.header a {
  margin-right: 20px;
  font-size: 18px;
  color: #000000;
  text-decoration: none;
}
.header a.active {
  color: #007bff;
}
.header button {
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  background-color: #007bff;
  border: none;
}
.project {
  display: flex;
  padding: 10px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border: 1px solid #dddddd;
}
.project img {
  width: 200px;
  height: 150px;
  object-fit: cover;
}
.project-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}
.project-title {
  font-size: 24px;
  color: #007bff;
}
.project-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.project-info span {
  font-size: 20px;
  color: #007bff;
}
.project-progress {
  display: flex;
  align-items: center;
}
.project-progress .progress-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin-left: 10px;
  background-color: #e0e0e0;
  border-radius: 50%;
}
.project-progress .progress-circle span {
  font-size: 16px;
  color: #007bff;
}
.project-meta {
  font-size: 14px;
  color: #666666;
  text-align: right;
}
.placeholder {
  height: 100px;
  margin-top: 20px;
  background-color: #e0e0e0;
}
a:hover {
  cursor: default;
}
</style>
