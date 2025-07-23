<template>
  <table class="workorder-table">
    <thead>
      <tr>
        <th style="width: 150px">订单编号</th>
        <th v-if="!isAnyExpanded" style="width: 150px">店铺订单号</th>
        <th v-if="!isAnyExpanded" style="width: 200px">订单状态</th>
        <th v-if="!isAnyExpanded" style="width: 200px">订单备注</th>
        <th v-if="!isAnyExpanded" style="width: 150px">预计结束时间</th>
        <th v-if="!isAnyExpanded" style="width: 150px">实际结束时间</th>
        <th v-if="!isAnyExpanded" style="width: 150px">是否逾期</th>
        <th style="width: 150px">SKU</th>
        <th style="width: 150px">MSKU</th>
        <th style="width: 150px">数量</th>
        <th style="width: 150px">物料</th>
        <th style="width: 150px">生产图</th>
        <th style="width: 150px">渲染图</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="workorder in workorderList" :key="workorder.globalOrderNo">
        <!-- 父级行 -->
        <tr class="expandable" @click="toggleChildren(workorder.globalOrderNo)">
          <td>{{ workorder.globalOrderNo }}</td>
          <td v-if="!isAnyExpanded">{{ workorder.platformOrderName }}</td>
          <td v-if="!isAnyExpanded">{{ formatOrderStatus(workorder.requestStatus) }}</td>
          <td v-if="!isAnyExpanded">{{ workorder.remark }}</td>
          <td v-if="!isAnyExpanded">{{ workorder.planEndTime }}</td>
          <td v-if="!isAnyExpanded">{{ workorder.realEndTime }}</td>
          <td v-if="!isAnyExpanded">{{ formatOutTime(workorder.ifOutTime) }}</td>
          <td>{{ workorder.sku }}</td>
          <td>{{ workorder.msku }}</td>
          <td>{{ workorder.count }}</td>
          <td>{{ workorder.wuliao }}</td>
          <td>{{ workorder.proImg }}</td>
          <td>{{ workorder.scImg }}</td>
          <!-- 占位以保持表格结构 -->
        </tr>
        <!-- 子级行 -->
        <template v-if="isExpanded(workorder.globalOrderNo)">
          <tr v-for="child in workorder.children" :key="child.globalOrderNo" class="child">
            <td class="child-cell">{{ child.globalOrderNo }}</td>
            <td class="child-cell" v-if="!isAnyExpanded">{{ child.platformOrderName }}</td>
            <td class="child-cell" v-if="!isAnyExpanded">{{ formatOrderStatus(child.requestStatus) }}</td>
            <td class="child-cell" v-if="!isAnyExpanded">{{ child.remark }}</td>
            <td class="child-cell" v-if="!isAnyExpanded">{{ child.planEndTime }}</td>
            <td class="child-cell" v-if="!isAnyExpanded">{{ child.realEndTime }}</td>
            <td class="child-cell" v-if="!isAnyExpanded">{{ formatOutTime(child.ifOutTime) }}</td>
            <td class="child-cell">{{ child.sku }}</td>
            <td class="child-cell">{{ child.msku }}</td>
            <td class="child-cell">{{ child.count }}</td>
            <td class="child-cell">{{ child.wuliao }}</td>
            <td class="child-cell">{{ child.proImg }}</td>
            <td class="child-cell">{{ child.scImg }}</td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      workorderList: [
        {
          globalOrderNo: "G123456",
          platformOrderName: "P123456",
          requestStatus: 1,
          remark: "无",
          planEndTime: "2023-12-01",
          realEndTime: "2023-11-30",
          ifOutTime: 0,
          children: [
            {
              globalOrderNo: "C123456",
              platformOrderName: "CP123456",
              requestStatus: 1,
              remark: "子项备注",
              planEndTime: "2023-12-01",
              realEndTime: "2023-11-30",
              ifOutTime: 0,
              sku: "sku",
              msku: "msku"
            }
          ]
        },
        {
          globalOrderNo: "G123457",
          platformOrderName: "P123457",
          requestStatus: 2,
          remark: "需确认",
          planEndTime: "2023-12-02",
          realEndTime: "",
          ifOutTime: 1,
          children: [],
          isAnyExpanded: true
        }
      ],
      expandedWorkorders: [] // 确保初始值为数组，避免 TypeError
    };
  },
  methods: {
    formatOrderStatus(status) {
      const statusMap = {
        1: "同步中",
        2: "已同步",
        3: "未付款",
        4: "待审核",
        5: "待发货",
        6: "已发货",
        7: "已取消/不发货",
        8: "不显示",
        9: "平台发货"
      };
      return statusMap[status] || "未知状态"; // 默认返回 '未知状态'
    },
    toggleChildren(globalOrderNo) {
      const index = this.expandedWorkorders.indexOf(globalOrderNo);
      if (index > -1) {
        console.log("折叠");
        this.isAnyExpanded = false;
        // 如果已经展开，移除它
        this.expandedWorkorders.splice(index, 1);
      } else {
        console.log("展开");
        this.isAnyExpanded = true;
        this.expandedWorkorders.push(globalOrderNo);
      }
    },
    formatOutTime(ifOutTime) {
      return ifOutTime === 0 ? "未逾期" : "有逾期";
    },
    isExpanded(globalOrderNo) {
      // 检查给定的工单 ID 是否在展开列表中
      return this.expandedWorkorders.includes(globalOrderNo);
    },
    get isAnyExpanded() {
      // 检查是否有任何工单被展开
      return this.expandedWorkorders && this.expandedWorkorders.length > 0;
    }
  }
};
</script>

<style>
.workorder-table {
  width: 100%;
  table-layout: fixed; /* 固定列宽 */
  border-collapse: collapse; /* 合并边框 */
  background-color: white;
}
.workorder-table th,
.workorder-table td {
  padding: 8px; /* 内边距 */
  overflow: hidden; /* 隐藏溢出 */
  text-align: left; /* 左对齐 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 不换行 */
  border: 1px solid #cccccc; /* 边框样式 */
}
.workorder-table th {
  background-color: #6696fd4d; /* 表头背景色 */
}
.expandable {
  cursor: pointer; /* 鼠标指针变为手指 */
}
.child {
  background-color: #eeebeb; /* 子项行背景颜色 */
}
.child-cell {
  padding-left: 20px; /* 子项行的左边距，增加缩进 */
}
</style>
