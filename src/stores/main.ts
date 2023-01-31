import { defineStore } from "pinia";
import { getAllArticleInfo, getArticleCardInfo } from "@/interfaces/guest"
import cache from "@/utils/cache"
import DefaultConfig from '@/utils/Config';
import {showMessage} from "@/utils/tooltip"

function init_config(default_config: any): any {
    if (typeof UserConfig !== "undefined") {
        for (let key in UserConfig) {
            if (default_config[key]) {
                default_config[key] = UserConfig[key];
            }
        }
    }
    // handle slash
    if (!default_config.private_api_url.endsWith("/")) {
        default_config.private_api_url = default_config.private_api_url + "/";
    }
    if (!default_config.public_api_url.endsWith("/")) {
        default_config.public_api_url = default_config.public_api_url + "/";
    }
    return default_config;
}
const config = init_config(DefaultConfig)

const useMainStore = defineStore("main", {
    state: () => ({
        // 用户配置
        Config: config,
        // 当前api private/public
        current_api: "private",
        // 当前排序规则 created/updated
        current_sort_rule: config.sort_rule,
        // 数据加载状态
        is_data_loaded: false,
        // 当前所有的数据
        all_article_data: {
            "created": { statistical_data: { friends_num: 0, active_num: 0, article_num: 0 }, article_data: [] },
            "updated": { statistical_data: { friends_num: 0, active_num: 0, article_num: 0 }, article_data: [] },
        } as any,
        // 当前展示的文章数量
        current_arcitle_num: config.page_init_number,
        // 文章卡片状态
        article_card: {
            show: false,
            data: ""
        } as any

    }),
    getters: {
        get_current_article_data(state): any {
            return state.current_sort_rule === "created" ?
                state.all_article_data.created :
                state.all_article_data.updated
        },
        article_is_ended(state): boolean {
            let current_data: any = this.get_current_article_data
            return state.current_arcitle_num >= current_data.statistical_data.article_num
        },
        get_current_base_api(): string {
            let current_api: string = this.current_api
            let Config: any = this.Config
            return current_api === "private" ? Config.private_api_url : Config.public_api_url
        }
    },
    actions: {
        async get_data() {
            this.is_data_loaded = false
            let current_api: string = this.get_current_base_api
            // 本地加载
            let CreatedData = cache.getCache(current_api + "CreatedData")
            let UpdatedData = cache.getCache(current_api + "UpdatedData")
            console.log(CreatedData)
            console.log(UpdatedData)
            if (!CreatedData) {
                CreatedData = await getAllArticleInfo(current_api, "created")
                // 将本次获取放入缓存
                if (CreatedData) {
                    cache.setCache(current_api + "CreatedData", CreatedData, false, this.Config.expire_days)
                }
            }
            if (!UpdatedData) {
                UpdatedData = await getAllArticleInfo(current_api, "updated")
                // 将本次获取放入缓存
                if (UpdatedData) {
                    cache.setCache(current_api + "UpdatedData", UpdatedData, false, this.Config.expire_days)
                }
            }
            this.all_article_data.created = CreatedData
            this.all_article_data.updated = UpdatedData
            this.is_data_loaded = true
        },
        async get_article_card_data(link: string) {
            console.log(111)
            let data = await getArticleCardInfo(this.get_current_base_api, link)
            if ("statistical_data" in data) {
                this.article_card.data = data
                this.article_card.show = true
              } else {
                showMessage("未获取到文章卡片òᆺó\n如果持续出现此错误，检查数据库是否正常","error")
              }
        },
        add_current_arcitle_num() {
            this.current_arcitle_num += this.Config.page_turning_number;
        },
        change_current_sort_rule() {
            this.current_sort_rule === "created" ? this.current_sort_rule = "updated" : this.current_sort_rule = "created";
        },
        change_current_api() {
            this.current_api === "private" ? this.current_api = "public" : this.current_api = "private";
        },
        close_article_card(){
            this.article_card.show=false;
        }

    },
});

export default useMainStore;