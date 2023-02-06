import { defineStore } from "pinia";
import { runCrawlNow, apiRestart, getCrawlerStatus } from "@/interfaces/manage"
import useMainStore from "../main"
import { showMessage, showMessageBoxConfirm } from "@/utils/tooltip"
import useManageHomeStore from "@/stores/manage/home"

const useStatusStore = defineStore("status", {
    state: () => ({
        status: "未知",
        timer: null as any
    }
    ),
    getters: {

    },
    actions: {
        async restart_api(base_api: string) {
            // 上传成功，提示是否重启api/爬虫
            showMessageBoxConfirm("更新成功，下次运行爬虫生效，是否立即运行？", "提示").then(async () => {
                let resonse = await apiRestart(base_api)
                switch (resonse.status) {
                    case 200: {
                        showMessage("重启成功", "success")
                        break;
                    }
                    default: {
                        showMessage(resonse.message, "error")
                    }
                }
            }).catch(() => {
                showMessage("已取消", "info")
            })
        },
        clear_timer() {
            if (this.timer !== null) {
                clearTimeout(this.timer)
            }
        },
        async run_crawler() {
            const MainStore = useMainStore()
            let base_api = MainStore.get_current_base_api
            let res = await runCrawlNow(base_api)
            switch (res.status) {
                case 200: {
                    let data = res.data
                    if (data.code === 200) {
                        showMessage(data.message, "success")
                        // 状态改为运行中，检查爬虫的运行状态
                        this.status = "运行中"
                        setTimeout(this.check_crawler_status, 5000)
                        this.check_crawler_status()
                    }
                    else showMessage(data.message, "error")
                    break;
                }
                default: {
                    showMessage(res.message, "error")
                }
            }
        },
        async check_crawler_status() {
            const MainStore = useMainStore()
            let base_api = MainStore.get_current_base_api
            let res = await getCrawlerStatus(base_api)
            switch (res.status) {
                case 200: {
                    let data = res.data
                    if (data.status !== "运行中" && data.status !== "未运行" && data.status !== "未知") {
                        this.status = "未知"
                    } else {
                        this.status = data.status
                    } break;
                }
                default: {
                    this.status = "未知"
                }
            }
            this.clear_timer()
            if (this.status === "运行中") {
                // 在运行中每10s检查一次
                this.timer = setTimeout(this.check_crawler_status, 1000 * 10)
            } else {
                // 在非运行状态每60s检查一次
                this.timer = setTimeout(this.check_crawler_status, 1000 * 60)
            }
        }
    }
},



)

export default useStatusStore;


