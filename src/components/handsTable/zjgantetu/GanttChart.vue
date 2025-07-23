<template>
  <div>
    <div style="display: flex; align-items: center; margin-top: 20px">
      <div style="display: flex; justify-content: flex-end">
        <div>
          <el-button type="primary" @click="changeScale('year')">年</el-button>
          <el-button type="primary" @click="changeScale('month')">月</el-button>
          <el-button type="primary" @click="changeScale('week')">周</el-button>
          <el-button type="primary" @click="changeScale('day')">日</el-button>
        </div>
      </div>
      <div style="display: flex; align-items: center; margin-left: 60px">
        <div style="display: flex; align-items: center">
          <div>多维表格</div>
          <el-switch v-model="dwb" @change="toggleDwb" />
        </div>
        <div style="display: flex; align-items: center; margin-left: 10px">
          <div>甘特图</div>
          <el-switch v-model="gantetu" @change="toggleGantetu" />
        </div>
      </div>
    </div>

    <div id="gantt_here" ref="gantt" style="height: 60vh; margin-top: 10px"></div>
  </div>
</template>

<script>
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "dhtmlx-gantt/codebase/dhtmlxgantt.js";
import { color } from "echarts";

export default {
  name: "GanttChart",
  data() {
    return {
      dwb: false,
      gantetu: true
    };
  },
  mounted() {
    this.initGantt();
  },
  methods: {
    toggleDwb() {
      this.gantetu = !this.gantetu;
      if (this.dwb == true) {
        this.$emit("toggle-dwb");
      }
    },
    toggleGantetu() {
      this.dwb = !this.dwb;
      if (this.dwb == true) {
        this.$emit("toggle-dwb");
      }
    },
    setScale(scale) {
      const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

      switch (scale) {
        case "year":
          gantt.config.scales = [
            { unit: "year", step: 1, format: "%Y" },
            {
              unit: "month",
              step: 1,
              format: function (date) {
                return monthNames[date.getMonth()];
              }
            }
          ];
          gantt.config.scale_height = 50;
          break;
        case "month":
          gantt.config.scales = [
            { unit: "month", step: 1, format: "%Y年 " + monthNames[new Date().getMonth()] },
            { unit: "day", step: 1, format: "%d" }
          ];
          gantt.config.scale_height = 50;
          break;
        case "week":
          gantt.config.scales = [
            {
              unit: "week",
              step: 1,
              format: function (date) {
                return "第" + gantt.date.getWeek(date) + "周 (" + gantt.date.date_to_str("%Y年%m月%d日")(date) + ")";
              }
            },
            {
              unit: "day",
              step: 1,
              format: function (date) {
                return dayNames[date.getDay()];
              }
            }
          ];
          gantt.config.scale_height = 50;
          break;
        case "day":
          gantt.config.scales = [{ unit: "day", step: 1, format: "%Y年%m月%d日 %D" }];
          gantt.config.scale_height = 30;
          break;
      }
    },
    initGantt() {
      try {
        // 设置时间识别格式
        gantt.config.xml_date = "%Y-%m-%d";
        gantt.config.order_branch = true;
        gantt.config.grid_width = 400;
        gantt.config.row_height = 30;
        gantt.config.scales = [
          { unit: "month", step: 1, date: " %Y 年  %m月" },
          { unit: "day", step: 1, date: "%d" }
        ];

        const tasks = {
          data: [
            {
              id: 1,
              text: "解限机",
              start_date: null,
              duration: -1,
              open: true,
              person: null,
              taskprogress: null,
              gongshi: 0,
              color: "#FF5733"
            },
            {
              id: 2,
              text: "绑定组-张忠",
              start_date: null,
              duration: -1,
              parent: 1,
              person: "邱高翔",
              gongshi: 0,
              taskprogress: "未开始"
            },
            {
              id: 3,
              text: "绑定组-赵笑",
              start_date: null,
              duration: -1,
              parent: 1,
              person: null,
              gongshi: 0,
              taskprogress: "未开始",
              color: "#3357FF"
            },
            {
              id: 4,
              text: "绑定组-陶虹",
              start_date: null,
              duration: -1,
              parent: 1,
              person: null,
              gongshi: 0,
              taskprogress: "未开始",
              color: "#3357FF"
            },
            {
              id: 5,
              text: "绑定组-天博元",
              start_date: null,
              duration: -1,
              parent: 1,
              person: null,
              gongshi: 0,
              taskprogress: "未开始",
              color: "#3357FF"
            },
            {
              id: 6,
              text: "绑定组-蔡晴",
              start_date: null,
              duration: -1,
              parent: 1,
              person: null,
              gongshi: 0,
              taskprogress: "未开始",
              color: "#3357FF"
            }
          ]
        };

        gantt.config.columns = [
          { name: "text", label: "任务名", tree: true, width: 150, align: "left" },
          { name: "all_task", label: "所有任务", width: 100, align: "center" },
          { name: "gongshi", label: "预设工时", width: 100, align: "center" }
        ];

        gantt.config.lightbox.sections = [
          { name: "description", height: 38, map_to: "text", type: "textarea", focus: true },
          { name: "time", height: 72, type: "duration", map_to: "auto" }
        ];

        gantt.init(this.$refs.gantt); // 使用引用
        gantt.parse(tasks);
      } catch (error) {
        console.error("Error initializing Gantt:", error);
      }
    },
    changeScale(scale) {
      this.currentScale = scale;
      this.setScale(scale);
      gantt.render();
    }
  }
};
</script>

<style scoped></style>
