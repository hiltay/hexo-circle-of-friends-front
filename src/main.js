import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/assets/css/index.css";
import packagejson from '../package.json'

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);
// element-ui
app.use(ElementPlus);
// element-ui-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// axios
app.config.globalProperties.$axios = axios;
// version
app.config.globalProperties.$fcircle_front_version = packagejson.version;
app.mount("#hexo-circle-of-friends-root");
