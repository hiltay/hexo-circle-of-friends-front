import { defineStore } from "pinia";
import { manageLogin, loginWithToken } from "@/interfaces/manage"
import useMainStore from "../main"
import cache from "@/utils/cache"
import { showMessage } from "@/utils/tooltip"

const useLoginStore = defineStore("login", {
    state: () => ({
        // 登录页面是否展示
        is_login_page_open: true,
        // 登录框密码
        password: ""

    }),
    getters: {

    },
    actions: {
        show_login_page() {
            // 展示登录页面
            this.is_login_page_open = true;
        },
        close_login_page() {
            // 不展示登录页面
            this.is_login_page_open = false;
        },
        async login() {
            const MainStore = useMainStore();
            let res = await manageLogin(MainStore.get_current_base_api, this.password)
            switch (res.status) {
                case 200: {
                    let data = res.data
                    if (data.code === 200) {
                        this.is_login_page_open = false;
                        cache.setCache("fcircle-token", data.token)
                        showMessage("登录成功", "success")
                    }else{
                        showMessage("密码错误", "error")
                    }
                    break;
                }
                default: {
                    showMessage(res.message, "error")
                }
            }
        },
        async login_with_token() {
            const MainStore = useMainStore();
            let res = await loginWithToken(MainStore.get_current_base_api)
            switch (res.status) {
                case 200: {
                    if (res.data.code === 200) {
                        this.is_login_page_open = false;
                        break;
                    }
                }
                default: {
                    // console.log(res.message)
                    break;
                }
            }
        },
        logout(){
            // 登出
            cache.deleteCache("fcircle-token")
            this.is_login_page_open = true;
            showMessage("已退出登录", "success")
        }

    }

}
)

export default useLoginStore;