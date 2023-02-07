import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";

import "element-plus/dist/index.css";
import "@/styles/index.css";
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
app.mount("#hexo-circle-of-friends-root");
