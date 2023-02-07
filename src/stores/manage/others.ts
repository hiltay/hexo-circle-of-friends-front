import { defineStore } from "pinia";
import { downloadLogs, request_default } from "@/interfaces/manage"
import useMainStore from "../main"
import { showMessage } from "@/utils/tooltip"
import useManageHomeStore from "@/stores/manage/home"

const downloadBlob = (blob: Blob | MediaSource, filename: string) => {
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE doesn't allow using a blob object directly as link href.
        // Workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
        return;
    }
    // Other browsers
    // Create a link pointing to the ObjectURL containing the blob
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
    }, 100);
}


const useOthersStore = defineStore("others", {
    state: () => ({
    }
    ),
    getters: {

    },
    actions: {
        async downloadlogs() {
            const MainStore = useMainStore();
            const ManageHomeStore = useManageHomeStore();
            if (ManageHomeStore.get_current_settings.DEPLOY_TYPE === "github") {
                let res = await downloadLogs(MainStore.get_current_base_api, true)
                switch (res.status) {
                    case 200: {
                        let data = res.data
                        if (data.code === 200) {
                            let download_url = data.path
                            let filename = data.filename
                            let resp = await request_default.get<any>({
                                url: download_url,
                                headers: {
                                    Accept: 'application/json; application/octet-stream'
                                },
                                responseType: 'blob'
                            })
                            const contentType = "application/zip"
                            const blob = new Blob([resp.data], {
                                type: contentType
                            });
                            downloadBlob(blob, filename);
                        } else {
                            showMessage(data.message, "error")
                        }
                        break;
                    }
                    default: {
                        showMessage(res.message, "error")
                    }
                }
            } else {
                // server||docker
                let resp = await downloadLogs(MainStore.get_current_base_api, false)
                switch (resp.status) {
                    case 200: {
                        const contentType = "application/zip"
                        let filename;
                        let re = new RegExp("filename=\"(.+\.zip)\"")
                        let arr = re.exec(resp.headers["content-disposition"])
                        if (arr && arr.length > 1) {
                            filename = arr[1];
                        } else {
                            filename = "pyq_log.zip"
                        }

                        const blob = new Blob([resp.data], {
                            type: contentType
                        });
                        downloadBlob(blob, filename);
                        break;
                    }
                    default: {
                        showMessage(resp.message, "error")
                    }
                }


            }

        }
    }
},



)

export default useOthersStore;


