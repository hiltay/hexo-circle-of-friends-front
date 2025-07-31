<template>
  <!-- <el-config-provider namespace="yyyz"> -->
  <Main_Component />
<!-- </el-config-provider> -->
</template>

<script setup lang="ts">
import Main_Component from '@/components/main/Index.vue'
import useMainStore from "@/stores/main"
const MainStore = useMainStore();

MainStore.get_data()
MainStore.init_summary_settings()
// 延迟3秒后检查版本，避免影响主要功能加载
setTimeout(() => {
  MainStore.check_version()
}, 3000)

</script>

<style>
/* 排序按钮 */
#cf-change {
  font-size: 14px;
  display: block;
  padding: 12px 0 4px;
  width: 100%;
  text-align: center;
}

/* 主容器 */
#cf-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  height: auto;
  margin: auto;
}

#cf-container a {
  text-decoration: none;
}

.cf-time-updated,
.cf-time-created {
  display: inline-block;
  text-align: left;
  white-space: nowrap;
}

.cf-time-updated i.fas,
.cf-time-created i.far {
  padding-right: 8px;
}

/* 底部 */
#cf-footer {
  margin: 6rem 1% 2rem 0;
  text-align: right;
  font-size: 13px;
}

.cf-data-lastupdated {
  font-size: 13px;
  text-align: right;
  display: block;
}

/* 颜色 */
.cf-article .cf-article-title:hover {
  letter-spacing: 2px;
  color: var(--lmm-hover) !important;
}

#cf-more i.fas:hover {
  color: var(--lmm-hover);
}

#cf-state,
#cf-more {
  background: var(--lmm-background);
  color: var(--lmm-fontcolor);
}

#cf-change,
.cf-time-updated,
.cf-time-created,
.cf-article-floor {
  color: var(--lmm-floorcolor);
}

.cf-article-author,
.cf-article a.cf-article-title,
.cf-article:hover .cf-article-floor,
.cf-article:hover .cf-time-created,
.cf-article:hover .cf-time-updated {
  color: var(--lmm-fontcolor);
}

.cf-article {
  background: var(--lmm-background);
}

#cf-change span:hover {
  color: var(--lmm-hover);
  cursor: pointer;
}

.cf-overshow p a:hover {
  color: var(--lmm-hover) !important;
}

.cf-overshow p span {
  color: var(--lmm-floorcolor);
}

/* 暗色主题 */
.dark-theme #cf-overlay,
.theme-dark #cf-overlay {
  background-color: rgba(59, 61, 66, 0.42);
}

.dark-theme .cf-overshow,
.theme-dark .cf-overshow {
  background: #292a2d;
}

.dark-theme .cf-overshow p a,
.theme-dark .cf-overshow p a {
  color: var(--lmm-fontcolor);
}

.dark-theme .cf-overshow .cf-overshow-content,
.theme-dark .cf-overshow .cf-overshow-content {
  background: #eaeaea;
}

.dark-theme #cf-state,
.dark-theme #cf-more,
.theme-dark #cf-state,
.theme-dark #cf-more {
  background: var(--lmm-dack-background);
  color: var(--lmm-dark-fontcolor);
}

.dark-theme #cf-change,
.dark-theme .cf-time-updated,
.dark-theme .cf-time-created,
.dark-theme .cf-article-floor,
.theme-dark #cf-change,
.theme-dark .cf-time-updated,
.theme-dark .cf-time-created,
.theme-dark .cf-article-floor {
  color: var(--lmm-dark-floorcolor);
}

.dark-theme .cf-article-author,
.dark-theme .cf-article a.cf-article-title,
.theme-dark .cf-article-author,
.theme-dark .cf-article a.cf-article-title {
  color: var(--lmm-dark-fontcolor);
}

.dark-theme .cf-article,
.theme-dark .cf-article {
  background: var(--lmm-dack-background);
}

.dark-theme .cf-article:hover .cf-article-floor,
.dark-theme .cf-article:hover .cf-time-created,
.dark-theme .cf-article:hover .cf-time-updated,
.dark-theme .cf-overshow p span,
.theme-dark .cf-article:hover .cf-article-floor,
.theme-dark .cf-article:hover .cf-time-created,
.theme-dark .cf-article:hover .cf-time-updated,
.theme-dark .cf-overshow p span {
  color: var(--lmm-dark-fontcolor);
}

/* 移动端适配 */
@media screen and (max-width: 400px) {
  #cf-state {
    font-size: 14px;
  }

  .cf-article-time i {
    display: none;
  }
}

@media screen and (max-width: 300px) {

  #cf-state,
  .cf-article-time {
    display: none;
  }
}


/* element-ui 全局按钮样式开始 */
.el-button:focus,
.el-button:hover {
  color: var(--lmm-hover) !important;
}

/* element-ui 全局按钮样式结束 */

/* element-ui 全局表单样式开始 */
.el-form-item__label {
  color: #ffffff !important;
}

/* element-ui 全局表单样式结束 */
</style>