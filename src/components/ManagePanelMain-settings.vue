<template>
  <el-form :model="form" label-width="120px">
    <el-row v-for="(item, index) in form.LINK" :key="index">
      <el-col :span="14">
        <el-form-item label="link">
          <el-tooltip content="爬取起始页面，填写你的友链页地址" placement="left" :hide-after="50" effect="light">
            <el-input v-model="form.LINK[index].link" placeholder="示例：https://example.com/link/"/>
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="theme">
          <el-tooltip content="爬取起始页面的主题" placement="left" :hide-after="50" effect="light">
            <el-select v-model="form.LINK[index].theme" placeholder="Select">
              <el-option-group
                v-for="group in theme_options"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :value="item.value"
                />
              </el-option-group>
            </el-select>
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button v-if="index===0" circle class="cf-manage-main-add-btn" @click="add_link">
          <el-icon>
            <Plus/>
          </el-icon>
        </el-button>
        <el-button v-if="index!==0" circle class="cf-manage-main-add-btn" @click="del_link(index)">
          <el-icon>
            <Minus/>
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
    <el-row v-for="(item, index) in form.BLOCK_SITE" :key="index">
      <el-col :span="22">
        <el-form-item class="cf-manage-main-settings-form" label="BLOCK_SITE">
          <el-tooltip content="屏蔽站点，支持正则表达式" placement="left" effect="light">
            <el-input placeholder="非必填，示例：https://example.com/" v-model="form.BLOCK_SITE[index]"/>
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button v-if="index===0" circle class="cf-manage-main-add-btn" @click="add_blocksite">
          <el-icon>
            <Plus/>
          </el-icon>
        </el-button>
        <el-button v-if="index!==0" circle class="cf-manage-main-add-btn" @click="del_blocksite(index)">
          <el-icon>
            <Minus/>
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="23" :offset="1">
        <el-form-item class="cf-manage-main-settings-form" label="OUTDATE_CLEAN">
          <el-tooltip content="数据库文章过期清除时间" placement="left" effect="light">
            <el-input placeholder="示例：60" v-model="form.OUTDATE_CLEAN"/>
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item class="cf-manage-main-settings-form" label="HTTP_PROXY">
          <el-tooltip content="HTTP代理" placement="left" effect="light">
            <el-input placeholder="[IP]:[端口]，示例：192.168.3.204:18080" v-model="http_proxy"/>
          </el-tooltip>
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
  name: "ManagePanelMain_settings",
  data() {
    return {
      // link字段主题选项
      theme_options: [
        {
          label: '普通主题',
          options: [
            {
              value: 'butterfly',
            },
            {
              value: 'fluid',
            },
            {
              value: 'matery',
            },
            {
              value: 'nexmoe',
            },
            {
              value: 'stun',
            },
            {
              value: 'Yun',
            },
            {
              value: 'sakura',
            },
            {
              value: 'volantis',
            },
            {
              value: 'stellar',
            },
          ],
        },
        {
          label: '通用主题',
          options: [
            {
              value: 'common1',
            },
            {
              value: 'common2',
            },
          ],
        },
      ],
      // todo 暂存http代理配置 http代理更改env环境
      http_proxy:"",
      form: {
        LINK: this.current_settings.LINK,
        BLOCK_SITE: this.current_settings.BLOCK_SITE === [] ? this.current_settings.BLOCK_SITE : [""],
        OUTDATE_CLEAN: this.current_settings.OUTDATE_CLEAN,
      }
    }
  },
  methods: {
    // 添加一条LINK项
    add_link() {
      this.form.LINK.push({
        link: "",
        theme: ""
      });
    },
    // 删除一条LINK项
    del_link(index) {
      this.form.LINK.splice(index, 1);
    },
    // 添加一条BLOCK_SITE项
    add_blocksite() {
      this.form.BLOCK_SITE.push("")
    },
    // 删除一条BLOCK_SITE项
    del_blocksite(index) {
      this.form.BLOCK_SITE.splice(index, 1);
    },
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
            ElMessage({
              message: error.message,
              type: 'error',
            })
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
