<template>
  <div>
    <div id="cf-manage-overlay"></div>
    <el-container class="cf-manage-pannel">
      <div class="cf-pannel-area" >
        <svg class="cf-manage-close-btn" @click="close_manage_panel" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
          <path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
        </svg>
        <ManagePanelLogin v-if="show_login_page" :Config="Config" @login_success="login_success" ></ManagePanelLogin>
        <ManagePanelMain v-else :Config="Config" @logout="logout"></ManagePanelMain>
      </div>
    </el-container>

    </div>
</template>

<script>
import ManagePanelLogin from './ManagePanelLogin.vue'
import ManagePanelMain from './ManagePanelMain.vue'

export default {
  name: "ManagePanel",
  // 声明需要使用的事件
  emits: ['close_manage_panel'],
  data(){
    return {
      // 展示登录页面
      show_login_page:true,
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
/* 移动端适配 */
@media screen and (max-width: 1200px) {
  .el-container.cf-manage-pannel {
    width: 90%;
    padding: 45px 0 0;
  }
}

/*管理面板蒙版开始*/
#cf-manage-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
  background-color: rgb(140, 135, 136);
  position: fixed;
  border-radius: 10px;
  width: 50%;
  height: 70%;
  /*overflow: scroll;*/
  z-index: 999;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  padding: 45px;
}

/*管理面板关闭按钮开始*/
.cf-manage-close-btn {
  position: absolute;
  max-width: 30px;
  color: white;
  cursor: pointer;
  right: 2%;
  top: 5px;
}

.cf-manage-close-btn:hover {
  color: rgb(73,177,245);
}
/*管理面板关闭按钮结束*/
.cf-pannel-area{
  width: 100% ;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
/*管理面板滚动条样式开始*/
::-webkit-scrollbar-thumb {
  background-color: rgba(52, 218, 177, 0.85);
  background-image: -webkit-linear-gradient(45deg, hsla(0, 7%, 86%, 0.4) 25%, transparent 0, transparent 50%, hsla(0, 8%, 64%, 0.4) 0, hsla(103, 96%, 44%, 0.4) 75%, transparent 0, transparent) !important;
  border-radius: 2em !important

}

::-webkit-scrollbar {
  width: 8px;
  height: 8px
}

::-webkit-scrollbar-track {
  background-color: rgb(182, 178, 180);

  border-radius: 2em
}

::-webkit-scrollbar-corner {
  background-color: transparent
}

/*管理面板滚动条样式结束*/

/*管理面板样式结束*/
</style>
