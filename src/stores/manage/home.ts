import { defineStore } from "pinia";
import { readSettings, backendVersion } from "@/interfaces/manage"
import { request_default } from "@/interfaces/index"
import useMainStore from "../main"
import packagejson from "../../../package.json"
import { showMessage, showNotification } from "@/utils/tooltip"
const useManageHomeStore = defineStore("managehome", {
    state: () => ({
        // 当前选项卡
        current_tab: "settings",
        // 当前配置
        current_settings: null as any,
        // 每个组件的唯一key，用于内部组件刷新
        component_keys: {
            settings: 0,
            envs: 0,
            links: 0,
            switchdb: 0,
            status: 0
        } as any
    }
    ),
    getters: {
        get_current_settings(): any {
            return this.current_settings;
        }

    },
    actions: {
        // 获取当前朋友圈配置信息
        async read_current_settings() {
            const MainStore = useMainStore()
            let res = await readSettings(MainStore.get_current_base_api)
            switch (res.status) {
                case 200: {
                    let data = res.data
                    if (data.code === 200) {
                        this.current_settings = data.current_settings
                        break
                    }
                }
                default: {
                    showMessage(res.message, "error")
                }
            }
        },
        async version_check() {
            // 版本更新检测提示
            const MainStore = useMainStore()
            this.read_current_settings()
            // 后端版本检测
            let res = await backendVersion(MainStore.get_current_base_api)
            let data = res.data
            if (data && data.status === 1) {
                let title = '版本更新提示'
                let message = '检测到后端新版本：' + data.latest_version + '，然而当前版本为：' + data.current_version + '，请及时更新后端版本'
                showNotification(title, message, "warning")
            }
            // 前端版本检测
            res = await request_default.get<any>({
                url: "https://fcircle-doc.yyyzyyyz.cn/front_version.txt"
            });
            data = res.data
            if (data && data !== packagejson.version) {
                let title = '版本更新提示'
                let message = '检测到前端新版本：' + data + '，然而当前版本为：' + packagejson.version + '，请及时更新前端版本'
                showNotification(title, message, "warning")
            }
        },
        refresh_component(component_name: string) {
            // 刷新内部的组件
            // 重新获取当前配置
            this.read_current_settings()
            // 变更key值，刷新内部组件
            this.component_keys[component_name]++

        },


    }

}
)

export default useManageHomeStore;


