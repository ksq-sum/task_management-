<template>
  <el-dialog v-model="isDialogVisible" title="项目详情" width="600px">
    <div class="dialog-content">
      <div class="form-group">
        <label>项目代号</label>
        <p class="r-p">{{ projectName }}</p>
      </div>
      <div class="form-group">
        <label>项目名称</label>
        <p class="r-p">{{ code }}</p>
      </div>
      <div class="form-group">
        <label>项目模板</label>
        <!-- <el-switch v-model="isActive" active-text="Active" inactive-text="Inactive"></el-switch> -->
      </div>
      <div class="form-group">
        <label>创建时间</label>
        <el-input v-model="creationTime" disabled></el-input>
      </div>
      <div class="form-group">
        <label>开始时间</label>
        <el-input v-model="startTime" disabled></el-input>
      </div>
      <div class="form-group">
        <label>结束时间</label>
        <el-input v-model="endTime" disabled></el-input>
      </div>
      <div class="form-group">
        <label>分辨率</label>
        <p class="r-p">{{ resolution }}</p>
      </div>
      <div class="form-group">
        <label>帧率</label>
        <p class="r-p">{{ frameRate }}</p>
      </div>
      <div class="form-group">
        <label>备注</label>
        <p class="r-p">{{ notes }}</p>
      </div>
    </div>
    <template #footer>
      <el-button @click="isDialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="submit">完成</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";

const props = defineProps({
  value: Boolean
});

const isDialogVisible = ref(props.value); // 控制弹窗的显示
const projectName = ref("Aurora Analytics");
const code = ref("AuAn");
const isActive = ref(true);
const creationTime = ref("2017-09-14 11:49:42");
const startTime = ref("2017-01-01 00:00:00");
const endTime = ref("2018-01-01 00:00:00");
const notes = ref("");
const resolution = ref("1920x1080");
const frameRate = ref(24);

// 监听 prop 的变化，更新 localValue
watch(
  () => props.value,
  newValue => {
    isDialogVisible.value = newValue;
    console.log("isDialogVisible:" + isDialogVisible.value);
  }
);

const resetValue = () => {
  isDialogVisible.value = true; // 开启弹窗
};

const submit = () => {
  const projectDetails = {
    projectName: projectName.value,
    code: code.value,
    isActive: isActive.value,
    notes: notes.value,
    resolution: resolution.value,
    frameRate: frameRate.value
  };
  console.log("Submitted:", projectDetails);
  isDialogVisible.value = false; // 关闭弹窗
};

// 将方法暴露给父组件
defineExpose({ resetValue });
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
}
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.r-p {
  margin-left: 10px;
}
</style>
