<template>
    <n-tabs 
        v-model:value="currentTab"
        type="card" 
        tab-style="min-width: 80px;"
        v-if="openTabs.length"
        @update:value="onSelectTab"
        @close="removeTab" closable>
        <n-tab-pane v-for="tab in openTabs" :key="tab.articleId" :tab="tab.title" :name="tab.articleId">
            <n-layout content-style="padding: 24px;">
                <ArticleComponent :article="getArticleData(tab.articleId)"/>
            </n-layout>
        </n-tab-pane>
    </n-tabs>
    <HomeView v-else-if="!openTabs.length || currentIndex == -1" />
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { NTabs, NTabPane, NLayout, NTab } from 'naive-ui'
import ArticleComponent from './ArticleComponent.vue'
import HomeView from '@/views/HomeView.vue'
import store from '../ts/store'
import storage from '@/ts/storage'
import type { Article } from '@/ts/interfaces'
import events from '@/ts/events'

interface TabInfo {
    articleId: string,
    title: string,
    scrollDepth: number,
}

export default defineComponent({
    components: {
        NTabs, NTabPane, NLayout, ArticleComponent, HomeView
    },
    computed : {
        currentTab () {
            return store.currentArticle;
        }
    },
    watch : {
        currentTab(newValue : string, oldValue : string) {
            if(newValue === oldValue)
                return;
            else if(newValue === "home")
                this.setCurrentTab(-1);
            else {
                let index = this.openTabs.findIndex((e) => e.articleId == newValue);
                if(index === -1)
                    this.addTab(store.currentArticle, store.currentTitle);
            }

        }
    },
    data() {
        return {
            openTabs: [] as TabInfo[],
            currentIndex: 0
        }
    },
    beforeMount() {
        this.onSelectTab(store.currentArticle);
    },
    mounted() {
        events.on('updatedArticle', (e) => {
            const data = e as {id : string, article : Article };
            this.updateTab(data.id, { articleId : data.article.id, title : data.article.title });
        });
        // events.on('articlePathUpdated', (e) => {
        //     const data = e as { articleId : string};
        //     this.currentTab = data.articleId;
        // });
    },
    methods: {
        updateTab(id : string, tab : { articleId : string, title : string}) {
            const i = this.openTabs.findIndex(t => t.articleId == id)

            if(i != -1) {
                this.openTabs[i].articleId = tab.articleId;
                this.openTabs[i].title = tab.title;
            }
        },
        getArticleData(id : string) : Article {
            let data = storage.getArticle(id);

            if(data === undefined)
                throw `Error! No article with ID ${id} found!`;
            else
                return data;
        },
        addTab(id: string, title : string) {
            const t = this.openTabs.findIndex((e) => e.articleId == id);
            if (t != -1) {
                this.setCurrentTab(t);
                return;
            }

            let tab : TabInfo = {
                articleId : id,
                title : title,
                scrollDepth : 0
            };

            this.openTabs.push(tab);
            this.setCurrentTab(this.openTabs.length - 1);
        },
        removeTab(id: string) {
            console.log("removing " + id);
            let index = this.openTabs.findIndex((e) => e.articleId === id);
            if (index < 0 || index >= this.openTabs.length)
                return;

            this.openTabs.splice(index, 1);

            if (this.openTabs.length == 0)
                this.setCurrentTab(-1);
            else if (this.currentIndex == index)
                this.setCurrentTab(Math.max(0, this.currentIndex - 1));
        },
        setCurrentTab(index: number) {
            if (index == -1) {
                this.currentIndex = -1;
                store.currentArticle = "home";
            }
            else if (index < this.openTabs.length) {
                this.currentIndex = index;
                store.currentArticle = this.openTabs[index].articleId;
            }

            store.selectedText = "";
        },
        onSelectTab(id: string) {
            this.setCurrentTab(this.openTabs.findIndex((e) => e.articleId === id))
        }
    }
})
</script>