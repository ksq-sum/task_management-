import { createApp } from "vue";
import App from "./App.vue";
// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
// iconfont css
import "@/assets/iconfont/iconfont.scss";
// font css
import "@/assets/fonts/font.scss";
// element css
import "element-plus/dist/index.css";
// element dark css
import "element-plus/theme-chalk/dark/css-vars.css";
// custom element dark css
import "@/styles/element-dark.scss";
// custom element css
import "@/styles/element.scss";
// svg icons
import "virtual:svg-icons-register";
// element plus
import ElementPlus from "element-plus";
// element icons
import * as Icons from "@element-plus/icons-vue";
// custom directives
import directives from "@/directives/index";
// vue Router
import router from "@/routers";
// vue i18n
import I18n from "@/languages/index";
// pinia store
import pinia from "@/stores";
// errorHandler
import errorHandler from "@/utils/errorHandler";
// 引入阿里巴巴图标
import "@/assets/task_project/iconfont.css";
import "@/assets/web_task/iconfont.css";
//引入vuetify组件
import vuetify from "@/plugins/vuetify";
import "element-plus/dist/index.css";
import WlGantt from "wl-gantt";
import "wl-gantt/lib/wl-gantt.css";
// 引入 vue-easytable 样式
import "vue-easytable/libs/theme-default/index.css";
import Handsontable from "handsontable/base";
import { registerCellType, NumericCellType } from "handsontable/cellTypes";

import { registerPlugin, UndoRedo } from "handsontable/plugins";

registerCellType(NumericCellType);
registerPlugin(UndoRedo);
// 引入 vue-easytable 组件
// import "vue-easytable/libs/theme-default/index.css"; // 引入样式
// import { VeTable } from "vue-easytable"; // 引入组件

const app = createApp(App);
// app.use(vuetify); // 使用 Vuetify
app.config.errorHandler = errorHandler;
// main.js
function setRem() {
  const html = document.documentElement;
  const width = html.clientWidth; // 获取当前视口的宽度
  const rem = width / 120; // 将视口宽度除以10（可以根据需要调整基准值）
  html.style.fontSize = `${rem}px`; // 设置根元素的字体大小
}

// 初始化设置
setRem();

// 监听窗口调整大小事件
window.addEventListener("resize", setRem);

// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});
// app.component("VeTable", VeTable);

app
  .use(ElementPlus)
  .use(directives)
  .use(router)
  .use(I18n)
  .use(pinia)
  .use(vuetify)
  // .use(VueEasytable)
  // .use(VePagination)
  // .use(VeIcon)
  // .use(VeLoading)
  // .use(VeLocale)
  .mount("#app");
