<template>
  <el-alert
    title="当前部署方式"
    type="success"
    :description="current_settings.DEPLOY_TYPE"
    show-icon
    center
    :closable="false"
  />
  <el-divider/>
  <el-form :model="all_env" label-width="120px">
    <el-row v-for="(value,name) in all_env" :key="name">
      <el-col :span="22" :offset="2">
        <el-form-item :label="name">
          <el-input :placeholder="value.placeholder" v-model="value.value"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
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
import {ElMessage, ElMessageBox} from 'element-plus'

export default {
  name: "ManagePanelMain_envs",
  emits:['refresh'],
  data() {
    return {
      // 环境变量配置
      all_env: {
        PROXY: {
          value: "",
          placeholder: "http代理"
        },
        APPKEY: {
          value: "",
          placeholder: "leancloud的APPKEY"
        },
        APPID: {
          value: "",
          placeholder: "leancloud的APPID"
        },
        MYSQL_USERNAME: {
          value: "",
          placeholder: "mysql用户名"
        },
        MYSQL_PASSWORD: {
          value: "",
          placeholder: "mysql密码"
        },
        MYSQL_IP: {
          value: "",
          placeholder: "mysql ip地址"
        },
        MYSQL_PORT: {
          value: "",
          placeholder: "mysql端口"
        },
        MYSQL_DB: {
          value: "",
          placeholder: "mysql 数据库名称"
        },
        GH_NAME: {
          value: "",
          placeholder: "github name"
        },
        GH_EMAIL: {
          value: "",
          placeholder: "github email"
        },
        GH_TOKEN: {
          value: "",
          placeholder: "github access token"
        },
        MONGODB_URI: {
          value: "",
          placeholder: "mongodb连接URI"
        },
      },
    }
  },
  methods: {
    submit_form() {
      // 如果本地有缓存token，尝试直接使用token登录
      let auth_token = get_cache_token()
      // 拼接请求体
      let body = {}
      for (let key in this.all_env) {
        if (this.all_env[key].value !== "") {
          body[key] = this.all_env[key].value
        }
      }
      let success = true
      if (auth_token) {
        let config = init_header(auth_token)
        // 根据部署方式决定请求url
        if (this.current_settings.DEPLOY_TYPE === "github") {
          // github+vercel部署
          this.$axios.put(this.Config.private_api_url + "update_github_env", body, config)
            .then(response => {
              let data = response.data
              if (data.code !== 200) {
                ElMessage({
                  message: data.message,
                  type: 'error',
                })
                success = false
              }
            })
            .catch(error => {
              ElMessage({
                message: error.message,
                type: 'error',
              })
              success = false
            })
          this.$axios.put(this.Config.private_api_url + "update_vercel_env", body, config)
            .then(response => {
              let data = response.data
              if (data.code !== 200) {
                ElMessage({
                  message: data.message,
                  type: 'error',
                })
                success = false
              }
            })
            .catch(error => {
              ElMessage({
                message: error.message,
                type: 'error',
              })
              success = false
            })
        } else {
          // server或docker
          this.$axios.put(this.Config.private_api_url + "update_server_env", body, config)
            .then(response => {
              let data = response.data
              if (data.code !== 200) {
                ElMessage({
                  message: data.message,
                  type: 'error',
                })
                success = false
              }
            })
            .catch(error => {
              ElMessage({
                message: error.message,
                type: 'error',
              })
              success = false
            })
        }
          if (success) {
            // 上传成功，提示是否重启api/爬虫
            ElMessageBox.confirm(
              '更新环境变量成功，重启程序后生效，是否立即重启？',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }
            ).then(() => {
                // 重启api
                this.$axios.get(this.Config.private_api_url + "restart_api", config)
                ElMessage({
                  type: 'success',
                  message: '重启成功',
                })
              })
              .catch(error => {
                ElMessage({
                  type: 'info',
                  message: '已取消',
                })
              })
          }
        }
         else {
        ElMessage({
          message: "认证失败，未获取到fcircle token",
          type: 'error',
        })
      }
    },
    // 刷新当前组件
    refresh() {
      this.$emit("refresh","envs")
    }
  },
  created() {
    if (this.current_settings.DEPLOY_TYPE === "github") {
      this.all_env["STORAGE_TYPE"] = {
        value: "",
        placeholder: "存储方式"
      }
      this.all_env["VERCEL_ACCESS_TOKEN"] = {
        value: "",
        placeholder: "vercel访问令牌"
      }
    } else if (this.current_settings.DEPLOY_TYPE === "server") {
      this.all_env["EXPOSE_PORT"] = {
        value: "",
        placeholder: "api端口，默认：8000"
      }
      this.all_env["RUN_PER_HOURS"] = {
        value: "",
        placeholder: "爬虫运行小时间隔，默认：6"
      }
    }else{
      // docker 部署
      this.all_env["RUN_PER_HOURS"] = {
        value: "",
        placeholder: "爬虫运行小时间隔，默认：6"
      }
    }
    // 获取env
    // 如果本地有缓存token，尝试直接使用token登录
    let auth_token = get_cache_token()
    if (auth_token) {
      let config = init_header(auth_token)
      this.$axios.get(this.Config.private_api_url + "read_envs", config)
        .then(response => {
          let data = response.data
          if (data.code === 200) {
            // 更新env
            for (let key in data.current_envs) {
              if (this.all_env[key] && data.current_envs[key] !== null) {
                this.all_env[key].value = data.current_envs[key]
              }
            }
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
    } else {
      ElMessage({
        message: "认证失败，未获取到fcircle token",
        type: 'error',
      })
    }


  },
  props: ["Config", "current_settings"]
}
</script>

<style scoped>
</style>
