import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import _ from 'lodash'
import "element-plus/dist/index.css";
import "@/assets/css/index.css";
import packagejson from '../package.json'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

// element-ui-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// pinia
const pinia = createPinia()
app.use(pinia)
// axios
app.config.globalProperties.$axios = axios;
// version
app.config.globalProperties.$fcircle_front_version = packagejson.version;
// lodash
app.config.globalProperties.$_ = _
app.mount("#hexo-circle-of-friends-root");
