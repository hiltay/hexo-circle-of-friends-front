<template>
  <div>
    <div v-for="(data, index) in (all_article_data.article_data.slice(0, current_arcitle_num))" :key="index">
      <el-popover ref="popoverRefs" :placement="getOptimalPlacement(index)" :width="320" trigger="hover"
        :show-after="500" :hide-after="300" :disabled="!summary_enabled" popper-class="cf-summary-popover"
        popper-options="{
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top', 'bottom', 'left', 'right']
              }
            },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
                padding: 8
              }
            }
          ]
        }" @show="handlePopoverShow(data.link)" @hide="handlePopoverHide">
        <template #reference>
          <div class="cf-article">
            <a class="cf-article-title" :href="data.link" target="_blank" rel="noopener nofollow"
              :data-title="data.title">{{ data.title }}</a>
            <span class="cf-article-floor">{{ data.floor }}</span>
            <div class="cf-article-avatar no-lightbox flink-item-icon">
              <!-- 添加no-lightbox解决渲染问题 -->
              <img class="cf-img-avatar avatar no-lightbox" :src="data.avatar" alt="avatar"
                @error="loadDefaultImg($event)">
              <span class="cf-article-author" @click="open_article_card(data.link)">{{ data.author }}</span>
              <span class="cf-article-time">
                <span v-if="current_sort_rule === 'created'" class="cf-time-created">
                  <i class="far fa-calendar-alt">发表于</i>{{ data.created }}
                </span>
                <span v-if="current_sort_rule === 'updated'" class="cf-time-updated">
                  <i class="fas fa-history">更新于</i>{{ data.updated }}
                </span>
              </span>
            </div>
          </div>
        </template>

        <!-- Popover内容 -->
        <div class="cf-summary-content">
          <div v-if="article_summary.loading && article_summary.link === data.link" class="cf-summary-loading">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
          </div>
          <div
            v-else-if="article_summary.data && article_summary.data.summary && article_summary.data.summary !== '暂无摘要信息' && article_summary.link === data.link"
            class="cf-summary-text">
            <div class="cf-summary-header">
              <el-icon>
                <Document />
              </el-icon>
              <span>文章摘要</span>
            </div>
            <div class="cf-summary-body">
              {{ article_summary.data.summary }}
            </div>
            <div class="cf-summary-footer">
              <div class="cf-summary-meta">
                <div v-if="article_summary.data.ai_model" class="cf-summary-model">
                  <el-tooltip :content="`使用模型：${article_summary.data.ai_model}`" placement="top" effect="dark"
                    :disabled="article_summary.data.ai_model.length <= 20">
                    <span class="cf-model-text">
                      使用模型 {{ article_summary.data.ai_model }}
                    </span>
                  </el-tooltip>
                </div>
                <div class="cf-summary-times">
                  <span v-if="article_summary.data.created_at" class="cf-summary-time">
                    创建：{{ formatTime(article_summary.data.created_at) }}
                  </span>
                  <span v-if="article_summary.data.updated_at" class="cf-summary-time">
                    更新：{{ formatTime(article_summary.data.updated_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else-if="article_summary.data && article_summary.data.summary === '暂无摘要信息' && article_summary.link === data.link"
            class="cf-summary-no-summary-text">
            暂无摘要
          </div>
          <div v-else-if="article_summary.link === data.link" class="cf-summary-simple-loading">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
          </div>
          <div v-else class="cf-summary-placeholder">
            <div class="cf-summary-placeholder-bg"></div>
            <div class="cf-summary-placeholder-content">
              <el-icon>
                <Document />
              </el-icon>
            </div>
          </div>
        </div>
      </el-popover>
    </div>
    <div>
      <div id="cf-more" class="cf-new-add" @click="loadMoreArticle()">
        <small v-if="is_ended">一切皆有尽头！</small>
        <i v-else class="fas fa-angle-double-down"></i>
      </div>
      <div id="cf-footer" class="cf-new-add">
        <span class="cf-data-lastupdated">更新于：{{ all_article_data['statistical_data']['last_updated_time'] }}</span>
        Powered by
        <a href="https://github.com/Rock-Candy-Tea/hexo-circle-of-friends" target="_blank">FriendCircle</a>
        <span class="cf-version-info">
          <span v-if="version_check.loading" class="cf-version-loading">| 检查版本...</span>
          <span v-else-if="version_check.need_update" class="cf-version-update">
            | 发现新版本 {{ version_check.latest_version }}！
            <a href="https://github.com/Rock-Candy-Tea/hexo-circle-of-friends" target="_blank" class="cf-update-link">立即更新</a>
          </span>
          <span v-else-if="version_check.checked" class="cf-version-current">
            | v{{ version_check.current_version }}
          </span>
        </span>
      </div>
      <div id="cf-overlay" class="cf-new-add" onclick="closeShow()"></div>
      <div id="cf-overshow" class="cf-new-add"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useMainStore from "@/stores/main"
import { Loading, Document, WarningFilled, Clock, Cpu, InfoFilled } from '@element-plus/icons-vue'

const MainStore = useMainStore();
const current_sort_rule = computed(() => MainStore.current_sort_rule);
const Config = computed(() => MainStore.Config);
const current_arcitle_num = computed(() => MainStore.current_arcitle_num);
const article_summary = computed(() => MainStore.article_summary);
const summary_enabled = computed(() => MainStore.summary_enabled);
const version_check = computed(() => MainStore.version_check);

const all_article_data = computed(() => MainStore.get_current_article_data)
const is_ended = computed(() => MainStore.article_is_ended)

function loadMoreArticle() {
  MainStore.add_current_arcitle_num()
}

function loadDefaultImg(event: any) {
  // 当图片出错时，用默认图片替换
  event.target.setAttribute('src', Config.value.error_img)
}

function open_article_card(link: string) {
  setTimeout(MainStore.get_article_card_data, 100, link)
}

function handlePopoverShow(link: string) {
  if (summary_enabled.value) {
    MainStore.show_article_summary(link, { x: 0, y: 0 });
  }
}

function handlePopoverHide() {
  MainStore.hide_article_summary();
}

function formatTime(timeStr: string) {
  try {
    const date = new Date(timeStr);
    return date.toLocaleDateString('zh-CN');
  } catch {
    return timeStr;
  }
}

function getOptimalPlacement(index: number) {
  // 根据文章的位置索引智能选择最佳的popover位置
  const viewportHeight = window.innerHeight;
  const articleHeight = 120; // 估算的文章卡片高度
  const articleTop = index * articleHeight;

  // 如果文章在屏幕上半部分，显示在下方
  if (articleTop < viewportHeight / 2) {
    return 'bottom';
  }
  // 如果文章在屏幕下半部分，显示在上方
  else {
    return 'top';
  }
}
</script>

<style scoped>
/* 文章卡片样式开始 */
.cf-article {
  display: flex;
  flex-direction: column;
  margin: 20px 1%;
  border-radius: 5px;
  font-weight: bolder;
  overflow: hidden;
  transition: all ease-out .3s;
  position: relative;
  padding: 0.5rem 1rem;
}

.cf-article:hover {
  transition: transform .3s;
  -webkit-transform: scale(1.3);
  transform: scale(1.03)
}

.cf-article-avatar {
  display: flex;
  align-items: center;
  line-height: 35px;
}

.cf-img-avatar {
  align-self: center;
  text-align: center;
  display: inline-block !important;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin: 0 0 -4px !important;
  background: #fff;
}

.cf-article-author {
  line-height: 35px;
  font-size: 14px;
  font-weight: 400;
  margin-left: 5px;
  align-self: center;
  text-align: center;
  height: 40px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
}

.cf-article-floor {
  position: absolute;
  top: 0;
  right: 0.5rem;
  font-style: italic;
  font-size: 3rem;
  line-height: 1.5rem;
  z-index: 1;
  font-weight: 400;
}

.cf-article-title {
  font-weight: 500;
  position: relative;
  z-index: 2;
  width: 100%;
  display: block;
  letter-spacing: 1.5px;
  font-size: 18px;
  align-self: start;
  text-align: left;
  line-height: 40px;
  padding: 0;
  margin-bottom: 10px;
  transition: 0.3s;
}

.cf-article-time {
  font-size: 14px;
  font-weight: 400;
  margin-left: auto;
}

.cf-article-time i:before {
  margin-right: 5px;
}

/* 文章卡片样式结束 */

/* 更多按钮样式开始 */
#cf-more {
  width: 40%;
  max-width: 810px;
  height: 30px;
  margin: auto;
  border-radius: 12px;
  font-weight: bolder;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;
  transition: 0.3s;
}

#cf-more:hover {
  width: 60%;
}

#cf-more i.fas::before {
  content: "∞";
}

/* 更多按钮样式结束 */

/* Footer样式开始 */
#cf-footer a {
  color: var(--el-color-primary);
  text-decoration: none;
}

#cf-footer a:hover {
  text-decoration: underline;
}

.cf-version-info {
  font-size: 13px;
}

.cf-version-loading {
  color: var(--el-color-info);
  opacity: 0.8;
}

.cf-version-current {
  color: var(--el-color-success);
  font-weight: 500;
}

.cf-version-update {
  color: var(--el-color-warning);
  font-weight: 500;
}

.cf-update-link {
  color: var(--el-color-danger) !important;
  text-decoration: none;
  margin-left: 4px;
  font-weight: 600;
}

.cf-update-link:hover {
  text-decoration: underline !important;
}

/* Footer样式结束 */

/* 文章摘要Popover样式开始 */
.cf-summary-content {
  padding: 0;
}

.cf-summary-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.cf-summary-loading .el-icon {
  font-size: 16px;
  color: var(--el-color-primary);
}

/* 简化的加载状态样式 */
.cf-summary-simple-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.cf-summary-simple-loading .el-icon {
  font-size: 32px;
  color: var(--el-color-primary);
}

/* 暂无摘要文字样式 */
.cf-summary-no-summary-text {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  font-size: 16px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

/* 无摘要内容的样式 */
.cf-summary-no-content {
  position: relative;
  width: 100%;
  height: 360px !important;
  min-height: 360px !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: visible;
  border-radius: 12px;
  background: linear-gradient(180deg,
      var(--el-color-primary-light-9) 0%,
      var(--el-fill-color-extra-light) 30%,
      var(--el-bg-color) 70%,
      var(--el-color-info-light-9) 100%);
}









/* 占位符样式 */
.cf-summary-placeholder {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  min-height: 80px;
  overflow: hidden;
}

.cf-summary-placeholder-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
      transparent 40%,
      var(--el-color-primary-light-9) 50%,
      transparent 60%);
  background-size: 20px 20px;
  animation: shimmer 2s ease-in-out infinite;
  opacity: 0.1;
}

.cf-summary-placeholder-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-placeholder);
  font-size: 14px;
}

.cf-summary-placeholder .el-icon {
  font-size: 18px;
  color: var(--el-color-primary);
  opacity: 0.6;
}

/* 动画效果 */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  33% {
    transform: translateY(-10px) rotate(1deg);
  }

  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

@keyframes wave {

  0%,
  100% {
    transform: scaleX(1) scaleY(1);
  }

  50% {
    transform: scaleX(1.2) scaleY(0.8);
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.8;
  }
}

@keyframes iconPulse {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
}

@keyframes badgeFloat {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-2px);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.cf-summary-text {
  padding: 0;
}

.cf-summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-weight: 600;
  font-size: 15px;
  color: var(--el-text-color-primary);
  background: linear-gradient(135deg, var(--el-fill-color-extra-light) 0%, var(--el-fill-color-light) 100%);
  border-radius: 12px 12px 0 0;
}

.cf-summary-header .el-icon {
  font-size: 18px;
  color: var(--el-color-primary);
  opacity: 0.8;
}

.cf-summary-body {
  padding: 20px 20px 20px 32px;
  line-height: 1.7;
  font-size: 14px;
  color: var(--el-text-color-regular);
  max-height: 240px;
  overflow-y: auto;
  text-align: justify;
  background: var(--el-bg-color);
  position: relative;
  word-wrap: break-word;
  word-break: break-word;
}

.cf-summary-body::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 20px;
  width: 3px;
  height: 24px;
  background: linear-gradient(to bottom, var(--el-color-primary), var(--el-color-primary-light-5));
  border-radius: 2px;
  opacity: 0.6;
}

.cf-summary-body::-webkit-scrollbar {
  width: 4px;
}

.cf-summary-body::-webkit-scrollbar-track {
  background: var(--el-fill-color-light);
  border-radius: 2px;
}

.cf-summary-body::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 2px;
}

.cf-summary-body::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-dark);
}

.cf-summary-footer {
  padding: 12px 20px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(135deg, var(--el-fill-color-extra-light) 0%, var(--el-fill-color-light) 100%);
  border-radius: 0 0 12px 12px;
}

.cf-summary-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cf-summary-model {
  font-size: 13px;
  color: var(--el-color-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cf-model-text {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: help;
  transition: color 0.2s ease;
}

.cf-model-text:hover {
  color: var(--el-color-primary-dark-2);
}

.cf-summary-times {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cf-summary-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 当空间足够时，改为水平布局 */
@media (min-width: 768px) {
  .cf-summary-meta {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .cf-summary-times {
    text-align: right;
    flex-shrink: 0;
  }

  .cf-summary-model {
    flex: 1;
    margin-right: 12px;
  }
}

/* 自定义Popover样式 */
:global(.cf-summary-popover) {
  width: 360px !important;
  max-width: 360px !important;
  height: auto !important;
  max-height: 420px !important;
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid var(--el-border-color-lighter) !important;
  backdrop-filter: blur(8px) !important;
  animation: popoverFadeIn 0.3s ease-out !important;
  overflow: visible !important;
}

:global(.cf-summary-popover .el-popover__arrow::before) {
  border-top-color: var(--el-fill-color-extra-light) !important;
}

/* Popover动画 */
@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 文章摘要Popover样式结束 */
</style>
