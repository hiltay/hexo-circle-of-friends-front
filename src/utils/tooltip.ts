import { ElMessage } from "element-plus";

export function showMessage(message: string, type: any) {
    ElMessage({
        message:message,
        type: type
    });
}