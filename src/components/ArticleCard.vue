<template>
  <div>
    <div id="cf-overlay" @click="close_article_card"></div>
    <transition name="fade">
      <div v-if="show" class="cf-overshow">
      <div class="cf-overshow-head">
        <img class="cf-img-avatar avatar" :src="article_card_data.statistical_data.avatar" @error="loadDefaultImg($event)" alt="avatar">
        <a class="" target="_blank" rel="noopener nofollow"
           :href="article_card_data.statistical_data.link">{{ article_card_data.statistical_data.name }}</a>
      </div>
        <div v-if="article_card_data.article_data.length===0">
          <div class="cf-overshow-content-tail">
              <span style="font-style: italic;font-size: 16px;color: gray;">该作者最近暂无文章喵=^ω^=</span>
          </div>
        </div>
        <div v-else>
          <div v-for="(data,index) in article_card_data.article_data" :key="index" :class="article_card_data.article_data.length-1===index?'cf-overshow-content-tail':'cf-overshow-content'">
            <p>
              <a class="cf-article-title" :href="data.link" target="_blank" rel="noopener nofollow"
                 :data-title="data.title">{{data.title}}</a>
              <span>{{data.created}}</span>
            </p>
          </div>
        </div>
    </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ArticleCard",
  emits:['close_article_card'],
  data() {
    return {
      show:false // 控制淡入淡出
    }
  },
  methods:{
    // 关闭文章卡片
    close_article_card(){
      this.show=false // 淡出
      setTimeout(() => this.$emit("close_article_card"), 200)
    },
    loadDefaultImg(event) {
      // 当图片出错时，用默认图片替换
      event.target.setAttribute('src', this.Config.error_img)
    },
  },
  mounted() {
    // 淡入
    setTimeout(() => this.show=true, 100)
  },
  props: ['Config','article_card_data']
}
</script>

<style scoped>
/* 淡入淡出开始 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}
.fade-enter, .fade-leave-to {
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
  text-align: center;
  border-radius: 20px;
  position:fixed;
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
.cf-overshow .cf-overshow-content{
  padding: 2px 3px 7px;
}


.cf-overshow .cf-overshow-content-tail{
  padding: 2px 3px 7px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.cf-overshow .cf-overshow-content:hover,.cf-overshow .cf-overshow-content-tail:hover {
  background-color: var(--lmm-background-floorcolor);
}
/*个人卡片body样式结束*/
</style>
