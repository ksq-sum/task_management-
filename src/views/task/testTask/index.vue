<template>
  <div class="container">
    <div style="display: flex; cursor: default">
      <div :class="{ active: isActive1, inactive: !isActive1 }" @click="toggleActive(1)">资产管理表</div>
      <div :class="{ active: isActive2, inactive: !isActive2 }" @click="toggleActive(2)">项目管理视图</div>
      <div :class="{ active: isActive3, inactive: !isActive3 }" @click="toggleActive(3)">项目人员总表</div>
    </div>

    <HotTable v-if="zcshow" :show="zcshow" />
    <zhipian_handsTable v-if="ifshow" style="margin-top: 20px" :show="ifshow" />
    <test v-if="zjshow" :show="zjshow"></test>
    <!-- <zongjian_handsTable v-if="zjshow" /> -->
  </div>
</template>

<script setup>
import GanttChart from "@/components/GanttChart.vue";
import HotTable from "@/components/handsTable/zichan/EasyExcel.vue";
// import zhipian_handsTable from "@/components/handsTable/zhipian/index.vue";
import zongjian_handsTable from "@/components/handsTable/zongjian/index.vue";
import zhipian_handsTable from "@/components/handsTable/n_zhipian/EasyExcel.vue";
import test from "@/components/EasyExcel.vue";
import { ref } from "vue";

const zcshow = ref(true);
const ifshow = ref(false);
const zjshow = ref(false);
const isActive1 = ref(false);
const isActive2 = ref(false);
const isActive3 = ref(false);

const cg_zcshow = () => {};

const cg_ifshow = () => {};

const cg_zongjianshow = () => {};

const toggleActive = index => {
  if (index == 1) {
    isActive1.value = !isActive1.value;
    isActive2.value = false;
    isActive3.value = false;
    zcshow.value = true;
    ifshow.value = false;
    zjshow.value = false;
  } else if (index == 2) {
    isActive2.value = !isActive2.value;
    isActive1.value = false;
    isActive3.value = false;
    zcshow.value = false;
    ifshow.value = true;
    zjshow.value = false;
  } else if (index == 3) {
    isActive3.value = !isActive3.value;
    isActive1.value = false;
    isActive2.value = false;
    zcshow.value = false;
    ifshow.value = false;
    zjshow.value = true;
  }
};
</script>

<style scoped>
.active {
  padding: 5px;
  margin-left: 20px;
  border: 2px solid black; /* 激活状态的边框样式 */
  border-radius: 10px;
}
.inactive {
  padding: 5px;
  margin-left: 20px;
  color: rgb(128 128 128 / 63%);
  border: 1px solid rgb(128 128 128 / 63%); /* 默认状态的边框样式 */
  border-radius: 10px;
}
</style>
