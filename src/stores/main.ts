import { defineStore } from "pinia";

import DefaultConfig from '@/utils/Config';

const useMainStore = defineStore("main", {
    state: () => ({
        url: DefaultConfig.private_api_url
    }),
    actions: {
        toggle_url() {
            this.url = "https://fcircle-pub.rct.cool/"
        }
    },
});

export default useMainStore;