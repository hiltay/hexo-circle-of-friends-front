<template>
    <el-alert
      title="当前部署方式"
      type="success"
      :description= "current_settings.DEPLOY_TYPE"
      show-icon
      center
      :closable="false"
    />
  <el-divider />
  <el-form :model="all_env" label-width="120px">
    <el-row v-for="(obj,index) in all_env" :key="index">
      <el-col :span="22" :offset="2">
        <el-form-item class="cf-manage-main-settings-form" :label="obj.name">
            <el-input :placeholder="obj.placeholder" v-model="obj.value"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="7">
        <el-form-item>
          <el-button type="primary" @click="submit_form">保存</el-button>
          <el-button type="info" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>
import {get_cache_token, init_header} from "../utils/tools";
import { ElMessage } from 'element-plus'

export default {
  name: "ManagePanelMain_envs",
  data() {
    return {
      // 环境变量配置
      all_env:[
        {
          name:"PROXY",
          value:"",
          placeholder:"http代理"
        },
        {
          name:"APPKEY",
          value:"",
          placeholder:"leancloud的APPKEY"
        },
        {
          name:"APPID",
          value:"",
          placeholder:"leancloud的APPID"
        },
        {
          name:"MYSQL_USERNAME",
          value:"",
          placeholder:"mysql用户名"
        },
        {
          name:"MYSQL_PASSWORD",
          value:"",
          placeholder:"mysql密码"
        },
        {
          name:"MYSQL_IP",
          value:"",
          placeholder:"mysql ip地址"
        },
        {
          name:"MYSQL_PORT",
          value:"",
          placeholder:"mysql端口"
        },
        {
          name:"MYSQL_DB",
          value:"",
          placeholder:"mysql 数据库名称"
        },
        {
          name:"GH_NAME",
          value:"",
          placeholder:"github name"
        },
        {
          name:"GH_EMAIL",
          value:"",
          placeholder:"github email"
        },
        {
          name:"GH_TOKEN",
          value:"",
          placeholder:"github access token"
        },
        {
          name:"MONGODB_URI",
          value:"",
          placeholder:"mongodb连接URI"
        },
      ],
    }
  },
  methods: {
    submit_form(){
      // 如果本地有缓存token，尝试直接使用token登录
      let auth_token = get_cache_token()
      // 拼接请求体
      let body = {}
      for (let i=0;i<this.all_env.length;i++){
        if (this.all_env[i].value !=="") {
          body[this.all_env[i].name]=this.all_env[i].value
        }
      }
      if (auth_token) {
        let config = init_header(auth_token)
        // 根据部署方式决定请求url
        if (this.current_settings.DEPLOY_TYPE==="github"){
          // github+vercel部署
          this.$axios.put(this.Config.private_api_url + "update_github_env",body, config)
            .then(response => {
              let data = response.data
              if (data.code === 200) {
                ElMessage({
                  message: data.message,
                  type: 'success',
                })
              } else {
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
          this.$axios.put(this.Config.private_api_url + "update_vercel_env",body, config)
            .then(response => {
              let data = response.data
              if (data.code === 200) {
                ElMessage({
                  message: data.message,
                  type: 'success',
                })
              } else {
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
        } else{
          // server或docker
          this.$axios.put(this.Config.private_api_url + "update_server_env",body, config)
            .then(response => {
              let data = response.data
              if (data.code === 200) {
                console.log(data)
                ElMessage({
                  message: data.message,
                  type: 'success',
                })
              } else {
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
      }
    },
    // 刷新当前组件
    refresh(){
      this.$emit("refresh")
    }
  },
  created() {

    if (this.current_settings.DEPLOY_TYPE==="github"){
      this.all_env.push({
        name:"STORAGE_TYPE",
        value:"",
        placeholder:"存储方式"
      },)
      this.all_env.push({
        name:"VERCEL_ACCESS_TOKEN",
        value:"",
        placeholder:"vercel访问令牌"
      },)
    }else if (this.current_settings.DEPLOY_TYPE==="server"){
      this.all_env.push({
        name:"EXPOSE_PORT",
        value:"",
        placeholder:"api端口，默认：8000"
      },)
      this.all_env.push({
        name:"RUN_PER_HOURS",
        value:"",
        placeholder:"爬虫运行小时间隔，默认：6"
      },)
    }


  },
  props: ["Config", "current_settings"]
}
</script>

<style scoped>

.cf-manage-main-add-btn {
  margin-left: 30px;
}


</style>
