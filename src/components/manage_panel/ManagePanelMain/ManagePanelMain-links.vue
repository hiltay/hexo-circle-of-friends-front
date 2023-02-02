<template>
  <el-form-item label="当前自定义友链状态">
    <el-switch v-model="enable" />
  </el-form-item>
  <el-form label-width="120px">
    <div v-if="enable">
      <el-col :span="24">
        <el-form-item label="json友链地址" label-width="auto">
          <el-input
            placeholder="可以是网络地址，也可以是路径（私有部署），示例：https://blogroll.ccknbc.cc/fcircle.json 或 /home/data/fcircle/friends.json"
            v-model="json_api" />
        </el-form-item>
      </el-col>
      <el-row>
        <el-form-item label="点击添加一条友链" label-width="auto">
        </el-form-item>
        <el-col :span="2">
          <el-button circle @click="add_link">
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>
      <el-row v-for="(value, index) in list" :key="index">
        <el-col :span="6">
          <el-form-item label="名称" label-width="50px">
            <el-input v-model="value[0]" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主页" label-width="50px">
            <el-input v-model="value[1]" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="头像" label-width="50px">
            <el-input v-model="value[2]" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="后缀" label-width="50px">
            <el-input v-model="value[3]" />
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button circle @click="del_link(index)">
            <el-icon>
              <Minus />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>
    </div>
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
import useLinksStore from "@/stores/manage/links"
import useManageHomeStore from "@/stores/manage/home"
const LinksStore = useLinksStore();
const ManageHomeStore = useManageHomeStore();
let { enable, list, json_api } = storeToRefs(LinksStore);
let { current_settings } = storeToRefs(ManageHomeStore)

// 添加一条配置项友链
function add_link() {
  LinksStore.add_link()
}
// 删除一条配置项友链
function del_link(index:number) {
  LinksStore.del_link(index)
}
// 提交表单
function submit_form() {
  LinksStore.submit_form()
  refresh()
}
// 刷新当前组件
function refresh() {
  ManageHomeStore.refresh_component("links")
}
LinksStore.init_value()

</script>

<style scoped>

</style>
