<template>
  <div>
    <span class="cf-manage-title">友链朋友圈管理面板</span>
    <el-input class="cf-manage-input" size="large" v-model="password" type="password" clearable show-password placeholder="请输入密码" />
    <el-button @click="login" class="cf-manage-login-btn" round>立即登录</el-button>

  </div>
</template>

<script>

import {init_header,get_cache_token} from "../utils/tools";

export default {
  name: "ManagePanelLogin",
  data(){
    return {
      // 登录框密码
      password:''
    }
  },
  methods:{
    // 登录
    login(){
      let body = {
        "password":this.password
      }
      // 本地没有token，使用密码登录
      this.$axios.post(this.Config.private_api_url+"login",body)
        .then(response=>{
          let data = response.data
          if (data.code===200){
            // 更新本地缓存
            localStorage.setItem("fcircle-token",data.token)
            this.$emit("login_success")
          }else {
            this.$message.error({
              title: '错误',
              message: '用户名或密码错误',
            });
          }
        })
        .catch(error=>{
          // console.log(error)
          // 提示信息
        })
    },
  },
  created() {
    let auth_token = get_cache_token()
    // 如果本地有缓存token，尝试直接使用token登录
    if (auth_token){
      let config= init_header(auth_token)
      this.$axios.get(this.Config.private_api_url+"login_with_token",config)
        .then(response=>{
          let data = response.data
          if (data.code===200){
            this.$emit("login_success")
          }else{

          }
        })
        .catch(error=>{
          // console.log(error)
        })
    }
  },
  props:['Config'],
}
</script>

<style scoped>
.cf-manage-title{
  position: absolute;
  transform: translate(-50%, -50%);
  top: 35%;
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
.cf-manage-input{
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: 50%;
  top: 45%;
}
.cf-manage-login-btn{
  position: absolute;
  transform: translate(-50%, -50%);
  max-width: 50%;
  top: 60%;
}
</style>
