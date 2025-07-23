<template>
  <el-dialog v-model="isDialogVisible" title="任务详情" width="600px">
    <div class="dialog-content">
      <div class="form-group">
        <label>任务类型</label>
        <div class="button-container">
          <button class="button">动画镜头</button>
          <button class="button">人物模型</button>
        </div>
      </div>
      <div class="form-group">
        <label>任务名称</label>
        <div class="input-container">
          <input type="text" class="styled-input" placeholder="请输入任务名称" />
        </div>
      </div>
      <div class="form-group">
        <label>任务描述</label>
        <div class="input-container">
          <textarea type="text" style="height: 100px" class="styled-input" placeholder="请输入内容..." />
        </div>
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

const projectName = ref("task01");
const isDialogVisible = ref(props.value); // 控制弹窗的显示

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
    projectName: projectName.value
  };
  console.log("Submitted:", projectDetails);
  isDialogVisible.value = false; // 关闭弹窗
};

// 将方法暴露给父组件
defineExpose({ resetValue });
</script>

<style scoped lang="scss">
@import "./index";
</style>
