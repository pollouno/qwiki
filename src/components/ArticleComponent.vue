<template>
    <h1>{{ cleanArticle.title }}</h1>
    
    <n-button @click="() => { isEditing = !isEditing }">Toggle Edit</n-button>
    <n-button v-if="isDirty && isEditing" @click="onDiscard">Discard</n-button>
    <n-button v-if="isDirty && isEditing" @click="onSave">Save</n-button>
    <quill-editor
        v-model:content="content"
        content-type="html"
        theme="snow"
        @text-change="onTextChange"
        @selection-change="onSelectionChange"
        v-if="isEditing"/>
    <div v-if="!isEditing" v-html="content"></div>
</template>

<script lang="ts">
import { NButton } from 'naive-ui';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { Article } from '@/ts/interfaces';
import { ref, type PropType } from 'vue';
import storage from '@/ts/storage';

export default {
    components: {
        NButton, QuillEditor
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
            isDirty : false,
            isEditing : ref(true),
            content : ref("")
        }
    },
    mounted() {
        this.cleanArticle = this.article;
        this.onDiscard();
    },
    methods: {
        onTextChange() {
            this.isDirty = true;
        },
        onSelectionChange(selection : any) {
            console.log(this.content.substring(selection.range.index, selection.range.length));
        },
        onDiscard() {
            this.isDirty = false;
            this.content = this.cleanArticle.content;
        },
        onSave() {
            this.isDirty = false;
            this.cleanArticle = storage.setArticle(this.cleanArticle.id, {
                id : this.cleanArticle.id,
                title : this.cleanArticle.title,
                parent : this.cleanArticle.parent,
                content : this.content
            });
        }
    }
}
</script>