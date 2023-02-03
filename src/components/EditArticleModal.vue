<template>
    <n-button @click="showModal = true">
        {{ buttonText }}
    </n-button>
    <n-modal :show="showModal" preset="dialog" :title="isNewArticle ? 'New Article' : 'Edit article'"
        positive-text="Submit" negative-text="Cancel" @positive-click="submitCallback" @negative-click="cancelCallback">
        <n-input placeholder="Enter title here..." v-model:value="title"/>
        <n-input placeholder="Enter article ID here..." v-model:value="articleId" @change="onArticleIdChange"/>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NInput, NModal, NButton } from 'naive-ui'
import storage from '@/ts/storage'
import store from '@/ts/store'
import { reject } from 'lodash'

export default defineComponent({
    components: {
        NModal, NInput, NButton
    },
    props : {
        buttonText : {
            type : String,
            required : true
        },
        isNewArticle : {
            type : Boolean,
            required : true
        },
        defaultTitle : {
            type : String,
            required : false,
            default : ""
        },
        defaultId : {
            type : String,
            required : false,
            default : ""
        }
    },
    emits : [ 'save', 'cancel' ],
    setup() {
        return {
            title: ref("New Article"),
            articleId: ref("new_article"),
            showModal: ref(false),
            isCustomId: ref(false)
        }
    },
    beforeMount() {
        if(this.defaultId != "") {
            this.isCustomId = true;
            this.articleId  = this.defaultId;
        }
        if(this.defaultTitle != "") {
            this.title = this.defaultTitle;
            this.onTitleChange(this.title);
        }
    },
    watch : {
        title(newValue) {
            this.onTitleChange(newValue);
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

            if(this.isNewArticle) {
                const success = storage.getArticle(this.articleId) ? false : true;
                
                return new Promise<string | void>((resolve) => {
                    if(success) {
                        storage.setArticle(this.articleId, { id : this.articleId, title : this.title, content : "", parent : ""})
                        store.setCurrentArticle(this.articleId, this.title);

                        this.$emit('save');
                        resolve();
                    } else {
                        reject(`Article with ID ${this.articleId} already exists!`);
                    }

                });
            }
            else {
                const success = storage.setArticleMetadata(this.defaultId, this.title, this.articleId);

                return new Promise<string | void>(
                    (resolve, reject) => {
                        if(success) {
                            this.$emit('save');
                            resolve();
                        } else reject(`No Article with ID ${this.defaultId}`);
                    }
                );
            }
        }
    }
})
</script>