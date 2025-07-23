<template>
  <div class="main-box">
    <TreeFilter
      label="name"
      title="部门列表(单选)"
      :request-api="web_getDepartment"
      :default-value="initParam.departmentId"
      @change="changeTreeFilter"
    />

    <div class="table-box">
      <ProTable
        ref="proTable"
        :columns="columns"
        :request-api="web_getUserList"
        :init-param="initParam"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <UserDrawer ref="drawerRef" />
      <!-- <ImportExcel ref="dialogRef" /> -->
    </div>
  </div>
</template>

<script setup lang="ts" name="departmentManage">
import { ref, reactive } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { User } from "@/api/interface";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessage } from "element-plus";
import TreeFilter from "@/components/TreeFilter/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import {
  web_getDepartment,
  getUserDepartment,
  getUserGender,
  getUserStatus,
  getUserList,
  web_getUserList,
  addUser,
  editUser,
  resetUserPassWord,
  deleteUser
} from "@/api/modules/user";
import { CirclePlus, View, EditPen, Refresh, Delete } from "@element-plus/icons-vue";

//data
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ departmentId: "1" });

// 树形筛选切换
const changeTreeFilter = (val: string) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  proTable.value!.pageable.pageNum = 1;
  initParam.departmentId = val;
};

// 表格表头配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "index", label: "id", width: 80 },
  { prop: "username", label: "用户名", width: 120, search: { el: "input" } },
  { prop: "realname", label: "姓名" },
  { prop: "gender", label: "性别" },
  { prop: "user_email", label: "邮箱" },
  { prop: "psd", label: "密码" },
  { prop: "department", label: "部门" },
  { prop: "permissions", label: "员工权限" },
  { prop: "create_time", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 330, fixed: "right" }
]);

//methods
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
  proTable.value?.getTableList();
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};
</script>
