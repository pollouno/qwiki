<template>
    <n-button @click="() => { isEditing = !isEditing }">Toggle Edit</n-button>
    <n-button v-if="isDirty && isEditing" @click="onDiscard">Discard</n-button>
    <n-button v-if="isDirty && isEditing" @click="onSave">Save</n-button>
    <h1>{{ innerArticle.title }}</h1>
    <QuillEditor @text-change="onTextChange" :content="content" theme="snow" />
</template>

<script lang="ts">
import type { Article } from '@/ts/interfaces';
import { NButton } from 'naive-ui';
import { ref, type PropType } from 'vue';
import storage from '@/ts/storage';

export default {
    components: {
        NButton
    },
    props: {
        article: { type: Object as PropType<Article>, required: true }
    },
    data() {
        return {
            innerArticle: this.article,
            content: ref(""),
            isDirty: ref(false),
            isEditing: ref(false)
        }
    },
    beforeMount() {
        this.content = this.innerArticle.content;
    },
    methods: {
        onTextChange() {
            this.isDirty = true;
        },
        onDiscard() {
            this.isDirty = false;
            this.content = this.innerArticle.content;
        },
        onSave() {
            this.isDirty = false;
            this.innerArticle = storage.setArticle(this.innerArticle.id, {
                id : this.innerArticle.id,
                title : this.innerArticle.title,
                content : this.content,
                parent : this.innerArticle.parent
            });

            console.log("OnSave -->");
            console.log(this.innerArticle);

            this.onDiscard();
        }
    }
}
</script>