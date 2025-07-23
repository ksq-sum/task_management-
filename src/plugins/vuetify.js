// src/plugins/vuetify.js
import { createVuetify } from "vuetify";
import "vuetify/styles"; // 引入 Vuetify 默认样式
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives
});

export default vuetify;
