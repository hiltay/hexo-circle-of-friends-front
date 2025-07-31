<template>
  <div>
    <div id="cf-overlay" @click="close_article_card"></div>
    <transition name="fade">
      <div class="cf-overshow">
        <div class="cf-overshow-head">
          <img class="cf-img-avatar avatar" :src="article_card.data.statistical_data.avatar"
            @error="loadDefaultImg($event)" alt="avatar">
          <a class="" target="_blank" rel="noopener nofollow" :href="article_card.data.statistical_data.link">{{
            article_card.data.statistical_data.name
          }}</a>
        </div>
        <div v-if="article_card.data.article_data.length === 0" class="cf-no-articles">
          <div class="cf-no-articles-bg"></div>
          <div class="cf-no-articles-content">
            <div class="cf-no-articles-icon">📝</div>
            <h4>暂无文章</h4>
            <p>该作者最近暂无发布文章</p>
            <small>可能是刚刚加入朋友圈或更新较少</small>
          </div>
        </div>
        <div v-else>
          <div v-for="(data, index) in article_card.data.article_data" :key="index"
            :class="article_card.data.article_data.length - 1 === index ? 'cf-overshow-content-tail' : 'cf-overshow-content'">
            <p>
              <a class="cf-article-title" :href="data.link" target="_blank" rel="noopener nofollow"
                :data-title="data.title">{{ data.title }}</a>
              <span>{{ data.created }}</span>
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import useMainStore from "@/stores/main"
import { computed } from 'vue'
const MainStore = useMainStore();
const article_card = computed(() => MainStore.article_card);
const Config = computed(() => MainStore.Config);

// 关闭文章卡片
function close_article_card() {
  setTimeout(MainStore.close_article_card, 200)
}
function loadDefaultImg(event: any) {
  // 当图片出错时，用默认图片替换
  event.target.setAttribute('src', Config.value.error_img)
}
</script>

<style scoped>
/* 淡入淡出开始 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 淡入淡出结束 */

/* 个人文章列表层 */
#cf-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
}

#cf-overlay {
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.42);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  pointer-events: all;
  transition: all 0.1s ease;
  z-index: 998;
}

.cf-overshow {
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 20px;
  position: fixed;
  width: 320px;
  /*min-height: 170px;*/
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.093);
  background: var(--lmm-background);
  transition: all 0.1s ease;
  z-index: 999;
}

.cf-overshow-head:hover img.cf-img-avatar {
  transform: rotate(360deg);
  transition: 0.8s;
}

.cf-overshow .cf-overshow-head a {
  color: var(--lmm-hover);
  display: block;
  text-align: center;
  font-weight: bold;
  margin-top: -5px;
  padding: 5px 8px 5px;
  text-decoration: none;
}

.cf-overshow img.cf-img-avatar {
  background: #fff;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: -45px auto 0 !important;
  box-shadow: 0 12px 40px rgb(0 0 0 / 9%);
  transform: rotate(-360deg);
  transition: 0.8s;
}

.cf-overshow p {
  margin: 0.3rem 5px;
  width: 100%;
  position: relative;
}

.cf-overshow p a.cf-article-title {
  text-decoration: none;
  display: block;
  text-align: left;
  position: relative;
  z-index: 2;
  font-size: 15px;
  line-height: 25px;
  margin-bottom: 15px;
  letter-spacing: normal;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cf-overshow p span {
  position: absolute;
  bottom: -1rem;
  right: 8px;
  z-index: 1;
  font-style: italic;
  font-size: 12px;
}

/*个人卡片body样式开始*/
.cf-overshow .cf-overshow-content {
  padding: 2px 3px 7px;
}


.cf-overshow .cf-overshow-content-tail {
  padding: 2px 3px 7px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.cf-overshow .cf-overshow-content:hover,
.cf-overshow .cf-overshow-content-tail:hover {
  background-color: var(--lmm-background-floorcolor);
}

/*个人卡片body样式结束*/

/* 无文章状态样式 */
.cf-no-articles {
  position: relative;
  min-height: 120px;
  padding: 20px;
  overflow: hidden;
  border-radius: 0 0 20px 20px;
}

.cf-no-articles-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    var(--lmm-background-floorcolor, #f8f9fa) 0%, 
    var(--lmm-background, #ffffff) 50%, 
    var(--lmm-background-floorcolor, #f8f9fa) 100%);
  opacity: 0.6;
}

.cf-no-articles-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(64, 158, 255, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 80% 80%, rgba(64, 158, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px, 12px 12px;
  animation: float 15s ease-in-out infinite;
}

.cf-no-articles-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  min-height: 80px;
}

.cf-no-articles-icon {
  font-size: 28px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.cf-no-articles-content h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--lmm-fontcolor, #333);
}

.cf-no-articles-content p {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: var(--lmm-hover, #666);
  line-height: 1.4;
}

.cf-no-articles-content small {
  font-size: 12px;
  color: var(--lmm-floorcolor, #999);
  font-style: italic;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
</style>
