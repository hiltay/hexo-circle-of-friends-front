<template>
  <el-alert title="程序运行状态：" type="success" :description="status" show-icon center :closable="false" />
  <el-button class="cf-manage-center-btn" type="primary" :disabled="status === '运行中'" @click="run_crawler">立即运行爬虫
  </el-button>
  <el-button class="cf-manage-center-btn" type="primary" @click="check_crawler_status">检测运行状态
  </el-button>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onUnmounted } from 'vue'
import useStatusStore from "@/stores/manage/status"
const StatusStore = useStatusStore();
let { status } = storeToRefs(StatusStore);
// 运行爬虫程序
function run_crawler() {
  StatusStore.run_crawler()
}
// 查看爬虫运行状态
function check_crawler_status() {
  StatusStore.check_crawler_status()
}

StatusStore.check_crawler_status()

onUnmounted(() => {
  StatusStore.clear_timer()
})


</script>

<style scoped>
.cf-manage-center-btn {
  margin-top: 30px;
}
</style>
