<template>
  <div>
    <div id="cf-manage-overlay" @click="close_manage_panel" @close_manage_panel="close_manage_panel"></div>
      <div class="cf-manage-pannel flex-col">
        <el-scrollbar height="100%">
        <svg class="cf-manage-close-btn" @click="close_manage_panel" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
          <path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
        </svg>
        <ManagePanelLogin v-if="show_login_page" :Config="Config" @login_success="login_success" ></ManagePanelLogin>
        <ManagePanelMain v-else :Config="Config" @logout="logout"></ManagePanelMain>
        </el-scrollbar>
      </div>

    </div>
</template>

<script>
import ManagePanelLogin from './ManagePanelLogin.vue'
import ManagePanelMain from './ManagePanelMain.vue'

export default {
  name: "ManagePanel",
  data(){
    return {
      // 展示登录页面
      show_login_page:true,
      // 当前组件名称
      current_component: "",

    }
  },
  methods:{
    // 关闭管理面板
    close_manage_panel(){
      this.$emit("close_manage_panel")
    },
    // 登录成功
    login_success(){
      // 登录成功，不显示登录页面
      this.show_login_page = false
    },
    // 退出登录
    logout(){
      // 展示登录页面
      this.show_login_page = true
      // 内部组件不展示
      this.current_component=""
    }
  },
  props:["Config"],
  components: {
    ManagePanelLogin,
    ManagePanelMain
  }
}
</script>

<style scoped>
/*管理面板蒙版开始*/
#cf-manage-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(255, 255, 255, 0.42);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  pointer-events: all;
  transition: all 0.1s ease;
  z-index: 998;
}
/*管理面板蒙版结束*/
/*管理面板样式开始*/
.cf-manage-pannel {
  text-align: center;
  background-color: rgb(182, 178, 180);
  position: fixed;
  border-radius: 10px;
  width: 800px;
  height: 800px;
  /*overflow: scroll;*/
  z-index: 999;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}

/*管理面板关闭按钮开始*/
.cf-manage-close-btn {
  position: absolute;
  max-width: 30px;
  color: white;
  cursor: pointer;
  right: 0;
  top: 0;
}
/*管理面板关闭按钮结束*/

/*管理面板滚动条样式开始*/
.el-scrollbar {
  --el-scrollbar-opacity: 1;
  --el-scrollbar-bg-color: white;
  --el-scrollbar-hover-opacity: 1;
  --el-scrollbar-hover-bg-color: var(--yyyz-scrollbar-hover-bg-color);
}
/*管理面板滚动条样式结束*/

/*管理面板样式结束*/
</style>
