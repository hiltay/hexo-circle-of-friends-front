<template>
  <div>
    <span class="cf-manage-title">友链朋友圈管理面板</span>
    <el-button @click="logout" class="cf-manage-exit-btn" round>退出登录</el-button>
    <el-tabs
      v-model="current_tab"
      type="card"
      class="cf-manage-tabs-area"
      @tab-click="handleClick"
    >
      <el-tab-pane label="配置管理" name="first">
        <ManagePanelMain_settings v-if="current_settings!==null" :Config="Config" :current_settings="current_settings" :key="component_keys.settings" @refresh="refresh_component"></ManagePanelMain_settings>
      </el-tab-pane>
      <el-tab-pane label="环境变量管理" name="second">
        <ManagePanelMain_envs v-if="current_settings!==null" :Config="Config" :current_settings="current_settings" :key="component_keys.envs" @refresh="refresh_component"></ManagePanelMain_envs>
      </el-tab-pane>
      <el-tab-pane label="自定义友链管理" name="third">
<!--        todo 自定义友链管理-->
<!--        todo 关于-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ManagePanelMain_settings from './ManagePanelMain-settings'
import ManagePanelMain_envs from './ManagePanelMain-envs'
import {get_cache_token, init_header} from "../utils/tools";
import {ElMessage} from "element-plus";


export default {
  name: "ManagePanelMain",
  data() {
    return {
      // 当前选项卡
      current_tab: "first",
      // 当前配置
      current_settings: null,
      // 每个组件的唯一key，用于内部组件刷新
      component_keys:{
        settings:0,
        envs:0
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
    refresh_component(value){
      // 重新获取当前配置
      this.read_current_settings()
      // 变更key值，刷新内部组件
      this.component_keys[value] +=1
    },
    handleClick(tab, event ){
      console.log(tab, event);
    }
  },
  created() {
    this.read_current_settings()
  },
  props: ["Config"],
  components: {
    ManagePanelMain_settings,
    ManagePanelMain_envs
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

/*选项卡区域*/
.cf-manage-tabs-area{
  position: relative;
  margin: 10% 5% 0 5%;
}


</style>
