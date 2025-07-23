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
  web_imgConfire,
  web_imgCancle,
  web_upAuditstatus,
  web_getTaskForms,
  web_getTaskFormAll,
  web_getAuditback,
  web_getAuditIcon,
  web_getMyAllTasks,
  web_updateAudit
} from "@/api/modules/task";
import { useRoute, useRouter } from "vue-router";
import { format } from "date-fns";
import { stringify } from "qs";
import secondTaskMesg from "@/views/task/secondTaskMesg/index.vue";
import { version } from "nprogress";
import { useUserStore } from "@/stores/modules/user"; // 导入你的 store
import { number } from "echarts";

export default {
  props: {
    data: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeA: false,
      isEditing: false,
      desserts: [],
      gx: [],
      openGroups: [],
      inputValue_Eng: "task01",
      inputValue_Chi: "资产01",
      gxchecked: [],
      showSh: false,
      reviewers: [
        { selected: "内部审核" } // 初始审核人
      ],
      auditOptions: [],
      //编辑的节点
      editnode: "",
      editname: "",
      titleData: "",
      //temp节点
      noderesTemp: "",
      fbshow: true,
      updateDesserts: [],
      showDrawer: false, // 控制弹窗的可见性
      fileList: [],
      only_code_code: "",
      g_only_code: "",
      upload_data: {},
      selected_code: "",
      selected_code_code: "",
      auditFiles: {},
      imageUrls: [],
      showImg: true,
      new_Auditback: "",
      editAdudit_only: {},
      fileflowShow: false,
      zp_show: true,
      zg_show: true,
      backShow: true,
      uploadShow: false,
      auditShow: false,
      getTableNum: 3,
      taskClickTwo: false,
      taskClickOne: false,
      taskClickThree: true,
      isModalOpen: false,
      ifAuditShow: true,
      uploadImg: false,
      imgAudit: false,
      imgAudit_passed: true,
      imgAudit_arr: {},
      ediback: "",
      dNodeProducer: "",
      shifouGetAudit: true,
      uploadGetAudit: true,
      up_auditstatus: false,
      sidebarShow: true
    };
  },
  components: {
    ElUpload,
    ElButton,
    secondTaskMesg
  },
  mounted() {
    document.addEventListener("click", event => {
      if (!this.showDrawer) {
        if (this.$refs.tableContainer && !this.$refs.tableContainer.contains(event.target)) {
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

      // 初始化 openGroups，默认展开所有组
      this.openGroups = Object.keys(groups).map((_, index) => index);

      return Object.values(groups);
    }
  },
  methods: {
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
            message: "请选择一条任务后，再点击任务审核！",
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
    showMessage(msg) {
      ElMessage({
        message: msg,
        type: "success",
        duration: 3000 // 消息显示时间
      });
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
      console.log("resultColor, lastPerson:");
      console.log(resultColor, lastPerson);
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
        const formattedData = this.auditFiles.map(item => {
          return {
            ...item,
            create_time: this.formatCreateTime(item.create_time)
          };
        });
        this.auditFiles = formattedData;
        // console.log(response);
        // console.log(response);
        if (this.auditFiles.length > 0) {
          // 遍历数组
          this.auditFiles.forEach((item, index) => {
            // 替换 create_p 的值
            item.create_p = lastPerson;

            // 添加 color 字段
            item.color = index === 0 ? resultColor : "灰色"; // 第一个元素设置为 resultColor，其余为 "灰色"
          });
        }
      });
    },
    cg_flowShow(event) {
      this.fileflowShow = !this.fileflowShow;
      if (this.fileflowShow == true) {
        this.activeA = true;
        console.log(1);
      } else {
        this.activeA = false;
        console.log(2);
      }
      event.stopPropagation();
    },
    cancelAdd(event) {
      this.showDrawer = false;
      web_imgCancle().then(response => {
        // this.clearTd();
      });
      event.stopPropagation();
      this.fileList = [];
      this.showImg = !this.showImg;
    },
    confireAdd(event) {
      this.showDrawer = false;
      web_imgConfire().then(response => {
        //更新状态
        const only_code = this.selected_code + this.selected_code_code;
        console.log(only_code);
        web_upAuditstatus(only_code, 1).then(response => {
          this.showMessage("提交成功！");
          // this.clearTd();
          this.getTableData();
        });
      });
      event.stopPropagation();
      this.fileList = [];
    },
    // 处理img文件变化的方法
    handleChange(file, newFileList) {
      this.fileList = newFileList; // 更新文件列表
      //获取当前时间
      const now = new Date();
      const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
      const userStore = useUserStore();

      //拼一个OC_NODE_FILE
      const keyVal = this.key;
      let only_code = this.selected_code + this.selected_code_code;
      const file_code = {
        pro_code: keyVal,
        task_code: this.selected_code,
        code_code: this.selected_code_code,
        only_code: only_code,
        only_code_form: "",
        file_type: 0,
        file_path: "",
        audit_level: 1,
        audit_if_passed: 0,
        create_time: formattedNow,
        create_p: userStore.getName
      };
      // console.log("file_code:", file_code);
      this.upload_data = file_code;
      // console.log("this.upload_data:", this.upload_data);
    },
    // 处理img文件拖拽
    handleDrop() {
      // event.stopPropagation();
      // console.log("文件被拖拽到此区域", dragEvent);
    },
    beforeUpload(file) {
      // console.log("上传前的验证");
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isPDF = file.type === "application/pdf";
      const isValid = isJPG || isPNG || isPDF;

      if (!isValid) {
        // 如果不符合条件，使用 $message 提示用户
        // 由于在 setup 中不能直接使用 this，您需要使用 `getCurrentInstance`
        const { proxy } = getCurrentInstance();
        proxy.$message.error("上传文件只能是 JPG、PNG 或 PDF 格式!");
      }

      const fileName = file.name;

      return isValid;
    },
    // 创建 img 对象 URL
    createObjectURL(file) {
      return URL.createObjectURL(file);
    },
    handleChildClick() {
      this.sidebarShow = !this.sidebarShow;
    },
    openDialogM(event) {
      const userPerx = useUserStore();
      if (this.dNodeProducer == userPerx.getName) {
        if (this.uploadGetAudit) {
          this.showDrawer = true;
          this.uploadImg = false;
          this.showImg = true;
          this.ifAuditShow = false;
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

      event.stopPropagation();
    },
    clearTd() {
      // 遍历 desserts 数组，重置 td_select 为 false
      this.desserts.forEach(dessert => {
        dessert.td_select = false; // 重置选择状态
      });
      this.only_code_code = "";
      this.selected_code = "";
      this.selected_code_code = "";
      this.auditFiles = {};
      this.imageUrls = [];
      this.showImg = true;
      this.new_Auditback = "";
    },
    clickCheckbox(dessert, group) {
      let lastPerson = "";
      let resultColor = "";
      console.log(dessert.temp_task_status);
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
              if (index == dessert.temp_task_status.length - 1) {
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
      if (dessert.node_producer && dessert.node_producer.length > 0 && (dessert.auditstatus == 5 || dessert.auditstatus == 0)) {
        this.up_auditstatus = true;
      } else {
        this.up_auditstatus = false;
      }

      if (group.headerSelected == true) {
        group.headerSelected = false;
      } else {
        // 重置
        this.groupedDesserts.forEach(gg => {
          gg.headerSelected = false;
        });
        group.headerSelected = true;
      }
      this.only_code_code = dessert.code_code;
      let only_code = dessert.category + dessert.code_code;
      this.g_only_code = only_code;

      this.desserts.forEach(dessert => {
        let onlyCode = dessert.category + dessert.code_code;
        if (onlyCode != only_code) {
          dessert.td_select = false; // 重置选择状态
        }
      });

      dessert.td_select = !dessert.td_select;
      //传值给上传文件
      this.selected_code = dessert.category;

      this.selected_code_code = dessert.code_code;

      if (dessert.td_select == false) {
        this.auditFiles = {};
      } else {
        this.getForms({ only_code: this.selected_code + this.selected_code_code }, resultColor, lastPerson);
      }

      let valueAfterSlash = dessert.newCategory.split("/")[1];
      this.editAdudit_only = {
        chinaName: valueAfterSlash
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
    },
    cgProStatuIsEditing() {
      this.isEditing = !this.isEditing;
      if (this.isEditing == true) {
        //清空
        this.updateDesserts = [];
      } else {
        console.log("updateDessert:", JSON.stringify(this.updateDesserts));
        web_supplementTask(this.updateDesserts).then(response => {
          console.log("res:", response);
        });
      }
    },
    updateDessert(dessert, index, key, value, group) {
      const pindex = String(index + 1).padStart(2, "0");
      const task_code = group.category;
      const pro_code = this.key;
      const code_code = dessert.code_name + pindex;
      const only_code = task_code + code_code;
      // 将新字段添加到 dessert 对象中
      dessert.task_code = task_code;
      dessert.pro_code = pro_code;
      dessert.code_code = code_code;
      dessert.only_code = only_code;
      dessert[key] = value;
      console.log("dd:", JSON.stringify(dessert));

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
      console.log("this.updateDessert");
    },
    openModal(img_url) {
      console.log(img_url);
      this.isModalOpen = true; // 打开模态框
      this.imageUrl = img_url;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    confireShowDrawer() {
      this.showDrawer = false;
      this.imgAudit = false;
      // console.log("imgAudit_arr:", this.imgAudit_arr);
      if (this.imgAudit_arr != {}) {
        web_updateAudit(this.g_only_code, this.imgAudit_arr.is_passed, this.ediback).then(response => {
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
    auditClick(file) {
      this.showImg = false;
      this.showDrawer = true;
      this.uploadImg = true;

      //校验是否是当前的审核人
      let curr_audit_p = this.auditFiles[0].create_p;
      const userPerx = useUserStore();
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
      });

      //审核评论
      //获取审核结果
      //版本号
      // 使用正则表达式匹配最后一个form后面的数字
      const match = file.only_code_form.match(/form(\d+)$/);
      let versionN = -1;

      if (match) {
        // 转换为整数
        versionN = parseInt(match[1], 10);
      }
      web_getAuditback(this.selected_code + this.selected_code_code, versionN).then(response => {
        this.new_Auditback = response;
      });
    },
    upAudit(is_passed) {
      this.imgAudit = true;
      if (is_passed == 2) {
        this.imgAudit_passed = true;
      } else {
        this.imgAudit_passed = false;
      }
      console.log("this.g_only_code.only_code:", this.g_only_code);
      let imgAudit_arr = {
        only_code: this.g_only_code,
        is_passed: is_passed
      };
      this.imgAudit_arr = imgAudit_arr;
      console.log("this.imgAudit_arr:", this.imgAudit_arr);
    },
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

    // 得到表格数据
    getTableData() {
      const userPerx = useUserStore();
      // console.log(this.key);
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
            item.Child.forEach(cItem => {
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

              web_getAuditIcon(cItem.task_code).then(res => {
                const temp_res = res;
                console.log("temp_res:", temp_res);
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
                //拼newCategory
                let cc = this.key;
                let newCategory = cItem.task_code.replace(new RegExp(`^${cc}`), "");
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
                const toRemove = `${cc}_`;
                if (newCategory.startsWith(toRemove)) {
                  newCategory = newCategory.slice(toRemove.length);
                }
                newCategory = newCategory + "/" + cItem.chinaName;
                this.desserts.push({
                  newCategory: newCategory,
                  thum_inf: cItem.thum_inf,
                  planTime: planTime,
                  code_name: cItem.code_name,
                  only_code: cItem.only_code, //提供给OC_NODE_FILE的only_code
                  code_code: cItem.code_code,
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
                  deadline: deadline,
                  td_select: false,
                  released: released,
                  realTime: realTime,
                  createTime: item.create_time,
                  temp_task_status: temp_res
                });

                this.desserts.sort((a, b) => {
                  return new Date(b.createTime) - new Date(a.createTime);
                });
              });
            });
          }
        });
      });
    },
    addReviewTemp() {
      const key = this.key;
      const editnode = this.editnode;
      const editname = this.editname;
      //查询版本
      web_getVersion(this.key, this.editnode).then(response => {
        let v_num = parseInt(response) + 1;
        //获取当前时间
        const now = new Date();
        const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");

        // 假设 reviewers 是一个数组，您想根据它构建 reviewArray
        const reviewArray = this.reviewers.map((reviewer, index) => ({
          pro_code: key,
          code_code: editnode, // 例如，使用 reviewer 的某个属性
          code_name: editname,
          version_num: v_num,
          if_latest: 0,
          current_audit_level: "1",
          current_audit_name: "1级审核",
          current_level: "1-" + index + 1,
          current_name: reviewer.selected,
          node_supervisor: "", // 使用 reviewer 的属性
          if_passed: 0,
          create_time: formattedNow,
          create_p: "zs",
          delete_flag: 0
        }));
        // console.log(JSON.stringify(reviewArray));
        web_addAuditNodes(reviewArray).then(response => {
          // console.log(response);
          // 提示“审核预设成功！”

          this.showSh = !this.showSh;
        });
      });
    },
    cgProStatu() {
      web_cgProStatu(this.key, 1).then(response => {});
      this.fbshow = !this.fbshow;
    },
    isGroupOpen(groupIndex) {
      // console.log(groupIndex);
      return this.openGroups.includes(groupIndex);
    },
    toggleSelection(item) {
      item.selected = !item.selected;
    },
    handleSuccess(response, file, fileList) {
      // console.log("上传成功:", response);
      ElMessage({
        message: "上传图片已成功！",
        type: "success",
        duration: 3000 // 消息显示时间
      });
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
