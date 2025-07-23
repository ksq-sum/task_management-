<template>
  <div class="proTask">
    <!-- 侧边导航栏 -->
    <div class="lNavigation">
      <leftNavigation class="lNavigation"></leftNavigation>
    </div>
    <!-- 完整画布 -->
    <div class="cvTask">
      <canvaTask class="cvTask"></canvaTask>
    </div>
  </div>
</template>

<script setup lang="ts" name="progressionTask">
import leftNavigation from "@/views/task/leftNavigation/index.vue";
import canvaTask from "@/views/task/canvas/index.vue";
</script>

<style scoped lang="scss">
// .proTask {
//   display: flex;
//   width: 100%;
//   height: 100%;
// }
.proTask {
  display: flex;

  // grid-template-columns:这个属性定义网格中的列数和列的大小
  //  auto-fill：这个函数会自动填充尽可能多的列，以适应容器的宽度
  //  minmax(300px, 1fr)：这个函数设置每列的最小宽度为 300 像素，同时允许其最大宽度为可用空间的 1 份（1fr）。这意味着，如果有额外的空间，列会均匀地扩展以填充这些空间。
  grid-template-columns: repeat(auto-fill, minmax(350px, 10fr));
  gap: 20px;
  width: 100%;
  height: 100%;
}
.lNavigation {
  height: 100%;
}
.cvTask {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 26%);
  border-radius: 10px;
}
</style>
