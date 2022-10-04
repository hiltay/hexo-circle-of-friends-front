<template>
  <div>
    <div id="cf-state" class="cf-new-add">
      <div class="cf-state-data">
        <div class="cf-data-friends" @click="open_article_card">
          <span class="cf-label">订阅</span>
          <span class="cf-message">{{ all_data.statistical_data.friends_num }}</span>
        </div>
        <div class="cf-data-active" @click="toggle_api_url">
          <span class="cf-label">活跃</span>
          <span class="cf-message">{{ all_data.statistical_data.active_num }}</span>
        </div>
        <div class="cf-data-article" @click="clear_session_storage">
          <span class="cf-label">日志</span>
          <span class="cf-message">{{ all_data.statistical_data.article_num }}</span>
        </div>
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
    }
  },
  props: ['Config', 'all_data']
  // created() {
  //
  //
  // }
}

</script>

<style scoped>
#cf-state {
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
</style>
