<template>
    <el-form-item label="当前自定义友链状态">
      <el-switch v-model="enable" />
    </el-form-item>
  <el-form label-width="120px">
    <div v-if="enable">
      <el-col :span="24">
          <el-form-item label="json友链地址" label-width="auto">
            <el-input placeholder="可以是网络地址，也可以是路径（私有部署），示例：https://blogroll.ccknbc.cc/fcircle.json 或 /home/data/fcircle/friends.json" v-model="json_api"/>
          </el-form-item>
      </el-col>
      <el-row>
      <el-form-item label="点击添加一条友链" label-width="auto">
      </el-form-item>
        <el-col :span="2">
          <el-button circle @click="add_link">
            <el-icon>
              <Plus/>
            </el-icon>
          </el-button>
        </el-col>
      </el-row>
      <el-row v-for="(value,index) in list" :key="index">
        <el-col :span="6">
          <el-form-item label="名称" label-width="50px">
            <el-input v-model="value[0]"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主页" label-width="50px">
            <el-input v-model="value[1]"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="头像" label-width="50px">
            <el-input v-model="value[2]"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="后缀" label-width="50px">
            <el-input v-model="value[3]"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-button circle @click="del_link(index)">
            <el-icon>
              <Minus/>
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

<script>
import {get_cache_token, init_header} from "../utils/tools";
import { ElMessage } from 'element-plus'

export default {
  name: "ManagePanelMain_links",
  emits:['refresh'],
  data() {
    return {
      // 当前是否开启自定义友链
      enable:this.current_settings.SETTINGS_FRIENDS_LINKS.enable,
      list:[
      ],
      json_api:""
    }
  },
  methods: {
    // 添加一条配置项友链
    add_link() {
      this.list.push([
        "","",""
      ]);
    },
    // 删除一条配置项友链
    del_link(index) {
      this.list.splice(index, 1);
    },
    // 提交表单
    submit_form(){
      // 如果本地有缓存token，尝试直接使用token登录
      let auth_token = get_cache_token()
      // 拼接body
      let body = {}
      body["enable"] = this.enable
      body["json_api"] = this.json_api
      let list_ = []
      // 过滤掉全部为空的项
      for(let i=0;i<this.list.length;i++){
        if(this.list[i][0]===this.list[i][1]===this.list[i][2]===""){
          continue
        }else{
          list_.push(this.list[i])
        }
      }
      body["list"] = list_
      // 封装请求体
      let request_body = {"SETTINGS_FRIENDS_LINKS":body}
      if (auth_token) {
        let config = init_header(auth_token)
        this.$axios.put(this.Config.private_api_url + "update_settings",request_body, config)
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
      this.$emit("refresh","links")
    }
  },
  created(){
    for(let i=0;i<this.current_settings.SETTINGS_FRIENDS_LINKS.list.length;i++){
      // 读取远程配置，添加现有的配置项友链
      let item = this.current_settings.SETTINGS_FRIENDS_LINKS.list[i]
      if (item.length===3){
        // 未携带suffix
        this.list.push([item[0],item[1],item[2]])
      }else if (item.length===4){
        // 携带suffix
        this.list.push([item[0],item[1],item[2],item[3]])
      }
    }
    this.json_api = this.current_settings.SETTINGS_FRIENDS_LINKS.json_api
  },
  props: ["Config", "current_settings"]
}
</script>

<style scoped>

</style>
