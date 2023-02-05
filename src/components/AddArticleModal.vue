<template>
    <n-button @click="showModal = true">
        {{ buttonText }}
    </n-button>
    <n-modal :show="showModal" preset="dialog" title="New Article"
        positive-text="Submit" negative-text="Cancel" @positive-click="submitCallback" @negative-click="cancelCallback">
        <n-space vertical>
            <n-input placeholder="Enter title here..." v-model:value="title"/>
            <n-input placeholder="Enter article ID here..." v-model:value="articleId" @change="onArticleIdChange"/>
            <n-select :options="collections" v-model:value="collection"/>
        </n-space>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NInput, NModal, NButton, NSelect, NSpace } from 'naive-ui'
import storage from '@/ts/storage'
import store from '@/ts/store'
import { reject } from 'lodash'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

export default defineComponent({
    components: {
        NModal, NInput, NButton, NSelect, NSpace
    },
    props : {
        buttonText : {
            type : String,
            required : true
        }
    },
    emits : [ 'save', 'cancel' ],
    setup() {
        return {
            title: ref("New Article"),
            articleId: ref("new_article"),
            collection: ref('main'),
            collections: ref([] as SelectMixedOption[]),
            showModal: ref(false),
            isCustomId: ref(false)
        }
    },
    mounted() {
        storage.getCollections().forEach(c => this.collections.push({
           label : c,
           value : c 
        }));
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
                
                this.collection = store.currentCollection;
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
        cancelCallback() {
            this.$emit('cancel');
            this.showModal = false;
        },
        submitCallback() {
            this.showModal = false;
            
            const success = storage.getArticle(this.articleId) ? false : true;
            
            return new Promise<string | void>((resolve) => {
                if(success) {
                    storage.setArticle(this.articleId, { id : this.articleId, title : this.title, content : "", parent : this.collection})
                    store.setCurrentArticle(this.articleId, this.title);

                    this.$emit('save');
                    resolve();
                } else {
                    reject(`Article with ID ${this.articleId} already exists!`);
                }
            });
        }
    }
})
</script>