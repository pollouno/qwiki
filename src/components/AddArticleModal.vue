<template>
    <n-popselect :options="addOptions" placement="right-start" @update-value="onClick">
        <n-button>
            <n-space size="small">
                <n-icon>
                    <plus></plus>
                </n-icon>
            </n-space>
        </n-button>
    </n-popselect>
    <n-modal :show="showModal" preset="dialog" title="New Article"
        positive-text="Create" negative-text="Cancel" @positive-click="submitCallback" @negative-click="cancelCallback">
        <n-space vertical>
            <n-input placeholder="Enter title here..." v-model:value="title"/>
            <n-input placeholder="Enter ID here..." v-model:value="articleId" @change="onArticleIdChange"/>
            <n-select v-if="toAdd == 'article'" :options="collections" v-model:value="collection"/>
        </n-space>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NInput, NModal, NButton, NSelect, NSpace, NIcon, NPopselect } from 'naive-ui'
import { Plus } from '@vicons/tabler'
import store from '@/ts/store'
import { reject } from 'lodash'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import events from '@/ts/events'

export default defineComponent({
    components: {
        NModal, NInput, NIcon, NButton, NSelect, NSpace, Plus, NPopselect
    },
    setup() {
        return {
            title: ref("New Article"),
            articleId: ref("new_article"),
            collection: ref('main'),
            collections: ref([] as SelectMixedOption[]),
            showModal: ref(false),
            isCustomId: ref(false),
            addOptions: [
                { label : 'New Article'   , value : 'article' },
                { label : 'New Collection', value : 'collection' },
            ],
            toAdd : ref('')
        }
    },
    watch : {
        title(newValue) {
            this.onTitleChange(newValue);
        },
        showModal(newValue) {
            if(newValue) {
                if(store.selectedText)
                    this.title = store.selectedText;
                else
                    this.title = "New Article";
                
                this.collection = 'root';
            }
            
            this.onTitleChange(this.title);
        }
    },
    methods : {
        onTitleChange(t : string) {
            this.title = t

            if(this.isCustomId)
                return;

            this.articleId = t.toLowerCase().replace(" ", "_").replace(/[^a-z0-9_]/g, "");
        },
        onArticleIdChange(id : string) {
            if(id === "") {
                this.isCustomId = false;
                this.onTitleChange(this.title);
            }
            else {
                this.articleId = id;
                this.isCustomId = true;
            }
        },
        onClick(value : string) {
            this.toAdd = value;
            this.showModal = true;

            this.collections.length = 0;
            this.$qwiki.project?.collections.forEach(c => 
                this.collections.push({
                    label : c.name == 'root' ? 'Select a collection' : c.name,
                    value : c.id
                }
            ));
        },
        cancelCallback() {
            this.showModal = false;
        },
        submitCallback() {
            this.showModal = false;
            
            switch (this.toAdd) {
                case 'article':
                    this.$qwiki.project?.addArticle(this.articleId, this.title, this.collection);
                    break;
                case 'collection':
                    this.$qwiki.project?.addCollection(this.articleId, this.title);
                    break;
            }

            events.emit('updatedArticles', {});
        }
    }
})
</script>