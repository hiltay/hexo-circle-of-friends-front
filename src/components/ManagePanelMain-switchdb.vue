<template>
    <el-alert
    title="当前使用数据库"
    type="success"
    :description="current_settings.DATABASE"
    show-icon
    center
    :closable="false"
  />
    <el-radio-group v-model="current_db">
    <el-radio label="sqlite">sqlite</el-radio>
    <el-radio label="leancloud">leancloud</el-radio>
    <el-radio label="mysql">mysql</el-radio>
    <el-radio label="mongodb">mongodb</el-radio>
  </el-radio-group>
</template>

<script>
import {get_cache_token, init_header} from "../utils/tools";
import { ElMessage } from 'element-plus'

export default {
  name: "ManagePanelMain_switchdb",
  data() {
    return {
      current_db:null,
    }
  },
  methods: {
    // 刷新当前组件
    refresh(){
      this.$emit("refresh","settings")
    }
  },
  created(){
    this.current_db = this.current_settings.DATABASE
  },
  props: ["Config", "current_settings"]
}
</script>

<style scoped>

.cf-manage-main-add-btn {
  margin-left: 30px;
}


</style>
