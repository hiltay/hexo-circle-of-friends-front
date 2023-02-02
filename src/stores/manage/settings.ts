import { defineStore } from "pinia";
import _ from 'lodash'
import { updateSettings, dbReset, apiRestart } from "@/interfaces/manage"
import useMainStore from "../main"
import { showMessage, showMessageBoxConfirm } from "@/utils/tooltip"
import { arraydeepEqual } from "@/utils/tools"
import useManageHomeStore from "@/stores/manage/home"

const useSettingsStore = defineStore("settings", {
    state: () => ({
        // todo 暂存http代理配置 http代理更改env环境
        form: {
            LINK: "" as any,
            BLOCK_SITE: [""] as Array<string>,
            OUTDATE_CLEAN: "",
            HTTP_PROXY: "",
        }
    }
    ),
    getters: {

    },
    actions: {
        // 添加一条LINK项
        add_link() {
            this.form.LINK.push({
                link: "",
                theme: "",
            });
        },
        // 删除一条LINK项
        del_link(index: number) {
            this.form.LINK.splice(index, 1);
        },
        // 添加一条BLOCK_SITE项
        add_blocksite() {
            this.form.BLOCK_SITE.push("");
        },
        // 删除一条BLOCK_SITE项
        del_blocksite(index: number) {
            this.form.BLOCK_SITE.splice(index, 1);
        },
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

        async submit_form() {
            // 过滤block_site
            let block_site = []
            for (let i = 0; i < this.form.BLOCK_SITE.length; i++) {
                if (this.form.BLOCK_SITE[i] !== "") {
                    block_site.push(this.form.BLOCK_SITE[i])
                }
            }
            this.form.BLOCK_SITE = block_site
            let body = this.form;
            const MainStore = useMainStore()
            const ManageHomeStore = useManageHomeStore();
            let base_api = MainStore.get_current_base_api
            let res = await updateSettings(base_api, body)
            switch (res.status) {
                case 200: {
                    let data = res.data;
                    if (data.code === 200) {
                        showMessage(data.message, "success")
                        // 重置数据库提醒
                        if (!arraydeepEqual(body.LINK, ManageHomeStore.get_current_settings.LINK)) {
                            showMessageBoxConfirm("检测到抓取起始url有变化，是否需要重置数据库？", "提示").then(async () => {
                                // 重置数据库，删除文章和友链表
                                let resp = await dbReset(base_api)
                                switch (resp.status) {
                                    case 200: {
                                        showMessage("重置成功", "success")
                                        this.restart_api(base_api)
                                        break;
                                    }

                                    default: {
                                        showMessage(resp.message, "error")
                                    }
                                }
                            }).catch(() => {
                                showMessage("已取消", "info")
                                this.restart_api(base_api)
                            })
                        } else {
                            // 上传成功，提示是否重启api/爬虫
                            this.restart_api(base_api)
                        }

                        break;
                    }
                }
                default: {
                    showMessage(res.message, "error")
                }
            }
        },

        init_value() {
            const ManageHomeStore = useManageHomeStore();
            let current_settings = ManageHomeStore.get_current_settings
            this.form.LINK = _.cloneDeep(current_settings.LINK)
            if (current_settings.BLOCK_SITE.length > 0) {
                this.form.BLOCK_SITE = _.cloneDeep(current_settings.BLOCK_SITE)
            }
            this.form.OUTDATE_CLEAN = current_settings.OUTDATE_CLEAN
            this.form.HTTP_PROXY = current_settings.HTTP_PROXY
        }
    }

}
)

export default useSettingsStore;


