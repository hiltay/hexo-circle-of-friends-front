import { defineStore } from "pinia";
import { getAllArticleInfo, getArticleCardInfo, getArticleSummary, getRandomPost, getVersion, getLatestVersion } from "@/interfaces/guest"
import cache from "@/utils/cache"
import DefaultConfig from '@/utils/Config';
import { showMessage } from "@/utils/tooltip"

function init_config(default_config: any): any {
    if (typeof UserConfig !== "undefined" && UserConfig) {
        for (let key in UserConfig) {
            if (default_config[key] && UserConfig[key as keyof UserConfigInterface]) {
                default_config[key] = UserConfig[key as keyof UserConfigInterface];
            }
        }
    }
    // handle slash
    if (!default_config.private_api_url.endsWith("/")) {
        default_config.private_api_url = default_config.private_api_url + "/";
    }
    return default_config;
}
const config = init_config(DefaultConfig)

const useMainStore = defineStore("main", {
    state: () => ({
        // 用户配置
        Config: config,
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
        } as any,
        // 文章摘要状态
        article_summary: {
            show: false,
            loading: false,
            data: null,
            link: "",
            cancelled: false
        } as any,
        // 摘要功能开关
        summary_enabled: true,
        // 随机文章状态
        random_article: {
            loading: false,
            data: null,
            error: null
        } as any,
        // 版本检查状态
        version_check: {
            current_version: '',
            latest_version: '',
            need_update: false,
            checked: false,
            loading: false
        } as any,
    }),
    getters: {
        get_current_article_data(state: any): any {
            return state.current_sort_rule === "created" ?
                state.all_article_data.created :
                state.all_article_data.updated
        },
        article_is_ended(state: any): boolean {
            let current_data: any = this.get_current_article_data
            return state.current_arcitle_num >= current_data.statistical_data.article_num
        },
        get_current_base_api(state: any): string {
            let Config: any = state.Config
            return Config.private_api_url
        }
    },
    actions: {
        async get_data() {
            this.is_data_loaded = false
            let current_api: string = this.get_current_base_api
            // 本地加载
            let CreatedData = cache.getCache(current_api + "CreatedData")
            let UpdatedData = cache.getCache(current_api + "UpdatedData")
            if (!CreatedData) {
                let res = await getAllArticleInfo(current_api, "created")
                CreatedData = res.data
                // 将本次获取放入缓存
                if (CreatedData) {
                    cache.setCache(current_api + "CreatedData", CreatedData, false, this.Config.expire_days)
                }
            }
            if (!UpdatedData) {
                let res =  await getAllArticleInfo(current_api, "updated")
                UpdatedData = res.data
                // 将本次获取放入缓存
                if (UpdatedData) {
                    cache.setCache(current_api + "UpdatedData", UpdatedData, false, this.Config.expire_days)
                }
            }
            this.all_article_data.created = CreatedData
            this.all_article_data.updated = UpdatedData
            this.is_data_loaded = true
        },
        async get_article_card_data(link?: string) {
            let res = await getArticleCardInfo(this.get_current_base_api, link)
            let data = res.data
            if ("statistical_data" in data) {
                this.article_card.data = data
                this.article_card.show = true
            } else {
                showMessage("未获取到文章卡片òᆺó\n如果持续出现此错误，检查数据库是否正常", "error")
            }
        },
        add_current_arcitle_num() {
            // 当前文章数量增加
            this.current_arcitle_num += this.Config.page_turning_number;
        },
        change_current_sort_rule() {
            // 切换当前排序规则
            this.current_sort_rule === "created" ? this.current_sort_rule = "updated" : this.current_sort_rule = "created";
        },
        close_article_card() {
            // 关闭文章卡片
            this.article_card.show = false;
        },
        async show_article_summary(link: string, position?: { x: number, y: number }) {
            // 显示文章摘要
            this.article_summary.link = link;
            this.article_summary.show = true;
            this.article_summary.loading = true;
            this.article_summary.data = null;
            this.article_summary.cancelled = false;

            // 记录开始时间
            const startTime = Date.now();
            console.log('开始获取摘要:', new Date().toLocaleTimeString());
            
            try {
                let current_api: string = this.get_current_base_api;
                
                // 创建超时Promise - 3秒后超时
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('摘要获取超时')), 3000);
                });
                
                // 使用Promise.race来实现超时
                const res = await Promise.race([
                    getArticleSummary(current_api, link),
                    timeoutPromise
                ]);
                
                // 检查是否已取消
                if (this.article_summary.cancelled) {
                    return;
                }
                
                // 确保最少显示800ms的加载动画
                const elapsed = Date.now() - startTime;
                const minLoadingTime = 800;
                console.log(`已耗时: ${elapsed}ms, 最小时间: 800ms`);
                if (elapsed < minLoadingTime) {
                    const waitTime = minLoadingTime - elapsed;
                    console.log(`需要等待额外: ${waitTime}ms`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
                
                // 再次检查是否已取消
                if (this.article_summary.cancelled) {
                    return;
                }
                
                // 检查返回的数据是否包含有效的摘要
                const responseData = (res as any).data;
                console.log('API响应数据:', responseData);
                
                if (responseData && responseData.summary && responseData.summary.trim() !== '') {
                    console.log('摘要获取成功，总耗时:', Date.now() - startTime + 'ms');
                    this.article_summary.data = responseData;
                    this.article_summary.loading = false;
                } else {
                    console.log('API返回成功但无摘要内容');
                    // 即使没有摘要内容，也要确保最小加载时间
                    const elapsed = Date.now() - startTime;
                    const minLoadingTime = 1200;
                    console.log(`无摘要内容 - 已耗时: ${elapsed}ms, 最小时间: ${minLoadingTime}ms`);
                    if (elapsed < minLoadingTime) {
                        const waitTime = minLoadingTime - elapsed;
                        console.log(`无摘要内容 - 需要等待额外: ${waitTime}ms`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                    
                    // 再次检查是否已取消
                    if (this.article_summary.cancelled) {
                        return;
                    }
                    
                    console.log('无摘要内容，总耗时:', Date.now() - startTime + 'ms');
                    this.article_summary.loading = false;
                    this.article_summary.data = { summary: "暂无摘要信息" };
                }
            } catch (error: any) {
                // 如果是取消请求，直接返回
                if (this.article_summary.cancelled || error?.message === '请求已取消') {
                    return;
                }
                
                console.error("获取文章摘要失败:", error);
                
                // 确保最少显示800ms的加载动画
                const elapsed = Date.now() - startTime;
                const minLoadingTime = 800;
                console.log(`错误情况 - 已耗时: ${elapsed}ms, 最小时间: ${minLoadingTime}ms`);
                if (elapsed < minLoadingTime) {
                    const waitTime = minLoadingTime - elapsed;
                    console.log(`错误情况 - 需要等待额外: ${waitTime}ms`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
                
                // 最后检查是否已取消
                if (this.article_summary.cancelled) {
                    return;
                }
                
                console.log('超时或错误，总耗时:', Date.now() - startTime + 'ms');
                this.article_summary.loading = false;
                this.article_summary.data = { summary: "暂无摘要信息" };
            }
        },
        hide_article_summary() {
            // 隐藏文章摘要
            this.article_summary.cancelled = true;
            this.article_summary.show = false;
            this.article_summary.data = null;
            this.article_summary.loading = false;
        },
        async get_random_article() {
            // 获取随机文章
            this.random_article.loading = true;
            this.random_article.error = null;
            
            try {
                let current_api: string = this.get_current_base_api;
                let res = await getRandomPost(current_api, 1);
                
                if (res.data) {
                    this.random_article.data = res.data;
                    // 如果返回的是单个文章对象，调用文章卡片显示
                    this.get_article_card_data(res.data.link);
                } else {
                    this.random_article.error = "暂无可用的随机文章";
                    showMessage("暂无可用的随机文章 (｡•́︿•̀｡)", "warning");
                }
            } catch (error) {
                console.error("获取随机文章失败:", error);
                this.random_article.error = "获取随机文章失败";
                showMessage("获取随机文章失败，请稍后重试 ╥﹏╥", "error");
            } finally {
                this.random_article.loading = false;
            }
        },
        toggle_summary_enabled() {
            // 切换摘要功能开关
            this.summary_enabled = !this.summary_enabled;
            
            // 如果关闭摘要功能，同时隐藏当前显示的摘要
            if (!this.summary_enabled) {
                this.hide_article_summary();
            }
            
            // 保存到localStorage
            try {
                localStorage.setItem('cf_summary_enabled', this.summary_enabled.toString());
            } catch (error) {
                console.warn('无法保存摘要功能设置到localStorage:', error);
            }
        },
        init_summary_settings() {
            // 初始化摘要功能设置
            try {
                const saved = localStorage.getItem('cf_summary_enabled');
                if (saved !== null) {
                    this.summary_enabled = saved === 'true';
                }
            } catch (error) {
                console.warn('无法从localStorage读取摘要功能设置:', error);
            }
        },
        
        // 版本号标准化函数
        normalizeVersion(version: string): string {
            // 移除前导的 v 字符，并确保格式一致
            return version.replace(/^v?/, '').trim();
        },
        
        // 比较版本号
        compareVersions(current: string, latest: string): boolean {
            const currentNormalized = this.normalizeVersion(current);
            const latestNormalized = this.normalizeVersion(latest);
            
            const currentParts = currentNormalized.split('.').map(Number);
            const latestParts = latestNormalized.split('.').map(Number);
            
            // 确保版本号数组长度一致
            const maxLength = Math.max(currentParts.length, latestParts.length);
            while (currentParts.length < maxLength) currentParts.push(0);
            while (latestParts.length < maxLength) latestParts.push(0);
            
            // 逐位比较
            for (let i = 0; i < maxLength; i++) {
                if (latestParts[i] > currentParts[i]) {
                    return true; // 需要更新
                } else if (latestParts[i] < currentParts[i]) {
                    return false; // 不需要更新
                }
            }
            return false; // 版本相同，不需要更新
        },
        
        async check_version() {
            if (this.version_check.checked || this.version_check.loading) {
                return;
            }
            
            this.version_check.loading = true;
            console.log('开始版本检查...');
            
            try {
                let current_api: string = this.get_current_base_api;
                
                // 并行获取当前版本和最新版本
                const [currentVersionRes, latestVersionRes] = await Promise.all([
                    getVersion(current_api),
                    getLatestVersion()
                ]);
                
                const currentVersion = currentVersionRes.data?.version || '';
                const latestVersion = latestVersionRes.data || '';
                
                console.log('当前版本:', currentVersion);
                console.log('最新版本:', latestVersion);
                
                this.version_check.current_version = currentVersion;
                this.version_check.latest_version = latestVersion;
                this.version_check.need_update = this.compareVersions(currentVersion, latestVersion);
                this.version_check.checked = true;
                
                if (this.version_check.need_update) {
                    console.log('发现新版本，需要更新!');
                } else {
                    console.log('版本已是最新');
                }
                
            } catch (error) {
                console.error('版本检查失败:', error);
                // 检查失败时，设置为已检查状态，避免重复检查
                this.version_check.checked = true;
            } finally {
                this.version_check.loading = false;
            }
        }

    },
});

export default useMainStore;