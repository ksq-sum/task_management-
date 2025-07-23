import { defineComponent } from "vue";
import { HotTable, HotColumn } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import Handsontable from "handsontable";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import { registerLanguageDictionary, zhCN } from "handsontable/i18n";
import { HiddenRows } from "handsontable/plugins/hiddenRows";
import { registerPlugin } from "handsontable/plugins";
import { loadingSvg } from "@/utils/svg";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import CustomDateTimeEditor from "./customFlatpickrEditor";
import { web_getDeadline } from "@/api/modules/task";
import GanttChart1 from "@/components/handsTable/gantetu/GanttChart.vue";

// import GanttChart2 from "@/components/handsTable/gantetu/GanttChart.vue";
// register Handsontable's modules
registerAllModules();
registerPlugin(HiddenRows);
// 注册简体中文
registerLanguageDictionary(zhCN);
export default defineComponent({
  data() {
    return {
      data: [
        {
          category: "矛隼",
          artist: null,
          title: "矛隼*",
          label: "MB101",
          person: null,
          pro_type: "角色",
          startTime: null,
          endTime: null,
          huanjie: null,
          gongshi: null,
          statu: null,
          makeback: null,
          level: "S",
          hiddenRow: false,
          taskProgress: "",
          weekday: null
        },
        {
          category: "矛隼",
          title: "矛隼*原画",
          artist: "",
          label: null,
          pro_type: null,
          huanjie: "原画",
          person: "鄢健翔",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-06",
          gongshi: 5,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: "已完成",
          weekday: null
        },
        {
          category: "矛隼",
          title: "矛隼*绑定",
          artist: "",
          label: null,
          pro_type: null,
          huanjie: "模型",
          person: "孔思琦",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-06",
          gongshi: 2,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: "初步完成",
          weekday: null
        },
        {
          category: "矛隼",
          title: "矛隼*解算",
          artist: "",
          label: null,
          pro_type: null,
          huanjie: "绑定",
          person: "刘雅豪",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-07",
          gongshi: 9,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: "进行中",
          weekday: null
        },
        {
          category: "矛隼",
          title: "矛隼*模型",
          artist: "",
          label: null,
          pro_type: null,
          huanjie: "解算",
          person: "孔思琦",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-06",
          gongshi: 6,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: "未开始",
          weekday: null
        },
        {
          category: "菲儿",
          artist: null,
          title: "菲儿*",
          label: "C_FeiEr",
          person: null,
          pro_type: "道具",
          huanjie: null,
          startTime: null,
          endTime: null,
          gongshi: null,
          statu: null,
          makeback: null,
          level: "B",
          hiddenRow: false,
          taskProgress: null,
          weekday: null
        },
        {
          category: "菲儿",
          title: "菲儿*原画",
          artist: "",
          label: null,
          pro_type: null,
          person: null,
          huanjie: "原画",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-06",
          gongshi: 4,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: null,
          weekday: null
        },
        {
          category: "菲儿",
          title: "菲儿*绑定",
          artist: "",
          label: null,
          person: null,
          huanjie: "模型",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-06",
          gongshi: 1,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: null,
          weekday: null
        },
        {
          category: "菲儿",
          title: "菲儿*解算",
          artist: "",
          label: null,
          person: null,
          huanjie: "绑定",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-06",
          gongshi: 7,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: null,
          weekday: null
        },
        {
          category: "菲儿",
          title: "菲儿*模型",
          artist: "",
          label: null,
          person: null,
          huanjie: "解算",
          startTime: "2025-01-06 09:30",
          endTime: "2025-01-06",
          gongshi: 5,
          statu: null,
          makeback: null,
          level: null,
          taskProgress: null,
          weekday: null
        }
      ],
      dialogTableVisible: false,
      huanSelect: ["", "原画", "模型", "绑定", "解算"],
      levelOptions: ["S", "A", "B", "C"],
      levelSelectOptions: [],
      selectedLevel: "",
      tableData: [
        [false, "Tagcat", "United Kingdom", "Classic Vest", "11/10/2025", "01-2331942", true, "172", 2, 2],
        [true, "Zoomzone", "Indonesia", "Cycling Cap", "03/05/2025", "88-2768633", true, "188", 6, 2]
        // 省略其余数据...
      ],
      filterData: [],
      // 列头
      colHeaders1: ["Company Name", "Name", "Sell date", "In stock", "Quantity", "Order ID", "Country"],

      // Context Menu 配置
      contextMenuOptions: [
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
      filterIf1: false,
      filterIf2: false,
      secondColumnSettings: {
        title: "Second column header"
      },
      settings: {
        height: "auto",
        autoWrapRow: true,
        autoWrapCol: true,
        licenseKey: "non-commercial-and-evaluation"
      },
      contextMenuSettings: {
        callback: (key, selection, clickEvent) => {},
        items: {
          shaixuan: {
            name: "筛选"
          },
          colors: {
            name: "Colors...",
            submenu: {
              items: [
                {
                  key: "colors:red",
                  name: "Red",
                  callback: () => {
                    setTimeout(() => {
                      alert("You clicked red!");
                    }, 0);
                  }
                },
                { key: "colors:green", name: "Green" },
                { key: "colors:blue", name: "Blue" }
              ]
            }
          }
        }
      },
      colHeaders: ["Year", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"],
      shuaixuanCols: [{ key: "colors:green", name: "Green" }],
      personOptions: ["", "孔思琦", "刘雅豪", "鄢健翔", "贺怀鹍"],
      huanjieOptions: ["", "原画", "模型", "绑定", "解算"],
      protypeOptions: ["", "角色", "环境", "道具"],
      taskProgressOptions: ["", "未开始", "进行中", "初步完成", "返修", "已完成"],
      filteredData: [],

      selectedTask: "",
      huanjieSelectedTask: "",
      taskOptions: [
        {
          value: "矛隼",
          label: "矛隼"
        },
        {
          value: "菲儿",
          label: "菲儿"
        }
      ],
      protypeSelectOptions: [
        { value: "角色", label: "角色" },
        { value: "环境", label: "环境" },
        { value: "道具", label: "道具" }
      ],
      peopleSelect: "",
      peopleSelectOptions: [],
      huanjieSelectOptions: [],
      selectedProtype: "",
      language: "zh-CN",
      taskProgressSelect: "",
      taskProgressSelectOptions: [],
      customCellProperties: {},
      shortcuts: [
        {
          text: "Today",
          value: new Date()
        },
        {
          text: "Yesterday",
          value: () => {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            return date;
          }
        },
        {
          text: "A week ago",
          value: () => {
            const date = new Date();
            date.setDate(date.getDate() - 7);
            return date;
          }
        }
      ],
      value2: "",
      dateRow: "",
      dateCol: "",
      selectedZhipian: "",
      gantetu: false,
      dwb: true
    };
  },
  components: {
    HotTable,
    HotColumn,
    GanttChart1
  },

  mounted() {
    // this.filteredData = this.data;
    this.getCellProperties();
  },
  created() {
    // 定义模板对象，所有值为 null
    const template = {
      category: null,
      artist: null,
      title: null,
      label: null,
      person: null,
      pro_type: null,
      startTime: null,
      endTime: null,
      huanjie: null,
      gongshi: null,
      statu: null,
      makeback: null,
      level: null,
      hiddenRow: false,
      taskProgress: null,
      weekday: null
    };

    // 循环添加 10 条数据
    for (let i = 0; i < 10; i++) {
      this.data.push({ ...template });
    }
    this.filteredData = this.data;
    // this.contextMenuSettings.items.shaixuan.submenu.items = this.shuaixuanCols;
    this.huanjieSelectOptions = this.huanjieOptions.map(option => ({
      value: option,
      label: option
    }));
    this.levelSelectOptions = this.levelOptions.map(option => ({
      value: option,
      label: option
    }));
    this.taskProgressSelectOptions = this.taskProgressOptions.map(option => ({
      value: option,
      label: option
    }));
    this.filterData = this.data;
    // 提取唯一的人员值并格式化为选择项
    // 提取 person，过滤掉无效值
    const validPeople = this.data.map(item => item.person).filter(person => person != null && person !== ""); // 过滤 null、undefined 和空字符串

    // 去重
    const uniquePeople = [...new Set(validPeople)];

    // 转换为下拉选项
    this.peopleSelectOptions = uniquePeople.map(person => ({
      value: person,
      label: person
    }));

    // this.getCellProperties();
  },
  methods: {
    handleToggleDwb() {
      this.gantetu = false; // 触发子组件的事件时，改变父组件的 gantetu 值
      this.dwb = true;
    },
    toggleDwb(value) {
      // 切换 dwb 的状态
      this.dwb = value;
      // 根据 dwb 的值更新 gantetu
      this.gantetu = !value;
    },
    toggleGantetu(value) {
      // 切换 gantetu 的状态
      this.gantetu = value;
      // 根据 gantetu 的值更新 dwb
      this.dwb = !value;
    },
    getStartDateTime() {
      // console.log("value2:", this.value2);
      const formatVal = this.formatDate(this.value2);
      this.dialogTableVisible = false;
      const hotInstance = this.$refs.yourTableRef.hotInstance;
      hotInstance.setDataAtCell(this.dateRow, this.dateCol, formatVal);
      hotInstance.render();
    },
    formatDate(date) {
      // 获取年、月、日、小时和分钟
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并确保两位数
      let day = String(date.getDate()).padStart(2, "0");
      let hours = String(date.getHours()).padStart(2, "0");
      let minutes = String(date.getMinutes()).padStart(2, "0");

      // 拼接为所需格式
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    startTimeRenderer(instance, td, row, col, prop, value, cellProperties) {
      // 清空单元格内容，避免重复渲染
      Handsontable.dom.empty(td);
      td.style.padding = "10"; // 去除单元格默认的内边距
      td.style.margin = "0"; // 去除单元格默认的外边距
      td.innerHTML = "";
      const clickableElement = document.createElement("div");
      clickableElement.style.display = "flex";
      clickableElement.style.alignItems = "center";
      clickableElement.style.cursor = "pointer";
      clickableElement.addEventListener("click", event => {
        // 阻止事件冒泡，避免触发Handsontable的单元格选择
        event.stopPropagation();
        // 调用你想要触发的方法
        this.startTimeClick(row, col, value, td, clickableElement);
      });
      // 设置 div 的宽度和高度为 100%
      clickableElement.style.width = "100%";
      clickableElement.style.height = "100%";

      // 创建一个 span 元素来包含文本
      const textSpan = document.createElement("span");
      textSpan.textContent = value;
      textSpan.style.marginLeft = "0.3rem";
      clickableElement.appendChild(textSpan);

      td.appendChild(clickableElement);
      return td;
    },
    startTimeClick(row, col, value, td, clickableElement) {
      this.dialogTableVisible = true;
      this.dateRow = row;
      this.dateCol = col;
    },
    customDateTimeEditor() {
      Handsontable.editors.registerEditor("customDateTimeEditor", CustomDateTimeEditor);
    },
    // 设置某个单元格为只读
    setCellReadonly() {
      console.log("setCellReadonly");
      // 获取 Handsontable 实例
      const hotInstance = this.$refs.yourTableRef.hotInstance;
      // 设置指定单元格为只读 (row=1, col=1)
      hotInstance.setCellMeta(0, 0, "readOnly", true);

      // 重新渲染表格以应用更改
      hotInstance.render();
    },
    getCellProperties() {
      const readOnlyCells = [];
      const hotInstance = this.$refs.yourTableRef.hotInstance;

      this.data.forEach((item, index) => {
        if (item.hiddenRow == false || item.hiddenRow == true) {
          readOnlyCells.push(
            { row: index, col: 1 },
            { row: index, col: 5 },
            { row: index, col: 6 },
            { row: index, col: 7 },
            { row: index, col: 8 },
            { row: index, col: 9 },
            { row: index, col: 10 },
            { row: index, col: 11 },
            { row: index, col: 12 },
            { row: index, col: 13 },
            { row: index, col: 14 },
            { row: index, col: 15 }
          );
        } else {
          readOnlyCells.push(
            { row: index, col: 1 },
            { row: index, col: 2 },
            { row: index, col: 3 },
            { row: index, col: 4 },
            { row: index, col: 10 }
          );
        }
      });

      // 遍历 readOnlyCells 设置只读
      readOnlyCells.forEach(cell => {
        hotInstance.setCellMeta(cell.row, cell.col, "readOnly", true);
      });

      // 重新渲染表格以应用更改
      hotInstance.render();
    },

    peopleRenderer(instance, td, row, col, prop, value, cellProperties) {
      // 清空单元格内容
      td.innerHTML = "";

      // 检查值是否为 null 或空白
      if (value === null || value.trim() === "") {
        // 如果是 null 或空白，不显示任何内容
        return;
      }

      // 创建一个内部 div 来包含内容
      const innerDiv = document.createElement("div");
      innerDiv.style.padding = "8px"; // 设置内边距
      innerDiv.style.borderRadius = "6px"; // 设置圆角
      innerDiv.style.backgroundColor = "#f5f5f5"; // 浅灰色背景
      innerDiv.style.color = "#000"; // 黑色字体
      innerDiv.style.border = "1px solid #dcdcdc"; // 浅灰色边框
      innerDiv.style.display = "flex"; // 使用 Flex 布局
      innerDiv.style.alignItems = "center"; // 垂直居中
      innerDiv.style.justifyContent = "center"; // 水平居中

      // 创建文本内容部分
      const textSpan = document.createElement("span");
      textSpan.textContent = value.trim(); // 显示去除前后空格的单元格值
      innerDiv.appendChild(textSpan);

      // 单元格整体样式设置
      td.style.textAlign = "center"; // 水平居中
      td.style.verticalAlign = "middle"; // 垂直居中

      // 将内部 div 添加到单元格
      td.appendChild(innerDiv);

      return td; // 返回处理后的单元格
    },
    clearFilter() {
      // 重置所有选择的过滤器
      this.selectedTask = ""; // 重置任务名选择
      this.selectedProtype = ""; // 重置类型选择
      this.huanjieSelectedTask = ""; // 重置环节选择
      this.selectedLevel = ""; // 重置等级选择
      this.taskProgressSelect = ""; // 重置任务进度选择

      // 重新筛选数据以显示所有数据
      this.filterData = this.data; // 显示所有数据
      this.filterIf = false; // 关闭过滤状态
      this.filterIf1 = false;
      this.filterIf2 = false;
    },
    protypeRenderer(instance, td, row, col, prop, value, cellProperties) {
      // 清空单元格内容
      td.innerHTML = "";

      // 创建一个内部 div 来包含内容
      const innerDiv = document.createElement("div");
      let styles = "";
      if (prop == "pro_type") {
        // 定义不同值对应的样式
        styles = {
          道具: {
            backgroundColor: "#FFEAD6",
            color: "black",
            border: "1px solid #FFEAD6"
          },
          角色: {
            backgroundColor: "#E8F0FF",
            color: "black",
            border: "1px solid #E8F0FF"
          },
          环境: {
            backgroundColor: "#E7F9FD",
            color: "black",
            border: "1px solid #E7F9FD"
          }
        };

        innerDiv.style.padding = "4px";
        innerDiv.style.borderRadius = "8px"; // 稍微减小圆角以适应内边距
        innerDiv.style.display = "inline-block"; // 使 div 大小适应内容
        innerDiv.style.minWidth = "40px"; // 设置最小宽度以确保有足够空间显示内容
      }
      if (prop == "huanjie") {
        styles = {
          原画: {
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb"
          },
          绑定: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb"
          },
          解算: {
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb"
          },
          模型: {
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba"
          }
        };

        innerDiv.style.padding = "5px";
        innerDiv.style.borderRadius = "8px"; // 稍微减小圆角以适应内边距
        innerDiv.style.display = "inline-block"; // 使 div 大小适应内容
        innerDiv.style.minWidth = "60px"; // 设置最小宽度以确保有足够空间显示内容
      }
      if (prop == "taskProgress") {
        styles = {
          未开始: {
            backgroundColor: "#FFEAD6",
            color: "black",
            border: "1px solid #FFEAD6"
          },
          进行中: {
            backgroundColor: "#E8F0FF",
            color: "black",
            border: "1px solid #E8F0FF"
          },
          初步完成: {
            backgroundColor: "#F1F9DB",
            color: "black",
            border: "1px solid #F1F9DB"
          },
          返修: {
            backgroundColor: "#FFF9E4",
            color: "black",
            border: "1px solid #FFF9E4"
          },
          已完成: {
            backgroundColor: "#E7F9FD",
            color: "black",
            border: "1px solid #E7F9FD"
          }
        };

        innerDiv.style.padding = "4px";
        innerDiv.style.borderRadius = "8px"; // 稍微减小圆角以适应内边距
        innerDiv.style.display = "inline-block"; // 使 div 大小适应内容
        innerDiv.style.minWidth = "40px"; // 设置最小宽度以确保有足够空间显示内容
      }
      if (prop == "level") {
        styles = {
          S: {
            backgroundColor: "#7459EE",
            color: "white",
            border: "1px solid #7459EE"
          },
          A: {
            backgroundColor: "#3F85FF",
            color: "white",
            border: "1px solid #3F85FF"
          },
          B: {
            backgroundColor: "#FFCE20",
            color: "white",
            border: "1px solid #FFCE20"
          },
          C: {
            backgroundColor: "#FB6514",
            color: "white",
            border: "1px solid #FB6514"
          }
        };

        innerDiv.style.padding = "4px";
        innerDiv.style.borderRadius = "8px"; // 稍微减小圆角以适应内边距
        innerDiv.style.display = "inline-block"; // 使 div 大小适应内容
        innerDiv.style.minWidth = "40px"; // 设置最小宽度以确保有足够空间显示内容
      }

      // 设置默认样式
      td.style.textAlign = "center"; // 文本居中
      td.style.verticalAlign = "middle"; // 垂直居中

      // 应用样式
      if (styles[value]) {
        Object.assign(innerDiv.style, styles[value]);
        innerDiv.textContent = value;
      } else {
        // 如果值不在预定义样式中，显示默认值
        innerDiv.textContent = value || "";
        innerDiv.style.backgroundColor = "transparent";
        innerDiv.style.color = "inherit";
        innerDiv.style.border = "none";
      }

      // 将内部 div 添加到单元格
      td.appendChild(innerDiv);

      return td; // 返回处理后的单元格
    },

    handleTaskNameClick(row, col, value, td, clickableElement) {},
    weekdayRenderer(instance, td, row, col, prop, value, cellProperties) {
      // 清空单元格内容
      td.innerHTML = "";

      // 如果值为 null 或 undefined
      if (value === null || value === undefined || value === "") {
        // 创建 <i> 图标占位
        const icon = document.createElement("i");
        if (prop == "weekday") {
          icon.className = "iconfont icon-shijian"; // 使用您指定的图标类名
        }
        if (prop == "statu") {
          icon.className = "iconfont icon-pinglun"; // 使用您指定的图标类名
        }
        td.appendChild(icon);
      } else {
        // 如果有实际值，显示值
        td.textContent = value;
      }

      // 设置单元格样式（可选）
      td.style.textAlign = "center"; // 水平居中
      td.style.verticalAlign = "middle"; // 垂直居中

      return;
    },
    filterCommon(proType, protypeMatch, item) {
      if (protypeMatch == true) {
        proType = 1;
      }
      if (proType == 1 && protypeMatch == false && !(item.hiddenRow == false || item.hiddenRow == true)) {
        protypeMatch = true;
      }
      if ((item.hiddenRow == false || item.hiddenRow == true) && protypeMatch == false) {
        proType = 0;
      }
      return [proType, protypeMatch];
    },

    filterIfClick() {
      let proType = 0;
      let level = 0;
      console.log("this.selectedLevel:", this.selectedLevel);
      // 应用所有筛选条件
      // 应用筛选条件
      this.filterData = this.data.filter(item => {
        const taskMatch = !this.selectedTask || item.category === this.selectedTask;
        const taskProgress = !this.taskProgressSelect || item.taskProgress === this.taskProgressSelect;
        let protypeMatch = !this.selectedProtype || item.pro_type === this.selectedProtype;
        if (this.selectedProtype != "") {
          let arr = this.filterCommon(proType, protypeMatch, item);
          proType = arr[0];
          protypeMatch = arr[1];
        }
        const huanjieMatch = !this.huanjieSelectedTask || item.huanjie === this.huanjieSelectedTask;
        let levelMatch = !this.selectedLevel || item.level === this.selectedLevel;
        if (this.levelMatch != "") {
          let arr = this.filterCommon(level, levelMatch, item);
          level = arr[0];
          levelMatch = arr[1];
        }

        const personMatch = !this.peopleSelect || item.person === this.peopleSelect;
        // return taskMatch && protypeMatch && taskProgress && huanjieMatch && levelMatch && protypeZiMatch && levelZiMatch;
        return taskMatch && protypeMatch && taskProgress && huanjieMatch && levelMatch && personMatch;
      });
      console.log("筛选后的数据:", this.filterData);
      if (this.huanjieSelectedTask != "" || this.taskProgressSelect != "" || this.peopleSelect != "") {
        // 遍历 tasks，根据 category 从 data 中查找父元素并插入
        const result = this.filterData.map(task => {
          // 从 data 中找到符合条件的父元素（category 相同，hiddenRow 为 true 或 false）
          const parentItems = this.data.filter(
            item => item.category === task.category && (item.hiddenRow === false || item.hiddenRow === true)
          );

          // 将父元素插入到当前 task 前面，并返回合并后的数组
          return [...parentItems, task];
        });

        // 展平数组
        this.filterData = result.flat();

        console.log(this.filterData);
      }
      // 切换 filterIf 状态
      // this.filterIf = !this.filterIf;
      this.filterIf = true;
      if (this.filterIf1 == false) {
        this.filterIf1 = true;
        this.filterIf2 = false;
      } else {
        this.filterIf1 = false;
        this.filterIf2 = true;
      }
    },
    cgElement(td, clickableElement, value, iconVal, row, col, instance) {
      // 清空单元格内容
      td.innerHTML = "";

      // 创建一个 span 元素来包含文本
      const textSpan = document.createElement("span");
      textSpan.textContent = value;
      textSpan.style.marginLeft = "0.3rem";

      // 创建图标元素
      const iconElement = document.createElement("i");
      iconElement.className = iconVal;
      iconElement.style.marginLeft = "0.2rem";
      if (iconVal == "iconfont icon-fanhui-copy") {
        iconElement.style.fontSize = "1.2rem";
      } else {
        iconElement.style.fontSize = "0.8rem";
      }
      iconElement.addEventListener("click", event => {
        // 阻止事件冒泡
        event.stopPropagation();
        // 执行您的第一个图标点击逻辑
        this.handleIconElementClick(row, col, td, instance, value);
      });

      const iconElement2 = document.createElement("i");
      iconElement2.className = "iconfont icon-jiahao";
      iconElement2.style.marginLeft = "1.5rem";

      // 给第二个图标添加 click 事件监听器
      iconElement2.addEventListener("click", event => {
        // 阻止事件冒泡
        event.stopPropagation();
        // 执行您的第二个图标点击逻辑
        this.handleIconElement2Click(row, col, td, instance);
      });

      clickableElement.appendChild(iconElement);
      clickableElement.appendChild(textSpan);
      clickableElement.appendChild(iconElement2);
      td.appendChild(clickableElement);
    },
    handleIconElementClick(row, col, td, instance, value) {
      const result = [];

      // 从指定的起始行开始遍历数据
      for (let i = row + 1; i < this.data.length; i++) {
        // 判断当前行的 category 是否等于传入的 value
        if (this.data[i].category === value) {
          result.push(i);
        } else {
          // 一旦遇到不匹配的元素，终止循环
          break;
        }
      }

      const hot = this.$refs.yourTableRef.hotInstance;
      if (hot) {
        const hiddenRowsPlugin = hot.getPlugin("hiddenRows");
        // 检查当前行的隐藏状态
        if (!this.data[row]["hiddenRow"]) {
          hiddenRowsPlugin.hideRows(result); // 隐藏行
          hot.render(); // 重新渲染表格
          this.data[row]["hiddenRow"] = true; // 更新隐藏状态
          // 更新单元格图标为"展开"状态
        } else {
          hiddenRowsPlugin.showRows(result); // 显示行
          hot.render(); // 重新渲染表格
          this.data[row]["hiddenRow"] = false; // 更新隐藏状态
          // 更新单元格图标为"收起"状态
        }
      }
    },

    handleAfterCreateRow(index, amount, source) {
      console.log("Row Created:", index, "Amount:", amount, "Source:", source);
      // console.log("this.data:", this.data);

      if (index != 0) {
        console.log(this.data[index - 1]);
        console.log(this.data[index + 1]);
        const hotInstance = this.$refs.yourTableRef.hotInstance;

        if (this.data[index + 1] && this.data[index + 1].hasOwnProperty("hiddenRow")) {
          console.log("前一个元素存在并且包含 hiddenRow 字段。");
        } else {
          hotInstance.setDataAtCell(index, 0, this.data[index - 1].category);
          hotInstance.setDataAtCell(index, 1, this.data[index - 1].category + "*");
          hotInstance.setDataAtCell(index, 5, "原画");

          // 删除hiddenRow字段
          // 确保索引有效并且该元素存在
          if (index >= 0 && this.data[index] && this.data[index].hasOwnProperty("hiddenRow")) {
            delete this.data[index].hiddenRow; // 删除 hiddenRow 字段
          }
          this.setHandle(hotInstance, index);
        }
      }
    },
    handleAfterChange(changes, source) {
      if (source === "loadData") {
        return; // 忽略来自 loadData 的更改
      }

      if (changes) {
        const hotInstance = this.$refs.yourTableRef.hotInstance;

        changes.forEach(([row, prop, oldValue, newValue]) => {
          if (oldValue !== newValue) {
            // 获取列索引
            const colIndex = hotInstance.propToCol(prop);

            // console.log(`Row ${row}, Column ${colIndex} (Property ${prop}) changed from ${oldValue} to ${newValue}`);

            this.onTaskNameChange(row, colIndex, oldValue, newValue);
          }
        });
      }
    },
    formatDateToCustomFormat(dateString) {
      // Create a Date object from the ISO 8601 date string
      const date = new Date(dateString);

      // Extract the components of the date
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      // Construct the formatted date string
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

      return formattedDate;
    },

    async onTaskNameChange(row, colIndex, oldValue, newValue) {
      if (colIndex === 0) {
        // 检查新旧值是否不同
        if (oldValue !== newValue) {
          // 更新 colIndex + 4 的值
          const targetRow = row + 4; // 目标行
          const hotInstance = this.$refs.yourTableRef.hotInstance;

          const zichanValue = hotInstance.getDataAtCell(row, 1);
          let valueBeforeAsterisk = "";
          if (zichanValue != null) {
            valueBeforeAsterisk = zichanValue.split("*")[0];
            if (valueBeforeAsterisk != newValue) {
              hotInstance.setDataAtCell(row, colIndex + 1, newValue + "*");
            }
          }

          // 遍历从 row+1 到 row+4
          for (let i = row + 1; i <= row + 4; i++) {
            const cellValue = hotInstance.getDataAtCell(i, 1);

            if (cellValue && cellValue.startsWith(oldValue + "*")) {
              // 提取 '*' 号后面的值
              const postAsterisk = cellValue.substring((oldValue + "*").length);

              // 更新为 newValue + "*" + 原*号后面的值
              hotInstance.setDataAtCell(i, 1, newValue + "*" + postAsterisk);
            }
          }
          hotInstance.render();
        }
      }

      if (colIndex === 5) {
        // 检查新旧值是否不同
        if (oldValue !== newValue) {
          const hotInstance = this.$refs.yourTableRef.hotInstance;

          // 获取同行 colIndex = 1 的值
          const currentValue = hotInstance.getDataAtCell(row, 1);

          // 更新 colIndex = 1 的值，将 * 后面的值替换为 newValue
          if (currentValue) {
            const parts = currentValue.split("*");
            if (parts.length > 1) {
              // 更新 * 后面的值
              hotInstance.setDataAtCell(row, 1, parts[0] + "*" + newValue);
            }
          }
        }
      }

      if (colIndex === 8 || colIndex === 9) {
        const hotInstance = this.$refs.yourTableRef.hotInstance; // 获取 col = 8，row = row 的值
        const valueCol8 = hotInstance.getDataAtCell(row, 8);

        // 获取 col = 9，row = row 的值
        const valueCol9 = hotInstance.getDataAtCell(row, 9);

        // 判断这两个值是否都不为空
        if (
          valueCol8 !== null &&
          valueCol8 !== undefined &&
          valueCol8 !== "" &&
          valueCol9 !== null &&
          valueCol9 !== undefined &&
          valueCol9 !== ""
        ) {
          let numberValue = Number(valueCol9);
          // 两个值都不为空的情况下，执行相应的操作
          const response = await web_getDeadline(valueCol8 + ":00", numberValue);
          const formattedResponse = this.formatDateToCustomFormat(response);
          if (formattedResponse) {
            hotInstance.setDataAtCell(row, 10, formattedResponse);
          }
        }
      }
    },
    setHandle(hotInstance, targetRow) {
      hotInstance.setCellMeta(targetRow, 5, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 6, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 7, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 8, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 9, "readOnly", false);

      hotInstance.setCellMeta(targetRow, 11, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 12, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 13, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 14, "readOnly", false);
      hotInstance.setCellMeta(targetRow, 15, "readOnly", false);

      hotInstance.setCellMeta(targetRow, 1, "readOnly", true);
      hotInstance.setCellMeta(targetRow, 2, "readOnly", true);
      hotInstance.setCellMeta(targetRow, 10, "readOnly", true);
      hotInstance.setCellMeta(targetRow, 3, "readOnly", true);
      hotInstance.setCellMeta(targetRow, 4, "readOnly", true);
    },
    handleIconElement2Click(row, col, td, instance) {
      const hotInstance = this.$refs.yourTableRef.hotInstance;
      // 获取当前单元格的值
      const currentValue = instance.getDataAtCell(row, col);
      const nextCellValue = instance.getDataAtCell(row + 1, col + 1);
      console.log("获取当前单元格的值:", currentValue);
      console.log("获取下一行:", instance.getDataAtCell(row + 1, col + 1));

      // 要填充的行数
      const rowsToFill = 1;

      // 获取当前的总行数
      let totalRows = instance.countRows();

      // 检查是否需要添加新行
      const requiredRows = row + rowsToFill + 1; // +1 是因为行号从0开始

      // 要填充的行数
      const template = {
        category: null,
        artist: null,
        title: null,
        label: null,
        person: null,
        pro_type: null,
        startTime: null,
        endTime: null,
        huanjie: null,
        gongshi: null,
        statu: null,
        makeback: null,
        level: null,
        hiddenRow: false,
        taskProgress: null,
        weekday: null
      };
      // 循环添加 2 条数据
      for (let i = 0; i < 1; i++) {
        this.data.push({ ...template });
      }
      const data = this.data;
      // 重新加载数据
      // 更新数据但保持当前配置
      instance.updateSettings({
        data: data
      });

      instance.setDataAtCell(row, 1, currentValue + "*");
      hotInstance.setCellMeta(row, 1, "readOnly", true);

      // 填充值到下面的4个单元格
      // 在函数开始处添加一个数组来存储新添加的行号
      let newRowsAdded = [];
      let lastIndex = -1;
      // 判断条件
      if (nextCellValue === null || (typeof nextCellValue === "string" && !nextCellValue.includes(currentValue))) {
        for (let i = 1; i <= rowsToFill; i++) {
          const targetRow = row + i;
          // newRowsAdded.push(targetRow);
          // 获取 targetRow 行的数据对象
          hotInstance.alter("insert_row_below", targetRow - 1, 1); // 插入新行
          instance.setDataAtCell(targetRow, col, currentValue);
          if (i == 1) {
            instance.setDataAtCell(targetRow, 5, "原画");
            instance.setDataAtCell(targetRow, 1, currentValue + "*原画");
          }
          this.setHandle(hotInstance, targetRow);
        }
      } else {
        // 找到最后一个 project_type 为 currentValue 的元素的索引
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].category === currentValue) {
            lastIndex = i;
          }
        }
        // console.log("lastIndex:", lastIndex);

        // 在最后一个匹配项之后插入新模板
        if (lastIndex != -1) {
          hotInstance.alter("insert_row_below", lastIndex, 1); // 插入新行
          instance.setDataAtCell(lastIndex + 1, col, currentValue);
          instance.setDataAtCell(lastIndex + 1, 5, "原画");
          instance.setDataAtCell(lastIndex + 1, 1, currentValue + "*原画");
          this.setHandle(hotInstance, lastIndex + 1);
        } else {
          // 如果没有找到匹配项，可以选择在末尾添加，或根据需求处理
          this.data.push({ ...template });
        }
      }
      const seenCategories = new Set();
      this.data.forEach(item => {
        if (item.category !== null) {
          if (seenCategories.has(item.category)) {
            // 如果该类别已经出现过，删除 hiddenRow 字段
            delete item.hiddenRow;
          } else {
            // 如果该类别尚未出现，保留 hiddenRow 并记录该类别
            seenCategories.add(item.category);
          }
        }
      });
      // console.log(this.data);

      // 重新渲染表格
      instance.render();
    },

    taskNameRenderer(instance, td, row, col, prop, value, cellProperties) {
      // 创建一个包含文本和图标的可点击元素
      const clickableElement = document.createElement("div");
      clickableElement.style.display = "flex";
      clickableElement.style.alignItems = "center";
      clickableElement.style.cursor = "pointer";
      // 获取当前行的数据
      const rowData = instance.getSourceDataAtRow(row);

      // 检查 huanjie 字段是否有值且不是 null
      const shouldHideValue = rowData.huanjie !== null && rowData.huanjie !== "";
      if (shouldHideValue) {
        // 根据条件决定是否隐藏当前单元格的内容
        td.innerHTML = shouldHideValue ? "" : String(value || "");

        // 返回 td 表示渲染已完成
        return td;
      } else {
        // 添加点击事件监听器
        clickableElement.addEventListener("click", event => {
          // 阻止事件冒泡，避免触发Handsontable的单元格选择
          event.stopPropagation();
          // 调用你想要触发的方法
          this.handleTaskNameClick(row, col, value, td, clickableElement);
        });
        // 获取当前行的数据
        const rowData = instance.getSourceDataAtRow(row);
        // 根据行的展开状态选择图标
        const iconClass = rowData.hiddenRow ? "iconfont icon-fanhui-copy" : "iconfont icon-xiala";
        this.cgElement(td, clickableElement, value, iconClass, row, col, instance);

        // 将图标添加到单元格
        // td.appendChild(iconElement);
        // td.appendChild(textSpan);

        return td;
      }
    },
    getdata() {
      return this.data;
    },
    hiddenRows() {
      const hot = this.$refs.yourTableRef.hotInstance;
      if (hot) {
        const hiddenRowsPlugin = hot.getPlugin("hiddenRows");
        hiddenRowsPlugin.hideRow(1); // 隐藏第2行（索引从0开始）
        hot.render(); // 重新渲染表格以应用更改
      }
      // const plugin = hot.getPlugin("hiddenRows");

      // plugin.hideRow(4);
    },
    statusRenderer(instance, td, row, col, prop, value, cellProperties) {
      const div = document.createElement("div");
      div.style.backgroundColor = value === "完成" ? "green" : "red";
      div.style.color = "white";
      div.style.padding = "5px";
      div.style.borderRadius = "5px";
      div.style.textAlign = "center";
      div.innerText = value;
      td.innerHTML = "";
      td.appendChild(div);
    },
    cgBackColor() {
      console.log("cgBackColor:");
    },
    clickHotTable() {
      // console.log("this.data:", this.data);
    },

    // applyFilter() {
    //   if (this.selectedCategory === "") {
    //     this.filteredData = this.data;
    //   } else {
    //     this.filteredData = this.data
    //       .map(parent => ({
    //         ...parent,
    //         __children: parent.__children.filter(child => child.huanjie === this.selectedCategory)
    //       }))
    //       .filter(parent => parent.__children.length > 0);

    //     console.log("this.filteredData:", this.filteredData);
    //     this.$refs.yourTableRef.hotInstance.render();
    //   }
    // },

    // 自定义 Flatpickr 编辑器
    registerCustomEditor() {
      Handsontable.editors.registerEditor("customFlatpickrEditor", CustomFlatpickrEditor);
    }
  }
});
