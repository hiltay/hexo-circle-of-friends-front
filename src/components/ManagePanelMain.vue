<template>
  <div class="ManagePanelMain">
    <div class="cf-manage-top">
      <span class="cf-manage-title">友链朋友圈管理面板</span>
      <el-button @click="logout" class="cf-manage-exit-btn" round>退出登录</el-button>
    </div>
    <el-tabs
      v-model="current_tab"
      type="card"
      class="cf-manage-tabs-area"
    >
      <el-tab-pane label="配置管理" name="settings">
        <ManagePanelMain_settings v-if="current_settings!==null" :Config="Config" :current_settings="current_settings"
                                  :key="component_keys.settings"
                                  @refresh="refresh_component"></ManagePanelMain_settings>
      </el-tab-pane>
      <el-tab-pane label="环境变量管理" name="envs">
        <ManagePanelMain_envs v-if="current_settings!==null" :Config="Config" :current_settings="current_settings"
                              :key="component_keys.envs" @refresh="refresh_component"></ManagePanelMain_envs>
      </el-tab-pane>
      <el-tab-pane label="自定义友链管理" name="links">
        <ManagePanelMain_links v-if="current_settings!==null" :Config="Config" :current_settings="current_settings"
                               :key="component_keys.links" @refresh="refresh_component"></ManagePanelMain_links>
      </el-tab-pane>
      <el-tab-pane label="数据库管理" name="switchsb">
        <ManagePanelMain_switchdb v-if="current_settings!==null" :Config="Config" :current_settings="current_settings"
                                  :key="component_keys.switchdb"
                                  @refresh="refresh_component"></ManagePanelMain_switchdb>
      </el-tab-pane>
      <el-tab-pane label="状态监控" name="status">
        <ManagePanelMain_status :Config="Config" :key="component_keys.status"></ManagePanelMain_status>
      </el-tab-pane>
      <el-tab-pane label="关于" name="about">
        <ManagePanelMain_about></ManagePanelMain_about>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ManagePanelMain_settings from './ManagePanelMain-settings'
import ManagePanelMain_envs from './ManagePanelMain-envs'
import ManagePanelMain_links from './ManagePanelMain-links'
import ManagePanelMain_switchdb from './ManagePanelMain-switchdb'
import ManagePanelMain_status from './ManagePanelMain-status'
import ManagePanelMain_about from './ManagePanelMain-about'
import {get_cache_token, init_header} from "../utils/tools";
import {ElMessage, ElNotification} from "element-plus";


export default {
  name: "ManagePanelMain",
  // 声明需要使用的事件
  emits: ['logout'],
  data() {
    return {
      // 当前选项卡
      current_tab: "settings",
      // 当前配置
      current_settings: null,
      // 每个组件的唯一key，用于内部组件刷新
      component_keys: {
        settings: 0,
        envs: 0,
        links: 0,
        switchdb: 0,
        status: 0
      }

    }
  },
  methods: {
    // 登出
    logout() {
      // 清除本地token缓存
      localStorage.removeItem("fcircle-token")
      this.$emit("logout")
    },
    // 切换当前组件
    change_current_component(component_name) {
      // 登录成功不显示登录页面
      this.show_login_page = false
      // 切换组件名
      if (this.current_component !== component_name) {
        this.current_component = component_name
      }
    },
    // 获取当前朋友圈配置信息
    read_current_settings() {
      let auth_token = get_cache_token()
      // 如果本地有缓存token，尝试直接使用token登录
      if (auth_token) {
        let config = init_header(auth_token)
        this.$axios.get(this.Config.private_api_url + "read_settings", config)
          .then(response => {
            let data = response.data
            if (data.code === 200) {
              this.current_settings = data.current_settings
            } else {
              // 无法获取当前朋友圈配置
              ElMessage({
                message: data.message,
                type: 'error',
              })
            }
          })
          .catch(error => {
            ElMessage({
              message: error.message,
              type: 'error',
            })
          })
      }
    },
    // 刷新内部的组件
    refresh_component(value) {
      // 重新获取当前配置
      this.read_current_settings()
      // 变更key值，刷新内部组件
      this.component_keys[value] += 1
    },
  },
  created() {
    this.read_current_settings()
    // 后端版本检测
    this.$axios.get(this.Config.private_api_url + "version")
      .then(response => {
        // status:0 不需要更新；status:1 需要更新 status:2 检查更新失败
        if (response.data.status === 1) {
          ElNotification({
            title: '版本更新提示',
            message: '检测到后端新版本：' + response.data.latest_version + '，然而当前版本为：' + response.data.current_version + '，请及时更新后端版本',
            type: 'warning',
          })
        }
      })
    // 前端版本检测
    this.$axios.get("https://fcircle-doc.yyyzyyyz.cn/front_version.txt")
    .then(response => {
      if (response.data !== this.$fcircle_front_version) {
        ElNotification({
          title: '版本更新提示',
          message: '检测到前端新版本：' + response.data + '，然而当前版本为：' + this.$fcircle_front_version + '，请及时更新前端版本',
          type: 'warning',
        })
      }
    })
  },
  props: ["Config"],
  components: {
    ManagePanelMain_settings,
    ManagePanelMain_envs,
    ManagePanelMain_links,
    ManagePanelMain_switchdb,
    ManagePanelMain_status,
    ManagePanelMain_about,
  }
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
