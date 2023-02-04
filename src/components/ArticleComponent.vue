<template>
    <n-layout has-sider>
        <n-layout-sider>
            <n-button @click="() => { isEditing = !isEditing }">Toggle Edit</n-button>
        </n-layout-sider>
        <n-layout>
            <n-space justify="end">
                <n-button v-if="isDirty" @click="onDiscard">Discard</n-button>
                <n-button v-if="isDirty" @click="onSave">Save</n-button>
            </n-space>
        </n-layout>
    </n-layout>
    <div v-if="isEditing">
        <n-space vertical>
            <n-input v-model:value="title" size="large" @input="onTextChange"/>
            <n-input v-model:value="id" @input="onTextChange"/>
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
        <h1 >{{ title }}</h1>
        <h3 >({{ id }})</h3>
        <div v-html="content"></div>
    </div>
</template>

<script lang="ts">
import { NButton, NInput, NLayout, NLayoutSider, NSpace } from 'naive-ui';
import { Quill, QuillEditor, Delta } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { Article } from '@/ts/interfaces';
import { ref, type PropType } from 'vue';
import storage from '@/ts/storage';
import store   from '@/ts/store';

export default {
    components: {
        NButton, NInput, NLayout, NLayoutSider, NSpace, QuillEditor
    },
    props: {
        article : {
            type : Object as PropType<Article>,
            required : true
        }
    },
    data() {
        return {
            cleanArticle : {} as Article,
            title : ref(""),
            id : ref(""),
            content : ref(""),
            isDirty : false,
            isEditing : ref(false),
            editor : Quill
        }
    },
    mounted() {
        this.cleanArticle = this.article;
        this.onDiscard();
    },
    methods: {
        onReady(quill : Quill) { this.editor = quill; },
        onTextChange() {
            if( this.id != this.cleanArticle.id ||
                this.title != this.cleanArticle.title || 
                this.content != this.cleanArticle.content ) {
                    this.isDirty = true;
                }
        },
        onSelectionChange(selection : any) {
            if(!selection || !selection.range) {
                store.selectedText = "";
                return;
            }

            const delta = this.editor.getContents(selection.range.index, selection.range.length) as Delta;
            if(delta.length() == 0)
                store.selectedText = "";
            else
                store.selectedText = (delta.ops[0].insert as string).trim();
        },
        onDiscard() {
            this.isDirty = false;
            this.title = this.cleanArticle.title;
            this.id = this.cleanArticle.id;
            this.content = this.cleanArticle.content;
        },
        onSave() {
            this.isDirty = false;

            if(store.currentArticle == this.cleanArticle.id) {
                store.currentArticle = this.id;
                store.currentTitle = this.title;
            }

            this.cleanArticle = storage.setArticle(this.cleanArticle.id, {
                id : this.id,
                title : this.title,
                parent : this.cleanArticle.parent,
                content : this.content
            });
        }
    }
}
</script>