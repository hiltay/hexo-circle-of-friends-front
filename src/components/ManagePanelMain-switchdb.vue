<template>
  <el-alert
    title="当前使用数据库"
    type="success"
    :description="current_settings.DATABASE"
    show-icon
    center
    :closable="false"
  />
  <div class="cf-manage-tip">如需切换数据库，请配置对应环境变量，然后点击保存：</div>
  <el-radio-group v-model="current_db">
    <el-radio v-if="this.current_settings.DATABASE !== 'sqlite'" label="sqlite"
      >sqlite</el-radio
    >
    <el-radio
      v-if="this.current_settings.DATABASE !== 'leancloud'"
      label="leancloud"
      >leancloud</el-radio
    >
    <el-radio v-if="this.current_settings.DATABASE !== 'mysql'" label="mysql"
      >mysql</el-radio
    >
    <el-radio
      v-if="this.current_settings.DATABASE !== 'mongodb'"
      label="mongodb"
      >mongodb</el-radio
    >
  </el-radio-group>
  <el-form
    v-if="current_db === 'sqlite'"
    :model="sqlite_env"
    label-width="120px"
  >
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
          <el-button type="primary" @click="submit_form">保存</el-button>
          <el-button type="info" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-form
    v-if="current_db === 'leancloud'"
    :model="leancloud_env"
    label-width="120px"
  >
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
          <el-button type="primary" @click="submit_form">保存</el-button>
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
          <el-button type="primary" @click="submit_form">保存</el-button>
          <el-button type="info" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-form
    v-if="current_db === 'mongodb'"
    :model="mongodb_env"
    label-width="120px"
  >
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
          <el-button type="primary" @click="submit_form">保存</el-button>
          <el-button type="info" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { get_cache_token, init_header } from "../utils/tools";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "ManagePanelMain_switchdb",
  emits: ["refresh"],
  data() {
    return {
      // 当前数据库
      current_db: null,
      // sqlite环境变量
      sqlite_env: {
        GH_NAME: {
          value: "",
          placeholder: "github name",
        },
        GH_EMAIL: {
          value: "",
          placeholder: "github email",
        },
        GH_TOKEN: {
          value: "",
          placeholder: "github access token",
        },
      },
      // leancloud环境变量
      leancloud_env: {
        APPKEY: {
          value: "",
          placeholder: "leancloud的APPKEY",
        },
        APPID: {
          value: "",
          placeholder: "leancloud的APPID",
        },
      },
      // mysql环境变量
      mysql_env: {
        MYSQL_USERNAME: {
          value: "",
          placeholder: "mysql用户名",
        },
        MYSQL_PASSWORD: {
          value: "",
          placeholder: "mysql密码",
        },
        MYSQL_IP: {
          value: "",
          placeholder: "mysql ip地址",
        },
        MYSQL_PORT: {
          value: "",
          placeholder: "mysql端口",
        },
        MYSQL_DB: {
          value: "",
          placeholder: "mysql 数据库名称",
        },
      },
      // mongodb环境变量
      mongodb_env: {
        MONGODB_URI: {
          value: "",
          placeholder: "mongodb连接URI",
        },
      },
    };
  },
  methods: {
    submit_form() {
      // 如果本地有缓存token，尝试直接使用token登录
      let auth_token = get_cache_token();

      let success = true;
      // 确保token存在、选择了数据库
      if (auth_token) {
        // 拼接请求体
        let body = {};
        if (this.current_db === "sqlite") {
          for (let key in this.sqlite_env) {
            if (this.sqlite_env[key].value !== "") {
              body[key] = this.sqlite_env[key].value;
            } else {
              ElMessage({
                message: "请确保环境变量已添加",
                type: "error",
              });
              return;
            }
          }
          body["STORAGE_TYPE"] = "sqlite"
        }
        if (this.current_db === "leancloud") {
          for (let key in this.leancloud_env) {
            if (this.leancloud_env[key].value !== "") {
              body[key] = this.leancloud_env[key].value;
            } else {
              ElMessage({
                message: "请确保环境变量已添加",
                type: "error",
              });
              return;
            }
          }
          body["STORAGE_TYPE"] = "leancloud"
        }
        if (this.current_db === "mysql") {
          for (let key in this.mysql_env) {
            if (this.mysql_env[key].value !== "") {
              body[key] = this.mysql_env[key].value;
            } else {
              ElMessage({
                message: "请确保环境变量已添加",
                type: "error",
              });
              return;
            }
          }
          body["STORAGE_TYPE"] = "mysql"
        }
        if (this.current_db === "mongodb") {
          for (let key in this.mongodb_env) {
            if (this.mongodb_env[key].value !== "") {
              body[key] = this.mongodb_env[key].value;
            } else {
              ElMessage({
                message: "请确保环境变量已添加",
                type: "error",
              });
              return;
            }
          }
          body["STORAGE_TYPE"] = "mongodb"
        }
        // 初始化请求头
        let config = init_header(auth_token);
        // 根据部署方式决定请求url
        if (this.current_settings.DEPLOY_TYPE === "github") {
          // github+vercel部署
          this.$axios
            .put(
              this.Config.private_api_url + "update_github_env",
              body,
              config
            )
            .then((response) => {
              let data = response.data;
              if (data.code !== 200) {
                ElMessage({
                  message: data.message,
                  type: "error",
                });
                success = false;
              }
            })
            .catch((error) => {
              ElMessage({
                message: error.message,
                type: "error",
              });
              success = false;
            });
          this.$axios
            .put(
              this.Config.private_api_url + "update_vercel_env",
              body,
              config
            )
            .then((response) => {
              let data = response.data;
              if (data.code !== 200) {
                ElMessage({
                  message: data.message,
                  type: "error",
                });
                success = false;
              }
            })
            .catch((error) => {
              ElMessage({
                message: error.message,
                type: "error",
              });
              success = false;
            });
        } else {
          // server或docker
          this.$axios
            .put(
              this.Config.private_api_url + "update_server_env",
              body,
              config
            )
            .then((response) => {
              let data = response.data;
              if (data.code !== 200) {
                ElMessage({
                  message: data.message,
                  type: "error",
                });
                success = false;
              }
            })
            .catch((error) => {
              ElMessage({
                message: error.message,
                type: "error",
              });
              success = false;
            });
        }
        // 更新完环境变量后，更新配置，将DATABASE设置为对应的数据库
        body = {
          DATABASE: this.current_db,
        };
        this.$axios
          .put(this.Config.private_api_url + "update_settings", body, config)
          .then((response) => {
            let data = response.data;
            if (data.code === 200) {
              ElMessage({
                message: data.message,
                type: "success",
              });
            } else {
              ElMessage({
                message: data.message,
                type: "error",
              });
            }
            success = false;
          })
          .catch((error) => {
            ElMessage({
              message: error.message,
              type: "error",
            });
            success = false;
          });
        if (success) {
          // 上传成功，提示是否重启api/爬虫
          ElMessageBox.confirm(
            "更新环境变量成功，重启程序后生效，是否立即重启？",
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
        }
      } else {
        ElMessage({
          message: "认证失败，未获取到fcircle token",
          type: "error",
        });
      }
      // 最后刷新本页面
      this.refresh();
    },
    // 刷新当前组件
    refresh() {
      this.$emit("refresh", "switchdb");
    },
  },
  created() {
    this.current_db = this.current_settings.DATABASE;
  },
  props: ["Config", "current_settings"],
};
</script>

<style scoped>
.cf-manage-main-add-btn {
  margin-left: 30px;
}
.cf-manage-tip {
  color: #fff;
}
</style>
