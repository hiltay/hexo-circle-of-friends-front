<template>
  <div>
    <ManagePanel
      v-if="manage_panel_open"
      :Config="Config"
      @close_manage_panel="close_manage_panel"
    ></ManagePanel>
    <ArticleCard
      v-if="article_card_data.open"
      :article_card_data="article_card_data.data"
      :Config="Config"
      @close_article_card="close_article_card"
    ></ArticleCard>
    <div v-if="change_map[Config.sort_rule]">
      <div id="cf-container">
        <Header
          :Config="Config"
          :all_data="change_map[Config.sort_rule]"
          @watch_sort_rule="change_sort_rule"
          @show_article_card="open_article_card"
          @toggle_api_url="toggle_api_url"
          @open_manage_panel="open_manage_panel"
        >
        </Header>
        <ArticleBody
          :Config="Config"
          :all_data="change_map[Config.sort_rule]"
          @show_article_card="open_article_card"
        ></ArticleBody>
      </div>
    </div>
    <span v-else>与主机通讯中……</span>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import ArticleBody from "./components/ArticleBody.vue";
import ArticleCard from "./components/ArticleCard.vue";
import ManagePanel from "./components/ManagePanel.vue";
import DefaultConfig from "./utils/Config";
import { ElMessage } from "element-plus";

function init_config(default_config) {
  if (typeof UserConfig !== "undefined") {
    for (let key in UserConfig) {
      if (default_config[key]) {
        default_config[key] = UserConfig[key];
      }
    }
  }
  return default_config;
}

export default {
  name: "App",
  data() {
    return {
      // 配置
      Config: DefaultConfig,
      // 当前api
      current_api: null,
      // 排序规则
      change_map: {
        updated: null,
        created: null,
      },
      // 文章卡片
      article_card_data: {
        open: false,
        data: null,
      },
      // 管理面板状态
      manage_panel_open: false,
    };
  },
  methods: {
    // 加载文章数据
    get_data(base_url) {
      // 本地加载
      let CreatedData = JSON.parse(
        sessionStorage.getItem(base_url + "CreatedData")
      );
      let UpdatedData = JSON.parse(
        sessionStorage.getItem(base_url + "UpdatedData")
      );
      this.change_map["created"] = CreatedData;
      this.change_map["updated"] = UpdatedData;
      if (CreatedData === null) {
        // 没有缓存，第一次加载created
        this.$axios
          .get(base_url + "all?rule=created")
          .then((response) => {
            sessionStorage.setItem(
              base_url + "CreatedData",
              JSON.stringify(response.data)
            );
            this.change_map["created"] = response.data;
          })
          .catch((error) => {
            ElMessage({
              message: error.message,
              type: "error",
            });
          });
      }
      if (UpdatedData === null) {
        // 没有缓存，第一次加载updated
        this.$axios
          .get(base_url + "all?rule=updated")
          .then((response) => {
            sessionStorage.setItem(
              base_url + "UpdatedData",
              JSON.stringify(response.data)
            );
            this.change_map["updated"] = response.data;
          })
          .catch((error) => {
            ElMessage({
              message: error.message,
              type: "error",
            });
          });
      }
    },
    // 切换排序规则
    change_sort_rule(rule) {
      // 监听事件，修改排序规则rule
      this.Config.sort_rule = rule;
    },
    // 打开文章卡片
    open_article_card(link) {
      let url;
      // 监听事件，获取link对应的文章卡片展示
      // 选择私有库还是公共库api
      let current_base_api =
        this.current_api === "private"
          ? this.Config.private_api_url
          : this.Config.public_api_url;
      if (link !== "") {
        url = current_base_api + "post?num=5&link=" + link;
      } else {
        url = current_base_api + "post?num=5";
      }
      this.$axios.get(url).then((response) => {
        if ("statistical_data" in response.data) {
          this.article_card_data.data = response.data;
          this.article_card_data.open = true;
        } else {
          ElMessage({
            message:
              "未获取到文章卡片òᆺó\n如果持续出现此错误，检查数据库是否正常",
            type: "error",
          });
        }
      });
    },
    // 关闭文章卡片
    close_article_card() {
      this.article_card_data.open = false;
    },
    toggle_api_url() {
      if (this.current_api === "private") {
        this.current_api = "public";
        this.get_data(this.Config.public_api_url);
      } else {
        this.current_api = "private";
        this.get_data(this.Config.private_api_url);
      }
    },
    // 打开管理面板
    open_manage_panel() {
      this.manage_panel_open = true;
    },
    // 关闭管理面板
    close_manage_panel() {
      this.manage_panel_open = false;
    },
  },
  created() {
    this.Config = init_config(this.Config);
    this.current_api = "private";
    this.get_data(this.Config.private_api_url);
  },
  components: {
    Header,
    ArticleBody,
    ArticleCard,
    ManagePanel,
  },
};
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
</style>
