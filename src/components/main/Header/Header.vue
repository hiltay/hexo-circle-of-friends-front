<template>
  <div>
    <div id="cf-state" class="cf-new-add">
      <el-button id="panel-btn" circle @click="open_manage_panel"><el-icon><Setting /></el-icon></el-button>
      <div class="cf-state-data">
        <el-tooltip content="点击获取一篇随机文章" placement="bottom" effect="light">
          <div class="cf-data-friends" @click="open_article_card">
            <span class="cf-label">订阅</span>
            <span class="cf-message">{{ all_article_data.statistical_data?.friends_num }}
            </span>
          </div>
        </el-tooltip>
        <el-tooltip content="点击切换公共库/私有库" placement="top" effect="light">
          <div class="cf-data-active" @click="toggle_api_url">
            <span class="cf-label">活跃</span>
            <span class="cf-message">{{ all_article_data.statistical_data?.active_num }}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="点击清空缓存" placement="bottom" effect="light">
          <div class="cf-data-article" @click="clear_session_storage">
            <span class="cf-label">日志</span>
            <span class="cf-message">{{ all_article_data.statistical_data?.article_num }}</span>
          </div>
        </el-tooltip>
      </div>
      <div id="cf-change">
        <span :class='current_sort_rule === "created" ? "cf-change-now" : ""' @click="change_sort_rule">Created</span> |
        <span :class='current_sort_rule === "updated" ? "cf-change-now" : ""' @click="change_sort_rule">Updated</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import useMainStore from "@/stores/main"
import cache from "@/utils/cache"
const MainStore = useMainStore();
let { current_sort_rule, current_api, Config } = storeToRefs(MainStore);
const all_article_data = computed(() => MainStore.get_current_article_data)

// 切换排序规则
function change_sort_rule() {
  MainStore.change_current_sort_rule()
}
// 随机文章卡片
function open_article_card() {
  setTimeout(MainStore.get_article_card_data, 100)
}
// 切换私有库/公共库
function toggle_api_url() {
  MainStore.change_current_api()
  MainStore.get_data()
}
// 清除sessionstorage缓存
function clear_session_storage() {
  cache.clearCache()
  location.reload();
}
// 打开管理面板
function open_manage_panel() {
  MainStore.open_manage_panel()
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

#cf-change {
  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
}

#cf-change .cf-change-now {
  color: var(--lmm-hover);
  font-weight: 800;
}

.cf-state-data {
  width: 100%;
  display: flex;
}

.cf-data-friends,
.cf-data-active,
.cf-data-article {
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

#panel-btn {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
