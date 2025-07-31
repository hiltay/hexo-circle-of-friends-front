<template>
  <div>
    <div id="cf-state" class="cf-new-add">
      <div class="cf-state-data">
        <el-tooltip content="点击获取一篇随机文章" placement="bottom" effect="light">
          <div class="cf-data-friends" @click="get_random_article" :class="{ 'cf-loading': random_article_loading }">
            <span class="cf-label">订阅</span>
            <span class="cf-message">
              <el-icon v-if="random_article_loading" class="is-loading">
                <Loading />
              </el-icon>
              <span v-else>{{ all_article_data.statistical_data?.friends_num }}</span>
            </span>
          </div>
        </el-tooltip>
        <el-tooltip :content="summary_enabled ? '点击关闭文章摘要' : '点击开启文章摘要'" placement="bottom" effect="light">
          <div class="cf-data-active" @click="toggle_summary" :class="{ 'cf-summary-disabled': !summary_enabled }">
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
import { Loading } from '@element-plus/icons-vue'

const MainStore = useMainStore();
const current_sort_rule = computed(() => MainStore.current_sort_rule);
const Config = computed(() => MainStore.Config);
const all_article_data = computed(() => MainStore.get_current_article_data)
const random_article_loading = computed(() => MainStore.random_article.loading)
const summary_enabled = computed(() => MainStore.summary_enabled)

// 切换排序规则
function change_sort_rule() {
  MainStore.change_current_sort_rule()
}

// 获取随机文章
function get_random_article() {
  if (!random_article_loading.value) {
    MainStore.get_random_article()
  }
}

// 切换摘要功能
function toggle_summary() {
  MainStore.toggle_summary_enabled()
}

// 清除sessionstorage缓存
function clear_session_storage() {
  cache.clearCache()
  location.reload();
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
.cf-data-article {
  height: 60px;
  background: transparent;
  display: flex;
  flex-direction: column;
  width: 33%;
  cursor: pointer;
}

.cf-data-active {
  height: 60px;
  background: transparent;
  display: flex;
  flex-direction: column;
  width: 33%;
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

/* 随机文章加载状态 */
.cf-data-friends.cf-loading {
  opacity: 0.7;
  pointer-events: none;
}

.cf-data-friends.cf-loading .cf-message {
  position: relative;
}

.cf-data-friends .el-icon.is-loading {
  animation: rotating 1s linear infinite;
  color: var(--el-color-primary);
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 活跃区域摘要切换样式 */
.cf-data-active {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cf-data-active:hover {
  transform: scale(1.05);
}

.cf-data-active.cf-summary-disabled {
  opacity: 0.6;
}
</style>
