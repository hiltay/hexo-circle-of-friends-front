import { defineStore } from "pinia";
import { updateGithubEnv, updateVercelEnv, updateServerEnv, apiRestart, readEnvs } from "@/interfaces/manage"
import useMainStore from "../main"
import { showMessage, showMessageBoxConfirm } from "@/utils/tooltip"
import useManageHomeStore from "@/stores/manage/home"

const useEnvsStore = defineStore("envs", {
    state: () => ({

        // 环境变量配置
        all_env: {
            PROXY: {
                value: "",
                placeholder: "http代理"
            },
            APPKEY: {
                value: "",
                placeholder: "leancloud的APPKEY"
            },
            APPID: {
                value: "",
                placeholder: "leancloud的APPID"
            },
            MYSQL_USERNAME: {
                value: "",
                placeholder: "mysql用户名"
            },
            MYSQL_PASSWORD: {
                value: "",
                placeholder: "mysql密码"
            },
            MYSQL_IP: {
                value: "",
                placeholder: "mysql ip地址"
            },
            MYSQL_PORT: {
                value: "",
                placeholder: "mysql端口"
            },
            MYSQL_DB: {
                value: "",
                placeholder: "mysql 数据库名称"
            },
            GH_NAME: {
                value: "",
                placeholder: "github name"
            },
            GH_EMAIL: {
                value: "",
                placeholder: "github email"
            },
            GH_TOKEN: {
                value: "",
                placeholder: "github access token"
            },
            MONGODB_URI: {
                value: "",
                placeholder: "mongodb连接URI"
            },
        } as any,
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

        async submit_form() {
            // 拼接请求体
            let body: any = {}
            for (let key in this.all_env) {
                if (this.all_env[key].value !== "") {
                    body[key] = this.all_env[key].value
                }
            }
            let success = true
            const MainStore = useMainStore()
            const ManageHomeStore = useManageHomeStore();
            let base_api = MainStore.get_current_base_api
            // 根据部署方式决定请求url
            if (ManageHomeStore.get_current_settings.DEPLOY_TYPE === "github") {
                // github+vercel部署
                let res = await updateGithubEnv(base_api, body)
                switch (res.status) {
                    case 200: {
                        let data = res.data
                        if (data.code !== 200) {
                            showMessage(data.message, "error")
                            success = false;
                        }
                        break;
                    }
                    default: {
                        showMessage(res.message, "error")
                        success = false;
                    }
                }

                res = await updateVercelEnv(base_api, body)
                switch (res.status) {
                    case 200: {
                        let data = res.data
                        if (data.code !== 200) {
                            showMessage(data.message, "error")
                            success = false;
                        }
                        break;
                    }
                    default: {
                        showMessage(res.message, "error")
                        success = false;
                    }
                }
            } else {
                // server或docker
                let res = await updateServerEnv(base_api, body)
                switch (res.status) {
                    case 200: {
                        let data = res.data
                        if (data.code !== 200) {
                            showMessage(data.message, "error")
                            success = false;
                        }
                        break;
                    }
                    default: {
                        showMessage(res.message, "error")
                        success = false;
                    }
                }
            }
            if (success) {
                // 上传成功，提示是否重启api/爬虫
                this.restart_api(base_api)
            }
        },
        async init_value() {
            const MainStore = useMainStore()
            const ManageHomeStore = useManageHomeStore();
            let base_api = MainStore.get_current_base_api
            if (ManageHomeStore.get_current_settings.DEPLOY_TYPE === "github") {
                this.all_env["STORAGE_TYPE"] = {
                    value: "",
                    placeholder: "存储方式"
                }
                this.all_env["VERCEL_ACCESS_TOKEN"] = {
                    value: "",
                    placeholder: "vercel访问令牌"
                }
            } else if (ManageHomeStore.get_current_settings.DEPLOY_TYPE === "server") {
                this.all_env["EXPOSE_PORT"] = {
                    value: "",
                    placeholder: "api端口，默认：8000"
                }
                this.all_env["RUN_PER_HOURS"] = {
                    value: "",
                    placeholder: "爬虫运行小时间隔，默认：6"
                }
            } else {
                // docker 部署
                this.all_env["RUN_PER_HOURS"] = {
                    value: "",
                    placeholder: "爬虫运行小时间隔，默认：6"
                }
            }
            // 获取env
            let res = await readEnvs(base_api)
            switch (res.status) {
                case 200: {
                    let data = res.data
                    if (data.code === 200) {
                        // 更新env
                        for (let key in data.current_envs) {
                            if (this.all_env[key] && data.current_envs[key] !== null) {
                                this.all_env[key].value = data.current_envs[key]
                            }
                        }

                    }else showMessage(data.message, "error");
                    break;

                }
                default: {
                    showMessage(res.message, "error")
                }
            }
        }
    }
},



)

export default useEnvsStore;


