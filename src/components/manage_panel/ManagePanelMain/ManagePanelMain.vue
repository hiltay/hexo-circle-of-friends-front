<!--
 * @Author: yyyz 904108079@qq.com
 * @Date: 2023-02-02 22:01:24
 * @LastEditors: yyyz 904108079@qq.com
 * @LastEditTime: 2023-02-06 22:58:49
 * @FilePath: \hexo-circle-of-friends-front\src\components\manage_panel\ManagePanelMain\ManagePanelMain.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by yyyz, All Rights Reserved. 
-->
<template>
  <div class="ManagePanelMain">
    <div class="cf-manage-top">
      <span class="cf-manage-title">友链朋友圈管理面板</span>
      <el-button @click="logout" class="cf-manage-exit-btn" round>退出登录</el-button>
    </div>
    <el-tabs v-model="current_tab" type="card" class="cf-manage-tabs-area">
      <el-tab-pane label="配置管理" name="settings">
        <ManagePanelMain_settings v-if="current_settings" :key="component_keys.settings"></ManagePanelMain_settings>
      </el-tab-pane>
      <el-tab-pane label="环境变量管理"  name="envs">
        <ManagePanelMain_envs v-if="current_settings" :key="component_keys.envs"></ManagePanelMain_envs>
      </el-tab-pane>
      <el-tab-pane label="自定义友链管理" name="links">
        <ManagePanelMain_links v-if="current_settings" :key="component_keys.links"></ManagePanelMain_links>
      </el-tab-pane>
      <el-tab-pane label="数据库管理" name="switchdb">
        <ManagePanelMain_switchdb v-if="current_settings" :key="component_keys.switchdb"></ManagePanelMain_switchdb>
      </el-tab-pane>
      <el-tab-pane label="状态监控" name="status" :key="component_keys.status">
        <ManagePanelMain_status></ManagePanelMain_status>
      </el-tab-pane>
      <el-tab-pane label="其它" name="others" :key="component_keys.status">
        <ManagePanelMain_others></ManagePanelMain_others>
      </el-tab-pane>
      <el-tab-pane label="关于" name="about">
        <ManagePanelMain_about></ManagePanelMain_about>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import ManagePanelMain_settings from './ManagePanelMain-settings.vue'
import ManagePanelMain_envs from './ManagePanelMain-envs.vue'
import ManagePanelMain_links from './ManagePanelMain-links.vue'
import ManagePanelMain_switchdb from './ManagePanelMain-switchdb.vue'
import ManagePanelMain_status from './ManagePanelMain-status.vue'
import ManagePanelMain_others from './ManagePanelMain-others.vue'
import ManagePanelMain_about from './ManagePanelMain-about.vue'
import { storeToRefs } from 'pinia'
import useLoginStore from "@/stores/manage/login"
import useManageHomeStore from "@/stores/manage/home"
const ManageHomeStore = useManageHomeStore();
const LoginStore = useLoginStore();
let { current_tab, current_settings, component_keys } = storeToRefs(ManageHomeStore)

ManageHomeStore.version_check()

// 登出
function logout() {
  // 清除本地token缓存
  LoginStore.logout()
}

</script>

<style scoped>
.ManagePanelMain {
  padding: 0 10px;
}

.ManagePanelMain .cf-manage-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/*标题css*/
.cf-manage-title {
  overflow-wrap: break-word;
  color: white;
  font-size: 24px;
  font-family: PingFangSC-Regular;
  text-align: center;
  white-space: nowrap;
  user-select: none;
}

/*退出按钮*/
.cf-manage-exit-btn {
  font-size: 16px;
}

/*选项卡区域*/
.cf-manage-tabs-area {
  position: relative;
  margin: 10px 0px;
}

:deep(.el-tabs__nav-next) {
  color: #fff !important;
}

:deep(.el-tabs__nav-prev) {
  color: #fff !important;
}
</style>
