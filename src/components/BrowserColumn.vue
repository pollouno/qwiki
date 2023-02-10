<!-- <style>
    .n-divider {
        margin-top: 24px !important;
        margin-bottom: 3px !important;
    }
</style> -->

<template>
    <n-space vertical>
        <h1 style="text-align: center;">Project Name</h1>
        <!-- <n-button style="margin: 2px; width: auto;"> <Home></Home> </n-button> -->
        <n-space style="margin-bottom: 12px;" :size="2" justify="space-around">
            <add-article-modal button-text="New Article" @save="onCreateArticleSave"/>
            <add-collection-modal button-text="Edit Project" @save="onCreateCollectionSave"/>
        </n-space>
        <n-select :options="collections" v-model:value="currentCollection"/>
        <n-divider style="margin: 10px 0 3px 0;"></n-divider>
        <n-input v-model:value="pattern" placeholder="Search" />
        <n-tree
            block-line 
            :show-irrelevant-nodes="false"
            :pattern="pattern"
            :data="data"
            @update:selected-keys="(onSelect as OnUpdateSelectedKeys)"
            @drop="onDrop"
            virtual-scroll
            draggable />
    </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NDivider, type TreeDropInfo, type TreeOption } from 'naive-ui'
import { NInput, NTree, NSelect, NSpace } from 'naive-ui'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OnUpdateSelectedKeys } from 'naive-ui/es/tree/src/Tree'
import AddArticleModal from './AddArticleModal.vue'
import AddCollectionModal from './EditProjectModal.vue'
import store from '@/ts/store'
import storage from '@/ts/storage'
import events from '@/ts/events'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

function createData(collection : string): TreeOption[] | undefined {
    const data = [] as TreeOption[];
    const parentArticles = storage.getChildArticles(collection); 
    
    for (let i = 0; i < parentArticles.length; i++) {
        const article = parentArticles[i];
        
        data.push({ key : article.id, label: article.title/*, children: getChildren(article.id)*/})
    }

    return data;
}

export default defineComponent({
    components: {
        NTree, NInput, NSelect, NDivider, NSpace, AddArticleModal, AddCollectionModal
    },
    methods: {
        setCollections() {
            this.collections.splice(0, this.collections.length);
            storage.getCollections().forEach(c => {
                this.collections.push({ value : c, label : c });
            });

            console.log(this.collections);
        },
        onSelect(keys: Array<string | number>, option: Array<TreeOption | null>, meta: { node: TreeOption, action: 'select' | 'unselect' }) {
            store.setCurrentArticle(meta.node.key as string, meta.node.label as string);
        },
        onCreateCollectionSave() {
            this.setCollections();
            this.onCreateArticleSave();
        },
        onCreateArticleSave() {
            this.data = createData(this.currentCollection);
            this.$forceUpdate();
        },
        onDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
            console.log({ node, dragNode, dropPosition});
        }
    },
    setup() {
        return {
            data: createData('main'),
            pattern: ref(''),
            currentCollection: ref('main'),
            collections: ref([] as SelectMixedOption[])
        }
    },
    watch : {
        currentCollection() {
            this.onCreateArticleSave();
            store.currentCollection = this.currentCollection;
        }
    },
    mounted() {
        this.setCollections();
        events.on('updatedArticle'     , () => this.onCreateArticleSave() );
        events.on('createdCollection', (e)  =>{
            const data = e as { id : string };
            this.currentCollection = data.id;
            this.onCreateCollectionSave();
        });
        events.on('collectionRouteUpdated', (e) => {
            const data = e as { collection : string };

            this.currentCollection = data.collection;
            this.onCreateCollectionSave();
        });
    }
})
</script>