import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import authMenuList from "@/assets/json/authMenuList.json";
import normalMenuList from "@/assets/json/normalMenuList.json";
import http from "@/api";
import { useUserStore } from "@/stores/modules/user";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  //定义login路由
  var login_url = `http://192.168.112.72:8889/user/login`;
  // var login_url = `http://127.0.0.1:8889/user/login`;
  return http.post<Login.ResLogin>(login_url, params, { loading: false });
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: false }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, {}, { loading: false });
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据
  //根据权限，限制路径
  const userStore = useUserStore();
  const name = userStore.getName;
  //初步实现
  //管理员
  if (name == "ksq") {
    return authMenuList;
    //普通用户
  } else {
    return normalMenuList;
  }
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return {};
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(PORT1 + `/logout`);
};
