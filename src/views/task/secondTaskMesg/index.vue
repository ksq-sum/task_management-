<template>
  <transition name="fade" v-cloak>
    <div v-if="isec_body">
      <div v-show="task_show">
        <div class="hearder">
          <div class="task-info">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <i class="iconfont icon-shensuo-copy" @click="handleClick"></i>
              <h2 v-show="backShow" style="margin-left: 1rem; white-space: nowrap">任务备注</h2>
              <h2 v-show="uploadShow" style="margin-left: 1rem; white-space: nowrap">工作上传</h2>
              <h2 v-show="auditShow" style="margin-left: 1rem; white-space: nowrap">任务审核</h2>
            </div>
            <div class="task-name">
              <div>
                <span style="white-space: nowrap">任务名称：</span>
                <span style="white-space: nowrap">{{ editAdudit_only.chinaName }}</span>
              </div>

              <img class="task-image" src="@/assets/task_img/taskMeg.png" />
            </div>
          </div>
        </div>
        <div style="margin-top: 1rem; border-top: 1px solid #cccccc"></div>
        <div>
          <div class="bot_div" v-if="backShow">
            <el-button type="primary">编辑备注</el-button>
          </div>
          <!-- <nav class="navbar">
          <a :class="['nav-item', !navColor ? 'active' : '']" @click="toggleNavColor($event)">备注</a>
          <a :class="['nav-item', navColor ? 'active' : '']" @click="toggleNavColor($event)">工作上传</a>
          <a class="nav-item">浏览历史</a>
        <a class="nav-item">相关链接</a>
        </nav> -->
          <!-- <nav class="navbar sed"> -->
          <!-- <a class="nav-item">评论</a> -->
          <!-- <a class="nav-item">制作人员</a> -->
          <!-- <a class="nav-item">审核权限</a> -->
          <!-- </nav> -->
        </div>

        <div style="margin-top: 20px" v-if="backShow">
          <div class="editable-div" contenteditable="true">在这里添加备注...</div>
        </div>

        <div style="margin-top: 20px" v-if="uploadShow">
          <div class="uplaod_div">
            <h2 @click="openDialog($event)">上传工作</h2>
          </div>
        </div>

        <div v-if="auditShow">
          <!-- <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px">
            <div style="width: 30%">主管选择：</div>
            <el-select v-model="supervisor_selectedValue" style="width: 70%" placeholder="请选择">
              <el-option v-for="item in secondTaskMesg_ops" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div> -->
          <div style="height: 240px">
            <div v-for="(person, index) in reviewers" :key="index" style="margin-top: 2rem">
              <span>审核人：</span>
              <select
                v-model="person.selected"
                style="width: 6rem; margin-left: 4rem; border: 1px solid grey; border-radius: 0.2rem"
              >
                <option v-for="option in auditOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>

              <i
                class="iconfont icon-yingyong-"
                style="margin-left: 1.5rem"
                @click="delAudit(person.selected, index, $event)"
              ></i>
            </div>

            <div class="stage" style="margin-top: 1.5rem">
              <button class="add-person" @click="addPerson($event)" style="background-color: #007bff34">添加审核人</button>
            </div>
            <div style="position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%)">
              <button class="confirmAdd" @click="addReviewTemp($event)">确认</button>
            </div>
          </div>
        </div>

        <div v-if="supervisorShow">
          <div style="height: 240px">
            <div
              v-for="(person, index) in reviewers"
              :key="index"
              style="display: flex; justify-content: space-between; margin-top: 2rem"
            >
              <div style="font-size: 14px">
                <span>审核阶段：</span>
                <select
                  v-model="person.selected"
                  style="width: 5rem; margin-left: 0; border: 1px solid grey; border-radius: 0.2rem"
                >
                  <option v-for="option in auditOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>

              <div style="font-size: 14px">
                <span>审核人：</span>
                <select
                  v-model="person.person"
                  style="width: 5rem; margin-left: 0; border: 1px solid grey; border-radius: 0.2rem"
                >
                  <option v-for="option in peopleName" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>

              <i class="iconfont icon-yingyong-" @click="delAuditS(person.selected, index, $event)"></i>
            </div>

            <div class="stage" style="margin-top: 1.5rem">
              <button class="add-person" @click="addPersonS($event)" style="background-color: #007bff34">添加审核人</button>
            </div>
            <div style="position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%)">
              <button class="confirmAdd" @click="addReviewTempS($event)">确认</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElButton } from "element-plus";
import { defineEmits } from "vue";

const isec_body = ref(false);
onMounted(() => {
  isec_body.value = true; // 在组件挂载后设置 isVisible
});

// 定义 emit 事件
const emit = defineEmits(["childClicked", "openDialog", "toggleNav"]);
const navColor = ref(false);
// const backShow = ref(true);
const fileList = ref([]);
const videoTypes = ".mp4,.avi,.mov,.mkv,.wmv,.flv,.webm"; // 支持的文件格式
const props = defineProps({
  editAdudit_only: {
    type: Object,
    required: true
  },
  backShow: {
    type: Boolean,
    required: true
  },
  uploadShow: {
    type: Boolean,
    required: false
  },
  auditShow: {
    type: Boolean,
    required: false
  },
  supervisorShow: {
    type: Boolean,
    required: false
  },
  auditOptions: {
    type: Array
  },
  secondTaskMesg_ops: {
    type: Object
  },
  reviewers: {
    type: Array
  },
  peopleName: {
    type: Array
  }
});
const task_show = ref(true);
const supervisor_selectedValue = ref("");
// 上传成功的回调
const handleSuccess = (response, file) => {
  ElMessage.success(`${file.name} 上传成功`);
  console.log("上传成功:", response);
};
const handleClick = () => {
  // 触发父组件的方法，传递参数（如果需要）
  emit("childClicked");
};

const addReviewTemp = event => {
  emit("addReviewTemp", event);
};

const addReviewTempS = event => {
  emit("addReviewTempS", event);
};

const delAudit = (pSelected, index, event) => {
  // console.log("触发");
  emit("delAudit", [pSelected, index, event]);
  // .delAudit([pSelected, index, event]);
};

const delAuditS = (pselected, index, event) => {
  emit("delAuditS", [pselected, index, event]);
};

const addPerson = event => {
  emit("addPerson", event);
};

const addPersonS = event => {
  emit("addPersonS", event);
};

const editAdudit = event => {
  this.aduitshow = false;
  // 获取主管
  if (this.supervisor_options.length === 0) {
    this.getAllSupervisor();
  }
  // console.log("this.reviewers:", this.reviewers);

  web_getNodeAudit(this.editAdudit_only.only_code).then(response => {
    this.reviewers = [];
    response.forEach(item => {
      //username对应的realname
      this.reviewers.push({
        selected: item.level_name
      });
    });
  });
  // console.log("this.reviewers:", this.reviewers);
  // this.showSh = !this.showSh;
  // 阻止事件冒泡
  event.stopPropagation();
};
// 上传失败的回调
const handleError = (err, file) => {
  ElMessage.error(`${file.name} 上传失败`);
  console.error("上传失败:", err);
};

// 上传前的钩子
const beforeVideoUpload = file => {
  const isVideo = file.type.startsWith("video/");
  if (!isVideo) {
    ElMessage.error("只能上传视频文件!");
  }
  return isVideo;
};

// 处理文件变化
const handleChange = (file, newFileList) => {
  console.log("处理文件变化");
  fileList.value = newFileList; // 更新文件列表
  console.log(file); // 打印当前文件
};

// 处理文件拖拽
const handleDrop = dragEvent => {
  console.log("文件被拖拽到此区域", dragEvent);
};

// 上传前的验证
const beforeUpload = file => {
  console.log("上传前的验证");
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isPDF = file.type === "application/pdf";
  const isValid = isJPG || isPNG || isPDF;

  if (!isValid) {
    // 如果不符合条件，使用 $message 提示用户
    // 由于在 setup 中不能直接使用 this，您需要使用 `getCurrentInstance`
    const { proxy } = getCurrentInstance();
    proxy.$message.error("上传文件只能是 JPG、PNG 或 PDF 格式!");
  }
  return isValid;
};

// 兼容性处理，确保 createObjectURL 可用
// 创建对象 URL
const createObjectURL = file => {
  return URL.createObjectURL(file);
};

// 调用父组件的方法
const openDialog = event => {
  emit("openDialog", event); // 触发自定义事件
};
// 关闭弹窗
const closeDrawer = () => {
  showDrawer.value = false;
};
// 切换 navColor 的状态
const toggleNavColor = event => {
  if (event) {
    event.stopPropagation();
  }
  navColor.value = !navColor.value;
  backShow.value = !backShow.value;
};

const toggleTest = e => {
  console.log(e);
};

// 添加新的方法来处理外部触发
const handleExternalToggle = () => {
  navColor.value = true; // 直接设置为工作上传状态
  backShow.value = false;
};

// 暴露方法给父组件
defineExpose({
  handleExternalToggle
});
</script>

<style>
[v-cloak] {
  display: none;
}
.add-person {
  width: 100%;
  padding: 10px;
  color: #007bff;
  cursor: pointer;
  background-color: #007bff34;
  border: 1px dashed #007bff;
  border-radius: 0.2rem;
}
.hearder {
  display: flex;
  justify-content: space-between;
}
.task-info {
  width: 100%;
}
.confirmAdd {
  width: 6rem;
  padding: 0.5rem;
  margin-top: 50px;
  color: #ffffff;
  cursor: pointer;
  background-color: #007bff;
  border: none;
  border-radius: 0.2rem;
}
.task-name {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  color: grey;
}
.task-image {
  width: 10rem;
  margin-left: auto;
}
.upload-demo-video {
  margin: 20px;
}

/* .upload-demo {
  width: 300px;
  margin: 20px;
} */
.uplaod_div {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  cursor: pointer;
  border: 1px dashed #007bff;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.4rem;
  margin-top: 1rem;
  background-color: rgb(104 104 104 / 38.4%);
}
.navbar.sed {
  justify-content: start;
  margin-top: 0;
}
.nav-item {
  margin-right: 20px;
  font-size: 1rem;
  color: #666666;
  text-decoration: none;
  cursor: default;
}
.nav-item:hover {
  color: #000000;
}
.nav-item.active {
  font-weight: bold; /* 使活动状态更显眼 */
  color: #007bff; /* 活动状态的颜色，可以根据需要更改 */
}
.el-button {
  color: #000000;

  /* color: aliceblue; */
}
.bot_div {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
}
.editable-div {
  width: 100%;
  height: 25rem;
  padding: 10px;
  margin-top: 20px;
  overflow-y: auto;
  font-size: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
.editable-div:focus {
  border-color: #007bff; /* 焦点时边框颜色 */
  outline: none; /* 去掉焦点框 */
}
.task-name span {
  display: inline-block;
  white-space: nowrap;
}
</style>
