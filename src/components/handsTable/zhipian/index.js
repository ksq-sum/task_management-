import { defineComponent } from "vue";
import { HotTable, HotColumn } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import Handsontable from "handsontable";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import { registerLanguageDictionary, zhCN } from "handsontable/i18n";
import { HiddenRows } from "handsontable/plugins/hiddenRows";
import { registerPlugin } from "handsontable/plugins";
import GanttChart from "@/components/handsTable/zpgantetu/GanttChart.vue";
import { loadingSvg } from "@/utils/svg";
import flatpickr from "flatpickr";
import { web_getDepartPs, web_getAllProject } from "@/api/modules/task";
import "flatpickr/dist/flatpickr.min.css";
// register Handsontable's modules
registerAllModules();
registerPlugin(HiddenRows);
// 注册简体中文
registerLanguageDictionary(zhCN);
export default defineComponent({
  data() {
    return {
      data: [],
      n_data: [
        [
          [false, "Tagcat", "United Kingdom", "Classic Vest", "11/10/2025", "01-2331942", true, "172", 2, 2],
          [true, "Zoomzone", "Indonesia", "Cycling Cap", "03/05/2025", "88-2768633", true, "188", 6, 2]
        ]
      ],
      dwb: true,
      gantetu: false,
      huanSelect: ["", "原画", "模型", "绑定", "解算"],
      prolevelOptions: [
        { label: "S", value: "S" },
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" }
      ],
      levelOptions: [],
      progresStatuOptions: [
        { label: "进行", value: "进行" },
        { label: "修改", value: "修改" },
        { label: "暂停", value: "暂停" },
        { label: "完成", value: "完成" }
      ],
      selectedProgress: "",
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
      personOptions_res: [],
      personOptions: [],
      huanjieOptions: ["", "原画", "模型", "绑定", "解算"],
      typeOptions: ["", "买量", "番剧", "AI", "电影", "其他"],
      taskProgressOptions: ["", "进行", "修改", "暂停", "完成"],
      filteredData: [],
      proOptions: [],

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
      zhipianSelectOptions: [],
      peopleSelect: "",
      peopleSelectOptions: [],
      huanjieSelectOptions: [],
      selectedProtype: "",
      language: "zh-CN",
      taskProgressSelect: "",
      taskProgressSelectOptions: [],
      customCellProperties: {},
      selectedZhipian: "",
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
      hottable_csh: false
    };
  },
  components: {
    HotTable,
    HotColumn,
    GanttChart
  },
  mounted() {},
  created() {
    //单部门返回
    this.getDepartPs();

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
    addtemp() {
      // 定义模板对象，所有值为 null
      const template = {
        project_type: null,
        project_name: null,
        eng_name: null,
        level: null,
        zhipian: null,
        taskProgress: null,
        project_back: null,
        startTime: null,
        endTime: null
      };

      // 循环添加 10 条数据
      for (let i = 0; i < 10; i++) {
        this.data.push({ ...template });
      }
    },
    // 单部门返回
    getDepartPs() {
      const depart = "D_ZP";
      web_getDepartPs(depart).then(res => {
        this.personOptions_res = res;
        let realnameArray = res.map(user => user.realname);
        realnameArray.unshift("");
        this.personOptions = realnameArray;
        this.getAllProject();
      });
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
        this.data = res;
        this.hottable_csh = true;
        this.addtemp();
      });
    },
    toggleDwb() {
      this.gantetu = !this.gantetu;
    },
    toggleGantetu() {
      this.dwb = !this.dwb;
    },
    getZhipian() {
      // 提取唯一的人员值并格式化为选择项
      // 提取 person，过滤掉无效值
      const validPeople = this.data.map(item => item.zhipian).filter(person => person != null && person !== ""); // 过滤 null、undefined 和空字符串

      // 去重
      const uniquePeople = [...new Set(validPeople)];

      // 转换为下拉选项
      this.zhipianSelectOptions = uniquePeople.map(person => ({
        value: person,
        label: person
      }));
    },
    startTimeRenderer(instance, td, row, col, prop, value, cellProperties) {
      const clickableElement = document.createElement("div");
      clickableElement.style.display = "flex";
      clickableElement.style.alignItems = "center";
      clickableElement.style.cursor = "pointer";
      // console.log("startTimeRenderer");
      clickableElement.addEventListener("click", event => {
        // 阻止事件冒泡，避免触发Handsontable的单元格选择
        event.stopPropagation();
        // 调用你想要触发的方法
        this.startTimeClick(row, col, value, td, clickableElement);
      });
      td.innerHTML = "";
      // 创建一个 span 元素来包含文本
      const textSpan = document.createElement("span");
      textSpan.textContent = value;
      textSpan.style.marginLeft = "0.3rem";
      const iconElement2 = document.createElement("i");
      iconElement2.className = "iconfont icon-jiahao";
      iconElement2.style.marginLeft = "1.5rem";
      clickableElement.appendChild(textSpan);
      clickableElement.appendChild(iconElement2);

      td.appendChild(clickableElement);
      return td;
    },
    startTimeClick(row, col, value, td, clickableElement) {
      console.log("startTimeClick");
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

      this.selectedPro = "";
      this.selectedZhipian = "";
      this.selectedProgress = "";
      this.selectedProtype = "";

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

      if (prop == "taskProgress") {
        styles = {
          进行: {
            backgroundColor: "#E8F0FF",
            color: "black",
            border: "1px solid #E8F0FF"
          },
          修改: {
            backgroundColor: "#F1F9DB",
            color: "black",
            border: "1px solid #F1F9DB"
          },
          暂停: {
            backgroundColor: "#F5F5F5",
            color: "black",
            border: "1px solid #F5F5F5"
          },
          完成: {
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
            backgroundColor: "#E6E6FA",
            color: "black",
            border: "1px solid #E6E6FA"
          },
          A: {
            backgroundColor: "#F0F8FF",
            color: "black",
            border: "1px solid #F0F8FF"
          },
          B: {
            backgroundColor: "#F0FFF0",
            color: "black",
            border: "1px solid #F0FFF0"
          },
          C: {
            backgroundColor: "#FAF0E6",
            color: "black",
            border: "1px solid #FAF0E6"
          }
        };

        innerDiv.style.padding = "4px";
        innerDiv.style.borderRadius = "8px"; // 稍微减小圆角以适应内边距
        innerDiv.style.display = "inline-block"; // 使 div 大小适应内容
        innerDiv.style.minWidth = "40px"; // 设置最小宽度以确保有足够空间显示内容
      }
      if (prop == "project_type") {
        styles = {
          买量: {
            backgroundColor: "#FF6347",
            color: "white",
            border: "1px solid #FF6347"
          },
          番剧: {
            backgroundColor: "#9ACD32",
            color: "white",
            border: "1px solid #9ACD32"
          },
          AI: {
            backgroundColor: "#9932CC",
            color: "white",
            border: "1px solid #9932CC"
          },
          电影: {
            backgroundColor: "#FFCE20",
            color: "white",
            border: "1px solid #FFCE20"
          },
          其他: {
            backgroundColor: "#4876FF",
            color: "white",
            border: "1px solid #4876FF"
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

    filterIfClick(value) {
      this.selectedProtype = value;
      this.filterData = this.data.filter(item => {
        const protypeMatch = !this.selectedProtype || item.project_type === this.selectedProtype;
        const zhipianMatch = !this.selectedZhipian || item.zhipian === this.selectedZhipian;
        const progressMatch = !this.selectedProgress || item.taskProgress === this.selectedProgress;
        const proMatch = !this.selectedPro || item.level === this.selectedPro;
        return protypeMatch && zhipianMatch && proMatch && progressMatch;
      });

      // 打印筛选后的结果

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
        // 执行您的第二个图标点击逻辑
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
        // 判断当前行的 project_type 是否等于传入的 value
        if (this.data[i].project_type === value) {
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

    onTaskNameChange(row, colIndex, oldValue, newValue) {
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
    },
    handleIconElement2Click(row, col, td, instance) {
      const hotInstance = this.$refs.yourTableRef.hotInstance;
      // 获取当前单元格的值
      const currentValue = instance.getDataAtCell(row, col);
      const template = {
        project_type: currentValue,
        project_name: null,
        eng_name: null,
        level: null,
        zhipian: null,
        pro_type: null,
        project_back: null,
        taskProgress: null,
        startTime: null,
        endTime: null
      };

      // 找到最后一个 project_type 为 currentValue 的元素的索引
      let lastIndex = -1;
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].project_type === currentValue) {
          lastIndex = i;
        }
      }

      // 在最后一个匹配项之后插入新模板
      if (lastIndex !== -1) {
        this.data.splice(lastIndex + 1, 0, { ...template });
      } else {
        // 如果没有找到匹配项，可以选择在末尾添加，或根据需求处理
        this.data.push({ ...template });
      }

      const data = this.data;
      // 重新加载数据
      instance.updateSettings({
        data: data
      });

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
      const shouldHideValue = rowData.hiddenRow == false || rowData.hiddenRow == true;

      if (!shouldHideValue) {
        // 根据条件决定是否隐藏当前单元格的内容
        td.innerHTML = !shouldHideValue ? "" : String(value || "");

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
    clickHotTable() {
      console.log("this.data:", this.data);
    },

    applyFilter() {
      if (this.selectedCategory === "") {
        this.filteredData = this.data;
      } else {
        this.filteredData = this.data
          .map(parent => ({
            ...parent,
            __children: parent.__children.filter(child => child.huanjie === this.selectedCategory)
          }))
          .filter(parent => parent.__children.length > 0);

        console.log("this.filteredData:", this.filteredData);
        this.$refs.yourTableRef.hotInstance.render();
      }
    },

    // 自定义 Flatpickr 编辑器
    registerCustomEditor() {
      Handsontable.editors.registerEditor("customFlatpickrEditor", CustomFlatpickrEditor);
    }
  }
});
