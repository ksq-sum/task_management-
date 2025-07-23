<template>
  <div>
    <div style="display: flex; align-items: center; height: 40px; border-radius: 8px">
      <div class="protype-fl ml" @click="filterIfType('买量')">买量</div>
      <div class="protype-fl fj" @click="filterIfType('番剧')">番剧</div>
      <div class="protype-fl AI" @click="filterIfType('AI')">AI</div>
      <div class="protype-fl dy" @click="filterIfType('电影')">电影</div>
      <div class="protype-fl qt" @click="filterIfType('其他')">其他</div>
      <i style="margin-left: 40px; font-size: 25px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>

      <div style="margin-left: 60px" class="protype-fl S" @click="filterIfLevel('S')">S</div>
      <div class="protype-fl A" @click="filterIfLevel('A')">A</div>
      <div class="protype-fl B" @click="filterIfLevel('B')">B</div>
      <div class="protype-fl C" @click="filterIfLevel('C')">C</div>

      <div style="margin-left: 60px" class="protype-fl jx" @click="filterIfStatu('进行')">进行</div>
      <div class="protype-fl xg" @click="filterIfStatu('修改')">修改</div>
      <div class="protype-fl zt" @click="filterIfStatu('暂停')">暂停</div>
      <div class="protype-fl wc" @click="filterIfStatu('完成')">完成</div>

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
    <div style="height: 70vh; max-height: 75vh; margin-top: 30px; overflow-y: scroll">
      <div v-show="dwb" id="exampleTheme"></div>
      <div v-show="gantetu">
        <GanttChart />
      </div>
    </div>
  </div>
</template>

<script>
import Handsontable from "handsontable";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import { web_getDepartPs, web_getAllProject, web_addProject } from "@/api/modules/task";
import GanttChart from "@/components/handsTable/zpgantetu/GanttChart.vue";
import { ElMessage } from "element-plus";
export default {
  components: {
    GanttChart
  },
  name: "HandsontableComponent",
  data() {
    return {
      typeOptions: ["", "买量", "番剧", "AI", "电影", "其他"],
      levelOptions: ["", "S", "A", "B", "C"],
      jinduOptions: ["", "进行", "修改", "暂停", "完成"],
      personOptions: [],
      data: [],
      cl_data: [],
      type_filter: "",
      level_filter: "",
      statu_filter: "",
      gantetu: false,
      dwb: true,
      handleKeyDown: null,
      c_hot: null
    };
  },

  created() {
    this.getDepartPs();
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.showConfirm();
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggleGantetu() {
      this.dwb = !this.dwb;
    },
    toggleDwb() {
      this.gantetu = !this.gantetu;
    },
    unmountComponent() {
      // 这里可以通过父组件或其他方式卸载该组件
      this.$emit("unmount"); // 假设通过事件来告知父组件卸载
    },

    showConfirm() {
      const confirmed = confirm("确定要保存视图吗？");
      if (confirmed) {
        const nameMapping = {};
        this.personOptions_res.forEach(person => {
          nameMapping[person.realname] = person.username;
        });
        // 使用 map 函数遍历数组
        this.data = this.data.map(innerArray => {
          return innerArray.map(item => {
            // 如果 item 是 null，则替换为 ""
            return item === null ? "" : item;
          });
        });
        // 遍历 thisData 并替换每一行中的人员名称
        this.data.forEach(row => {
          if (nameMapping[row[4]]) {
            row[4] = nameMapping[row[4]];
          }
        });

        // 输出更新后的整个数据
        console.log(this.data);
        // 用户确认，执行卸载逻辑
        web_addProject(this.data).then(res => {
          console.log("res:", res);
        });
      } else {
        // 用户取消，可以在这里执行其他操作
        console.log("用户取消了保存视图");
      }
    },
    filterIfLevel(value) {
      this.level_filter = value;
      this.filterIfClick();
    },
    filterIfType(value) {
      this.type_filter = value;
      this.filterIfClick();
    },
    filterIfStatu(value) {
      this.statu_filter = value;
      this.filterIfClick();
    },
    filterIfClick() {
      // 创建一个过滤后的数据副本
      let filteredData = this.cl_data;

      //根据进度状态筛选
      if (this.statu_filter != "") {
        console.log("filteredData:", filteredData);
        filteredData = filteredData.filter(item => item[5] === this.statu_filter);
        console.log("filteredData:", filteredData);
      }

      // 根据类型筛选
      if (this.type_filter != "") {
        filteredData = filteredData.filter(item => item[2] === this.type_filter);
        console.log("filteredData1:", filteredData);
      }

      // 根据等级筛选
      if (this.level_filter != "") {
        filteredData = filteredData.filter(item => item[3] === this.level_filter);
        console.log("filteredData2:", filteredData);
      }

      // 更新数据源
      this.data = filteredData;

      this.create_hot();
    },
    clearFilter() {
      this.data = this.cl_data;
      this.create_hot();
    },
    getAllProject() {
      web_getAllProject().then(res => {
        const users = this.personOptions_res;
        // 创建一个映射对象，方便查找
        const usernameToRealnameMap = Object.fromEntries(users.map(user => [user.username, user.realname]));

        // 遍历项目数组，替换 zhipian 字段的值
        res.forEach(project => {
          if (usernameToRealnameMap[project.zhipian]) {
            project.zhipian = usernameToRealnameMap[project.zhipian];
          }
        });

        const formattedData = res.map(item => [
          item.project_name,
          item.eng_name,
          item.project_type,
          item.level,
          item.zhipian,
          item.taskProgress,
          item.project_back,
          item.startTime,
          item.endTime
        ]);
        this.data = formattedData;
        this.cl_data = formattedData;
        // console.log("this.data:", JSON.stringify(this.data));
        // console.log("this.personOptions_res:", JSON.stringify(this.personOptions_res));
        // 创建 realname 到 username 的映射
        // 创建 realname 到 username 的映射

        this.$nextTick(() => {
          this.create_hot();
          // this.getCellProperties();
          // 添加事件监听器
          this.handleKeyDown = event => {
            let isSaving = false; // 标志变量，表示是否正在保存数据
            let saveTimeout = null; // 用于管理时间限制
            if (event.ctrlKey && event.key === "s") {
              event.preventDefault(); // 防止默认行为

              if (isSaving) return; // 正在保存时返回

              isSaving = true; // 设置标志为正在保存

              // 调用保存数据的方法
              this.saveData()
                .then(() => {
                  isSaving = false; // 保存成功后重置标志
                })
                .catch(error => {
                  console.error("保存过程中出现错误:", error);
                  isSaving = false; // 确保在错误后也重置标志
                });

              clearTimeout(saveTimeout);
              saveTimeout = setTimeout(() => {
                isSaving = false; // 超过时间限制后重置标志
              }, 2000);
            }
          };

          // 监听 Ctrl+S 事件
          document.addEventListener("keydown", this.handleKeyDown);
          console.log("监听 Ctrl+S 事件");
        });
      });
    },
    // 单部门返回
    getDepartPs() {
      const depart = "D_ZP";
      web_getDepartPs(depart).then(res => {
        this.personOptions_res = res;
        let realnameArray = res.map(user => user.realname);
        realnameArray.unshift("");
        this.personOptions = realnameArray;
        // console.log("this.personOptions", this.personOptions);
        this.$nextTick(() => {
          this.getAllProject();
        });
      });
    },
    create_hot() {
      // 指定表格的 DOM 元素
      const example = this.$el.querySelector("#exampleTheme");

      // 清空 DOM 元素的内容，以便重新创建
      while (example.firstChild) {
        example.removeChild(example.firstChild);
      }

      let hot = new Handsontable(example, {
        data: this.data,

        // height: 450,
        colWidths: [180, 220, 140, 120, 120, 120, 140, 160, 160],
        colHeaders: [
          "项目名称",
          "英文名",
          "项目类型",
          "项目等级",
          "制片",
          "进度状态",
          "项目备注",
          "资产开始时间",
          "资产结束时间"
        ],
        contextMenu: [
          "cut",
          "copy",
          "---------",
          "row_above",
          "row_below",
          "remove_row",
          "---------",
          "alignment",
          "make_read_only",
          "clear_column"
        ],
        columns: [
          { data: 0, type: "text", headerClassName: "htLeft" },
          { data: 1, type: "text", headerClassName: "htLeft" },
          {
            data: 2,
            type: "dropdown",
            source: this.typeOptions,
            headerClassName: "htLeft"
          },
          { data: 3, type: "dropdown", source: this.levelOptions, headerClassName: "htLeft" },
          { data: 4, type: "dropdown", source: this.personOptions, headerClassName: "htLeft" },
          { data: 5, type: "dropdown", source: this.jinduOptions, headerClassName: "htLeft" },
          { data: 6, type: "text", headerClassName: "htLeft" },
          { data: 7, type: "date", dateFormat: "DD/MM/YYYY", headerClassName: "htLeft" },
          { data: 8, type: "date", dateFormat: "DD/MM/YYYY", headerClassName: "htLeft" }
        ],
        dropdownMenu: true,
        hiddenColumns: { indicators: true },
        multiColumnSorting: true,
        filters: true,
        rowHeaders: true,
        themeName: "ht-theme-main",
        manualRowMove: true,
        headerClassName: "htLeft",
        autoWrapRow: true,
        autoWrapCol: true,
        manualRowResize: true,
        manualColumnResize: true,
        navigableHeaders: true,
        copyPaste: true,
        beforeKeyDown: event => {
          // 检测 Ctrl + C
          if (event.ctrlKey && event.key === "c") {
            console.log("Ctrl+C was pressed");
            // 在这里添加您的自定义逻辑，比如记录数据
            const selected = hot.getSelected();
            const copiedData = selected.map(([startRow, startCol, endRow, endCol]) => {
              return hot.getData(startRow, startCol, endRow, endCol);
            });
            console.log("Copied data:", copiedData);

            // 阻止默认的复制行为
            event.stopImmediatePropagation();
            event.preventDefault();
          }
          // 检测 Ctrl + V
          if (event.ctrlKey && event.key === "v") {
            console.log("Ctrl+V was pressed");

            // 在这里添加自定义的粘贴逻辑
            const clipboardData = event.clipboardData || window.clipboardData; // 获取剪贴板数据
            console.log("Pasted data:", clipboardData);
            // const pastedData = clipboardData.getData("Text"); // 获取文本数据
            const pastedData = "Pasted data";

            // 将粘贴数据处理为数组
            const rows = pastedData.split("\n").map(row => row.split("\t"));

            // 获取当前光标的位置
            const selected = hot.getSelectedLast();
            console.log("Selected:", selected);

            // 阻止默认的粘贴行为
            event.stopImmediatePropagation();
            event.preventDefault();
          }
        },
        licenseKey: "non-commercial-and-evaluation",
        cells: (row, col) => {
          const cellProperties = {};
          if (this.data && this.data.length > row && row >= 0) {
            // 只有项目类型列 (index 2) 才需要自定义样式
            if (col === 2) {
              const styles = {
                买量: "project-type-buy",
                番剧: "project-type-anime",
                AI: "project-type-ai",
                电影: "project-type-movie",
                其他: "project-type-other"
              };
              const projectType = this.data[row][2]; // 获取当前行的项目类型
              if (styles[projectType]) {
                cellProperties.className = styles[projectType]; // 使用 className 属性
              }
            }

            if (col == 3) {
              const levelstyles = {
                S: "level-s",
                A: "level-a",
                B: "level-b",
                C: "level-c"
              };
              const levelType = this.data[row][3]; // 获取当前行的项目类型
              if (levelstyles[levelType]) {
                cellProperties.className = levelstyles[levelType]; // 使用 className 属性
              }
            }
            if (col === 5) {
              const styles = {
                进行: "project-status-in-progress",
                修改: "project-status-modified",
                暂停: "project-status-paused",
                完成: "project-status-completed"
              };

              const taskProgress = this.data[row][5]; // 获取当前行的进度状态
              if (styles[taskProgress]) {
                cellProperties.className = styles[taskProgress]; // 使用 className 属性
              }
            }
            return cellProperties;
          }
        }
      });

      this.c_hot = hot;
      this.getCellProperties();
    },
    saveData() {
      console.log("触发项目管理方法");
      const nameMapping = {};
      this.personOptions_res.forEach(person => {
        nameMapping[person.realname] = person.username;
      });
      // 使用 map 函数遍历数组
      this.data = this.data.map(innerArray => {
        return innerArray.map(item => {
          // 如果 item 是 null，则替换为 ""
          return item === null ? "" : item;
        });
      });
      // 遍历 thisData 并替换每一行中的人员名称
      this.data.forEach(row => {
        if (nameMapping[row[4]]) {
          row[4] = nameMapping[row[4]];
        }
      });

      // 输出更新后的整个数据
      console.log(JSON.stringify(this.data));
      // 用户确认，执行卸载逻辑
      web_addProject(this.data).then(res => {
        console.log("res:", res);
        ElMessage.success("保存成功");
      });
      return new Promise((resolve, reject) => {
        // 这里是保存逻辑，可以是 API 调用等
        setTimeout(() => {
          resolve(); // 假设保存成功
          // 如果出现错误，可以调用 reject()
        }, 1000);
      });
    },
    getCellProperties() {
      const readOnlyCells = [];

      // 7,8是弹窗
      this.data.forEach((item, index) => {
        readOnlyCells.push({ row: index, col: 7 }, { row: index, col: 8 });
      });
      console.log("readOnlyCells:", readOnlyCells);

      // 遍历 readOnlyCells 设置只读
      readOnlyCells.forEach(cell => {
        this.c_hot.setCellMeta(cell.row, cell.col, "readOnly", true);
      });

      // 重新渲染表格以应用更改
      this.c_hot.render();
    }
  }
};
</script>

<style>
@import "./index";
</style>
