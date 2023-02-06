<template>
    <ArticleCard v-if="article_card.show"></ArticleCard>

    <div id="cf-container">
        <Header v-if="is_data_loaded"></Header>
        <ArticleBody v-if="is_data_loaded"></ArticleBody>
        <span v-else>与主机通讯中……</span>
    </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Header from '@/components/main/Header/Header.vue'
import ArticleBody from '@/components/main/Article/ArticleBody.vue'
import ArticleCard from '@/components/main/Article/ArticleCard.vue'
import useMainStore from "@/stores/main"
const MainStore = useMainStore();
let { is_data_loaded, article_card } = storeToRefs(MainStore);

</script>
<style>

</style>