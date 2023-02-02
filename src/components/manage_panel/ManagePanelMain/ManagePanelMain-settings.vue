<template>
  <el-form :model="form" label-width="120px">
    <div v-for="(item, index) in form.LINK" :key="index" class="settings-item">
      <div class="item-col">
        <el-form-item label="link">
          <el-tooltip content="爬取起始页面，填写你的友链页地址" placement="left" :hide-after="50" effect="light">
            <el-input v-model="form.LINK[index].link" placeholder="示例：https://example.com/link/" />
          </el-tooltip>
        </el-form-item>
      </div>
      <div class="item-col">
        <el-form-item label="theme">
          <el-tooltip content="爬取起始页面的主题" placement="left" :hide-after="50" effect="light">
            <el-select v-model="form.LINK[index].theme" placeholder="Select">
              <el-option-group v-for="group in theme_options" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :value="item.value" />
              </el-option-group>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-button v-if="index === 0" circle class="cf-manage-main-add-btn" @click="add_link">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
        <el-button v-if="index !== 0" circle class="cf-manage-main-add-btn" @click="del_link(index)">
          <el-icon>
            <Minus />
          </el-icon>
        </el-button>
      </div>
    </div>
    <el-row v-for="(item, index) in form.BLOCK_SITE" :key="index">
      <el-col :span="22" :xs="15" :sm="17" :md="17" :lg="12" :xl="12">
        <el-form-item label="BLOCK_SITE">
          <el-tooltip content="屏蔽站点，支持正则表达式" placement="left" effect="light">
            <el-input placeholder="非必填，示例：https://example.com/" v-model="form.BLOCK_SITE[index]" />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button v-if="index === 0" circle class="cf-manage-main-add-btn" @click="add_blocksite">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
        <el-button v-if="index !== 0" circle class="cf-manage-main-add-btn" @click="del_blocksite(index)">
          <el-icon>
            <Minus />
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="OUTDATE_CLEAN" label-width="auto">
          <el-tooltip content="数据库文章过期清除时间" placement="left" effect="light">
            <el-input placeholder="示例：60" v-model="form.OUTDATE_CLEAN" />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="HTTP_PROXY">
          <el-tooltip content="是否开启http代理，如需开启，打开此选项同时还要在环境变量配置一个代理地址" placement="left" effect="light">
            <el-switch v-model="form.HTTP_PROXY" />
          </el-tooltip>
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
import useSettingsStore from "@/stores/manage/settings"
import useManageHomeStore from "@/stores/manage/home"
const SettingsStore = useSettingsStore();
const ManageHomeStore = useManageHomeStore();
let { form } = storeToRefs(SettingsStore);

// link字段主题选项
const theme_options = [
  {
    label: "普通主题",
    options: [
      {
        value: "butterfly",
      },
      {
        value: "fluid",
      },
      {
        value: "matery",
      },
      {
        value: "nexmoe",
      },
      {
        value: "stun",
      },
      {
        value: "Yun",
      },
      {
        value: "sakura",
      },
      {
        value: "volantis",
      },
      {
        value: "stellar",
      },
    ],
  },
  {
    label: "通用主题",
    options: [
      {
        value: "common1",
      },
      {
        value: "common2",
      },
    ],
  },
]
function add_link() {
  SettingsStore.add_link()
}
function del_link(index: number) {
  SettingsStore.del_link(index)
}
function add_blocksite() {
  SettingsStore.add_blocksite()
}

function del_blocksite(index: number) {
  SettingsStore.del_blocksite(index)
}
// 刷新当前组件
function refresh() {
  ManageHomeStore.refresh_component("settings")
}

function submit_form(){
  // 提交表单
  SettingsStore.submit_form()
  // 刷新当前组件
  refresh()
}

SettingsStore.init_value()

</script>

<style scoped>
@media screen and (max-width: 1200px) {
  .settings-item {
    flex-direction: column;
  }
}

.settings-item {
  display: flex;
}

.settings-item .item-col {
  display: flex;
}

.cf-manage-main-add-btn {
  margin-left: 30px;
}
</style>
