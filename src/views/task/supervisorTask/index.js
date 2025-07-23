import { ref } from "vue";
import { ElUpload, ElButton, ElMessage } from "element-plus";
import "element-plus/dist/index.css";
import {
  web_getNodes,
  web_getAuditNodes,
  web_getVersion,
  web_addAuditNodes,
  web_addTaskandNode,
  web_getTemp,
  web_getTableTask,
  web_cgProStatu,
  web_supplementTask,
  web_getTaskForms,
  web_getTaskFormAll,
  web_updateAudit,
  web_getAllSupervisor,
  web_getNodeAudit,
  web_getAuditName,
  web_editaudit,
  web_upAuditstatus,
  web_getAuditIcon,
  web_imgConfire,
  web_getMyAllTasks
} from "@/api/modules/task";
import { useRoute, useRouter } from "vue-router";
import { format } from "date-fns";
import { stringify } from "qs";
import secondTaskMesg from "@/views/task/secondTaskMesg/index.vue";
import { version } from "nprogress";
import { it } from "element-plus/es/locale/index.mjs";
import { useUserStore } from "@/stores/modules/user"; // 导入你的 store
import { ElDatePicker } from "element-plus";
import DatePicker from "vue-datepicker-next";

export default {
  props: {
    data: {
      type: String,
      required: true,
      peopleOptions: []
    }
  },
  data() {
    return {
      isEditing: false,
      desserts: [],
      gx: [],
      inputValue_Eng: "task01",
      inputValue_Chi: "资产01",
      gxchecked: [],
      openGroups: [],
      showSh: false,
      reviewers: [
        { selected: "内部审核" } // 初始审核人
      ],
      auditOptions: [],
      //编辑的节点
      editnode: "",
      editname: "",
      upload_data: {},
      titleData: "",
      //temp节点
      noderesTemp: "",
      fbshow: true,
      updateDesserts: [],
      auditFiles: {},
      showDrawerS: false,
      fileList: [],
      imageUrls: "",
      g_only_code: "",
      g_code_code: "",
      g_task_code: "",
      producer_options: [],
      clickAudit: false,
      peopleName: [],
      isModalOpen: false,
      imageUrl: "",
      ediback: "",
      imgAudit: false,
      imgAudit_passed: true,
      imgAudit_arr: {},
      selectedDesserts: [],
      uploadImg: false,
      editAdudit_only: {},
      sidebarShow: true,
      zp_show: true,
      zz_show: true,
      fileflowShow: false,
      activeA: false,
      backShow: true,
      uploadShow: false,
      auditShow: false,
      getTableNum: 3,
      taskClickOne: false,
      taskClickTwo: false,
      taskClickThree: true,
      ifAuditShow: true,
      shifouGetAudit: true,
      dNodeProducer: "",
      uploadGetAudit: true,
      up_auditstatus: false
    };
  },
  mounted() {
    document.addEventListener("click", event => {
      if (!this.showDrawerS) {
        if (
          this.$refs.tableContainer &&
          !this.$refs.tableContainer.contains(event.target) &&
          (!this.$refs.taskContainer || !this.$refs.taskContainer.contains(event.target))
        ) {
          let x = 0;
          this.groupedDesserts.forEach(gg => {
            if (gg.headerSelected == true) {
              x = 1;
              gg.headerSelected = false; // 直接设置属性值
              //改变this.desserts
              // console.log(this.desserts);
              // 遍历对象并将每个 td_select 设置为 false
              Object.keys(this.desserts).forEach(key => {
                this.desserts[key].td_select = false;
              });
            }
          });
          if (x == 1) {
            this.clickAudit = false;
          }
        }
      }
    });
  },
  beforeDestroy() {
    document.removeEventListener("click", this.deselectTableRow);
  },
  components: {
    ElUpload,
    ElButton,
    secondTaskMesg,
    DatePicker
  },
  computed: {
    groupedDesserts() {
      const groups = {};
      this.desserts.forEach(dessert => {
        if (!groups[dessert.category]) {
          groups[dessert.category] = {
            category: dessert.newCategory,
            items: []
          };
        }
        groups[dessert.category].items.push(dessert);
      });
      // console.log(groups);
      // 初始化 openGroups，默认展开所有组
      this.openGroups = Object.keys(groups).map((_, index) => index);

      // const result = Object.fromEntries(this.openGroups.map(value => [value, value]));
      // this.openGroups = result;
      // console.log("this.openGroups", this.openGroups);

      return Object.values(groups);
    }
  },
  methods: {
    taskClick(numTask) {
      this.getTableNum = numTask;
      this.getTableData(this.getTableNum);
      if (numTask == 1) {
        this.taskClickOne = true;
        this.taskClickTwo = false;
        this.taskClickThree = false;
      }
      if (numTask == 2) {
        this.taskClickOne = false;
        this.taskClickTwo = true;
        this.taskClickThree = false;
      }
      if (numTask == 3) {
        this.taskClickOne = false;
        this.taskClickTwo = false;
        this.taskClickThree = true;
      }
    },
    cg_flowShow(event) {
      if (this.isEditing == true) {
        ElMessage({
          message: "当前表格处于编辑模式，请保存表格！",
          type: "warning",
          duration: 3000 // 消息显示时间
        });
      } else {
        this.fileflowShow = !this.fileflowShow;
        if (this.fileflowShow == true) {
          this.activeA = true;
          console.log(1);
        } else {
          this.activeA = false;
          console.log(2);
        }
      }

      event.stopPropagation();
    },
    handleChildClick() {
      this.sidebarShow = !this.sidebarShow;
    },
    confireAdd() {
      this.showDrawerS = false;
      web_imgConfire().then(response => {
        //更新状态
        const only_code = this.g_only_code.only_code;
        console.log(only_code);
        web_upAuditstatus(only_code, 1).then(response => {
          this.showMessage("提交成功！");
          // this.clearTd();
          this.getTableData(this.getTableNum);
        });
      });
      this.fileList = [];
    },
    edibackUpdateValue(event) {
      // 在输入时更新数据
      this.ediback = event.target.innerText; // 使用 innerText 获取内容
    },
    confireShowDrawer() {
      this.showDrawerS = false;
      this.imgAudit = false;
      // console.log("imgAudit_arr:", this.imgAudit_arr);
      if (this.imgAudit_arr != {}) {
        console.log("this.imgAudit_arr:", this.imgAudit_arr);
        console.log("this.ediback:", this.ediback);
        web_updateAudit(this.imgAudit_arr.only_code, this.imgAudit_arr.is_passed, this.ediback).then(response => {
          if (this.imgAudit_arr.is_passed == 2) {
            ElMessage({
              message: "审核通过",
              type: "success",
              duration: 3000 // 消息持续时间，单位是毫秒
            });
          }
          if (this.imgAudit_arr.is_passed == 1) {
            ElMessage({
              message: "审核未通过",
              type: "success",
              duration: 3000 // 消息持续时间，单位是毫秒
            });
          }
          this.getTableData(this.getTableNum);
          this.clearTd();
        });
      }
    },
    openModal(img_url) {
      // console.log(img_url);
      this.isModalOpen = true; // 打开模态框
      this.imageUrl = img_url;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    // 审核人编辑
    async getAuditPerson() {
      web_getAuditName().then(response => {
        let peopleOptions = [];
        let peopleName = [];
        response.forEach(item => {
          peopleOptions.push({
            realname: item.realname,
            username: item.username
          });
          peopleName.push(item.realname);
        });

        // console.log("peopleOptions:", peopleOptions);
        this.peopleOptions = peopleOptions;
        this.peopleName = peopleName;
      });
    },
    openDialogM() {
      //校验是否是当前提交人
      //是否能提交
      // let curr_audit_p = this.auditFiles[0].create_p;
      const userPerx = useUserStore();
      // console.log();
      if (this.dNodeProducer == userPerx.getName) {
        if (this.uploadGetAudit) {
          this.showDrawerS = true;
          this.uploadImg = false;
        } else {
          ElMessage({
            message: "当前该任务不支持上传文件！",
            type: "warning",
            duration: 3000 // 消息持续时间，单位是毫秒
          });
        }
      } else {
        ElMessage({
          message: "该条已指定制作人:" + this.dNodeProducer + "！",
          type: "warning",
          duration: 3000 // 消息持续时间，单位是毫秒
        });
      }
    },
    getProduces() {
      web_getAllSupervisor(3).then(response => {
        // 提取 username 和 realname
        const result = response.map(item => ({
          value: item.username,
          label: item.realname
        }));

        this.producer_options = result;
        web_getAllSupervisor(2).then(resp => {
          // 提取 username 和 realname
          const res = resp.map(item => ({
            value: item.username,
            label: item.realname
          }));
          res.forEach(item => {
            this.producer_options.push(item);
          });

          // console.log("res:", res);
          // console.log("this.producer_options:", this.producer_options);
        });
        // console.log(this.supervisor_options);
      });
    },
    toggleUpShow(togNum, event) {
      let flag = 1;
      if (togNum == 2) {
        this.desserts.forEach(item => {
          if (item.td_select == true) {
            flag = 0; // 如果发现有一个td_select为true，则将flag设置为0
          }
        });

        if (flag == 1) {
          ElMessage({
            message: "请选择一条任务后，再点击工作上传！",
            type: "warning",
            duration: 3000 // 消息显示时间
          });
          return;
        }
        this.uploadShow = true;
        this.backShow = false;
        this.auditShow = false;
        this.showSh = false;
      }
      if (togNum == 1) {
        this.uploadShow = false;
        this.backShow = true;
        this.auditShow = false;
        this.showSh = false;
      }
      if (togNum == 3) {
        //如果没有选中状态，则返回
        // console.log("如果没有选中状态，则返回:", JSON.stringify(this.desserts));
        let flag = 1; // 初始化标志变量

        this.desserts.forEach(item => {
          if (item.td_select == true) {
            flag = 0; // 如果发现有一个td_select为true，则将flag设置为0
          }
        });

        if (flag == 1) {
          ElMessage({
            message: "请选择一条任务后，再点击任务审核！",
            type: "warning",
            duration: 3000 // 消息显示时间
          });
          return;
        }

        this.editAdudit(event);
        this.uploadShow = false;
        this.backShow = false;
        this.auditShow = true;
      }
      this.sidebarShow = true;
      event.stopPropagation();
    },
    formatCreateTime(dateString) {
      // 创建 Date 对象
      const date = new Date(dateString);

      // 检查日期是否有效
      if (isNaN(date)) {
        console.error(`Invalid date format: ${dateString}`);
        return dateString; // 或者返回其他默认值
      }

      // 提取月份、日期和小时，并确保两位数格式
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");

      return `${month}-${day} ${hours}`;
    },
    getForms(only_code, resultColor, lastPerson) {
      // console.log("only_code:", only_code);
      web_getTaskForms(only_code).then(response => {
        this.auditFiles = response;
        // 排序函数
        this.auditFiles.sort((a, b) => {
          // 提取数字部分
          const numA = parseInt(a.only_code_form.match(/form(\d+)/)[1]);
          const numB = parseInt(b.only_code_form.match(/form(\d+)/)[1]);

          // 按数字大小排序，数值大的排前面
          return numB - numA;
        });
        // console.log(JSON.stringify(this.auditFiles));
        const formattedData = this.auditFiles.map(item => {
          return {
            ...item,
            create_time: this.formatCreateTime(item.create_time)
          };
        });
        this.auditFiles = formattedData;
        // console.log("this.auditFiles:", JSON.stringify(this.auditFiles));
        // 检查数组长度
        if (this.auditFiles.length > 0) {
          // 遍历数组
          this.auditFiles.forEach((item, index) => {
            // 替换 create_p 的值
            item.create_p = lastPerson;

            // 添加 color 字段
            item.color = index === 0 ? resultColor : "灰色"; // 第一个元素设置为 resultColor，其余为 "灰色"
          });
        }

        // console.log("this.auditFiles:", JSON.stringify(this.auditFiles));
      });
    },
    getBackgroundColor() {
      return color === "绿色" ? "green" : color === "灰色" ? "gray" : "transparent";
    },
    auditClick(file, event) {
      this.showDrawerS = true;
      this.uploadImg = true;

      //校验是否当前的审核人
      // console.log("校验是否当前的审核人:", this.auditFiles);
      let curr_audit_p = this.auditFiles[0].create_p;
      const userPerx = useUserStore();
      // console.log("curr_audit_p :", curr_audit_p);
      // console.log("userPerx:", userPerx.getName);

      if (this.shifouGetAudit == true) {
        if (curr_audit_p == userPerx.getName) {
          this.ifAuditShow = true;
        } else {
          this.ifAuditShow = false;
          ElMessage({
            message: "当前审核人为：" + curr_audit_p,
            type: "success",
            duration: 3000 // 消息显示时间
          });
        }
      } else {
        this.ifAuditShow = false;
        ElMessage({
          message: "当前该任务已存在审核结果",
          type: "success",
          duration: 3000 // 消息显示时间
        });
      }

      if (file.color == "灰色") {
        this.ifAuditShow = false;
      }
      // 获取表单数据
      web_getTaskFormAll(file.only_code_form).then(response => {
        // this.filePaths = response.file_paths;
        const file_paths = response.file_paths;
        const base_url = "http://192.168.112.72:8889/images/";

        const imageUrls = file_paths.map(filePath => {
          // 使用 path.basename 提取文件名（需要 Node.js 环境）
          const fileName = filePath.split("\\").pop(); // Windows环境下用反斜杠分割
          return base_url + fileName; // 拼接完整的 URL
        });
        this.imageUrls = imageUrls;
        // console.log(imageUrls);
      });
      event.stopPropagation();
    },
    upAudit(is_passed) {
      this.imgAudit = true;
      if (is_passed == 2) {
        this.imgAudit_passed = true;
      } else {
        this.imgAudit_passed = false;
      }
      let imgAudit_arr = {
        only_code: this.g_only_code.only_code,
        is_passed: is_passed
      };
      this.imgAudit_arr = imgAudit_arr;
    },
    async saveCode() {
      const keyVal = this.key;
      //获取当前时间
      const now = new Date();
      const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
      //任务表的一条任务
      let saveCodedata = [];
      //任务的所有节点
      let saveTaskNode = [];
      //节点审核表的所有数据
      let auditNode = [];
      //查询"审核模板表"是否存在该项目的节点模板
      // 使用 await 等待 web_getTemp 的结果。这样可以以同步的方式处理异步代码
      const noderesTemp = await web_getTemp(keyVal);
      // desserts添加x条任务
      this.gxchecked.forEach((item, index) => {
        let itemadd = {
          thum_inf: "task01-Design",
          code_name: item.gxname, // 使用 item 中的 code_name
          work_type: "",
          node_supervisor: "",
          version: "1",
          humandays: "",
          endTime: "",
          node_producer: "",
          task_status: 0,
          getTime: "",
          startTime: "",
          upload: "信息不全",
          finishTime: "",
          category: this.inputValue_Chi
        };
        this.desserts.push(itemadd);
        saveCodedata.push({
          pro_code: keyVal,
          task_code: keyVal + this.inputValue_Eng,
          task_name: this.inputValue_Eng,
          task_name_china: this.inputValue_Chi,
          task_status: 0,
          if_reworked: 0,
          task_code_count: 1,
          task_type: 0,
          task_realcode1: item.gxname + index + 1,
          create_time: formattedNow,
          category: this.inputValue_Chi
        });
        const filteredArray = noderesTemp.filter(it => it.code_code == item.gxcode);
        filteredArray.forEach(nodeTemp => {
          auditNode.push({
            pro_code: nodeTemp.pro_code,
            task_code: keyVal + this.inputValue_Eng,
            code_code: nodeTemp.code_code,
            only_code: keyVal + this.inputValue_Eng + (item.gxcode + index + 1),
            level_audit: nodeTemp.current_audit_level,
            curr_level: nodeTemp.current_level,
            level_name: nodeTemp.current_name,
            audit_person: "",
            if_passed: 0,
            create_time: formattedNow
          });
        });

        saveTaskNode.push({
          pro_code: keyVal,
          task_code: keyVal + this.inputValue_Eng,
          code_code: item.gxcode + index + 1,
          only_code: keyVal + this.inputValue_Eng + (item.gxcode + index + 1),
          code_name: item.gxname,
          thum_inf: "default",
          version: 1,
          create_time: formattedNow
        });
      });
      const allSaveData = { tasks: saveCodedata, task_nodes: saveTaskNode, node_audits: auditNode };
      // console.log("allSaveData:", JSON.stringify(allSaveData));
      // console.log("saveTaskNode:", saveTaskNode);

      // console.log("allSaveData:", JSON.stringify(allSaveData));
      //数据库添加一条任务，一条任务节点
      web_addTaskandNode(allSaveData).then(response => {
        console.log(response);
      });
      // 向 desserts 数组添加新数据
      // this.desserts.push(newDessert);
    },
    toggleGroup(groupIndex, group) {
      const index = this.openGroups.indexOf(groupIndex);
      if (index > -1) {
        this.openGroups.splice(index, 1); // 收起
        group.ifXiala = true;
      } else {
        this.openGroups.push(groupIndex); // 展开
        group.ifXiala = false;
      }
      this.isGroupOpen(groupIndex);
    },
    formatDate(date) {
      const yyyy = date.getFullYear(); // 获取完整的年份
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份，注意月份从0开始
      const dd = String(date.getDate()).padStart(2, "0"); // 获取日期
      // 获取小时（24小时制）
      const hours = String(date.getHours()).padStart(2, "0");

      return `${yyyy}-${mm}-${dd} ${hours}`; // 返回格式化后的日期字符串
    },
    cgProStatuIsEditing() {
      this.isEditing = !this.isEditing;
      if (this.isEditing == true) {
        this.sidebarShow = false;
        this.activeA = true;
        this.fileflowShow = true;
        //清空
        this.updateDesserts = [];
        //查询制作人
        this.getProduces();
      } else {
        this.updateDesserts.map(item => {
          // console.log("查询制作1:", item.deadline);
          if (item.deadline != "") {
            const date = new Date(item.deadline);
            const formattedDate = this.formatDate(date);
            item.deadline = formattedDate; // 将格式化后的日期赋值给当前项的deadline字段
          } else {
            item.deadline = "";
          }

          console.log("查询制作2:", item);
          return item;
        });
        // console.log("updateDessert:", JSON.stringify(this.updateDesserts));

        // console.log("this.updateDesserts:", JSON.stringify(this.updateDesserts));
        this.updateDesserts.forEach(function (dessert) {
          if (dessert.auditstatus === "信息不全") {
            dessert.auditstatus = 4;
          }
          if (dessert.auditstatus === "信息不完善") {
            dessert.auditstatus = 5;
          }
          if (dessert.auditstatus === "等待上传") {
            dessert.auditstatus = 0;
          }
          if (dessert.auditstatus === "等待审核") {
            dessert.auditstatus = 1;
          }
          if (dessert.auditstatus === "审核未通过") {
            dessert.auditstatus = 2;
          }
          if (dessert.auditstatus === "审核已通过") {
            dessert.auditstatus = 3;
          }
        });

        //制作人、截止到计时间有值，dessert.auditstatus = 0，待上传
        this.updateDesserts.forEach(function (dessert) {
          // 检查 dessert.deadline 的有效性
          if (dessert.deadline && dessert.deadline.length > 0) {
            // 检查 dessert.node_producer 的有效性
            if (
              dessert.node_producer &&
              dessert.node_producer.length > 0 &&
              (dessert.auditstatus == 5 || dessert.auditstatus == 0)
            ) {
              //审核人不能为空
              dessert.auditstatus = 0; // 更新 auditstatus

              //更新开始时间
              const now = new Date();
              // 获取年份、月份、日期和小时
              const year = now.getFullYear();
              const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要加1
              const day = String(now.getDate()).padStart(2, "0");
              const hours = String(now.getHours()).padStart(2, "0");

              // 格式化为"年月日时"
              const formattedDate = `${year}-${month}-${day} ${hours}`;
              dessert.released = formattedDate;

              // console.log('格式化为"年月日时"', dessert.released);
            }
          }
        });

        this.updateDesserts.forEach(item => {
          // 替换 planTime 的值
          item.planTime = item.zp_planTime;
          // 删除 zp_planTime 字段
          delete item.zp_planTime;
        });

        // console.log("更新开始时间this.updateDesserts:", JSON.stringify(this.updateDesserts));

        web_supplementTask(this.updateDesserts).then(response => {
          // console.log("res:", response);
          this.getTableData(this.getTableNum);
        });
      }
    },
    getDesClass(value) {
      // 获取除 a_code 和 a_person 字段以外的字段值
      const filteredValues = Object.keys(value)
        .filter(key => key !== "a_code" && key !== "a_person") // 筛选掉不需要的字段
        .map(key => value[key]); // 获取剩余字段的值

      // 输出结果
      // console.log("输出结果:", filteredValues); // 输出: [2]
      if (filteredValues[0] === 0) {
        return "iconfont icon-jinhangzhong";
      } else if (filteredValues[0] === 1) {
        return "iconfont icon-weitongguo";
      } else if (filteredValues[0] === 2) {
        return "iconfont icon-tongguo";
      } else if (filteredValues[0] === 4) {
        return "iconfont icon-jinhangzhong-copy";
      } else if (filteredValues[0] === 5) {
        return "iconfont icon-szhong-copy";
      } else if (filteredValues[0] === 6) {
        return "iconfont icon-shezhong";
      }
    },
    updateDessert(dessert, index, key, value, group) {
      console.log("dessert:", dessert);

      const pindex = String(index + 1).padStart(2, "0");
      const task_code = dessert.category;
      const pro_code = this.key;
      const code_code = dessert.code_name + pindex;
      const only_code = dessert.category + code_code;
      // 将新字段添加到 dessert 对象中
      dessert.task_code = task_code;
      dessert.pro_code = pro_code;
      dessert.code_code = code_code;
      dessert.only_code = only_code;
      dessert[key] = value;
      // console.log("dd:", JSON.stringify(dessert));

      // dessert[key] = value; // 更新 dessert 对象的属性值
      // 检查 only_code 是否存在于 this.updateDesserts 中
      const existingIndex = this.updateDesserts.findIndex(item => item.only_code === only_code);

      if (existingIndex !== -1) {
        // 如果存在，覆盖
        this.updateDesserts[existingIndex] = dessert;
      } else {
        // 如果不存在，新增
        this.updateDesserts.push(dessert);
      }
      console.log("this.updateDessert", this.updateDesserts);
    },
    forReleased(dateString) {
      // 假设输入格式为 'YYYY-MM-DD HH'
      // 为了确保 Date 对象能正确解析，加入分钟部分 ':00'
      const formattedDateString = dateString.length === 13 ? `${dateString}:00` : dateString;
      // 创建 Date 对象
      const date = new Date(formattedDateString);

      // 检查日期是否有效
      if (isNaN(date)) {
        throw new Error("无效的日期格式");
      }

      // 提取月份、日期和小时，并确保两位数格式
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");

      return `${month}-${day} ${hours}`;
    },
    // 得到表格数据
    async getTableData() {
      const userPerx = useUserStore();
      web_getMyAllTasks(this.key, userPerx.getName, this.getTableNum).then(response => {
        response.sort(function (a, b) {
          let dateA = new Date(a.create_time);
          let dateB = new Date(b.create_time);
          return dateB - dateA; // 按照日期时间字段倒序排序
        });
        this.desserts = [];
        response.forEach(item => {
          // console.log("item.child.length:", item.child.length);
          // 处理当前项
          // 如果有 children，递归遍历

          if (item.Child && item.Child.length > 0) {
            item.Child.forEach(async cItem => {
              let audstatus = "";
              if (parseInt(cItem.auditstatus) == 4) {
                audstatus = "信息不全";
              }
              if (parseInt(cItem.auditstatus) == 5) {
                audstatus = "信息不完善";
              }
              if (parseInt(cItem.auditstatus) == 0) {
                audstatus = "等待上传";
              }
              if (parseInt(cItem.auditstatus) == 1) {
                audstatus = "等待审核";
              }
              if (parseInt(cItem.auditstatus) == 2) {
                audstatus = "审核未通过";
              }
              if (parseInt(cItem.auditstatus) == 3) {
                audstatus = "审核已通过";
              }
              let c = false;
              // console.log("cItem.task_code:", cItem.task_code);
              const res = await web_getAuditIcon(cItem.task_code);
              const temp_res = res;
              if (audstatus === "信息不全") {
                res.forEach(item => {
                  // 遍历对象的属性
                  for (let key in item) {
                    // 排除 a_code 和 a_person
                    if (key !== "a_code" && key !== "a_person") {
                      if (item[key] != 1 && item[key] != 2) {
                        item[key] = 4; // 将其他值改为 4
                      }
                    }
                  }
                });
              }
              if (audstatus === "信息不完善") {
                res.forEach(item => {
                  // 遍历对象的属性
                  for (let key in item) {
                    // 排除 a_code 和 a_person
                    if (key !== "a_code" && key !== "a_person") {
                      if (item[key] != 1 && item[key] != 2) {
                        item[key] = 5; // 将其他值改为 4
                      }
                    }
                  }
                });
              }
              if (audstatus === "等待审核") {
                res.forEach(item => {
                  // 遍历对象的属性
                  for (let key in item) {
                    // 排除 a_code 和 a_person
                    if (key !== "a_code" && key !== "a_person") {
                      if (item[key] != 1 && item[key] != 2) {
                        item[key] = 6; // 将其他值改为 4
                      }
                    }
                  }
                });
              }

              // web_getAuditIcon(cItem.task_code).then(res => {
              let a_person = false;
              if (res.length > 0) {
                if (res[0]["a_person"] == "" || res[0]["a_person"] == null) {
                  a_person = true;
                } else {
                  a_person = false;
                }
              } else {
                a_person = false;
              }
              // console.log(res);
              //拼newCategory
              let cc = this.key;
              let newCategory = cItem.task_code.replace(new RegExp(`^${cc}`), "");
              const toRemove = `${cc}_`;
              if (newCategory.startsWith(toRemove)) {
                newCategory = newCategory.slice(toRemove.length);
              }
              newCategory = newCategory + "/" + cItem.chinaName;

              let planTime = "";
              if (cItem.planTime != "" && cItem.planTime != null) {
                planTime = cItem.planTime.substring(5);
              }
              let realTime = "";
              if (cItem.realTime != "" && cItem.realTime != null) {
                realTime = cItem.realTime.substring(5);
              }
              let deadline = "";
              if (cItem.deadline != "" && cItem.deadline != null) {
                deadline = cItem.deadline.substring(5);
              }
              let released = "";
              if (cItem.released != "" && cItem.released != null) {
                released = cItem.released.substring(5);
              }
              // const formatReleased = this.forReleased(cItem.released);
              this.desserts.push({
                newCategory: newCategory,
                thum_inf: cItem.thum_inf,
                code_name: cItem.code_name,
                code_code: cItem.code_code, //提供给OC_NODE_FILE的code_code
                work_type: cItem.work_type, // 假设 cItem 有 work_type 属性
                node_supervisor: cItem.node_supervisor, // 假设 cItem 有 node_supervisor 属性
                version: cItem.version, // 假设 cItem 有 version 属性
                humandays: cItem.humandays, // 假设 cItem 有 humandays 属性
                endTime: cItem.endTime, // 假设 cItem 有 endTime 属性
                node_producer: cItem.node_producer, // 假设 cItem 有 node_producer 属性
                task_status: res, // 假设 cItem 有 task_status 属性
                getTime: cItem.getTime, // 假设 cItem 有 getTime 属性
                startTime: cItem.startTime, // 假设 cItem 有 startTime 属性
                upload: cItem.upload, // 假设 cItem 有 upload 属性
                finishTime: cItem.finishTime, // 假设 cItem 有 finishTime 属性
                category: cItem.task_code, // 假设 cItem 有 category 属性
                auditstatus: audstatus,
                planTime: planTime,
                zp_planTime: cItem.planTime,
                deadline: deadline,
                zg_deadline: cItem.deadline,
                td_select: false, // 单选框 td 属性，默认未选择
                released: released,
                zg_released: cItem.released,
                realTime: realTime,
                createTime: item.create_time,
                auditPersonZero: a_person,
                temp_task_status: temp_res
              });

              this.desserts.sort((a, b) => {
                return new Date(b.createTime) - new Date(a.createTime);
              });

              // });
            });

            // console.log("this.desserts:", this.desserts);
          }
        });
      });
    },
    getRealNameByUsername(people, username) {
      const person = people.find(item => item.username === username);
      return person ? person.realname : null; // 如果找到了，返回 realname，否则返回 null
    },
    //获取审核
    clickEditAdudit() {
      this.reviewers = [];
      // 获取主管
      // console.log("g_only_code:", this.g_only_code);
      web_getNodeAudit(this.g_only_code.only_code).then(response => {
        // console.log(response);
        response.forEach(item => {
          // console.log("this.peopleOptions:", this.peopleOptions);
          const realname = this.getRealNameByUsername(this.peopleOptions, item.audit_person);
          //username对应的realname
          this.reviewers.push({
            selected: item.level_name,
            person: realname
          });
        });
      });
    },
    async editAdudit(event) {
      // this.showSh = !this.showSh;
      event.stopPropagation();
    },
    clickCheckbox(dessert, group) {
      if (dessert.deadline && dessert.deadline.length > 0) {
        // 检查 dessert.node_producer 的有效性
        if (dessert.node_producer && dessert.node_producer.length > 0 && (dessert.auditstatus == 5 || dessert.auditstatus == 0)) {
          this.up_auditstatus = true;
        } else {
          this.up_auditstatus = false;
        }
      }
      // console.log("dessert.task_status:", JSON.stringify(dessert.task_status));
      let lastPerson = "";
      let resultColor = "";
      // 遍历数组

      dessert.temp_task_status.forEach((item, index) => {
        // 检查每个对象中除 a_code 和 a_person 外的所有字段
        for (const key in item) {
          if (key !== "a_code" && key !== "a_person") {
            const value = item[key];

            // 如果值为 1，返回 "红色" 和对应的 a_person
            if (value === 1) {
              resultColor = "红色";
              // console.log("红色", item.a_person);
              lastPerson = item.a_person;
              return true; // 找到后立即返回
            }

            // 更新 lastPerson，只有在值为0时才赋值
            if ((value === 0 || value === 6) && lastPerson === "") {
              lastPerson = item.a_person; // 记录第一个值为0的a_person
            }

            // 根据不同的值更新 resultColor
            if (value === 2) {
              if (index == dessert.task_status.length - 1) {
                lastPerson = item.a_person;
              }
              resultColor = "绿色";
              // lastPerson = item.a_person;
            } else if (value === 0 || value === 6) {
              resultColor = "紫色";
            }
          }
        }
      });

      // console.log("resultColor:", resultColor);
      // console.log("lastPerson:", lastPerson);

      // 如果没有返回红色的情况，根据最后一个元素的值返回相应的颜色
      if (lastPerson) {
        // console.log("如果没有返回红色的情况，根据最后一个元素的值返回相应的颜色");
        console.log(resultColor, lastPerson);
      }
      if (!this.isEditing) {
        dessert.td_select = !dessert.td_select;
        if (group.headerSelected == true) {
          group.headerSelected = false;
        } else {
          // 重置
          this.groupedDesserts.forEach(gg => {
            gg.headerSelected = false;
          });
          group.headerSelected = true;
        }
      }
      //查询表单
      let task_code = dessert.task_code;
      let only_code = { only_code: dessert.category + dessert.code_code };
      this.g_only_code = only_code;
      this.g_task_code = dessert.category;
      this.g_code_code = dessert.code_code;

      this.desserts.forEach(dessert => {
        let onlyCode = dessert.category + dessert.code_code;
        if (onlyCode != only_code.only_code) {
          dessert.td_select = false; // 重置选择状态
        }
      });

      if (dessert.td_select) {
        this.clickAudit = true;
      } else {
        this.clickAudit = false;
      }

      if (dessert.td_select == false) {
        this.auditFiles = {};
      } else {
        // console.log("全局lastPerso:", lastPerson);
        //全局only_code
        this.getForms(only_code, resultColor, lastPerson);
        this.clickEditAdudit();
      }
      this.showSh = false;
      let valueAfterSlash = dessert.newCategory.split("/")[1];
      this.editAdudit_only = {
        chinaName: valueAfterSlash,
        task_code: dessert.category
      };

      if (dessert.td_select == true) {
        if (dessert.auditstatus == "审核已通过" || dessert.auditstatus == "审核未通过") {
          this.shifouGetAudit = false;
        } else {
          this.shifouGetAudit = true;
        }
        if ((dessert.auditstatus == "等待上传" || dessert.auditstatus == "审核未通过") && lastPerson != "") {
          this.uploadGetAudit = true;
        } else {
          this.uploadGetAudit = false;
        }
        this.dNodeProducer = dessert.node_producer;
      } else {
        this.dNodeProducer = "";
        this.uploadGetAudit = false;
      }
    },

    getColor(colorName) {
      const colorMap = {
        红色: "#FFC1C1",
        绿色: "#C2EECD",
        紫色: "#FFCB01",
        灰色: "#D3D3D3"
        // 可以添加更多颜色映射
      };

      return colorMap[colorName] || "#ffffff"; // 默认返回白色
    },
    getAuditStatusColor(auditStatus) {
      if (auditStatus === "审核已通过") {
        return "#34C758"; // 颜色为绿色
      } else if (auditStatus === "审核未通过") {
        return "#FF2D55"; // 颜色为红色
      } else if (auditStatus === "信息不全") {
        return "#DCDCDC"; // 灰
      } else if (auditStatus === "信息不完善") {
        return "#8664E6";
      } else if (auditStatus === "等待审核") {
        return "#FFCB01";
      } else {
        //等待上传
        return "#5AC8FA"; // 默认颜色
      }
    },
    closeShowDrawer(event) {
      this.imgAudit = false;
      this.showDrawerS = false;
      // this.clearTd();
      // this.getTableData();
      event.stopPropagation();
      this.fileList = [];
    },
    clearTd() {
      // 遍历 desserts 数组，重置 td_select 为 false
      this.desserts.forEach(dessert => {
        dessert.td_select = false; // 重置选择状态
      });
      this.g_only_code = "";
      this.g_task_code = "";
      this.g_code_code = "";
      this.clickAudit = !this.clickAudit;
      this.auditFiles = {};
    },
    delAudit(data) {
      console.log("data:", data);
      console.log(this.reviewers);
      this.reviewers.splice(data[1], 1);
      data[2].stopPropagation();
    },
    addReviewTemp(event) {
      const key = this.key;
      const editnode = this.editnode;
      const editname = this.editname;
      event.stopPropagation();
      //查询版本
      web_getVersion(this.key, this.editnode).then(response => {
        let v_num = parseInt(response) + 1;
        //获取当前时间
        const now = new Date();
        const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
        // console.log("reviewers:", JSON.stringify(this.reviewers));
        // console.log(JSON.stringify(this.peopleOptions));

        this.reviewers.forEach(item => {
          const personName = item.person;
          const foundPerson = this.peopleOptions.find(person => person.realname === personName);
          if (foundPerson) {
            item.username = foundPerson.username; // 替换 username
          }
        });
        // console.log(this.reviewers);

        // 假设 reviewers 是一个数组，您想根据它构建 reviewArray
        const reviewArray = this.reviewers.map((reviewer, index) => ({
          pro_code: key,
          task_code: this.g_task_code,
          only_code: this.g_only_code.only_code,
          code_code: this.g_code_code, // 例如，使用 reviewer 的某个属性
          code_name: editname,
          version_num: v_num,
          if_latest: 0,
          level_aud: "1",
          curr_level: "1-" + (index + 1),
          level_name: reviewer.selected,
          current_audit_level: "1",
          current_audit_name: "1级审核",
          current_level: "1-" + (index + 1),
          current_name: reviewer.selected,
          audit_person: reviewer.username,
          node_supervisor: "", // 使用 reviewer 的属性
          is_passed: 0,
          create_time: formattedNow,
          create_p: "zs",
          delete_flag: 0
        }));
        // console.log("reviewArray:", reviewArray);
        // console.log(JSON.stringify(reviewArray));
        web_editaudit(reviewArray).then(response => {
          console.log("reviewArray:", JSON.stringify(reviewArray));
          // console.log("2");
          //提示修改预设成功
          this.showMessage("修改预设成功!");

          this.getTableData(this.getTableNum);
          // this.showSh = !this.showSh;
          // 清空td状态
          // this.clearTd();
        });
      });
    },
    showMessage(msg) {
      ElMessage({
        message: msg,
        type: "success",
        duration: 3000 // 消息显示时间
      });
    },
    cgProStatu() {
      web_cgProStatu(this.key, 1).then(response => {});
      this.fbshow = !this.fbshow;
    },
    isGroupOpen(groupIndex) {
      return this.openGroups.includes(groupIndex);
    },
    toggleSelection(item) {
      item.selected = !item.selected;
    },
    // 处理img文件变化的方法
    handleChange(file, newFileList) {
      this.fileList = newFileList; // 更新文件列表
      //获取当前时间
      const now = new Date();
      const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
      const userStore = useUserStore();
      console.log("更新文件列表");
      console.log(this.g_only_code);
      console.log(this.g_task_code);
      console.log(this.g_code_code);

      //拼一个OC_NODE_FILE
      const keyVal = this.key;
      // let only_code = this.selected_code + this.selected_code_code;
      const file_code = {
        pro_code: keyVal,
        task_code: this.g_task_code,
        code_code: this.g_code_code,
        only_code: this.g_only_code.only_code,
        only_code_form: "",
        file_type: 0,
        file_path: "",
        audit_level: 1,
        audit_if_passed: 0,
        create_time: formattedNow,
        create_p: userStore.getName
      };
      console.log("file_code:", file_code);
      this.upload_data = file_code;
      // console.log("this.upload_data:", this.upload_data);
    },
    // 创建 img 对象 URL
    createObjectURL(file) {
      return URL.createObjectURL(file);
    },

    handleSuccess(response, file, fileList) {
      ElMessage({
        message: "上传图片已成功！",
        type: "success",
        duration: 3000 // 消息显示时间
      });
      console.log("上传成功:", response);
    },
    handleError(err, file, fileList) {
      console.log("上传失败:", err);
    },
    getNodes() {
      // 通过账号查询制片姓名
      //资产
      web_getNodes(0).then(response => {
        // 模拟数据获取
        // 使用 map 提取 code_name 和 code_code
        this.gx = response.map(item => ({
          gxname: item.code_name,
          gxcode: item.code_code,
          selected: false
        }));
      });
    },
    getAuditNodes() {
      // 通过账号查询制片姓名
      //资产
      web_getAuditNodes().then(response => {
        // 模拟数据获取
        this.auditOptions = response.map(item => item.audit_name);
      });
    },
    addPerson() {
      this.reviewers.push({ selected: "内部审核" }); // 添加新的审核人
    },
    addToGxChecked(item) {
      if (this.showSh == false) {
        // 检查项目是否已经存在
        const alreadyChecked = this.gxchecked.find(g => g.gxname === item.gxname);
        if (!alreadyChecked) {
          if (item.gxname == "设计") {
            this.gxchecked.push(item);
          }
        }
      } else {
        item.selected = !item.selected;
        this.editnode = item.gxcode;
        this.editname = item.gxname;
      }
    },
    cgshIf() {
      this.showSh = !this.showSh;
      //赋值给dess
    }
  },
  created() {
    this.getNodes();
    this.getAuditNodes();
    this.getTableData();
    this.getAuditPerson();
  },
  setup() {
    const route = useRoute();
    const key = ref(route.query.key); // 获取查询参数
    // this.titleData = key.value
    return {
      key
    };
  }
};
