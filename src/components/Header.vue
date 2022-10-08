<template>
  <div>
    <div id="cf-state" class="cf-new-add">
      <el-button id="panel-btn" circle @click="open_manage_panel"><el-icon><Setting /></el-icon></el-button>
      <div class="cf-state-data">
        <el-tooltip content="点击获取一篇随机文章" placement="bottom" effect="light">
          <div class="cf-data-friends" @click="open_article_card">
            <span class="cf-label">订阅</span>
            <span class="cf-message">{{ all_data.statistical_data.friends_num }}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="点击切换公共库/私有库" placement="top" effect="light">
          <div class="cf-data-active" @click="toggle_api_url">
            <span class="cf-label">活跃</span>
            <span class="cf-message">{{ all_data.statistical_data.active_num }}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="点击清空缓存" placement="bottom" effect="light">
          <div class="cf-data-article" @click="clear_session_storage">
            <span class="cf-label">日志</span>
            <span class="cf-message">{{ all_data.statistical_data.article_num }}</span>
          </div>
        </el-tooltip>
      </div>
      <div id="cf-change">
        <span :class='Config.sort_rule==="created"?"cf-change-now":""' @click="change_sort_rule">Created</span> |
        <span :class='Config.sort_rule==="updated"?"cf-change-now":""' @click="change_sort_rule">Updated</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  emits:['watch_sort_rule','show_article_card','toggle_api_url','open_manage_panel'],
  methods: {
    // 切换排序规则
    change_sort_rule() {
      let rule = this.Config.sort_rule === 'created' ? 'updated' : 'created';
      this.$emit('watch_sort_rule', rule);
    },
    // 随机文章卡片
    open_article_card() {
      this.$emit('show_article_card', '');
    },
    // 切换私有库/公共库
    toggle_api_url(){
      this.$emit('toggle_api_url')
    },
    // 清除sessionstorage缓存
    clear_session_storage(){
      sessionStorage.clear()
      location.reload();
    },
    // 打开管理面板
    open_manage_panel(){
      this.$emit('open_manage_panel')
    }
  },
  props:{
    all_data:{
      type:Object,
      default:()=>{
        return{
          statistical_data:{
            friends_num:0,
            active_num:0,
            article_num:0,
          }
        }
      }
    },
    Config:Object
  },
}

</script>

<style scoped>
#cf-state {
  position: relative;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: none;
  max-width: 810px;
  margin: auto;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 0;
}

#cf-change .cf-change-now {
  color: var(--lmm-hover);
  font-weight: 800;
}

.cf-state-data {
  width: 100%;
  display: flex;
}

.cf-data-friends, .cf-data-active, .cf-data-article {
  height: 60px;
  background: transparent;
  display: flex;
  flex-direction: column;
  width: 33%;
  cursor: pointer;
}
.cf-label {
  font-size: 16px;
  padding: 0 3%;
  align-self: center;
  text-align: center;
  width: 100%;
  height: 30px;
}

.cf-message {
  align-self: center;
  text-align: center;
  padding: 0 3%;
  width: 50%;
  font-size: 20px;
}

#panel-btn{
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
