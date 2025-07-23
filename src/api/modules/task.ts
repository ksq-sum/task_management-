import { ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { List } from "echarts";

//获取制作人姓名

export const web_getUserName = (username: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getName`, {
    username: username // 将 username 放在 params 中
  });
};

//获取所有导演

export const web_getAllDirect = () => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getDirector`, {});
};

//创建一个新的项目
export const web_createNPro = (jsonString: JSON) => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/project/create`, jsonString);
};

//获取我的项目
export const web_getMyPros = (username: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getMyallPro`, {
    username: username
  });
};

//获取节点
export const web_getNodes = (nodeType: number) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getNodes`, {
    nodeType: nodeType
  });
};

//获取审核节点
export const web_getAuditNodes = () => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getAuditNodes`, {});
};

//添加审核节点
export const web_addAuditNodes = (auditNode: Array<any>) => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/project/addCodeTemp`, auditNode);
};

//查询版本号
export const web_getVersion = (taskname: string, codecode: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getVersion`, {
    taskname: taskname,
    codecode: codecode
  });
};

//添加任务全部数据
export const web_addTaskandNode = (taskandnode: Array<any>) => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/tasks/createTask`, taskandnode);
};

//查询"审核模板表"是否存在该项目的节点模板
export const web_getTemp = (pro_code: string, codecode: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getTemp`, {
    pro_code: pro_code
  });
};

// web_getTableTask
export const web_getTableTask = (pro_code: string, codecode: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getTask`, {
    pro_code: pro_code
  });
};

export const web_cgProStatu = (pro_code: string, pro_statu: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/cgProStatus`, {
    pro_code: pro_code,
    pro_statu: pro_statu
  });
};

//添加任务全部数据
export const web_supplementTask = (taskandnode: Array<any>) => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/project/supplementTask`, taskandnode);
};

// 根据任务节点 查询表单名称
export const web_getTaskForms = (only_code: JSON) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getTaskForms`, only_code);
};

// 根据任务节点 查询表单信息
export const web_getTaskFormAll = (only_code_form: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getTaskFormAll`, {
    only_code_form: only_code_form
  });
};

//更新审核状态
export const web_updateAudit = (only_code: string, is_passed: number, editback: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/update/audit/`, {
    only_code: only_code,
    is_passed: is_passed,
    editback: editback
  });
};
// 获取所有主管
export const web_getAllSupervisor = (level: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/supervisor/`, {
    level: level
  });
};

// 更新任务节点审核预设
export const web_editaudit = (reviewArray: Array<any>) => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/project/editaudit/`, reviewArray);
};

//删除任务节点
export const web_delNode = (task_code: string, only_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/delNode/`, {
    task_code: task_code,
    only_code: only_code
  });
};

//图片确认提交
export const web_imgConfire = () => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/upload/confirm/`, {});
};

//图片确认取消
export const web_imgCancle = () => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/upload/cancel/`, {});
};

//更新node状态
export const web_upAuditstatus = (only_code: string, auditstatus: number) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/upAuditstatus/`, {
    only_code: only_code,
    auditstatus: auditstatus
  });
};

//获取审核阶段
export const web_getNodeAudit = (only_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getNodeAudit/`, {
    only_code: only_code
  });
};

//获取审核人姓名
export const web_getAuditName = () => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getNameUsername/`, {});
};

//获取最新审核备注
export const web_getAuditback = (only_code: string, version: number) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getAuditback/`, {
    only_code: only_code,
    version: version
  });
};

//获取项目百分比
export const web_getTaskProgress = (pro_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getTaskProgress/`, { pro_code: pro_code });
};

//获取项目模板
export const web_getAuditTemp = (pro_code: string, code_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getAuditTemp/`, {
    pro_code: pro_code,
    code_code: code_code
  });
};

//查询默认的任务名
export const web_getTaskNodeName = (pro_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getTaskNodeName/`, {
    pro_code: pro_code
  });
};

//查询审核阶段
export const web_getAuditIcon = (task_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getAuditIcon/`, {
    task_code: task_code
  });
};

//查询code_code
export const web_findCodeCode = (pro_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getCodeCode/`, {
    pro_code: pro_code
  });
};

//查询任务名是否重复
export const web_dupChEng = (task_code: string) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/dupChEng/`, {
    task_code: task_code
  });
};

//查询我的任务。。。
export const web_getMyAllTasks = (pro_code: string, perS: string, select: number) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/getTaskS/`, {
    pro_code: pro_code,
    perS: perS,
    select: select
  });
};

//下载任务管理器的模板文件
export const web_downloadTaskTemplate = () => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/exportExcel/`, {});
};

// 计算"截止时间"
export const web_getDeadline = (start_time: string, hours: number) => {
  return http.get<User.ResDepartment[]>(`http://192.168.112.72:8889/project/calculate_time/`, {
    start_time: start_time,
    hours: hours
  });
};

// 单部门返回
export const web_getDepartPs = (depart: string) => {
  const url = `http://192.168.112.72:8889/zn_project/getDepartPs?depart=${encodeURIComponent(depart)}`;
  return http.post<User.ResDepartment[]>(url);
};

//返回所有项目
export const web_getAllProject = () => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/zn_project/getAllProject/`, {});
};

//增删改项目
export const web_addProject = (pro: List) => {
  return http.post<User.ResDepartment[]>(`http://192.168.112.72:8889/zn_project/doProjects`, {
    pro: pro
  });
};

// 返回某项目的任务与项目节点
export const web_pro_proNode = (pro: string) => {
  const url = `http://192.168.112.72:8889/zn_project/getTask?pro_code=${pro}`;
  return http.post<User.ResDepartment[]>(url);
};

// 获取所有人账号
// /zn_project/getAllUser
export const web_getAllUser = (pro: string) => {
  const url = `http://192.168.112.72:8889/zn_project/getAllUser`;
  return http.post<User.ResDepartment[]>(url);
};

// 资产管理表增删改
export const web_zichan_crud = (pro: string, list: List[]) => {
  const url = `http://192.168.112.72:8889/zn_project/crudTask?pro_code=${pro}`;
  return http.post<User.ResDepartment[]>(url, {
    task: list
  });
};

// 获取人员、部门
export const web_get_department_user = () => {
  const url = `http://192.168.112.72:8889/zn_project/find_person_depart`;
  return http.post<User.ResDepartment[]>(url);
};

// 获取 人员任务分配
export const web_search_tasks = () => {
  const url = `http://192.168.112.72:8889/zn_project/search_tasks`;
  return http.post<User.ResDepartment[]>(url);
};

// 人员任务分配 表增删
export const web_crud_assign = (assign: List[], pro_code: string) => {
  const url = `http://192.168.112.72:8889/zn_project/crud_search_tasks?pro_code=${pro_code}`;
  return http.post<User.ResDepartment[]>(url, {
    task: assign
  });
};
