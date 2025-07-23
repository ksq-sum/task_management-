<template>
  <div>
    <!-- 开始时间 弹窗 -->
    <el-dialog v-model="dialogTableVisible" title="选择开始时间" width="400" align-center>
      <el-date-picker
        style="margin-left: 20px"
        v-model="value2"
        type="datetime"
        placeholder="Select date and time"
        :shortcuts="shortcuts"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="getStartDateTime"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
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

      <div style="display: flex; align-items: center; margin-left: 100px">
        <div style="display: flex; align-items: center">
          <div>多维表格</div>
          <el-switch v-model="dwb" @change="toggleDwb" />
        </div>
        <div style="display: flex; align-items: center; margin-left: 20px">
          <div>甘特图</div>
          <el-switch v-model="gantetu" @change="toggleGantetu" />
        </div>
      </div>
    </div>

    <div></div>

    <div style="display: flex; margin-top: 20px; margin-left: 20px">
      <div style="display: flex; align-items: center; width: 200px; white-space: nowrap">
        <div>任务名：</div>
        <el-select v-model="selectedTask" placeholder="请选择任务" @change="filterIfClick('selectedTask', item)">
          <el-option v-for="item in taskOptions" :key="item" :value="item"> </el-option>
        </el-select>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>

      <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
        <div>环节：</div>
        <el-select v-model="huanjieSelectedTask" placeholder="请选择环节" @change="filterIfClick('huanjieSelectedTask', item)">
          <el-option v-for="item in huanjieSelectOptions" :key="item" :value="item"> </el-option>
        </el-select>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>

      <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
        <div>人员：</div>

        <el-autocomplete
          v-model="peopleValue"
          :fetch-suggestions="querySearch"
          placeholder="请输入人员"
          @select="handleSelect"
          clearable
        >
        </el-autocomplete>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>

      <div style="display: flex; margin-left: 40px; border-radius: 8px">
        <div class="pro-p jxj" @click="filterIfClick('typeSelected', '角色')">角色</div>
        <div class="pro-p jxj" @click="filterIfClick('typeSelected', '环境')">环境</div>
        <div class="pro-p jxj" @click="filterIfClick('typeSelected', '道具')">道具</div>
      </div>
      <div style="display: flex; margin-left: 40px; border-radius: 8px">
        <div class="pro-p weikaishi" @click="filterIfClick('progressSelected', '未开始')">未开始</div>
        <div class="pro-p weikaishi" @click="filterIfClick('progressSelected', '进行中')">进行中</div>
        <div class="pro-p weikaishi" @click="filterIfClick('progressSelected', '初步完成')">初步完成</div>
        <div class="pro-p weikaishi" @click="filterIfClick('progressSelected', '返修')">返修</div>
        <div class="pro-p weikaishi" @click="filterIfClick('progressSelected', '已完成')">已完成</div>
      </div>
      <div style="display: flex; margin-left: 40px; border-radius: 8px">
        <div class="pro-p jxj" @click="filterIfClick('levelSelected', 'S')">S</div>
        <div class="pro-p jxj" @click="filterIfClick('levelSelected', 'A')">A</div>
        <div class="pro-p jxj" @click="filterIfClick('levelSelected', 'B')">B</div>
        <div class="pro-p jxj" @click="filterIfClick('levelSelected', 'C')">C</div>
      </div>
    </div>
    <div style="height: 70vh; max-height: 75vh; margin-top: 30px; overflow-y: scroll">
      <div ref="yourTableRef" v-show="dwb" id="exampleTheme"></div>
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
import {
  web_getDepartPs,
  web_getAllProject,
  web_addProject,
  web_pro_proNode,
  web_getAllUser,
  web_getDeadline,
  web_zichan_crud
} from "@/api/modules/task";
import GanttChart from "@/components/handsTable/zpgantetu/GanttChart.vue";
import { now } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { onBeforeUnmount } from "vue";

registerPlugin(HiddenRows);
// 自定义编辑器

export default {
  components: {
    GanttChart
  },
  name: "HandsontableComponent",
  data() {
    return {
      typeOptions: ["", "买量", "番剧", "AI", "电影", "其他"],
      levelOptions: ["", "S", "A", "B", "C"],
      protypeOptions: ["", "角色", "环境", "道具"],
      huanjieOptions: ["", "原画", "模型", "绑定", "解算"],
      taskProgressOptions: ["", "未开始", "进行中", "初步完成", "返修", "已完成"],
      personOptions: [],
      data: [],
      cl_data: [],
      type_filter: "",
      level_filter: "",
      gantetu: false,
      dwb: true,
      c_hot: null,
      typeSelected: "",
      progressSelected: "",
      levelSelected: "",
      huanjieSelectOptions: ["原画", "模型", "绑定", "解算"],
      huanjieSelectedTask: "",
      taskOptions: [],
      selectedTask: "",
      peopleValue: "",
      peopleValue_dialog: "",
      peopleSelectOptions: [],
      dialogTableVisible: false,
      dialogTableVisible_people: false,
      value2: "",
      dateRow: -1,
      dateCol: -1,
      data_res: "",
      pro_code: "JXJ_jiexianji",
      handleKeyDown: null
    };
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    // this.getCellProperties();
  },

  created() {
    this.getDepartPs();

    // this.create_hot();
  },
  beforeUnmount() {
    this.showConfirm();
  },
  methods: {
    handleAfterChange(changes, source) {
      if (source === "loadData") {
        return; // 忽略来自 loadData 的更改
      }
      if (changes) {
        changes.forEach(([row, col, oldValue, newValue]) => {
          if (oldValue !== newValue) {
            // 获取列索引
            this.onTaskNameChange(row, col, oldValue, newValue);
          }
        });
      }
    },
    handleAfterCreateRow(index, amount, source) {
      if (index != 0) {
        if (this.data[index + 1] == null) {
          this.data[index][16] = true;
        } else {
          if (this.data[index + 1] && (this.data[index + 1][16] || this.data[index + 1][16] == null)) {
            console.log("Row Created:", index, "Amount:", amount, "Source:", source);
          } else {
          }
        }
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
    async onTaskNameChange(row, col, oldValue, newValue) {
      if (col == 0) {
        if (oldValue != null && oldValue != "") {
          for (let i = 1; i < this.data.length; i++) {
            const targetRow = row + i;
            const huanjie = this.c_hot.getDataAtCell(targetRow - 1, 5);
            this.c_hot.setDataAtCell(targetRow - 1, 0, newValue);
            this.c_hot.setDataAtCell(targetRow - 1, 1, newValue + "*" + huanjie);
            if (this.c_hot.getDataAtCell(targetRow, 0) != oldValue) {
              break;
            }
          }
        } else {
          this.c_hot.setDataAtCell(row, 1, newValue + "*");
          // 拼音
          // const pinyin = require("pinyin");
          let task_name = this.data[row][0];
          task_name = pinyin(task_name, {
            style: pinyin.STYLE_NORMAL, // 设置拼音风格
            heteronym: false // 是否返回多音字
          });
          task_name = task_name.flat().join("");
          this.data[row][20] = this.pro_code + "_" + this.data[row][2] + "_" + task_name;

          let targetRow = -1;
          for (let i = 1; i < this.data.length; i++) {
            targetRow = row + i;
            if (this.c_hot.getDataAtCell(targetRow, 0) != this.data[row][0]) {
              break;
            }
            this.data[targetRow][17] = this.data[row][20];
            const c_now = this.getCurrentDateTime();
            this.data[targetRow][18] = this.data[row][20] + "_" + c_now;
          }
        }
      }
      if (col == 2) {
        let task_name = this.data[row][0];
        task_name = pinyin(task_name, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: false // 是否返回多音字
        });
        task_name = task_name.flat().join("");
        this.data[row][20] = this.pro_code + "_" + this.data[row][2] + "_" + task_name;
        let targetRow = -1;
        for (let i = 1; i < this.data.length; i++) {
          targetRow = row + i;
          if (this.c_hot.getDataAtCell(targetRow, 0) != this.data[row][0]) {
            break;
          }
          this.data[targetRow][17] = this.data[row][20];
          const c_now = this.getCurrentDateTime();
          this.data[targetRow][18] = this.data[row][20] + "_" + c_now;
        }
        // console.log(this.data);
      }
      if (col == 5) {
        const task = this.c_hot.getDataAtCell(row, 0);
        this.c_hot.setDataAtCell(row, 1, task + "*" + newValue);
      }
      // 计算"截止时间"、"开始时间"
      if (col === 8 || col === 9) {
        // 排除父项计算
        // console.log("this.data[row]:", this.data[row]);
        if (this.data[row][16] != true) {
          const valueCol8 = this.c_hot.getDataAtCell(row, 8);
          const valueCol9 = this.c_hot.getDataAtCell(row, 9);
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
              this.c_hot.setDataAtCell(row, 10, formattedResponse);
            }
          }

          //计算最早时间、工时、截止时间
          const task_name = this.c_hot.getDataAtCell(row, 0);
          let taskData = this.data.filter(row => row[0] === task_name); // 筛选出任务名称为矛隼的数组

          // 获取 index 为 16 的值为 true 的行的下标
          let trueIndices = taskData
            .map((row, index) => {
              // 使用 map() 方法获取每一行在 taskData 中的索引，同时检查 index 16 的值
              if (row[16] === true) {
                return index; // 返回当前 taskData 中的索引
              }
              return null; // 不符合条件则返回 null
            })
            .filter(index => index !== null); // 过滤掉 null 值

          // 此时 trueIndices 包含了在 taskData 中值为 true 的行的索引
          // 如果你需要的是在 this.data 中的下标，可以进一步处理
          let originalIndices = trueIndices.map(index => this.data.indexOf(taskData[index]));
          console.log("符合条件的行在 this.data 中的下标:", originalIndices);

          // 进一步筛选出 index 为 16 的值为 false 的数组
          taskData = taskData.filter(row => row[16] === false);
          // 获取 index 为 8 的所有值
          const index8Values = taskData.map(row => row[8]);
          const index9Values = taskData.map(row => row[9]);
          const index10Values = taskData.map(row => row[10]);

          // 找到 index 8 的最小值
          // 过滤掉空字符串并转换为 Date 对象
          const validDates = index8Values
            .filter(dateStr => dateStr !== "") // 过滤掉空字符串
            .map(dateStr => new Date(dateStr)); // 转换为 Date 对象

          const validDates10 = index10Values
            .filter(dateStr => dateStr !== "") // 过滤掉空字符串
            .map(dateStr => new Date(dateStr));

          // 计算总和
          const totalSum = index9Values
            .map(value => parseFloat(value)) // 将每个值转换为数字
            .filter(value => !isNaN(value)) // 过滤掉非数字值
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0); // 计算总和
          console.log("总和:", totalSum);

          let earliestDate = null;
          let formattedDate = null;
          // 检查是否有有效日期
          if (validDates.length === 0) {
            console.log("没有有效的日期");
          } else {
            // 找到最早的日期
            const earliestDate = new Date(Math.min(...validDates.map(date => date.getTime())));
            // 格式化为 yyyy-MM-dd HH:mm:ss
            const formatDate = date => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要加1
              const day = String(date.getDate()).padStart(2, "0");
              const hours = String(date.getHours()).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");

              return `${year}-${month}-${day} ${hours}:${minutes}`;
            };

            // 输出格式化后的日期
            formattedDate = formatDate(earliestDate);
          }

          let formattedDate10 = null;
          if (validDates10.length === 0) {
            console.log("没有有效的日期");
          } else {
            // 找到最晚的日期
            const lateDate = new Date(Math.max(...validDates10.map(date => date.getTime())));
            // 格式化为 yyyy-MM-dd HH:mm:ss
            const formatDate = date => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要加1
              const day = String(date.getDate()).padStart(2, "0");
              const hours = String(date.getHours()).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");

              return `${year}-${month}-${day} ${hours}:${minutes}`;
            };

            // 输出格式化后的日期
            formattedDate10 = formatDate(lateDate);
          }

          this.c_hot.setDataAtCell(originalIndices[0], 8, formattedDate);
          this.c_hot.setDataAtCell(originalIndices[0], 9, totalSum);
          this.c_hot.setDataAtCell(originalIndices[0], 10, formattedDate10);
          // console.log("task_name:", task_name);
          // console.log("taskData:", JSON.stringify(taskData));
          // console.log("最早的日期:", formattedDate);
        }
      }
      // 计算状态
      if (col == 10) {
        if (this.data[row][16] != true) {
          if (this.data[row][10] == "") {
            this.data[row][15] = "未逾期";
          }
          // 目标日期
          // 将目标日期字符串转换为 Date 对象
          const targetDate = new Date(this.data[row][10] + " GMT+0800");

          // 获取当前日期
          const currentDate = new Date();

          // 计算时间差（以毫秒为单位）
          const timeDifference = targetDate - currentDate;

          // 计算相差的天数（包含小数部分，精确到小时）
          const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // 以天为单位

          console.log("daysDifference:", daysDifference.toFixed(1));

          // 取绝对值
          const absoluteDaysDifference = Math.abs(daysDifference);

          // 判断是否逾期
          if (timeDifference < 0) {
            // console.log("已逾期");
            this.data[row][13] = "已逾期" + absoluteDaysDifference.toFixed(2) + "天";
          } else {
            // console.log(`距离目标日期还有 ${daysDifference} 天`);
            this.data[row][13] = "剩余" + daysDifference.toFixed(2) + "天";
          }
        }
      }
      // 计算最终结束时间
      if (col == 11) {
        if (this.data[row][11] == "初步完成" || this.data[row][11] == "已完成") {
          const formatDate = date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要加1
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${year}-${month}-${day} ${hours}:${minutes}`;
          };
          const now = new Date();
          console.log("formatDate:", formatDate(now));

          this.c_hot.setDataAtCell(row, 15, formatDate(now));
        }
      }
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
    getStartDateTime() {
      const formatVal = this.formatDate(this.value2);
      this.dialogTableVisible = false;
      // const hotInstance = this.$refs.yourTableRef.hotInstance;
      this.c_hot.setDataAtCell(this.dateRow, this.dateCol, formatVal);
      this.c_hot.render();
    },
    getPeopleTime() {
      this.dialogTableVisible_people = false;
      this.c_hot.setDataAtCell(this.dateRow, this.dateCol, this.peopleValue_dialog);
      this.c_hot.render();
    },
    get_pro_proNode() {
      // 默认解限机
      web_pro_proNode("JXJ_jiexianji").then(res => {
        // console.log("this.personOptions_res", JSON.stringify(this.personOptions_res));
        // this.data_res = res;
        // console.log(res);
        this.data = res;
        // 替换操作
        this.data = this.data.map(innerArray => {
          // 找到下标为 7 的值
          const username = innerArray[7];

          // 查找 personOptions_res 中对应的 realname
          const person = this.personOptions_res.find(person => person.username === username);

          // 如果找到，则替换为 realname，否则保留原值
          if (person) {
            innerArray[7] = person.realname;
          }

          return innerArray; // 返回修改后的数组
        });

        console.log("this.data", this.data);

        // console.log("this.data", JSON.stringify(this.data_res));
        this.cl_data = this.data;
        this.addTen();
        // 使用 Set 来去重，提取下标 1 的值
        this.taskOptions = [...new Set(this.data.map(item => item[0]))];

        this.$nextTick(() => {
          this.create_hot();
          this.getCellProperties();
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
    filterIfLevel(value) {
      this.level_filter = value;
      this.filterIfClick();
    },
    filterIfType(value) {
      this.type_filter = value;
      this.filterIfClick();
    },
    filterIfClick(data01, data02) {
      if (data01 == "typeSelected") {
        this.typeSelected = data02;
      }
      if (data01 == "progressSelected") {
        this.progressSelected = data02;
      }
      if (data01 == "levelSelected") {
        this.levelSelected = data02;
      }

      const filteredData = this.cl_data.filter(item => {
        return (
          (item[3] === this.typeSelected || this.typeSelected == "") &&
          (item[4] === this.levelSelected || this.levelSelected == "") &&
          (item[11] === this.progressSelected || this.progressSelected == "") &&
          (item[5] === this.huanjieSelectedTask || this.huanjieSelectedTask == "") &&
          (item[0] === this.selectedTask || this.selectedTask == "") &&
          (item[7] === this.peopleValue || this.peopleValue == "")
        );
      });

      // 筛选出 index 为 16 的条目
      const trueData = this.cl_data.filter(item => item[16] === true);
      // 用于存放最终结果的数组
      let resultData = [];
      let addTiao = false;
      let pre_val = "";
      for (let i = 0; i < filteredData.length; i++) {
        if (filteredData[i][0] != pre_val) {
          addTiao = false;
        }
        const currentItem = filteredData[i];
        console.log("currentItem:", currentItem[16]);
        console.log("addTiao:", addTiao);
        if (currentItem[16] === false && addTiao == false) {
          // 查找 trueData 中与 currentItem 的索引 1 值相等的条目
          for (let j = 0; j < trueData.length; j++) {
            const trueItem = trueData[j];
            if (trueItem[0] === currentItem[0]) {
              // 将找到的条目加入结果数组
              resultData.push(trueItem);
              resultData.push(currentItem);
              addTiao = true;
            }
          }
        } else {
          resultData.push(currentItem);
          if (currentItem[16] === true) {
            addTiao = true;
          }
        }
        pre_val = filteredData[i][0];
      }

      this.data = resultData;
      console.log("this.data:", resultData);
      this.create_hot();
    },
    clearFilter() {
      this.data = this.cl_data;
      this.create_hot();
    },
    getAllProject() {},
    // 所有人
    getDepartPs() {
      web_getAllUser().then(res => {
        this.personOptions_res = res;
        // 转换为 peopleSelectOptions 格式
        this.peopleSelectOptions = this.personOptions_res.map((item, index) => {
          return {
            value: item.realname, // 下标从 1 开始
            label: item.realname // 使用 realname 作为标签
          };
        });
        let realnameArray = res.map(user => user.realname);
        realnameArray.unshift("");
        this.personOptions = realnameArray;
        this.$nextTick(() => {
          this.get_pro_proNode();
        });
      });
    },
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

      let hot = new Handsontable(example, {
        data: this.data,
        colWidths: [160, 160, 120, 90, 90, 90, 120, 90, 140, 100, 140, 120, 120, 100, 140, 140],
        colHeaders: [
          "任务名",
          "资产名称",
          "文件名",
          "类型",
          "等级",
          "环节",
          "制作备注",
          "人员",
          "开始时间",
          "工时",
          "截止时间",
          "任务进度",
          "完成路径",
          "状态",
          "图片&附件",
          "最终结束时间"
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
            headerClassName: "htLeft"
          },
          { data: 3, type: "dropdown", source: this.protypeOptions, headerClassName: "htLeft" },
          { data: 4, type: "dropdown", source: this.levelOptions, headerClassName: "htLeft" },
          { data: 5, type: "dropdown", source: this.huanjieOptions, headerClassName: "htLeft" },
          { data: 6, type: "text", headerClassName: "htLeft" },
          { data: 7, type: "text", headerClassName: "htLeft", renderer: this.peopleRenderer },
          { data: 8, type: "text", headerClassName: "htLeft", renderer: this.startTimeRenderer },
          { data: 9, type: "text", headerClassName: "htLeft" },
          { data: 10, type: "text", headerClassName: "htLeft" },
          { data: 11, type: "dropdown", source: this.taskProgressOptions, headerClassName: "htLeft" },
          { data: 12, type: "text", headerClassName: "htLeft" },
          { data: 13, type: "text", headerClassName: "htLeft" },
          { data: 14, type: "text", headerClassName: "htLeft" },
          { data: 15, type: "text", headerClassName: "htLeft" }
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
            if (col == 3) {
              const levelstyles = {
                角色: "role",
                环境: "environment",
                道具: "props"
              };
              const levelType = this.data[row][3]; // 获取当前行的项目类型
              if (levelstyles[levelType]) {
                cellProperties.className = levelstyles[levelType]; // 使用 className 属性
              }
            }
            if (col == 4) {
              const styles = {
                S: "level-s",
                A: "level-a",
                B: "level-b",
                C: "level-c"
              };

              const taskProgress = this.data[row][4]; // 获取当前行的进度状态
              if (styles[taskProgress]) {
                cellProperties.className = styles[taskProgress]; // 使用 className 属性
              }
            }
            if (col == 5) {
              const styles = {
                原画: "project-yuanhua",
                模型: "project-moxing",
                绑定: "project-bangding",
                解算: "project-jiesuan"
              };

              const taskProgress = this.data[row][5]; // 获取当前行的进度状态
              if (styles[taskProgress]) {
                cellProperties.className = styles[taskProgress]; // 使用 className 属性
              }
            }
            return cellProperties;
          }
        },
        licenseKey: "non-commercial-and-evaluation"
      });

      // 保存 Handsontable 实例
      this.c_hot = hot;
    },
    saveData() {
      console.log("资产saveData");

      const cl_data = this.cl_data;
      let thisData = [];

      for (let i = 0; i < cl_data.length; i++) {
        const newData = cl_data[i];
        // 输出新数组
        if (newData[0] != "") {
          thisData.push(newData);
        }
      }

      // 遍历 thisData，转换对象为数组
      thisData = thisData.map(item => {
        // 检查是否为对象，若是则转换为数组
        if (typeof item === "object" && !Array.isArray(item)) {
          return Object.values(item); // 将对象转换为数组
        }
        return item; // 否则返回原始项
      });

      // 遍历 thisData 进行替换
      thisData.forEach((element, index) => {
        // 获取需要替换的 realname
        const realNameToReplace = element[7]; // 假设需要替换的字段在 index 7

        // 查找对应的 username
        const matchedOption = this.personOptions_res.find(option => option.realname === realNameToReplace);
        if (matchedOption) {
          element[7] = matchedOption.username; // 替换为 username
        }
      });

      // 输出更新后的 thisData
      // console.log("输出更新后的 thisData:", JSON.stringify(thisData));

      // 后台计算"最早开始时间"和"最晚截止时间"录入项目管理表中
      web_zichan_crud("JXJ_jiexianji", thisData).then(res => {
        // 遍历 thisData 进行替换
        thisData.forEach(element => {
          // 获取需要替换的 realname
          const realNameToReplace = element[7]; // 假设需要替换的字段在 index 7

          // 查找对应的 username
          const matchedOption = this.personOptions_res.find(option => option.username === realNameToReplace);
          if (matchedOption) {
            element[7] = matchedOption.realname; // 替换为 username
          }
        });
        ElMessage({
          message: "保存成功",
          type: "success"
        });
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

      // 8,9是弹窗
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
    // 在组件销毁时移除事件监听器

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
        if (type == "startTime") {
          // 调用你想要触发的方法
          this.startTimeClick(row, col, value, td, clickableElement);
        }
        if (type == "people") {
          this.peopleClick(row, col, value, td, clickableElement);
        }
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
    startTimeClick(row, col, value, td, clickableElement) {
      // 判断是否为父级
      if (this.data[row][16] != true) {
        this.dialogTableVisible = true;
        this.dateRow = row;
        this.dateCol = col;
      }
    },
    peopleClick(row, col, value, td, clickableElement) {
      // 判断是否为父级
      if (this.data[row][16] != true) {
        // 获取当前行的数据
        this.dialogTableVisible_people = true;
        this.dateRow = row;
        this.dateCol = col;
      }
    },
    // 自定义渲染器
    customRenderer(hotInstance, td, row, col, prop, value, cellProperties) {
      // 获取当前行的数据
      const rowData = hotInstance.getSourceDataAtRow(row);

      if (rowData[16]) {
        // 创建可点击的元素
        const clickableElement = document.createElement("div");
        clickableElement.style.display = "flex";
        clickableElement.style.alignItems = "center";
        clickableElement.style.cursor = "pointer";

        const iconElement = document.createElement("i");
        if (rowData[21]) {
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
            this.data[row][21] = false;
            hiddenRowsPlugin.hideRows(result); // 隐藏行
            this.c_hot.render(); // 渲染更新
            // 切换到下拉图标
          } else {
            this.data[row][21] = true;
            hiddenRowsPlugin.showRows(result); // 显示行
            this.c_hot.render();
          }
        };

        // 为 iconElement2 添加点击事件
        iconElement2.onclick = () => {
          console.log("iconElement2 clicked");
          // 可以在这里添加关于 iconElement2 的逻辑
          const currentValue = hotInstance.getDataAtCell(row, col);
          const nextCellValue = hotInstance.getDataAtCell(row + 1, col + 1);

          if (nextCellValue === null || (typeof nextCellValue === "string" && !nextCellValue.includes(currentValue))) {
            for (let i = 1; i <= 1; i++) {
              const targetRow = row + i;
              hotInstance.alter("insert_row_below", targetRow - 1, 1); // 插入新行
              // 设置只读
              hotInstance.setCellMeta(targetRow, 0, "readOnly", true);
              hotInstance.setCellMeta(targetRow, 1, "readOnly", true);
              hotInstance.setDataAtCell(targetRow, 0, currentValue);
              this.data[targetRow][16] = false;
              const task_code = this.data[row][20];
              this.data[targetRow][17] = task_code;
              const c_now = this.getCurrentDateTime();
              // 获取当前时间yyyy-MM-dd HH:mm:ss
              // this.data[targetRow][18] = task_code + "_" + c_now;
              this.data[targetRow][19] = c_now;
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
              // 设置只读
              this.c_hot.setCellMeta(lastIndex + 1, 0, "readOnly", true);
              this.c_hot.setCellMeta(lastIndex + 1, 1, "readOnly", true);
              this.c_hot.setCellMeta(lastIndex + 1, 2, "readOnly", true);
              this.c_hot.setCellMeta(lastIndex + 1, 3, "readOnly", true);
              this.c_hot.setCellMeta(lastIndex + 1, 4, "readOnly", true);
              hotInstance.setDataAtCell(lastIndex + 1, col, currentValue);
              hotInstance.setDataAtCell(lastIndex + 1, 1, currentValue + "*");
              // 当前值index[16]设置为false
              this.data[lastIndex + 1][16] = false;
              const task_code = this.data[row][20];
              this.data[lastIndex + 1][17] = task_code;
              const c_now = this.getCurrentDateTime();
              this.data[lastIndex + 1][19] = c_now;
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
    getCurrentDateTime() {
      const now = new Date();

      // 获取年份
      const year = now.getFullYear();

      // 获取月份（注意：月份是从0开始的，所以需要加1）
      const month = String(now.getMonth() + 1).padStart(2, "0");

      // 获取日期
      const date = String(now.getDate()).padStart(2, "0");

      // 获取小时
      const hours = String(now.getHours()).padStart(2, "0");

      // 获取分钟
      const minutes = String(now.getMinutes()).padStart(2, "0");

      // 获取秒
      const seconds = String(now.getSeconds()).padStart(2, "0");

      // 组合成所需的格式
      return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    },
    addTen() {
      // 创建一个包含22个空字符串的数组
      // const template = new Array(22).fill("");
      let template = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", true, "", "", "", "", ""];
      // for (let index = 0; index < 22; index++) {
      //   template.push("");
      // }
      // 将索引为16的值设置为true
      // template[16] = true;
      // 循环添加 2 条数据
      for (let i = 0; i < 10; i++) {
        this.data.push({ ...template });
      }
      // console.log(this.data);
    },
    showConfirm() {
      document.removeEventListener("keydown", this.handleKeyDown);
      const confirmed = confirm("确定要保存视图吗？");
      if (confirmed) {
        // 新数组
        // const newData = this.data.filter(item => Array.isArray(item) && item.some(element => element !== ""));
        let thisData = [];
        for (let i = 0; i < this.data.length; i++) {
          const newData = this.data[i];
          // 输出新数组
          if (newData[0] != "") {
            thisData.push(newData);
          }
        }

        // 遍历 thisData，转换对象为数组
        thisData = thisData.map(item => {
          // 检查是否为对象，若是则转换为数组
          if (typeof item === "object" && !Array.isArray(item)) {
            return Object.values(item); // 将对象转换为数组
          }
          return item; // 否则返回原始项
        });

        // 遍历 thisData 进行替换
        thisData.forEach((element, index) => {
          // 获取需要替换的 realname
          const realNameToReplace = element[7]; // 假设需要替换的字段在 index 7

          // 查找对应的 username
          const matchedOption = this.personOptions_res.find(option => option.realname === realNameToReplace);
          if (matchedOption) {
            element[7] = matchedOption.username; // 替换为 username
          }
        });

        // 输出更新后的 thisData
        // console.log("输出更新后的 thisData:", JSON.stringify(thisData));

        // 后台计算"最早开始时间"和"最晚截止时间"录入项目管理表中
        web_zichan_crud("JXJ_jiexianji", thisData).then(res => {
          console.log("res:", res);
        });
      } else {
        console.log("用户取消了保存视图");
      }
    }
  }
};
</script>

<style>
@import "./index";
</style>
