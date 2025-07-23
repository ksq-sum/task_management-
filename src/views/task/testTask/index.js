import { web_getTableTask } from "@/api/modules/task";
export default {
  data() {
    return {
      desserts: [],
      openGroups: [], // 用于存储展开的组索引
      isEditing: false,
      updateDesserts: []
    };
  },
  computed: {
    groupedDesserts() {
      const groups = {};
      this.desserts.forEach(dessert => {
        if (!groups[dessert.category]) {
          groups[dessert.category] = {
            category: dessert.category,
            items: []
          };
        }
        groups[dessert.category].items.push(dessert);
      });
      // 初始化 openGroups，默认展开所有组
      this.openGroups = Object.keys(groups).map((_, index) => index);

      console.log("this.openGroups", this.openGroups);
      // console.log("this.desserts", this.desserts);
      // console.log("Object.values(groups)", Object.values(groups));
      // console.log("groups", groups);

      return Object.values(groups);
    }
  },
  methods: {
    cgProStatuIsEditing() {
      this.isEditing = !this.isEditing;
      if (this.isEditing == true) {
        //清空
        this.updateDesserts = [];
        //查询制作人
        this.getProduces();
      } else {
        this.updateDesserts.map(item => {
          const date = new Date(item.deadline);
          const formattedDate = this.formatDate(date);
          item.deadline = formattedDate; // 将格式化后的日期赋值给当前项的deadline字段
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
            if (dessert.node_producer && dessert.node_producer.length > 0) {
              dessert.auditstatus = 0; // 更新 auditstatus
            }
          }
        });
        // console.log("this.updateDesserts:", JSON.stringify(this.updateDesserts));

        web_supplementTask(this.updateDesserts).then(response => {
          // console.log("res:", response);
          this.getTableData();
        });
      }
    },
    getProduces() {
      // web_getAllSupervisor(3).then(response => {
      //   // 提取 username 和 realname
      //   const result = response.map(item => ({
      //     value: item.username,
      //     label: item.realname
      //   }));
      //   this.producer_options = result;
      //   // console.log(this.supervisor_options);
      // });
    },

    toggleGroup(groupIndex) {
      const index = this.openGroups.indexOf(groupIndex);
      // console.log("index:", index);
      console.log("groupIndex:", groupIndex);
      // console.log("this.openGroups:", this.openGroups);
      // console.log("this.groupedDesserts:", this.groupedDesserts);
      // console.log("this.desserts:", this.desserts);
      if (index > -1) {
        this.openGroups.splice(index, 1); // 收起
      } else {
        this.openGroups.push(groupIndex); // 展开
      }
      console.log("this.openGroups:", this.openGroups);
      // console.log("this.groupedDesserts:", this.groupedDesserts);
    },
    isGroupOpen(groupIndex) {
      console.log(this.openGroups.includes(groupIndex));
      return this.openGroups.includes(groupIndex);
    },
    cgToggle() {
      this.$emit("updateValue");
    },
    // 得到表格数据
    getTableData() {
      this.desserts = [];
      web_getTableTask("test01").then(response => {
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
              this.desserts.push({
                thum_inf: cItem.thum_inf,
                code_name: cItem.code_name,
                code_code: cItem.code_code, //提供给OC_NODE_FILE的code_code
                work_type: cItem.work_type, // 假设 cItem 有 work_type 属性
                node_supervisor: cItem.node_supervisor, // 假设 cItem 有 node_supervisor 属性
                version: cItem.version, // 假设 cItem 有 version 属性
                humandays: cItem.humandays, // 假设 cItem 有 humandays 属性
                endTime: cItem.endTime, // 假设 cItem 有 endTime 属性
                node_producer: cItem.node_producer, // 假设 cItem 有 node_producer 属性
                task_status: cItem.task_status, // 假设 cItem 有 task_status 属性
                getTime: cItem.getTime, // 假设 cItem 有 getTime 属性
                startTime: cItem.startTime, // 假设 cItem 有 startTime 属性
                upload: cItem.upload, // 假设 cItem 有 upload 属性
                finishTime: cItem.finishTime, // 假设 cItem 有 finishTime 属性
                category: cItem.task_code, // 假设 cItem 有 category 属性
                auditstatus: audstatus,
                planTime: cItem.planTime,
                deadline: cItem.deadline,
                td_select: false // 单选框 td 属性，默认未选择
              });
            });
          }
        });
      });
    }
  },
  created() {
    this.getTableData();
  }
};
