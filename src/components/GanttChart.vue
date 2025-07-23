<template>
  <div>
    <div style="display: flex; align-items: center; margin-top: 20px">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-left: 20px;
          cursor: pointer;
          background-color: #c3e6cb;
          border-radius: 5px;
        "
      >
        解限机
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-left: 20px;
          cursor: pointer;
          background-color: #ffeeba;
          border-radius: 5px;
        "
      >
        大东家
      </div>
      <div style="display: flex; justify-content: flex-end; margin-left: 1400px">
        <div>
          <el-button type="primary" @click="changeScale('year')">年</el-button>
          <el-button type="primary" @click="changeScale('month')">月</el-button>
          <el-button type="primary" @click="changeScale('week')">周</el-button>
          <el-button type="primary" @click="changeScale('day')">日</el-button>
        </div>
      </div>
    </div>

    <div id="gantt_here" ref="gantt" style="height: 80vh; margin-top: 10px"></div>
  </div>
</template>

<script>
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "dhtmlx-gantt/codebase/dhtmlxgantt.js";

export default {
  name: "GanttChart",
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
            { id: 1, text: "矛隼", start_date: "2023-10-01", duration: 10, open: true },
            { id: 2, text: "矛隼*原画", start_date: "2023-10-02", duration: 5, parent: 1 },
            { id: 3, text: "矛隼*模型", start_date: "2023-10-07", duration: 5, parent: 1 },
            { id: 4, text: "矛隼*绑定", start_date: "2023-10-07", duration: 5, parent: 1 },
            { id: 5, text: "菲儿", start_date: "2023-10-15", duration: 8, open: true },
            { id: 6, text: "菲儿*", start_date: "2023-10-16", duration: 4, parent: 5 },
            { id: 7, text: "菲儿*原画", start_date: "2023-10-20", duration: 4, parent: 5 },
            { id: 8, text: "菲儿*模型", start_date: "2023-10-20", duration: 4, parent: 5 },
            { id: 9, text: "菲儿*模型", start_date: "2023-10-20", duration: 4, parent: 5 },
            { id: 10, text: "菲儿*模型", start_date: "2023-10-20", duration: 4, parent: 5 },
            { id: 11, text: "菲儿*解算", start_date: "2023-10-20", duration: 4, parent: 5 },
            { id: 12, text: "菲儿*绑定", start_date: "2023-10-20", duration: 4, parent: 5 }
          ],
          links: [
            { source: 2, target: 3, type: "0" },
            { source: 5, target: 6, type: "0" }
          ]
        };

        gantt.config.columns = [
          { name: "text", label: "任务名", tree: true, width: 150, align: "left" },
          { name: "zichaname", label: "资产名称", width: 100 },
          { name: "start_date", label: "开始日期", width: 100, align: "center" },
          { name: "person", label: "人员", width: 100, align: "center" },
          { name: "duration", label: "工时", width: 40, align: "center" },
          { name: "end_time", label: "结束时间", width: 100, align: "center" },
          { name: "taskprogress", label: "任务进度", width: 80, align: "center" }
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
