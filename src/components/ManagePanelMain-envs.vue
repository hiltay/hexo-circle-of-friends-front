<template>
  <el-form :model="form" label-width="120px">
    <el-row v-for="(obj,index) in all_env" :key="index">
      <el-col :span="24">
        <el-form-item class="cf-manage-main-settings-form" :label="obj.name">
            <el-input :placeholder="obj.placeholder" v-model="obj.value"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="7">
        <el-form-item>
          <el-button type="primary" @click="submit_form">保存</el-button>
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
      let auth_token = get_cache_token()
      // 如果本地有缓存token，尝试直接使用token登录
      let body = this.form
      if (auth_token) {
        let config = init_header(auth_token)
        this.$axios.put(this.Config.private_api_url + "update_settings",body, config)
          .then(response => {
            let data = response.data
            if (data.code === 200) {
              ElMessage({
                message: data.message,
                type: 'success',
              })
              this.refresh()
            } else {
              ElMessage({
                message: data.message,
                type: 'error',
              })
            }
          })
          .catch(error => {
            // console.log(error)
          })
      }
    },
    // 刷新当前组件
    refresh(){
      this.$emit("refresh")
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
