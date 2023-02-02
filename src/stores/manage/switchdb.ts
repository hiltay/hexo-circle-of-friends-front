import { defineStore } from "pinia";
import { updateGithubEnv, updateVercelEnv, updateServerEnv, apiRestart, readEnvs, updateSettings, dbReset } from "@/interfaces/manage"
import useMainStore from "../main"
import { showMessage, showMessageBoxConfirm } from "@/utils/tooltip"
import useManageHomeStore from "@/stores/manage/home"

const useSwitchDBStore = defineStore("switchdb", {
    state: () => ({
        // 当前数据库
        current_db: null as any,
        // sqlite环境变量
        sqlite_env: {
            GH_NAME: {
                value: "",
                placeholder: "github name",
            },
            GH_EMAIL: {
                value: "",
                placeholder: "github email",
            },
            GH_TOKEN: {
                value: "",
                placeholder: "github access token",
            },
        } as any,
        // leancloud环境变量
        leancloud_env: {
            APPKEY: {
                value: "",
                placeholder: "leancloud的APPKEY",
            },
            APPID: {
                value: "",
                placeholder: "leancloud的APPID",
            },
        } as any,
        // mysql环境变量
        mysql_env: {
            MYSQL_USERNAME: {
                value: "",
                placeholder: "mysql用户名",
            },
            MYSQL_PASSWORD: {
                value: "",
                placeholder: "mysql密码",
            },
            MYSQL_IP: {
                value: "",
                placeholder: "mysql ip地址",
            },
            MYSQL_PORT: {
                value: "",
                placeholder: "mysql端口",
            },
            MYSQL_DB: {
                value: "",
                placeholder: "mysql 数据库名称",
            },
        } as any,
        // mongodb环境变量
        mongodb_env: {
            MONGODB_URI: {
                value: "",
                placeholder: "mongodb连接URI",
            },
        } as any,
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
        async submit_form() {
            let success = true;
            // 确保选择了数据库
            // 拼接请求体
            let body = {} as any;
            if (this.current_db === "sqlite") {
                for (let key in this.sqlite_env) {
                    if (this.sqlite_env[key].value !== "") {
                        body[key] = this.sqlite_env[key].value;
                    } else {
                        showMessage("请确保环境变量已添加", "error")
                        return;
                    }
                }
                body["STORAGE_TYPE"] = "sqlite"
            }
            if (this.current_db === "leancloud") {
                for (let key in this.leancloud_env) {
                    if (this.leancloud_env[key].value !== "") {
                        body[key] = this.leancloud_env[key].value;
                    } else {
                        showMessage("请确保环境变量已添加", "error")
                        return;
                    }
                }
                body["STORAGE_TYPE"] = "leancloud"
            }
            if (this.current_db === "mysql") {
                for (let key in this.mysql_env) {
                    if (this.mysql_env[key].value !== "") {
                        body[key] = this.mysql_env[key].value;
                    } else {
                        showMessage("请确保环境变量已添加", "error")
                        return;
                    }
                }
                body["STORAGE_TYPE"] = "mysql"
            }
            if (this.current_db === "mongodb") {
                for (let key in this.mongodb_env) {
                    if (this.mongodb_env[key].value !== "") {
                        body[key] = this.mongodb_env[key].value;
                    } else {
                        showMessage("请确保环境变量已添加", "error")
                        return;
                    }
                }
                body["STORAGE_TYPE"] = "mongodb"
            }
            const MainStore = useMainStore()
            const ManageHomeStore = useManageHomeStore();
            let base_api = MainStore.get_current_base_api
            // 根据部署方式决定请求url
            if (ManageHomeStore.get_current_settings.DEPLOY_TYPE === "github") {
                // github+vercel部署
                let res = await updateGithubEnv(base_api, body)
                switch (res.status) {
                    case 200: {
                        let data = res.data;
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
                        let data = res.data;
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
                        let data = res.data;
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
            // 更新完环境变量后，更新配置，将DATABASE设置为对应的数据库
            body = {
                DATABASE: this.current_db,
            };

            let res = await updateSettings(base_api, body)
            switch (res.status) {
                case 200: {
                    let data = res.data;
                    if (data.code === 200) {
                        showMessage(data.message, "success")
                    } else {
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

            if (success) {
                // 上传成功，提示是否重启api/爬虫
                this.restart_api(base_api)
            } else {
                showMessage("上传失败！", "error")
            }
        },
        async reset_db() {
            // 如果本地有缓存token，尝试直接使用token登录
            const MainStore = useMainStore()
            let base_api = MainStore.get_current_base_api
            let res = await dbReset(base_api)
            switch (res.status) {
                case 200: {
                    showMessage("重置成功", "success")
                    break;
                }
                default: {
                    showMessage(res.message, "error")
                }
            }
        },
        init_value() {
            const ManageHomeStore = useManageHomeStore();
            this.current_db = ManageHomeStore.get_current_settings.DATABASE;
        }
    }
},



)

export default useSwitchDBStore;


