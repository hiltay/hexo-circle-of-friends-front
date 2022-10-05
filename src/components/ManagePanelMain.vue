<template>
  <div>
    <span class="cf-manage-title">友链朋友圈管理面板</span>
    <el-button @click="logout" class="cf-manage-exit-btn" round>退出登录</el-button>
    <!--    <el-button @click="xxx" class="cf-manage-settings-btn" round>配置管理</el-button>-->
    <!--    <el-button @click="xxx" class="cf-manage-status-btn" round>状态监控</el-button>-->
    <div class="cf-manage-main-area">
      <component v-if="current_settings!==null" :is="current_component" :config="Config" :current_settings="current_settings"></component>
      <!--      <ManagePanelMain_settings :config="Config"></ManagePanelMain_settings>-->
    </div>
    <!--    <component v-bind:is="current_component" :Config="Config"></component>-->
  </div>
</template>

<script>
import ManagePanelMain_settings from './ManagePanelMain-settings'
import {get_cache_token, init_header} from "../utils/tools";


export default {
  name: "ManagePanelMain",
  data() {
    return {
      // 当前组件名称
      current_component: "ManagePanelMain_settings",
      //
      current_settings: null
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
              this.current_settings=data.current_settings
            } else {
              // 无法获取当前朋友圈配置
            }
          })
          .catch(error => {
            // console.log(error)
          })
      }
    }
  },
  created() {
    this.read_current_settings()
  },
  props: ["Config"],
  components: {
    ManagePanelMain_settings
  }
}
</script>

<style scoped>
/*标题css*/
.cf-manage-title {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 5%;
  left: 15%;
  width: 168px;
  height: 33px;
  overflow-wrap: break-word;
  color: white;
  font-size: 24px;
  font-family: PingFangSC-Regular;
  text-align: center;
  white-space: nowrap;
  line-height: 33px;
  user-select: none;
}

/*退出按钮*/
.cf-manage-exit-btn {
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: 50%;
  height: 33px;
  font-size: 16px;
  top: 5%;
  right: 0;
}

/*项目配置按钮*/
.cf-manage-settings-btn {
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: 50%;
  height: 33px;
  font-size: 16px;
  top: 13%;
  left: 10%;
}

/*状态监控按钮*/
.cf-manage-status-btn {
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: 50%;
  height: 33px;
  font-size: 16px;
  top: 13%;
  left: 25%;
}

/*主区域*/
.cf-manage-main-area {
  max-width: 760px;
  margin-top: 20%;
  margin-left: 2%;
}

</style>
