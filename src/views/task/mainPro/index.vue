<template>
  <transition name="fade" v-cloak>
    <div v-if="isec_body">
      <div class="body">
        <div class="container">
          <!-- 表头 -->
          <div class="header">
            <div>
              <a :class="{ active: !ifActive }" @click="setActive"> 我参与的项目 </a>
              <!-- <a :class="{ active: ifActive }" @click="setActive"> 我关注的项目 </a> -->
            </div>
            <button @click="cgShowModal" style="border-radius: 5px" v-if="showcjProject">创建项目</button>
          </div>

          <!-- 项目内容 -->
          <div v-for="(project, index) in projects" :key="index" class="project" @click="handleTask(index)">
            <img
              style="border-radius: 10px"
              :alt="project.imageAlt"
              :height="project.imageHeight"
              :src="`http://192.168.112.72:8889/newImages/${project.pro_thumbnail}?IMAGE_DIR=G:/AI/Thumbnail`"
              :width="project.imageWidth"
            />
            <div class="project-details">
              <div class="project-info">
                <div class="project-title">{{ project.title }}</div>
                <div style="cursor: default">
                  <span> 项目倒计时: {{ project.countdown }}天 </span>
                </div>
                <div class="project-progress">
                  <span> 项目已完成: </span>
                  <div class="progress-circle">
                    <span> {{ project.progress }}</span>
                  </div>
                </div>
              </div>
              <div class="project-meta">
                <div>
                  <div>创建时间: {{ project.createTime }}</div>
                  <div>导演: {{ project.director }}</div>
                  <div>创建人: {{ project.creator }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 创建项目弹窗 -->
      <div v-if="showModal" class="modal-overlay">
        <dialogmainPro :titleData="proName" :onCallParentMethod="cgShowModal" :anotherMethod="getMypros"></dialogmainPro>
      </div>

      <!-- AI助手 -->
      <div class="chat-widget minimized" id="chatWidget">
        <div class="chat-header">
          <div class="chat-title">
            <i class="fas fa-robot"></i>
            <span>AI助手</span>
          </div>
          <div class="chat-controls">
            <button class="chat-control-btn" id="minimizeChat">
              <i class="fas fa-minus"></i>
            </button>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="message ai">
            <div class="message-bubble">你好！我是管理平台的AI助手，很高兴为您服务。</div>
          </div>
        </div>
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <textarea class="chat-input" id="chatInput" placeholder="输入消息..." rows="1"></textarea>
            <button class="send-button" id="sendMessage">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElUpload, ElButton } from "element-plus";
import "element-plus/dist/index.css";
import dialogmainPro from "@/views/task/dialogmainPro/index.vue";
import { useUserStore } from "@/stores/modules/user"; // 导入你的 store
import { web_getMyPros, web_getUserName, web_getTaskProgress } from "@/api/modules/task";
import { useRoute, useRouter } from "vue-router";

// 定义响应式状态
const ifActive = ref(false);
const showModal = ref(false);
const zzname = ref("");
const projects = ref<any[]>([]);
const proName = ref("");
const router = useRouter();
//登陆人
const loginUser = ref("");
const isec_body = ref(true);
const isTyping = ref(false);
const showcjProject = ref(true);

// 聊天窗口相关元素
const chatWidget = ref<HTMLElement | null>(null);
const minimizeBtn = ref<HTMLElement | null>(null);
const chatInput = ref<HTMLElement | null>(null);
const sendBtn = ref<HTMLElement | null>(null);
const chatMessages = ref<HTMLElement | null>(null);
const typingIndicator = ref<HTMLElement | null>(null);
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
  // router.push(`/task/secondTask`);
  // router.push({ path: "/task/secondTask", query: { key: "taskname" } });

  showModal.value = !showModal.value;
};

const getMypros = async () => {
  projects.value = [];
  const userStore = useUserStore();
  try {
    let response = await web_getMyPros(userStore.getName);
    response.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));

    loginUser.value = userStore.getName;
    // console.log("response:", JSON.stringify(response));
    for (const resp in response) {
      //计算项目百分比
      const progress = await web_getTaskProgress(response[resp].pro_name);

      const start_date_str = response[resp].pro_starttime;
      const end_date_str = response[resp].pro_endtime;
      const startDate = new Date();
      const endDate = new Date(end_date_str);
      // 计算日期差（毫秒）
      const differenceInMilliseconds = endDate - startDate;

      // 将毫秒转换为天数
      const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

      // console.log(`相差天数: ${differenceInDays} 天`);
      console.log("response[resp]:", response[resp]);

      projects.value.push({
        imageAlt: "",
        imageHeight: "150",
        imageSrc: "@/assets/task_img/1728982314813.png",
        imageWidth: "200",
        title: response[resp].pro_name,
        countdown: differenceInDays,
        progress: progress,
        createTime: response[resp].create_time,
        director: response[resp].pro_director,
        creator: response[resp].pro_p,
        pro_thumbnail: response[resp].pro_thumbnail
      });
    }
  } catch (error) {
    console.error("获取项目失败:", error);
  }
};

const cjProject = () => {
  const userStore = useUserStore();
  web_getUserName(userStore.getName).then(response => {
    if (response.permissions == 1) {
      showcjProject.value = true;
    } else {
      showcjProject.value = false;
    }
  });
};

const handleTask = (index: number) => {
  proName.value = projects.value[index].title;
  //项目代号
  //项目名
  const taskrealname = proName.value;

  // 打开详情页
  // router.push({ path: "/task/secondTask", query: { key: taskrealname } });
  // router.push({ path: "/task/supervisorTask", query: { key: taskrealname } });

  //根据权限进入不同页面
  web_getUserName(loginUser.value).then(response => {
    // console.log(response.permissions);
    //0-管理员，1-制片，2-主管，3-制作者
    if (response.permissions == 1) {
      // 模拟数据获取
      router.push({ path: "/task/secondTask", query: { key: taskrealname } });
    }
    if (response.permissions == 2) {
      // 模拟数据获取
      router.push({ path: "/task/supervisorTask", query: { key: taskrealname } });
    }
    if (response.permissions == 3) {
      // 模拟数据获取
      router.push({ path: "/task/makeTask", query: { key: taskrealname } });
    }
  });
};

// 发送消息功能
function sendMessage() {
  const message = chatInput.value?.value.trim();
  if (message) {
    // 添加用户消息
    addMessage(message, "user");
    chatInput.value!.value = "";

    // 显示输入中动画
    typingIndicator.value?.classList.add("active");

    // 模拟AI响应
    setTimeout(() => {
      typingIndicator.value?.classList.remove("active");
      addMessage(`收到您的消息："${message}"。我认真考虑并回复。`, "ai");
    }, 1500);
  }
}

function addMessage(content: string, type: string) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = content;

  messageDiv.appendChild(bubble);
  chatMessages.value?.appendChild(messageDiv);

  // 滚动到底部
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
}

// 在组件挂载时获取数据
// 在组件挂载时调用 getMypros
onMounted(() => {
  getMypros();
  // isec_body.value = true;

  cjProject();

  // 获取聊天窗口元素并绑定事件
  chatWidget.value = document.getElementById("chatWidget");
  minimizeBtn.value = document.getElementById("minimizeChat");
  chatInput.value = document.getElementById("chatInput");
  sendBtn.value = document.getElementById("sendMessage");
  chatMessages.value = document.getElementById("chatMessages");
  typingIndicator.value = document.querySelector(".typing-indicator");

  minimizeBtn.value?.addEventListener("click", e => {
    e.stopPropagation(); // 阻止事件冒泡
    chatWidget.value?.classList.toggle("minimized");
  });

  sendBtn.value?.addEventListener("click", sendMessage);

  chatInput.value?.addEventListener("keypress", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 自调整输入框高度
  chatInput.value?.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // 修改点击最小化状态恢复的功能
  chatWidget.value?.addEventListener("click", e => {
    console.log(4);
    if (chatWidget.value?.classList.contains("minimized") && e.target.closest(".chat-widget")) {
      chatWidget.value?.classList.remove("minimized");
    }
  });
});
</script>

<style scoped lang="css">
@import "./index";
</style>
