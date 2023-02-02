<template>
  <el-alert title="当前部署方式" type="success" :description="current_settings.DEPLOY_TYPE" show-icon center
    :closable="false" />
  <el-divider />
  <el-form :model="all_env" label-width="120px">
    <el-row v-for="(value, name) in all_env" :key="name">
      <el-col :span="22" :offset="2">
        <el-form-item :label="name">
          <el-input :placeholder="value.placeholder" v-model="value.value" />
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

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useEnvsStore from "@/stores/manage/envs"
import useManageHomeStore from "@/stores/manage/home"
const EnvsStore = useEnvsStore();
const ManageHomeStore = useManageHomeStore();
let { all_env } = storeToRefs(EnvsStore);
let { current_settings } = storeToRefs(ManageHomeStore)
// 刷新当前组件
function refresh() {
  ManageHomeStore.refresh_component("envs")
}
function submit_form() {
  EnvsStore.submit_form()
  refresh()
}

EnvsStore.init_value()
</script>

<style scoped>

</style>
