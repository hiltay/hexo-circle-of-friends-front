import { defineStore } from "pinia";
import { updateGithubEnv, updateVercelEnv, updateServerEnv, apiRestart, readEnvs, updateSettings, dbReset } from "@/interfaces/manage"
import useMainStore from "../main"
import { showMessage, showMessageBoxConfirm } from "@/utils/tooltip"
import useManageHomeStore from "@/stores/manage/home"

const useLinksStore = defineStore("links", {
    state: () => ({
        // 当前是否开启自定义友链
        enable: false as any,
        list: [] as any,
        json_api: "" as any
    }
    ),
    getters: {

    },
    actions: {
        async restart_api(base_api: string) {
            // 上传成功，提示是否重启api/爬虫
            showMessageBoxConfirm("更新环境变量成功，重启程序后生效，是否立即重启？", "提示").then(async () => {
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
        add_link() {
            this.list.push([
                "", "", ""
            ]);
        },
        // 删除一条配置项友链
        del_link(index: number) {
            this.list.splice(index, 1);
        },
        // 提交表单
        async submit_form() {
            // 拼接body
            let body = {} as any
            body["enable"] = this.enable
            body["json_api"] = this.json_api
            let list_ = [] as any
            // 过滤掉全部为空的项
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i][0] === this.list[i][1] === this.list[i][2] === "") {
                    continue
                } else {
                    list_.push(this.list[i])
                }
            }
            body["list"] = list_
            // 封装请求体
            let request_body = { "SETTINGS_FRIENDS_LINKS": body }
            const MainStore = useMainStore()
            let base_api = MainStore.get_current_base_api
            let res = await updateSettings(base_api, request_body)
            switch (res.status) {
                case 200: {
                    let data = res.data
                    if (data.code === 200) {
                        showMessage(data.message, "success")
                    } else {
                        showMessage(data.message, "error")
                    }
                    break;
                }
                default: {
                    showMessage(res.message, "error")
                }

            }
        },
        init_value() {
            const ManageHomeStore = useManageHomeStore();
            this.enable = ManageHomeStore.get_current_settings.SETTINGS_FRIENDS_LINKS.enable
            this.list = []
            for (let i = 0; i < ManageHomeStore.get_current_settings.SETTINGS_FRIENDS_LINKS.list.length; i++) {
                // 读取远程配置，添加现有的配置项友链
                let item = ManageHomeStore.get_current_settings.SETTINGS_FRIENDS_LINKS.list[i]
                if (item.length === 3) {
                    // 未携带suffix
                    this.list.push([item[0], item[1], item[2]])
                } else if (item.length === 4) {
                    // 携带suffix
                    this.list.push([item[0], item[1], item[2], item[3]])
                }
            }
            this.json_api = ManageHomeStore.get_current_settings.SETTINGS_FRIENDS_LINKS.json_api
        }
    }
},



)

export default useLinksStore;


