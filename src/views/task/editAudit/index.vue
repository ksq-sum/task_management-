<template>
  <div class="ed_overlay" v-if="isVisible">
    <div class="modal">
      <div class="modal-header">
        <h2>创建审核预设</h2>
        <i class="iconfont icon-chahao-copy" @click="closeModal"></i>
      </div>
      <div class="modal-body">
        <div class="node">
          <div class="column_node">
            <button
              draggable="true"
              class="button-gx"
              v-for="item in message"
              @click="cgBackgc(item)"
              :key="item.gxname"
              :style="{
                backgroundColor: item.bdselected ? '#AF52DE' : 'grey',
                border: item.selected ? '3px solid black' : 'none'
              }"
              style="color: white"
              :class="{ 'hover-effect': item.gxname === '设计' }"
              :disabled="item.gxname !== '设计'"
            >
              {{ item.gxname }}
            </button>
          </div>
        </div>
        <div class="content">
          <div style="margin-top: -20px; font-size: 20px">
            <span style="color: #af52de">{{ gxName }}</span>
            <span style="margin-left: 0.5rem">阶段：</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px">
            <div style="width: 30%">主管选择：</div>
            <el-select v-model="supervisor_selectedValue" style="width: 70%" placeholder="请选择">
              <el-option v-for="item in supervisor_options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div style="height: 240px">
            <div v-for="(person, index) in reviewers" :key="index" style="margin-top: 1rem">
              <span>审核人：</span>
              <select
                v-model="person.selected"
                style="width: 6rem; margin-left: 4rem; border: 1px solid grey; border-radius: 0.2rem"
              >
                <option v-for="option in auditOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>

              <i class="iconfont icon-yingyong-" style="margin-left: 1.5rem" @click="delAudit(person.selected, index)"></i>
            </div>
          </div>

          <div class="stage">
            <button class="add-person" @click="addPerson" style="margin-top: 1rem">添加审核人</button>
          </div>
          <div class="stage">
            <button class="confirm" @click="addReviewTemp">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  web_getNodes,
  web_getAllSupervisor,
  web_getAuditNodes,
  web_getAuditTemp,
  web_getVersion,
  web_addAuditNodes,
  web_findCodeCode
} from "@/api/modules/task";
import { format } from "date-fns";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default {
  props: {
    isVisible: Boolean,
    message: String,
    currProCode: String,
    auditOptions: Array
  },
  data() {
    return {
      // isVisible: true, // 控制弹窗的显示和隐藏
      reviewers: [
        { selected: "内部审核" } // 初始审核人
      ],
      gx: {},
      supervisor_options: [
        // 下拉框选项
        // { value: "option1", label: "选项 1" },
      ],
      supervisor_selectedValue: null,
      // auditOptions: [],
      gxCode: "",
      gxName: ""
    };
  },
  created() {
    // this.getNodes();
    this.getAllSupervisor();
    // this.designGc();
    // this.getAuditNodes();
  },
  methods: {
    designGc(fKey) {
      console.log("111");
      this.gxCode = "design";
      this.gxName = "设计";

      // this.currProCode = fKey;
      console.log(fKey);
      web_getAuditTemp(fKey, "design").then(response => {
        console.log(response);
        // 遍历原始数据并生成新数组
        const result = response.map(item => {
          return { selected: item.current_name }; // 提取 current_name 并生成新对象
        });
        if (response.length != 0) {
          const node_supervisor = response[0]["node_supervisor"];
          this.supervisor_selectedValue = node_supervisor;
          console.log("node_supervisor:", node_supervisor);
        }

        // 输出结果
        this.reviewers = result;
      });
    },
    cgBackgc(item) {
      item.selected = !item.selected;
      this.gxCode = item.gxcode;
      this.gxName = item.gxname;

      web_getAuditTemp(this.currProCode, item.gxcode).then(response => {
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
    },
    handleReceiveValue(value) {
      console.log("父组件传递过来的值：", value);
      this.$emit("receive-value", value); // 子组件通过$emit向父组件传递值
    },
    addPerson() {
      this.reviewers.push({ selected: "内部审核" }); // 添加新的审核人
    },
    getAllSupervisor() {
      web_getAllSupervisor(2).then(response => {
        // 提取 username 和 realname
        const result = response.map(item => ({
          value: item.username,
          label: item.realname
        }));
        this.supervisor_options = result;
        // console.log(this.supervisor_options);
      });
    },
    delAudit(selected, index) {
      this.reviewers.splice(index, 1);
    },
    closeModal() {
      this.$emit("close-modal"); // 触发事件通知父组件关闭弹窗
    },
    confirm() {
      // 处理确认逻辑
      alert("确认按钮被点击");
      this.closeModal();
    },
    showMessage(msg) {
      ElMessage({
        message: msg,
        type: "success",
        duration: 3000 // 消息显示时间
      });
    },
    addReviewTemp() {
      //获取当前时间
      const now = new Date();
      const userStore = useUserStore();
      const formattedNow = format(now, "yyyy-MM-dd HH:mm:ss");
      if (this.reviewers.length == 0) {
        ElMessage({
          message: "请添加审核人！",
          type: "warning",
          duration: 3000 // 消息显示时间
        });
        return;
      }

      //查询版本
      web_getVersion(this.currProCode, this.gxCode).then(response => {
        let v_num = parseInt(response) + 1;

        // 假设 reviewers 是一个数组，您想根据它构建 reviewArray
        const reviewArray = this.reviewers.map((reviewer, index) => ({
          pro_code: this.currProCode,
          code_code: this.gxCode, // 例如，使用 reviewer 的某个属性
          code_name: this.gxName,
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
          this.$emit("update-message", "新的信息");
          // this.showSh = !this.showSh;
          //清除节点被选中的状态
        });
      });
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
    }
  }
};
</script>
<style scoped lang="scss">
@import "./index";
</style>
