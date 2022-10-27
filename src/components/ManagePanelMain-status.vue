<template>
  <el-alert
    title="程序运行状态："
    type="success"
    :description="status"
    show-icon
    center
    :closable="false"
  />
  <el-button class="cf-manage-center-btn" type="primary" :disabled="status==='运行中'" @click="run_crawler">立即运行爬虫
  </el-button>
  <el-button class="cf-manage-center-btn" type="primary" @click="check_crawler_status">检测运行状态
  </el-button>

</template>

<script>
import {get_cache_token, init_header} from "../utils/tools";
import {ElMessage} from "element-plus";

export default {
  name: "ManagePanelMain_status",
  data() {
    return {
      status: "未知",
      timer: null
    }
  },
  methods: {
    // 运行爬虫程序
    run_crawler() {
      let auth_token = get_cache_token()
      if (auth_token) {
        let config = init_header(auth_token)
        this.$axios.get(this.Config.private_api_url + "run_crawl_now", config)
          .then(response => {
            let data = response.data
            if (data.code === 200) {
              ElMessage({
                message: data.message,
                type: 'success',
              })
              // 状态改为运行中，检查爬虫的运行状态
              this.status = "运行中"
              setTimeout(this.check_crawler_status, 5000)
              this.check_crawler_status()
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
    },
    // 查看爬虫运行状态
    check_crawler_status() {
      let auth_token = get_cache_token()
      if (auth_token) {
        let config = init_header(auth_token)
        this.$axios.get(this.Config.private_api_url + "crawler_status", config)
          .then(response => {
            let data = response.data
            if (data.status !=="运行中" && data.status!=="未运行" && data.status!=="未知"){
              this.status = "未知"
            }else{
              this.status = data.status
            }
          })
          .catch(() => {
            this.status = "未知"
          })
      }
      if (this.timer !== null) {
        clearTimeout(this.timer)
      }
      if (this.status === "运行中") {
        // 在运行中每10s检查一次
        this.timer = setTimeout(this.check_crawler_status, 1000 * 10)
      } else {
        // 在非运行状态每60s检查一次
        this.timer = setTimeout(this.check_crawler_status, 1000 * 60)
      }

    },
  },
  created() {
    this.check_crawler_status()
  },
  unmounted() {
    if (this.timer !== null) {
      clearTimeout(this.timer)
    }
  },
  unmounted() {
    if (this.timer !== null) {
      clearTimeout(this.timer)
    }
  },
  props: ["Config"],
}
</script>

<style scoped>
.cf-manage-center-btn {
  margin-top: 30px;
}
</style>
