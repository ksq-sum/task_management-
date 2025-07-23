import { ref } from "vue";
import { ElUpload, ElButton, ElMessage, ElMessageBox } from "element-plus";
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
  web_getAllSupervisor,
  web_editaudit,
  web_delNode,
  web_getAuditTemp,
  web_getTaskNodeName,
  web_getAuditIcon,
  web_getNodeAudit,
  web_findCodeCode,
  web_dupChEng,
  web_getTaskForms,
  web_getTaskFormAll,
  web_downloadTaskTemplate
} from "@/api/modules/task";
import { useRoute, useRouter } from "vue-router";
import { format } from "date-fns";
import { stringify } from "qs";
import secondTaskMesg from "@/views/task/secondTaskMesg/index.vue";
import { version } from "nprogress";
import { useUserStore } from "@/stores/modules/user"; // 导入你的 store
import { reactive } from "vue";
import { MessageBox } from "@element-plus/icons-vue";
import ed from "../editAudit/index.vue";
import { it } from "element-plus/es/locale/index.mjs";

export default {
  props: {
    data: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      supervisor_selectedValue: null, // 存储选中的值
      supervisor_options: [
        // 下拉框选项
        // { value: "option1", label: "选项 1" },
      ],
      desserts: [],
      openGroups: [],
      gx: [],
      inputValue_Eng: "",
      inputValue_Chi: "",
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
      isEditing: false,
      isEditing: false,
      updateDesserts: [],
      selectedDate: null,
      clickAudit: false,
      editAdudit_only: {},
      showdrop: true,
      node_item_name: "",
      aduitshow: true,
      workflowShow: false,
      auditFiles: {},
      fileflowShow: true,
      zg_slue_data: true,
      zg_th_data: true,
      sidebarShow: true,
      activeA: true,
      isChildVisible: false,
      parentMessage: "",
      currProCode: "",
      backShow: true,
      uploadShow: false,
      auditShow: false,
      secondTaskMesg_ops: [],
      isec_body: true,
      showDrawer: false,
      router: useRouter(),
      imageUrls: "",
      isModalOpen: false
    };
  },
  components: {
    ElUpload,
    ElButton,
    secondTaskMesg,
    ed
  },
  computed: {
    divStyle() {
      return {
        display: this.gxchecked.length === 0 ? "block" : "none"
      };
    },
    groupedDesserts() {
      const groups = {};
      // console.log("this.desserts3:", this.desserts);
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

      // console.log("this.desserts2:", this.desserts);
      // console.log("this.openGroups:", groups);
      return Object.values(groups);
    }
  },
  mounted() {
    this.isVisible = true; // 控制内容显示
    document.addEventListener("click", event => {
      const editAdudit = this.$refs.editAdudit2 ? this.$refs.editAdudit2.$el || this.$refs.editAdudit2 : null;
      const saveAdudit = this.$refs.saveAdudit ? this.$refs.saveAdudit.$el || this.$refs.saveAdudit : null;

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
    });
  },

  beforeDestroy() {
    document.removeEventListener("click", this.deselectTableRow);
  },
  methods: {
    closeModal() {
      this.isModalOpen = false;
    },
    openModal(img_url) {
      // console.log(img_url);
      this.isModalOpen = true; // 打开模态框
      this.imageUrl = img_url;
    },
    closeShowDrawer(event) {
      this.imgAudit = false;
      this.showDrawer = false;
      // this.clearTd();
      // this.getTableData();
      event.stopPropagation();
      this.fileList = [];
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
    zg_slue() {
      this.zg_slue_data = !this.zg_slue_data;
    },
    handleChildClick() {
      this.sidebarShow = !this.sidebarShow;
    },
    cg_workflowShow() {
      if (this.isEditing == true) {
        ElMessage({
          message: "当前表格处于编辑模式，请保存后再新建任务！",
          type: "warning",
          duration: 3000 // 消息显示时间
        });
      } else {
        if (this.fileflowShow == false) {
          this.fileflowShow = true;
        }
        this.workflowShow = !this.workflowShow;
        if (this.fileflowShow == true && this.workflowShow == false) {
          this.activeA = true;
          console.log("1");
        } else {
          this.activeA = false;
        }
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
        if (this.workflowShow == true) {
          this.workflowShow = false;
        }
        this.fileflowShow = !this.fileflowShow;
        if (this.fileflowShow == true && this.workflowShow == false) {
          this.activeA = true;
        } else {
          this.activeA = false;
        }
      }

      event.stopPropagation();
    },
    // deselectTableRow(event) {
    //   if (!this.$refs.tableContainer.contains(event.target)) {
    //     // 点击表格外部，取消表格中所有<tr>的选中状态

    //     this.groupedDesserts.forEach(gg => {
    //       this.$set(gg, "headerSelected", false); // 使用this.$set确保Vue能够检测到数据的变化
    //     });
    //   }
    // },
    returnAduit() {
      this.reviewers = [];
      this.showSh = false;
      if (this.node_item_name.selected) {
        this.node_item_name.selected = false;
      }
    },
    onDragStart(event, item) {
      // 设置拖拽的数据
      event.dataTransfer.setData("text/plain", JSON.stringify(item));
    },
    handleUpdateMessage(newMsg) {
      this.findCodeCode();
    },
    findCodeCode() {
      web_findCodeCode(this.key).then(response => {
        if (response.length != 0) {
          console.log(response);
          const codeResult = response["code_codes"];
          // console.log(codeResult);
          // 遍历数组并根据 arr 更新 selected 属性
          this.gx.forEach(item => {
            if (codeResult.includes(item.gxcode)) {
              item.bdselected = true;
            } else {
              item.bdselected = false;
            }
          });
        }
      });
    },
    showMessage(msg) {
      ElMessage({
        message: msg,
        type: "success",
        duration: 3000 // 消息显示时间
      });
    },
    editAdudit() {
      this.aduitshow = false;
      // 获取主管
      if (this.supervisor_options.length === 0) {
        this.getAllSupervisor();
      }
      // console.log("this.reviewers:", this.reviewers);

      web_getNodeAudit(this.editAdudit_only.only_code).then(response => {
        this.reviewers = [];
        // console.log(this.reviewers);
        // console.log("response:", response);
        // console.log(response);
        response.forEach(item => {
          //username对应的realname
          this.reviewers.push({
            selected: item.level_name
          });
        });
      });
      console.log("this.reviewers:", this.reviewers);
      // this.showSh = !this.showSh;
      // 阻止事件冒泡
      // event.stopPropagation();
    },
    // 函数来找到差异
    findDifference(only_code, code_code) {
      // 确定 code_code 在 only_code 中的位置
      const index = only_code.indexOf(code_code);

      // 如果 code_code 在 only_code 中存在
      if (index !== -1) {
        // 找出 only_code 的前缀和后缀
        const prefix = only_code.substring(0, index);
        const suffix = only_code.substring(index + code_code.length);

        return {
          prefix,
          suffix,
          combined: prefix + suffix // 返回去掉 code_code 后的字符串
        };
      } else {
        // 如果 code_code 不在 only_code 中
        return {
          prefix: only_code,
          suffix: "", // 无后缀
          combined: only_code // 返回原字符串
        };
      }
    },
    projectShow() {
      // let router = useRouter();
      this.router.push(`/task/projectShow`);
    },
    delTaskNode(event) {
      ElMessageBox.confirm("您确定要删除该节点吗？", "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const result = this.findDifference(this.editAdudit_only.only_code, this.editAdudit_only.code_code);
        // 用户点击了确定
        console.log("editAdudit_only:", result.prefix, this.editAdudit_only.only_code);

        web_delNode(result.prefix, this.editAdudit_only.only_code).then(response => {
          this.getTableData();
          this.clearTd();
        });
      });
      event.stopPropagation();
    },
    onDrop(event) {
      // 处理放置事件
      const data = event.dataTransfer.getData("text/plain");
      const jdata = JSON.parse(data);
      this.addToGxChecked(jdata);
      this.showdrop = false;

      // console.log("Dropped data:", data);
      // alert("成功放置: " + data);
    },
    clickCheckbox(dessert, index, group) {
      let lastPerson = "";
      let resultColor = "";
      // 遍历数组
      dessert.task_status.forEach((item, index) => {
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
      if (this.isEditing != true) {
        if (group.headerSelected == true) {
          group.headerSelected = false;
        } else {
          // 重置
          this.groupedDesserts.forEach(gg => {
            gg.headerSelected = false;
          });
          group.headerSelected = true;
        }

        // console.log("click_this.groupedDesserts:", this.groupedDesserts);
        let only_code = dessert.category + dessert.code_code;
        this.desserts.forEach(dessert => {
          let onlyCode = dessert.category + dessert.code_code;
          if (onlyCode != only_code) {
            dessert.td_select = false; // 重置选择状态
          }
        });
        dessert.td_select = !dessert.td_select;
        console.log(dessert.td_select);
        if (dessert.td_select) {
          this.clickAudit = true;
          this.getForms({ only_code: only_code }, resultColor, lastPerson);
        } else {
          this.clickAudit = false;
        }
        this.showSh = false;
        // console.log(dessert.category + dessert.code_code);

        // this.editAdudit_onlycode = dessert.category + dessert.code_code;
        // console.log("dessert:", dessert);
        this.editAdudit_only = {
          chinaName: dessert.chinaName,
          task_code: dessert.category,
          only_code: dessert.category + dessert.code_code,
          code_code: dessert.code_code
        };

        this.editAdudit();
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
    cgProStatuIsEditing() {
      this.clickAudit = false;
      this.isEditing = !this.isEditing;
      if (this.isEditing == true) {
        this.sidebarShow = false;
        this.activeA = true;
        this.fileflowShow = true;
        this.workflowShow = false;

        //清空
        this.updateDesserts = [];
        //查询主管
        this.getAllSupervisor();
      } else {
        this.sidebarShow = true;
        this.activeA = false;
        this.fileflowShow = false;
        this.workflowShow = false;
        // 检查条件并修改 auditstatus
        this.updateDesserts.forEach(item => {
          if (
            (item.auditstatus == 4 || item.auditstatus == "信息不全") &&
            item.work_type !== "" &&
            item.node_supervisor !== "" &&
            item.humandays !== "" &&
            item.planTime !== ""
          ) {
            item.auditstatus = 5; // 修改 auditstatus 为 5
          }
        });
        // 遍历并修改 auditstatus
        this.updateDesserts.forEach(function (dessert) {
          if (dessert.auditstatus === "信息不全") {
            dessert.auditstatus = 4;
          }
          if (dessert.auditstatus === "信息不完善") {
            dessert.auditstatus = 5;
          }
          if (dessert.auditstatus == "等待上传") {
            dessert.auditstatus = 0;
          }
          if (dessert.auditstatus == "等待审核") {
            dessert.auditstatus = 1;
          }
          if (dessert.auditstatus == "审核未通过") {
            dessert.auditstatus = 2;
          }
          if (dessert.auditstatus == "审核已通过") {
            dessert.auditstatus = 3;
          }
        });
        // console.log("this.updateDesserts:", JSON.stringify(this.updateDesserts));
        web_supplementTask(this.updateDesserts).then(response => {
          // console.log("res:", response);
          this.getTableData();
        });
      }
    },
    getAllSupervisor() {
      web_getAllSupervisor(2).then(response => {
        // 提取 username 和 realname
        const result = response.map(item => ({
          value: item.username,
          label: item.realname
        }));
        this.supervisor_options = result;
        this.secondTaskMesg_ops = result;
      });
    },
    formatDate(date) {
      const yyyy = date.getFullYear(); // 获取完整的年份
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份，注意月份从0开始
      const dd = String(date.getDate()).padStart(2, "0"); // 获取日期

      return `${yyyy}-${mm}-${dd}`; // 返回格式化后的日期字符串
    },
    updateDessert(dessert, index, key, value, group) {
      // console.log(dessert);
      // console.log(value);
      // console.log(group);

      const pindex = String(index + 1).padStart(2, "0");

      const task_code = dessert.category;
      const pro_code = this.key;
      const code_code = dessert.code_name + pindex;
      const only_code = dessert.category + code_code;

      // console.log(this.this.editAdudit_only);
      // console.log("pro_code:", pro_code);
      // console.log("task_code:", task_code);
      // console.log("code_code:", code_code);
      // // console.log("only_code:", only_code);
      // console.log(dessert.category);
      // 将新字段添加到 dessert 对象中
      dessert.task_code = task_code;
      dessert.pro_code = pro_code;
      dessert.code_code = code_code;
      dessert.only_code = only_code;
      dessert[key] = value;
      // dessert.key = value
      if (key == "planTime") {
        if (value == "") {
          console.log(value);
          dessert["planTime"] = "";
        } else {
          const date = new Date(value);
          const formattedDate = this.formatDate(date);
          dessert["planTime"] = formattedDate;
        }
      }

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
      // console.log(this.updateDesserts);
    },
    //校验
    stringToNumbers(str) {
      return str
        .split("")
        .map(char => char.charCodeAt(0) - 96)
        .filter(num => num > 0);
    },
    async saveCode() {
      this.gxchecked.forEach(it => {
        if (it.bdselected == false) {
          ElMessage({
            message: "当前阶段未添加审核预设！",
            type: "warning",
            duration: 3000 // 消息显示时间
          });
          return true;
        }
      });

      if (this.inputValue_Chi == "" || this.inputValue_Eng == "" || this.inputValue_Eng == this.key + "_") {
        ElMessage({
          message: "请正确输入任务的中文名和英文名！",
          type: "warning",
          duration: 3000 // 消息显示时间
        });
        //校验重复英文名
        return;
      }
      if (this.gxchecked.length == 0) {
        ElMessage({
          message: "请创建任务流后创建任务！",
          type: "warning",
          duration: 3000 // 消息显示时间
        });
        //校验重复英文名
        return;
      }
      let numericArray = await web_dupChEng(this.key + this.inputValue_Eng);

      if (numericArray != 0) {
        ElMessage({
          message: "任务英文名已重复，请重新填写该英文名",
          type: "warning",
          duration: 3000 // 消息显示时间
        });
        return;
      }

      // web_dupChEng(this.key + this.inputValue_Eng).then(response => {
      //   const numericArray = stringToNumbers(response);
      //   if (numericArray != 0) {
      //     ElMessage({
      //       message: "任务英文名已重复，请重新填写该英文名",
      //       type: "warning",
      //       duration: 3000 // 消息显示时间
      //     });
      //     return;
      //   }
      // });

      // keyVal + this.inputValue_Eng

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
      const userStore = useUserStore();
      // console.log(JSON.stringify(this.desserts));

      if (this.desserts == []) {
        const maxDesignCodeNum = 1;
      } else {
        // 计算code_code
        // 提取以 "design" 开头的 code_code 中的数字
        const maxDesignCode = this.desserts
          .map(item => {
            // console.log(item);
            // 只处理以 "design" 开头的 code_code
            if (item.code_code.startsWith(this.gxchecked[0].gxcode)) {
              // 从 code_code 中提取数字部分并转换为整数
              const num = parseInt(item.code_code.replace(this.gxchecked[0].gxcode, ""), 10);
              return num; // 返回提取的数字
            }
            return null; // 对于不满足条件的返回 null
          })
          .filter(num => num !== null) // 过滤掉 null 值
          .reduce((max, current) => Math.max(max, current), -Infinity); // 找到最大值

        // console.log(maxDesignCode); // 输出 2
        const maxDesignCodeNum = maxDesignCode + 1;
      }

      console.log("desserts添加x条任务");
      // desserts添加x条任务
      this.gxchecked.forEach((item, index) => {
        saveCodedata.push({
          pro_code: keyVal,
          task_code: keyVal + this.inputValue_Eng,
          task_name: this.inputValue_Eng,
          task_name_china: this.inputValue_Chi,
          task_status: 0,
          if_reworked: 0,
          task_code_count: 1,
          task_type: 0,
          task_realcode1: item.gxcode + index + 1 + "+",
          create_time: formattedNow,
          create_p: userStore.getName,
          category: this.inputValue_Chi
        });

        const filteredArray = noderesTemp.filter(it => it.code_code == item.gxcode);
        filteredArray.forEach(nodeTemp => {
          auditNode.push({
            pro_code: nodeTemp.pro_code,
            task_code: keyVal + this.inputValue_Eng,
            code_code: nodeTemp.code_code,
            only_code: keyVal + this.inputValue_Eng + (item.gxcode + index + 1),
            level_aud: nodeTemp.current_audit_level,
            curr_level: nodeTemp.current_level,
            level_name: nodeTemp.current_name,
            audit_person: "",
            is_passed: 0,
            version: 1,
            create_time: formattedNow,
            create_p: userStore.getName
          });
        });
        let node_super = "";
        if (filteredArray.length != 0) {
          node_super = filteredArray[0].node_supervisor;
        }

        saveTaskNode.push({
          pro_code: keyVal,
          audit_level: 1,
          task_code: keyVal + this.inputValue_Eng,
          code_code: item.gxcode + index + 1,
          only_code: keyVal + this.inputValue_Eng + (item.gxcode + index + 1),
          code_name: item.gxcode,
          thum_inf: "default",
          version: 1,
          auditstatus: 4,
          create_time: formattedNow,
          node_supervisor: node_super,
          node_producer: "",
          create_p: userStore.getName
        });
        console.log(saveTaskNode);
      });
      const allSaveData = { tasks: saveCodedata, task_nodes: saveTaskNode, node_audits: auditNode };

      web_addTaskandNode(allSaveData).then(response => {
        this.getTableData();
      });

      //改变默认资产名称

      //清空gxchecked
      this.gxchecked = [];

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
    toggleUpShow(togNum, event) {
      if (togNum == 2) {
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
    //清除td选中状态
    clearTd() {
      // 遍历 desserts 数组，重置 td_select 为 false
      this.desserts.forEach(dessert => {
        dessert.td_select = false; // 重置选择状态
      });
      this.editAdudit_only = {};
      this.clickAudit = !this.clickAudit;
    },
    auditClick(file, event) {
      this.showDrawer = true;
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
    // 得到表格数据
    getTableData() {
      web_getTableTask(this.key).then(response => {
        // 使用sort()方法对response数组进行排序
        response.sort(function (a, b) {
          let dateA = new Date(a.create_time);
          let dateB = new Date(b.create_time);
          return dateB - dateA; // 按照日期时间字段倒序排序
        });
        // console.log("response：", JSON.stringify(response));
        this.desserts = [];
        response.forEach(item => {
          // console.log("item.create_time:", item.create_time);

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
                //cItem.planTime 去年
                let planTime = "";
                if (cItem.planTime != "" && cItem.planTime != null) {
                  planTime = cItem.planTime.substring(5);
                }
                let realname = "";
                if (cItem.realTime != "" && cItem.realTime != null) {
                  realname = cItem.realTime.substring(5);
                }
                let deadline = "";
                if (cItem.deadline != "" && cItem.deadline != null) {
                  deadline = cItem.deadline.substring(5);
                }
                let released = "";
                if (cItem.released != "" && cItem.released != null) {
                  released = cItem.released.substring(5);
                }

                //拼newCategory
                let cc = this.key;
                let newCategory = cItem.task_code.replace(new RegExp(`^${cc}`), "");
                const toRemove = `${cc}_`;
                if (newCategory.startsWith(toRemove)) {
                  newCategory = newCategory.slice(toRemove.length);
                }
                newCategory = newCategory + "/" + cItem.chinaName;

                // 0-未开始，1-未通过，2-已通过，4-因未通过而停止
                this.desserts.push({
                  newCategory: newCategory,
                  thum_inf: cItem.thum_inf,
                  code_name: cItem.code_name,
                  code_code: cItem.code_code,
                  work_type: cItem.work_type, // 假设 cItem 有 work_type 属性
                  node_supervisor: cItem.node_supervisor, // 假设 cItem 有 node_supervisor 属性
                  version: cItem.version, // 假设 cItem 有 version 属性
                  auditstatus: audstatus,
                  humandays: cItem.humandays, // 假设 cItem 有 humandays 属性
                  endTime: cItem.endTime, // 假设 cItem 有 endTime 属性
                  planTime: planTime,
                  zp_planTime: cItem.planTime,
                  node_producer: cItem.node_producer, // 假设 cItem 有 node_producer 属性
                  task_status: res, // 假设 cItem 有 task_status 属性
                  getTime: cItem.getTime, // 假设 cItem 有 getTime 属性
                  startTime: cItem.startTime, // 假设 cItem 有 startTime 属性
                  upload: cItem.upload, // 假设 cItem 有 upload 属性
                  finishTime: cItem.finishTime, // 假设 cItem 有 finishTime 属性
                  category: cItem.task_code, // 假设 cItem 有 category 属性
                  td_select: false, // 单选框 td 属性，默认未选择
                  released: released,
                  deadline: deadline,
                  realTime: realname,
                  createTime: item.create_time,
                  chinaName: cItem.chinaName
                });

                this.desserts.sort((a, b) => {
                  return new Date(b.createTime) - new Date(a.createTime);
                });
                // console.log(this.desserts);

                // this.desserts.forEach(dessert => {
                //   console.log(dessert.createTime);
                // });
              });
            });
          }

          // console.log("this.desserts1:", this.desserts);

          // console.log("this.desserts1:", this.desserts);
        });
      });
      this.desserts.sort((a, b) => {
        return new Date(b.createTime) - new Date(a.createTime);
      });

      // web_getTaskNodeName(this.key).then(response => {
      //   // 提取前缀和数字部分
      //   let prefix = response.slice(0, 4); // 'task'
      //   let number = parseInt(response.slice(4)); // 提取数字部分并转换为整数

      //   // 数字加1
      //   let newTaskNumber = number + 1;

      //   // 生成新的任务字符串
      //   let newTask = `${prefix}${newTaskNumber}`;
      //   this.inputValue_Eng = newTask;
      // });
    },
    toggleChildNavColor(event) {
      // 通过 ref 调用子组件的方法
      this.$refs.secondTaskMesg.toggleTest(event);
    },
    delGxname() {
      // console.log(this.gxchecked);
      this.gxchecked = [];
    },
    seleClick(event) {
      event.stopPropagation();
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
    addReviewTemp(event) {
      const key = this.key;
      const editnode = this.editnode;
      const editname = this.editname;
      const userStore = useUserStore();
      // console.log("this.supervisor_selectedValue:", this.supervisor_selectedValue);
      //获取当前时间
      const now = new Date();
      const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
      if (this.reviewers.length == 0) {
        ElMessage({
          message: "请添加审核人！",
          type: "warning",
          duration: 3000 // 消息显示时间
        });
        return;
      }
      // console.log("this.editAdudit_only.task_code:", this.editAdudit_only.task_code);
      if (this.clickAudit) {
        const reviewArray = this.reviewers.map((reviewer, index) => ({
          pro_code: key,
          task_code: this.editAdudit_only.task_code,
          code_code: this.editAdudit_only.code_code,
          only_code: this.editAdudit_only.only_code,
          level_aud: 1,
          curr_level: "1-" + (index + 1),
          level_name: reviewer.selected,
          audit_person: this.supervisor_selectedValue,
          is_passed: 0,
          create_time: formattedNow,
          create_p: userStore.getName
        }));
        // console.log("reviewArray:", JSON.stringify(reviewArray));
        web_editaudit(reviewArray).then(response => {
          //提示修改预设成功
          this.showMessage("修改预设成功!");
          this.getTableData();

          // this.showSh = !this.showSh;
          //清空表格选择状态
          // this.clearTd();
          // this.getTableData();
        });
      } else {
        //查询版本
        web_getVersion(this.key, this.editnode).then(response => {
          let v_num = parseInt(response) + 1;

          // 假设 reviewers 是一个数组，您想根据它构建 reviewArray
          const reviewArray = this.reviewers.map((reviewer, index) => ({
            pro_code: key,
            code_code: editnode, // 例如，使用 reviewer 的某个属性
            code_name: editname,
            version_num: v_num,
            if_latest: 0,
            current_audit_level: "1",
            current_audit_name: "1级审核",
            current_level: "1-" + (index + 1),
            current_name: reviewer.selected,
            node_supervisor: this.supervisor_selectedValue, // 使用 reviewer 的属性
            if_passed: 0,
            create_time: formattedNow,
            create_p: userStore.getName,
            delete_flag: 0
          }));
          // console.log(JSON.stringify(reviewArray));
          web_addAuditNodes(reviewArray).then(response => {
            // console.log(response);
            // 提示“审核预设成功！”
            this.showMessage("审核预设成功!");
            // this.showSh = !this.showSh;
            //清除节点被选中的状态
          });
        });
      }
      event.stopPropagation();
    },
    cgProStatu() {
      web_cgProStatu(this.key, 1).then(response => {
        console.log("response:", response);
      });
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

        this.parentMessage = this.gx;
        this.parentMessage.forEach(item => {
          if (item.gxcode === "design") {
            item.selected = true;
          }
        });
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
    addPerson(event) {
      this.reviewers.push({ selected: "内部审核" }); // 添加新的审核人
      event.stopPropagation();
    },
    addToGxChecked(item) {
      this.showdrop = false;
      // 检查项目是否已经存在
      const alreadyChecked = this.gxchecked.find(g => g.gxname === item.gxname);
      if (!alreadyChecked) {
        if (item.gxname == "设计") {
          this.gxchecked.push(item);
        }
      }
      console.log("this.gxchecked:", this.gxchecked);
      console.log("item.td_select:", item.td_select);
    },
    addAudit(item) {
      this.aduitshow = true;
      this.node_item_name = item;
      item.selected = !item.selected;
      this.editnode = item.gxcode;
      this.editname = item.gxname;
      web_getAuditTemp(this.key, this.editnode).then(response => {
        // 遍历原始数据并生成新数组
        const result = response.map(item => {
          return { selected: item.current_name }; // 提取 current_name 并生成新对象
        });
        if (response.length != 0) {
          const node_supervisor = response[0]["node_supervisor"];
          this.supervisor_selectedValue = node_supervisor;
        }

        // 输出结果
        this.reviewers = result;
      });
      this.cgshIf();
    },

    handleReceivedValue(value) {},
    cgshIf() {
      this.isChildVisible = !this.isChildVisible;
      this.currProCode = this.key;
      this.auditOptions = this.auditOptions;
      // console.log("thisGx:", this.gx);
      // this.$refs.ed.handleReceivedValue("receive-value", this.gx);
      // this.showSh = !this.showSh;
      //赋值给dess
      //查询所有主管
      this.getAllSupervisor();
      this.$refs.childRef.designGc(this.key);
    },
    // delAudit(selected, index, event) {
    //   console.log("属性删除 内部审核");
    //   this.reviewers.splice(index, 1);
    //   event.stopPropagation();
    // },
    delAudit(data) {
      this.reviewers.splice(data[1], 1);
      data[2].stopPropagation(data[2]);
    },
    getInputValueEng() {
      this.inputValue_Eng = this.key + "_";
    },
    exportTable() {
      console.log("导出");
      // web_downloadTaskTemplate().then(response => {
      //   console.log(response);
      // });
      window.open("http://192.168.112.72:8889/project/exportExcel/");
    }
  },
  created() {
    this.getInputValueEng();
    this.getNodes();
    this.getAuditNodes();
    this.getTableData();
    this.findCodeCode();
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
