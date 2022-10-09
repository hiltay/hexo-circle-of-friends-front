<template>
  <el-form :model="form" label-width="120px">
    <div v-for="(item, index) in form.LINK" :key="index" class="settings-item">
      <div class="item-col">
        <el-form-item label="link">
          <el-tooltip
            content="爬取起始页面，填写你的友链页地址"
            placement="left"
            :hide-after="50"
            effect="light"
          >
            <el-input
              v-model="form.LINK[index].link"
              placeholder="示例：https://example.com/link/"
            />
          </el-tooltip>
        </el-form-item>
      </div>
      <div class="item-col">
        <el-form-item label="theme">
          <el-tooltip
            content="爬取起始页面的主题"
            placement="left"
            :hide-after="50"
            effect="light"
          >
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
        <el-button
          v-if="index === 0"
          circle
          class="cf-manage-main-add-btn"
          @click="add_link"
        >
          <el-icon>
            <Plus/>
          </el-icon>
        </el-button>
        <el-button
          v-if="index !== 0"
          circle
          class="cf-manage-main-add-btn"
          @click="del_link(index)"
        >
          <el-icon>
            <Minus/>
          </el-icon>
        </el-button>
      </div>
    </div>
    <el-row v-for="(item, index) in form.BLOCK_SITE" :key="index">
      <el-col :span="22" :xs="15" :sm="17" :md="17" :lg="12" :xl="12">
        <el-form-item label="BLOCK_SITE">
          <el-tooltip
            content="屏蔽站点，支持正则表达式"
            placement="left"
            effect="light"
          >
            <el-input
              placeholder="非必填，示例：https://example.com/"
              v-model="form.BLOCK_SITE[index]"
            />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button
          v-if="index === 0"
          circle
          class="cf-manage-main-add-btn"
          @click="add_blocksite"
        >
          <el-icon>
            <Plus/>
          </el-icon>
        </el-button>
        <el-button
          v-if="index !== 0"
          circle
          class="cf-manage-main-add-btn"
          @click="del_blocksite(index)"
        >
          <el-icon>
            <Minus/>
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="OUTDATE_CLEAN" label-width="auto">
          <el-tooltip
            content="数据库文章过期清除时间"
            placement="left"
            effect="light"
          >
            <el-input placeholder="示例：60" v-model="form.OUTDATE_CLEAN"/>
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="HTTP_PROXY">
          <el-tooltip
            content="是否开启http代理，如需开启，打开此选项同时还要在环境变量配置一个代理地址"
            placement="left"
            effect="light"
          >
            <el-switch v-model="form.HTTP_PROXY"/>
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

<script>
import {get_cache_token, init_header} from "../utils/tools";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "ManagePanelMain_settings",
  emits: ["refresh"],
  data() {
    return {
      // link字段主题选项
      theme_options: [
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
      ],
      // todo 暂存http代理配置 http代理更改env环境
      form: {
        LINK: this.current_settings.LINK,
        BLOCK_SITE:
          this.current_settings.BLOCK_SITE === []
            ? this.current_settings.BLOCK_SITE
            : [""],
        OUTDATE_CLEAN: this.current_settings.OUTDATE_CLEAN,
        HTTP_PROXY: this.current_settings.HTTP_PROXY,
      },
    };
  },
  methods: {
    // 添加一条LINK项
    add_link() {
      this.form.LINK.push({
        link: "",
        theme: "",
      });
    },
    // 删除一条LINK项
    del_link(index) {
      this.form.LINK.splice(index, 1);
    },
    // 添加一条BLOCK_SITE项
    add_blocksite() {
      this.form.BLOCK_SITE.push("");
    },
    // 删除一条BLOCK_SITE项
    del_blocksite(index) {
      this.form.BLOCK_SITE.splice(index, 1);
    },
    submit_form() {
      // 如果本地有缓存token，尝试直接使用token登录
      let auth_token = get_cache_token();
      // 过滤block_site
      let block_site = []
      for (let i=0;i<this.form.BLOCK_SITE.length;i++){
        if (this.form.BLOCK_SITE[i]!==""){
          block_site.push(this.form.BLOCK_SITE[i])
        }
      }
      this.form.BLOCK_SITE = block_site
      let body = this.form;
      if (auth_token) {
        let config = init_header(auth_token);
        this.$axios
          .put(this.Config.private_api_url + "update_settings", body, config)
          .then((response) => {
            let data = response.data;
            if (data.code === 200) {
              ElMessage({
                message: data.message,
                type: "success",
              });
              // 上传成功，提示是否重启api/爬虫
              ElMessageBox.confirm(
                "更新成功，下次运行爬虫生效，是否立即运行？",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  // 重启api
                  this.$axios.get(
                    this.Config.private_api_url + "restart_api",
                    config
                  );
                  ElMessage({
                    type: "success",
                    message: "重启成功",
                  });
                })
                .catch((error) => {
                  ElMessage({
                    type: "info",
                    message: "已取消",
                  });
                });
              // 刷新当前组件
              this.refresh();
            } else {
              ElMessage({
                message: data.message,
                type: "error",
              });
            }
          })
          .catch((error) => {
            ElMessage({
              message: error.message,
              type: "error",
            });
          });
      }
    },
    // 刷新当前组件
    refresh() {
      this.$emit("refresh", "settings");
    },
  },
  props: ["Config", "current_settings"],
};
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
