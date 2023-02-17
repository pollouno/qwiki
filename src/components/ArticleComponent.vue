<template>
    <n-layout has-sider>
        <n-layout-sider>
            <n-button @click="() => { isEditing = !isEditing }">Toggle Edit</n-button>
        </n-layout-sider>
        <n-layout>
            <n-space justify="end">
                <n-button v-if="isDirty" @click="onDiscard">Discard</n-button>
                <n-button v-if="isDirty" :disabled="!canSave" @click="onSave">Save</n-button>
                <edit-article-menu v-if="isEditing" @move="onMove" @delete="onDelete"/>
            </n-space>
        </n-layout>
    </n-layout>
    <div v-if="isEditing">
        <n-space vertical>
            <n-input v-model:value="title" :style="titleStyle" size="large" @input="onTextChange"/>
            <n-input v-if="!isCollection" v-model:value="id" :status="canSave ? 'success' : 'error'" @input="onTextChange"/>
            <quill-editor
            v-model:content="content"
            content-type="html"
            theme="snow"
            @text-change="onTextChange"
            @selection-change="onSelectionChange"
            @ready="onReady"
            v-if="isEditing"/>
        </n-space>
    </div>
    <div v-else>
        <span>
            <h1> {{ title }} <small v-if="!isCollection" style="font-size: 18px; font-weight: normal;">({{ id }})</small></h1>
        </span>
        <div v-html="content"></div>
    </div>
</template>

<script lang="ts">
import { NButton, NInput, NLayout, NLayoutSider, NSpace, useMessage } from 'naive-ui';
import { Quill, QuillEditor, Delta } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import EditArticleMenu from './EditArticleMenu.vue';
import { ref } from 'vue';
import type { QWikiArticle } from '../ts/qwikiProject'
import events from '@/ts/events';

export default {
    components: {
        NButton, NInput, NLayout, NLayoutSider, NSpace, QuillEditor, EditArticleMenu
    },
    data() {
        return {
            cleanArticle : {} as QWikiArticle,
            title : ref(""),
            id : ref(""),
            content : ref(""),
            isDirty : false,
            isEditing : ref(false),
            canSave : true,
            editor : Quill,
            titleStyle : {
                display: "block",
                fontSize: "2em",
                marginTop: "8px",
                marginBottom: "0",
                fontWeight: "bold"
            }
        }
    },
    computed : {
        routeParams() { console.log(this.$route.params); return this.$route.params; },
        collection()  { return this.$route.params.collection as string ?? 'root'; },
        articleId()   { return this.$route.params.articleId  as string ?? 'home'; },
        isCollection(){ return this.articleId == 'home'; }
    },
    watch : {
        routeParams(newValue) {
            const collection = newValue.collection;
            const articleId  = newValue.articleId;

            const a = this.$qwiki.project?.getArticle(articleId, collection);

            if(a) {
                this.cleanArticle = a;
                this.onDiscard();
            }
            else this.$router.replace('/');
        }
    },
    mounted() {
        const a = this.$qwiki.project?.getArticle(this.articleId, this.collection);

        if(a) {
            this.cleanArticle = a;
            this.onDiscard();
        }
        else this.$router.replace('/');
    },
    methods: {
        onReady(quill : Quill) { this.editor = quill; },
        onTextChange() {
            if( this.id != this.cleanArticle.id ||
                this.title != this.cleanArticle.title || 
                this.content != this.cleanArticle.content ) {
                    this.isDirty = true;
                }

            this.canSave = !this.$qwiki.project?.articleExists(this.id, this.collection) || this.id == this.cleanArticle.id;
        },
        onSelectionChange(selection : Delta) {
            //TODO: save selection somewhere
        },
        onDiscard() {
            this.isDirty = false;
            this.title = this.cleanArticle.title;
            this.id = this.cleanArticle.id;
            this.content = this.cleanArticle.content;
        },
        onSave() {
            this.isDirty = false;
            
            this.$qwiki.project?.editArticle(this.articleId, { id : this.id, title : this.title }, this.collection);
            this.$qwiki.project?.setContents(this.articleId, this.content, this.collection);
            this.cleanArticle.id = this.id;
            this.cleanArticle.title = this.title;
            this.cleanArticle.content = this.content;

            if(this.isCollection)
                this.$qwiki.project?.editCollection(this.collection, { name : this.title })

            this.$qwiki.saveSession();
            events.emit('updatedArticles', {});
        },
        onMove(to : string) {
            this.$qwiki.project?.moveToCollection(this.articleId, to, this.collection);
            this.$router.push(`/${to}/${this.articleId}`);
            
            this.$qwiki.saveSession();
        },
        onDelete() {
            this.$qwiki.project?.removeArticle(this.articleId, this.collection);
            this.$router.replace(`/${this.collection}/`);
            
            this.$qwiki.saveSession();
        }
    }
}
</script>