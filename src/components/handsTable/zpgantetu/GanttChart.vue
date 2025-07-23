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
    </div>

    <div id="gantt_here" ref="gantt" style="height: 70vh; margin-top: 10px"></div>
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
              text: "买量",
              open: true,
              person: null,
              start_date: "2025-10-15",
              end_date: null,
              duration: null,
              taskprogress: null,
              color: "#FF5733"
            },
            {
              id: 2,
              text: "大东家",
              start_date: "2025-10-15",
              end_date: null,
              duration: null,
              pro_type: "买量",
              parent: 1,
              pro_level: "B",
              taskprogress: "进行中"
            },

            { id: 5, text: "番剧", start_date: "2024-10-15", duration: 8, open: true, person: null, taskprogress: null },

            {
              id: 10,
              text: "解限机",
              pro_type: "番剧",
              start_date: "2024-10-20",
              duration: 4,
              parent: 5,
              pro_level: "S",
              taskprogress: "初步完成"
            },
            {
              id: 11,
              text: "长生界",
              pro_type: "番剧",
              start_date: "2024-10-20",
              duration: 4,
              parent: 5,
              person: null,
              pro_level: "B",
              taskprogress: "进行中"
            },
            {
              id: 12,
              text: "执笔2024三维人设",
              pro_type: "番剧",
              start_date: "2024-10-20",
              duration: 4,
              parent: 5,
              person: null,
              pro_level: "C",
              taskprogress: "进行中"
            },
            {
              id: 13,
              text: "仙逆",
              pro_type: "番剧",
              start_date: "2024-10-20",
              duration: 4,
              parent: 5,
              person: null,
              taskprogress: "进行中"
            }
          ]
        };

        gantt.config.columns = [
          { name: "text", label: "任务名", tree: true, width: 150, align: "left" },
          { name: "pro_type", label: "项目类型", width: 80, align: "center" },
          { name: "pro_level", label: "项目等级", width: 60, align: "center" },
          { name: "taskprogress", label: "进度状态", width: 80, align: "center" },
          { name: "", label: "资产结束时间", width: 100, align: "center" }
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
