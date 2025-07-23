<template>
  <div>
    <!-- 人员 弹窗 -->
    <el-dialog v-model="dialogTableVisible_people" title="选择开始人员" width="400" align-center>
      <el-autocomplete
        v-model="peopleValue_dialog"
        :fetch-suggestions="querySearch"
        placeholder="请输入人员"
        @select="handleSelect_people"
        clearable
      >
      </el-autocomplete>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible_people = false">取消</el-button>
          <el-button type="primary" @click="getPeopleTime"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <div style="display: flex; height: 40px; margin-top: 10px; border-radius: 8px">
      <div class="pro-p jxj_x">解限机</div>
      <div class="pro-p ddj">大东家</div>
      <div class="pro-p ddj">宝莲灯2</div>
      <div class="pro-p ddj">绝世强龙</div>
      <div class="pro-p ddj">可莉娜</div>
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

    <div style="display: flex; margin-top: 20px; margin-left: 20px">
      <div style="display: flex; align-items: center; width: 200px; white-space: nowrap">
        <div>部门：</div>
        <el-select v-model="selectedTask" placeholder="请选择部门" @change="filterData">
          <el-option v-for="item in taskOptions" :value="item"> </el-option>
        </el-select>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>

      <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
        <div>人员：</div>
        <el-select v-model="selectedProtype" placeholder="请选择人员" @change="filterData">
          <el-option v-for="item in protypeSelectOptions" :value="item"> </el-option>
        </el-select>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>
    </div>
    <div style="height: 70vh; max-height: 75vh; margin-top: 30px; overflow-y: scroll">
      <div v-show="dwb" id="exampleTheme"></div>
    </div>
  </div>
</template>

<script>
import Handsontable from "handsontable";
import { HiddenRows } from "handsontable/plugins/hiddenRows";
import { registerPlugin } from "handsontable/plugins";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import pinyin from "pinyin";
import {} from "@/api/modules/task";
import GanttChart from "@/components/handsTable/zpgantetu/GanttChart.vue";
// web_get_department_user
import { web_get_department_user, web_search_tasks, web_crud_assign } from "@/api/modules/task";
// import { fi } from "element-plus/es/locale";

registerPlugin(HiddenRows);
// 自定义编辑器

export default {
  components: {
    GanttChart
  },
  name: "HandsontableComponent",
  data() {
    return {
      data: [
        ["绑定组", "", "", "", "", "", "", "", "", "", true, true],
        ["绑定组", "绑定组-张忠", "张忠", "绑定组", "绑定组主管", "", "", "", "", "", false, true],
        ["绑定组", "绑定组-赵笑", "赵笑", "绑定组", "绑定师", "", "", "", "", "", false, true],
        ["绑定组", "绑定组-陶虹", "陶虹", "绑定组", "绑定师", "", "", "", "", "", false, true],
        ["绑定组", "绑定组-田博元", "田博元", "绑定组", "绑定师", "", "", "", "", "", false, true]
      ],
      cl_data: [],
      gantetu: false,
      dwb: true,
      c_hot: null,
      dialogTableVisible_people: false,
      peopleValue_dialog: "",
      pro_code: "JXJ_jiexianji",
      peopleSelectOptions: "",
      personOptions_res: "",
      personOptions: "",
      taskOptions: [],
      selectedTask: "",
      protypeSelectOptions: [],
      selectedProtype: "",
      pro_code: "JXJ_jiexianji",
      handleKeyDown: null
    };
  },
  mounted() {},
  created() {
    this.get_get_department_user();

    // this.getDepartPs();
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    // this.showConfirm();
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    searchTasks() {
      web_search_tasks().then(res => {
        // 生成目标数组
        let resultArray = [];

        // 用于存储部门的集合
        const departmentSet = new Set();

        // 遍历用户数据，确定应包含的部门
        res.forEach(user => {
          const personOption = this.personOptions_res.find(option => option.username === user.username);
          if (personOption) {
            departmentSet.add(personOption.depart_name); // 添加部门名称到集合中
          }
        });

        // 根据部门名称添加初始行及用户行
        departmentSet.forEach(department => {
          // 添加部门行
          resultArray.push([department, "", "", "", "", "", "", "", "", "", true, true, ""]);

          // 遍历用户数据，再次构建用户行
          res.forEach(user => {
            const personOption = this.personOptions_res.find(option => option.username === user.username);
            if (personOption && personOption.depart_name === department) {
              // 找到对应用户，构建数组行
              const userRow = [
                personOption.depart_name, // 部门名称
                `${personOption.depart_name}-${personOption.realname}`, // 完整名称
                personOption.realname, // 姓名
                personOption.depart_name, // 部门名称
                personOption.shenfen, // 职位
                "", // 空白字段
                user.start_time, // 空白字段
                user.end_time, // 空白字段
                user.all_tasks, // 空白字段
                user.gongshi, // 空白字段
                user.delete_flag === 1, // 删除标志
                true, // 活动标志
                user.create_time // 创建时间
              ];
              // 将用户行添加到部门行下面
              resultArray.push(userRow);
            }
          });
        });

        this.data = resultArray;
        this.cl_data = this.data;
        // 输出结果
        // console.log(JSON.stringify(newArray));
        // 获取索引为 0 的值并去重
        const uniqueValues = [...new Set(resultArray.map(item => item[0]))];
        const uniquePersons = [...new Set(resultArray.map(item => item[2]).filter(value => value !== ""))];
        this.taskOptions = uniqueValues;
        this.protypeSelectOptions = uniquePersons;

        // console.log(JSON.stringify(this.data));
        this.create_hot();
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
    },
    startTimeClick(row, col, value, td, clickableElement) {
      this.dialogTableVisible = true;
      this.dateRow = row;
      this.dateCol = col;
    },

    get_get_department_user() {
      web_get_department_user().then(res => {
        this.personOptions_res = res;
        this.peopleSelectOptions = this.personOptions_res.map((item, index) => {
          return {
            value: item.realname, // 下标从 1 开始
            label: item.realname // 使用 realname 作为标签
          };
        });
        let realnameArray = res.map(user => user.realname);
        realnameArray.unshift("");
        this.personOptions = realnameArray;
        this.searchTasks();
        // this.
        // console.log("res:", res);
      });
    },
    handleAfterChange(changes, source) {},
    handleAfterCreateRow(index, amount, source) {},
    formatDateToCustomFormat(dateString) {},
    async onTaskNameChange(row, col, oldValue, newValue) {},
    formatDate(date) {},
    getStartDateTime() {},
    getCurrentTime() {
      const now = new Date();

      // 获取各个部分
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以加1
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      // 格式化为 yyyy-MM-dd hh:mm:ss
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getPeopleTime() {
      this.dialogTableVisible_people = false;
      const foundPerson = this.personOptions_res.find(person => person.realname === this.peopleValue_dialog);
      const row_one = [
        foundPerson["depart_name"],
        foundPerson["depart_name"] + "-" + this.peopleValue_dialog,
        this.peopleValue_dialog,
        foundPerson["depart_name"],
        foundPerson["shenfen"],
        "",
        "",
        "",
        "",
        "",
        false,
        true,
        this.getCurrentTime()
      ];

      // 取出 index 0 的值
      const valueToMatch = row_one[0];
      const row_fu = [valueToMatch, "", "", "", "", "", "", "", "", "", true, true, ""]; // 要添加的新行

      // 过滤出所有 index 为 0 且值为空的数组
      let filteredData = this.data.filter(item => !(item[0] === "" && item.length === 13));
      filteredData.push(row_fu);
      filteredData.push(row_one);

      // 使用 Set 进行去重
      const uniqueData = Array.from(new Set(filteredData.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));

      // 输出处理后的结果
      const sortedData = uniqueData.sort((a, b) => {
        // 比较下标为 0 的值
        if (a[0] < b[0]) return -1; // a 在 b 之前
        if (a[0] > b[0]) return 1; // a 在 b 之后
        return 0; // a 和 b 相等
      });

      // 输出结果
      this.data = sortedData;
      const uniqueValues = [...new Set(sortedData.map(item => item[0]))];
      const uniquePersons = [...new Set(sortedData.map(item => item[2]).filter(value => value !== ""))];
      this.taskOptions = uniqueValues;
      this.protypeSelectOptions = uniquePersons;
      // console.log(JSON.stringify(this.data));
      this.peopleValue_dialog = "";
      // this.c_hot.render();
      this.create_hot();
    },
    get_pro_proNode() {},
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
    filterIfLevel(value) {},
    filterIfType(value) {},
    filterData() {
      this.filteredData = this.cl_data.filter(item => {
        const matchesTask = this.selectedTask ? item[0] === this.selectedTask : true;
        const matchesProtype = this.selectedProtype ? item[2] === this.selectedProtype : true;
        return matchesTask && matchesProtype;
      });
      this.data = this.filteredData;
      this.create_hot();
    },
    clearFilter() {
      this.data = this.cl_data;
      this.create_hot();
    },
    getAllProject() {},
    // 所有人
    getDepartPs() {},
    querySearch(queryString, cb) {
      // 模糊匹配逻辑
      const results = this.peopleSelectOptions.filter(item => {
        return item.label.toLowerCase().includes(queryString.toLowerCase());
      });
      cb(results);
    },
    handleSelect(item) {
      // 处理选择的项
      // console.log("选择的人员:", item);
      this.peopleValue = item.label; // 更新输入框的值
      this.filterIfClick("peopleSelected", item.label);
    },
    handleSelect_people(item) {
      this.peopleValue_dialog = item.label;
    },
    create_hot() {
      // 指定表格的 DOM 元素
      const example = this.$el.querySelector("#exampleTheme");

      // 清空 DOM 元素的内容，以便重新创建
      while (example.firstChild) {
        example.removeChild(example.firstChild);
      }
      this.addTen();

      let hot = new Handsontable(example, {
        data: this.data,
        colWidths: [140, 140, 120, 140, 140, 140, 160, 160, 120, 120],
        colHeaders: [
          "部门",
          "标题",
          "人员",
          "人员*部门",
          "人员*职位",
          "人员*状态",
          "最早开始时间",
          "最晚截止时间",
          "所有任务",
          "预设工时"
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
          {
            data: 0,
            type: "text",
            headerClassName: "htLeft",
            renderer: this.customRenderer
          },
          { data: 1, type: "text", headerClassName: "htLeft" },
          {
            data: 2,
            type: "text",
            headerClassName: "htLeft",
            renderer: this.peopleRenderer
          },
          { data: 3, type: "dropdown", source: this.protypeOptions, headerClassName: "htLeft" },
          { data: 4, type: "dropdown", source: this.levelOptions, headerClassName: "htLeft" },
          { data: 5, type: "dropdown", source: this.huanjieOptions, headerClassName: "htLeft" },
          { data: 6, type: "text", headerClassName: "htLeft" },
          { data: 7, type: "text", headerClassName: "htLeft" },
          { data: 8, type: "text", headerClassName: "htLeft" },
          { data: 9, type: "text", headerClassName: "htLeft" }
        ],
        dropdownMenu: true,
        hiddenColumns: { indicators: true },
        hiddenRows: { indicators: true },
        // multiColumnSorting: true,
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
        afterCreateRow: this.handleAfterCreateRow,
        afterChange: this.handleAfterChange,
        cells: (row, col) => {
          const cellProperties = {};
          if (this.data && this.data.length > row && row >= 0) {
            return cellProperties;
          }
        },
        licenseKey: "non-commercial-and-evaluation"
      });

      // 保存 Handsontable 实例
      this.c_hot = hot;
    },
    // 保存数据的函数
    // 保存数据的方法
    // 保存数据的方法
    saveData() {
      console.log("人员saveData");
      console.log("this.show", this.show);

      // 过滤掉第一个索引为0的值为""的数组
      const filteredArray = this.cl_data.filter(item => item[0] !== "" && item[10] !== true);
      console.log(JSON.stringify(this.personOptions_res));
      console.log("过滤后的数据:", JSON.stringify(filteredArray));

      return web_crud_assign(filteredArray, this.pro_code)
        .then(res => {
          console.log("res:", res);
        })
        .catch(error => {
          console.error("保存数据时出错:", error);
          throw error; // 确保在捕获错误时抛出异常
        });
    },
    getCellProperties() {
      const readOnlyCells = [];

      this.data.forEach((item, index) => {
        if (item[16] == true) {
          readOnlyCells.push(
            { row: index, col: 1 },
            { row: index, col: 5 },
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
        this.c_hot.setCellMeta(cell.row, cell.col, "readOnly", true);
      });

      // 重新渲染表格以应用更改
      this.c_hot.render();
    },
    commonRender(td, row, col, value, type) {
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
        this.peopleClick(row, col, value, td, clickableElement);
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
    peopleRenderer(instance, td, row, col, prop, value, cellProperties) {
      this.commonRender(td, row, col, value, "people");
    },
    startTimeRenderer(instance, td, row, col, prop, value, cellProperties) {
      this.commonRender(td, row, col, value, "startTime");
    },
    peopleClick(row, col, value, td, clickableElement) {
      this.dialogTableVisible_people = true;
      this.dateRow = row;
      this.dateCol = col;
    },
    // 自定义渲染器
    // 自定义渲染器
    customRenderer(hotInstance, td, row, col, prop, value, cellProperties) {
      // 获取当前行的数据
      const rowData = hotInstance.getSourceDataAtRow(row);

      if (rowData[10]) {
        // 创建可点击的元素
        const clickableElement = document.createElement("div");
        clickableElement.style.display = "flex";
        clickableElement.style.alignItems = "center";
        clickableElement.style.cursor = "pointer";

        const iconElement = document.createElement("i");
        if (rowData[11]) {
          // 创建图标元素
          iconElement.className = "iconfont icon-xiala";
          iconElement.style.fontSize = "0.8rem";
          iconElement.style.marginRight = "5px"; // 设置图标和文本之间的间距
        } else {
          // 创建图标元素
          iconElement.className = "iconfont icon-fanhui-copy"; // 初始图标
          iconElement.style.fontSize = "1.4rem";
          iconElement.style.marginRight = "5px"; // 设置图标和文本之间的间距
        }

        // 添加文本
        const textNode = document.createTextNode(value);
        clickableElement.appendChild(iconElement);
        clickableElement.appendChild(textNode);

        // 创建另一个图标元素
        const iconElement2 = document.createElement("i");
        iconElement2.className = "iconfont icon-jiahao"; // 另一个图标
        iconElement2.style.marginLeft = "1.5rem"; // 设置图标和文本之间的间距
        clickableElement.appendChild(iconElement2);

        // 为 iconElement 添加点击事件
        iconElement.onclick = () => {
          // 隐藏
          const result = [];

          // 从指定的起始行开始遍历数据
          for (let i = row + 1; i < this.data.length; i++) {
            // 判断当前行的 category 是否等于传入的 value
            if (this.data[i][0] === value) {
              result.push(i);
            } else {
              // 一旦遇到不匹配的元素，终止循环
              break;
            }
          }

          // 获取 hiddenRows 插件
          const hiddenRowsPlugin = this.c_hot.getPlugin("hiddenRows");
          if (iconElement.className === "iconfont icon-xiala") {
            this.data[row][11] = false;
            hiddenRowsPlugin.hideRows(result); // 隐藏行
            this.c_hot.render(); // 渲染更新
            // 切换到下拉图标
          } else {
            this.data[row][11] = true;
            hiddenRowsPlugin.showRows(result); // 显示行
            this.c_hot.render();
          }
        };

        // 为 iconElement2 添加点击事件
        iconElement2.onclick = () => {
          // 可以在这里添加关于 iconElement2 的逻辑
          const currentValue = hotInstance.getDataAtCell(row, col);
          const nextCellValue = hotInstance.getDataAtCell(row + 1, col + 1);

          if (nextCellValue === null || (typeof nextCellValue === "string" && !nextCellValue.includes(currentValue))) {
            for (let i = 1; i <= 1; i++) {
              const targetRow = row + i;
              hotInstance.alter("insert_row_below", targetRow - 1, 1); // 插入新行
              // 设置只读
              hotInstance.setDataAtCell(targetRow, 0, currentValue);
            }
          } else {
            // console.log(2);
            let lastIndex = -1;
            // 找到最后一个 project_type 为 currentValue 的元素的索引
            for (let i = 0; i < this.data.length; i++) {
              if (this.data[i][0] === currentValue) {
                lastIndex = i;
              }
            }
            // 在最后一个匹配项之后插入新模板
            if (lastIndex != -1) {
              hotInstance.alter("insert_row_below", lastIndex, 1); // 插入新行
              hotInstance.setDataAtCell(lastIndex + 1, col, currentValue);
            } else {
              // 如果没有找到匹配项，可以选择在末尾添加，或根据需求处理
              this.data.push({ ...template });
            }
          }
        };

        // 清空单元格并插入新的可点击元素
        Handsontable.dom.empty(td);
        td.appendChild(clickableElement);
      } else {
        const clickableElement = document.createElement("div");
        clickableElement.style.display = "flex";
        clickableElement.style.alignItems = "center";
        clickableElement.style.cursor = "pointer";
        // 清空单元格并插入新的可点击元素
        Handsontable.dom.empty(td);
        td.appendChild(clickableElement);
      }
    },
    showConfirm() {},
    addTen() {
      // 创建一个包含22个空字符串的数组
      let template = [];
      for (let index = 0; index < 10; index++) {
        template.push("");
      }
      template[10] = true;
      template[11] = true;
      template[12] = "";

      for (let i = 0; i < 10; i++) {
        this.data.push(template);
      }
    }
  }
};
</script>

<style>
.pro-p {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-left: 20px;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 5px;
}
</style>
