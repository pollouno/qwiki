<template>
    <edit-article-modal button-text="Create new article" is-new-article @save="onCreateArticleSave"/>
    <n-input v-model:value="pattern" placeholder="Search" />
    <n-tree
        block-line 
        :show-irrelevant-nodes="false"
        :pattern="pattern"
        :data="data"
        @update:selected-keys="(onSelect as OnUpdateSelectedKeys)" draggable />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { TreeOption } from 'naive-ui'
import { NInput, NTree } from 'naive-ui'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OnUpdateSelectedKeys } from 'naive-ui/es/tree/src/Tree'
import EditArticleModal from './EditArticleModal.vue'
import store from '@/ts/store'
import storage from '@/ts/storage'
import events from '@/ts/events'

function createData(): TreeOption[] | undefined {
    const data = [] as TreeOption[];
    const parentArticles = storage.getChildArticles(""); 
    
    for (let i = 0; i < parentArticles.length; i++) {
        const article = parentArticles[i];
        
        data.push({ key : article.id, label: article.title, children: getChildren(article.id)})
    }

    return data;
}

function getChildren(id : string) {
    const articles = storage.getChildArticles(id);

    if(articles.length == 0)
        return undefined;

    const children = [] as TreeOption[];

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        
        children.push({ name : article.id, label: article.title, children: getChildren(id)})
    }
}

export default defineComponent({
    components: {
        NTree, NInput, EditArticleModal
    },
    methods: {
        onSelect(keys: Array<string | number>, option: Array<TreeOption | null>, meta: { node: TreeOption, action: 'select' | 'unselect' }) {
            store.setCurrentArticle(meta.node.key as string, meta.node.label as string);
        },
        onCreateArticleSave() {
            this.data = createData();
            this.$forceUpdate();
        }
    },
    setup() {
        return {
            data: createData(),
            pattern: ref('')
        }
    },
    mounted() {
        events.on('updatedArticle', () => this.onCreateArticleSave() );
    }
})
</script>