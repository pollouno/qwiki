<script lang="ts">
import BrowserColumn from "./components/BrowserColumn.vue";
import { NLayout, NLayoutSider, NLayoutContent, NConfigProvider } from "naive-ui";
import { darkTheme } from "naive-ui";
import events from "./ts/events";
import storage from "./ts/storage";
import store from "./ts/store";

export default {
    data() {
        return { darkTheme : darkTheme }
    },
    components : {
        NConfigProvider, NLayout, NLayoutSider, BrowserColumn, NLayoutContent
    },
    computed : {
        path() { return this.$route.path }
    },
    mounted() {
        this.$qwiki.createProject("new_project", "New Project");
    },
    watch : {
        path() {
            const collection = this.$route.params.collection as string;
            const article    = this.$route.params.articleId  as string;
            
            if(storage.collectionExists(collection) && storage.articleExists(article))
                this.handleNewArticleRoute(collection, article);
        }
    },
    methods : {
        handleNewArticleRoute(collection : string, article : string) {
            if(store.currentCollection != collection) {
                store.currentCollection = collection;
                events.emit('collectionRouteUpdated', { collection : collection });
            }
            if(store.currentArticle != article) {
                const a = storage.getArticle(article);
                store.setCurrentArticle(a?.id as string, a?.title as string);
                events.emit('articleRouteUpdated'   , { articleId  : article, title : a?.title });
            }
        }
    }
}
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <n-layout has-sider style="height: 100%">
            <n-layout-sider :width="290" content-style="padding: 12px" bordered>
                <BrowserColumn/>
            </n-layout-sider>
            <n-layout-content content-style="padding: 12px;">
                <!-- <MainColumn/> -->
                <RouterView />
            </n-layout-content>
        </n-layout>
    </n-config-provider>
</template>