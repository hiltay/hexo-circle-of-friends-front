<template>
    <el-alert title="当前使用数据库" type="success" :description="current_settings.DATABASE" show-icon center
      :closable="false" />
    <div class="cf-manage-tip">如需切换数据库，请配置对应环境变量，然后点击保存：</div>
    <el-radio-group v-model="current_db">
      <el-radio label="sqlite">sqlite</el-radio>
      <el-radio label="leancloud">leancloud</el-radio>
      <el-radio label="mysql">mysql</el-radio>
      <el-radio label="mongodb">mongodb</el-radio>
    </el-radio-group>
    <el-form v-if="current_db === 'sqlite' && current_settings.DEPLOY_TYPE==='github'" :model="sqlite_env" label-width="120px">
      <el-row v-for="(value, name) in sqlite_env" :key="name">
        <el-col :span="22" :offset="2">
          <el-form-item :label="name">
            <el-input :placeholder="value.placeholder" v-model="value.value" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="submit_form(current_db)">保存</el-button>
            <el-button type="primary" @click="reset_db">重置当前数据库</el-button>
            <el-button type="info" @click="refresh">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="current_db === 'sqlite' && current_settings.DEPLOY_TYPE!=='github'" :model="sqlite_env" label-width="120px">
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="submit_form(current_db)">保存</el-button>
            <el-button type="primary" @click="reset_db">重置当前数据库</el-button>
            <el-button type="info" @click="refresh">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="current_db === 'leancloud'" :model="leancloud_env" label-width="120px">
      <el-row v-for="(value, name) in leancloud_env" :key="name">
        <el-col :span="22" :offset="2">
          <el-form-item :label="name">
            <el-input :placeholder="value.placeholder" v-model="value.value" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="submit_form(current_db)">保存</el-button>
            <el-button type="primary" @click="reset_db">重置当前数据库</el-button>
            <el-button type="info" @click="refresh">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="current_db === 'mysql'" :model="mysql_env" label-width="120px">
      <el-row v-for="(value, name) in mysql_env" :key="name">
        <el-col :span="22" :offset="2">
          <el-form-item :label="name">
            <el-input :placeholder="value.placeholder" v-model="value.value" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="submit_form(current_db)">保存</el-button>
            <el-button type="primary" @click="reset_db">重置当前数据库</el-button>
            <el-button type="info" @click="refresh">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="current_db === 'mongodb'" :model="mongodb_env" label-width="120px">
      <el-row v-for="(value, name) in mongodb_env" :key="name">
        <el-col :span="22" :offset="2">
          <el-form-item :label="name">
            <el-input :placeholder="value.placeholder" v-model="value.value" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="submit_form(current_db)">保存</el-button>
            <el-button type="primary" @click="reset_db">重置当前数据库</el-button>
            <el-button type="info" @click="refresh">刷新</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useSwitchDBStore from "@/stores/manage/switchdb"
import useManageHomeStore from "@/stores/manage/home"
const SwitchDBStore = useSwitchDBStore();
const ManageHomeStore = useManageHomeStore();
let { current_db, sqlite_env, mongodb_env, mysql_env, leancloud_env } = storeToRefs(SwitchDBStore);
let { current_settings } = storeToRefs(ManageHomeStore)

function submit_form(current_db:string) {
  // 如果本地有缓存token，尝试直接使用token登录
  SwitchDBStore.submit_form(current_db)
  // 刷新当前组件
  ManageHomeStore.refresh_component("switchdb")
}
function reset_db() {
  SwitchDBStore.reset_db()
}
// 刷新当前组件
function refresh() {
  ManageHomeStore.refresh_component("switchdb")
}

SwitchDBStore.init_value()

</script>

<style scoped>
.cf-manage-main-add-btn {
  margin-left: 30px;
}

.cf-manage-tip {
  color: #fff;
}
</style>
