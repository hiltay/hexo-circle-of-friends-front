<!--
 * @Author: yyyz 904108079@qq.com
 * @Date: 2023-02-06 22:53:59
 * @LastEditors: yyyz && 904108079@qq.com
 * @LastEditTime: 2023-02-06 23:10:20
 * @FilePath: \hexo-circle-of-friends-front\src\components\manage_panel\ManagePanelMain\ManagePanelMain-Others.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by yyyz, All Rights Reserved. 
-->
<template>

<el-button type="info" @click="download_logs">下载运行日志</el-button>
</template>

<script setup lang="ts">
import useOthersStore from "@/stores/manage/others"
const OthersStore = useOthersStore()
function download_logs(){
    OthersStore.downloadlogs()
}
</script>

<style>

</style>