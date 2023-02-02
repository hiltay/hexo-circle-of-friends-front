import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
export function showMessage(message: string, type: any) {
    ElMessage({
        message: message,
        type: type
    });
}

export function showMessageBoxConfirm(message: string, type: any) {
    return ElMessageBox.confirm(
        message,
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: type,
        }
    )
}

export function showNotification(title: string, message: string, type: any) {
    return ElNotification({
        title: title,
        message: message,
        type: type,
    })
}