<template>
  <div>
    <div v-for="(data,index) in (all_data['article_data'].slice(0,current_arcitle_num))" :key="index">
      <div class="cf-article">
        <a class="cf-article-title" :href="data.link" target="_blank" rel="noopener nofollow"
           :data-title="data.title">{{ data.title }}</a>
        <span class="cf-article-floor">{{ data.floor }}</span>
        <div class="cf-article-avatar no-lightbox flink-item-icon">
          <!-- 添加no-lightbox解决渲染问题 -->
          <img class="cf-img-avatar avatar no-lightbox" :src="data.avatar" alt="avatar" @error="loadDefaultImg($event)">
          <span class="cf-article-author" @click="open_article_card(data.link)">{{ data.author }}</span>
          <span class="cf-article-time">
            <span v-if="Config.sort_rule==='created'" class="cf-time-created">
              <i class="far fa-calendar-alt">发表于</i>{{ data.created }}
            </span>
            <span v-if="Config.sort_rule==='updated'" class="cf-time-updated">
              <i class="fas fa-history">更新于</i>{{ data.updated }}
            </span>
          </span>
        </div>
      </div>
    </div>
    <div>
      <div id="cf-more" class="cf-new-add" @click="loadMoreArticle()">
        <small v-if="is_ended">一切皆有尽头！</small>
        <i v-else class="fas fa-angle-double-down"></i>
      </div>
      <div id="cf-footer" class="cf-new-add">
        <span id="cf-version-up" onclick="checkVersion()"></span>
        <span class="cf-data-lastupdated">更新于：{{ all_data['statistical_data']['last_updated_time'] }}</span>
        Powered by
        <a href="https://github.com/Rock-Candy-Tea/hexo-circle-of-friends" target="_blank">FriendCircle</a>
      </div>
      <div id="cf-overlay" class="cf-new-add" onclick="closeShow()"></div>
      <div id="cf-overshow" class="cf-new-add"></div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'ArticleBody',
  emits:['show_article_card'],
  data() {
    return {
      current_arcitle_num: this.all_data['statistical_data']['article_num'] > 20 ? 20 : this.all_data['statistical_data']['article_num'],
      is_ended: this.all_data['statistical_data']['article_num'] <= 20,
    }
  },
  methods: {
    loadMoreArticle() {
      this.current_arcitle_num += this.Config.page_turning_number;
      if (this.current_arcitle_num >= this.all_data['statistical_data']['article_num']) this.is_ended = true;
      console.log(this.is_ended)
    },
    loadDefaultImg(event) {
      // 当图片出错时，用默认图片替换
      event.target.setAttribute('src', this.Config.error_img)
    },
    open_article_card(link) {
      this.$emit('show_article_card', link);
    },
  },

  props: ['Config', 'all_data']
}
</script>

<style scoped>

/* 文章卡片样式开始 */
.cf-article {

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
  text-align: right;
  float: right;
  font-weight: 400;
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

</style>
