import router from "@/routers/index";
import { LOGIN_URL } from "@/config";
import { RouteRecordRaw } from "vue-router";
import { ElNotification } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

//权限控制
/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  try {
    // 1.获取菜单列表 && 按钮权限列表
    await authStore.getAuthMenuList();
    await authStore.getAuthButtonList();

    // 2.判断当前用户有没有菜单权限
    if (!authStore.authMenuListGet.length) {
      ElNotification({
        title: "无权限访问",
        message: "当前账号无任何菜单权限，请联系系统管理员！",
        type: "warning",
        duration: 3000
      });
      userStore.setToken("");
      router.replace(LOGIN_URL);
      return Promise.reject("No permission");
    }

    // 3.添加动态路由
    authStore.flatMenuListGet.forEach(item => {
      item.children && delete item.children;
      if (item.component && typeof item.component == "string") {
        item.component = modules["/src/views" + item.component + ".vue"];
      }
      if (item.meta.isFull) {
        // console.log("itemisFull:", item);
        router.addRoute(item as unknown as RouteRecordRaw);
      } else {
        // console.log("itemisFull:", item.component);
        router.addRoute("layout", item as unknown as RouteRecordRaw);
      }
    });

    // 手动添加新路由
    // const newRoute = {
    //   path: "/task/secondTask",
    //   name: "secondTask",
    //   component: modules["/src/views/task/secondTask/index.vue"],
    //   meta: {
    // isAffix: false, // 根据需要设置
    // isFull: true,
    // isHide: false,
    // isReapire: false, // 根据需要设置
    // isLink: false,
    // permissions: 0, // 根据需要设置
    // title: "New Route"
    //   }
    // };
    // console.log(newRoute);
    // router.addRoute("layout", newRoute as unknown as RouteRecordRaw);
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    userStore.setToken("");
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
