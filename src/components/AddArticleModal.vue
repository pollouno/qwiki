<template>
    <n-popselect :options="addOptions" placement="right-start" @update-value="onClick">
        <n-button>
            <n-space size="small">
                <n-icon>
                    <plus />
                </n-icon>
            </n-space>
        </n-button>
    </n-popselect>
    <n-modal 
        preset="dialog"
        type="info"
        positive-text="Create"
        negative-text="Cancel"
        :title="modalTitle"
        :show="showModal"
        :positive-button-props="{ disabled : !canSave }"
        @positive-click="submitCallback"
        @negative-click="cancelCallback">
        <n-space vertical>
            <n-input placeholder="Enter title here..." v-model:value="title" @input="onTitleChange"/>
            <n-input placeholder="Enter ID here..." v-model:value="id" :status="canSave ? 'success' : 'error'" @input="onArticleIdChange" @update:value="checkValidation"/>
            <n-select v-if="toAdd == 'article'" :options="collections" v-model:value="collection"/>
        </n-space>
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NInput, NModal, NButton, NSelect, NSpace, NIcon, NPopselect } from 'naive-ui'
import { Plus } from '@vicons/tabler'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import events from '@/ts/events'

export default defineComponent({
    components: {
        NModal, NInput, NIcon, NButton, NSelect, NSpace, Plus, NPopselect
    },
    setup() {
        return {
            modalTitle : ref(''),
            title: ref(""),
            id: ref(""),
            collection: ref('main'),
            collections: ref([] as SelectMixedOption[]),
            showModal: ref(false),
            isCustomId: ref(false),
            canSave: ref(true),
            addOptions: [
                { label : 'New Article'   , value : 'article' },
                { label : 'New Collection', value : 'collection' },
            ],
            toAdd : ref('')
        }
    },
    watch : {
        showModal(newValue) {
            if(newValue) {
                switch (this.toAdd) {
                    case 'article':
                        this.modalTitle = 'New Article';
                        //TODO: default title to Quill's selected text
                        this.title = 'New Article';

                        this.id = ''
                        break;
                    case 'collection':
                        this.modalTitle = 'New Collection';
                        this.title = 'New Collection';
                        this.id = ''
                        break;
                }
                
                this.collection = this.$route.params.collection as string ?? 'root';
            }
            
            this.onTitleChange(this.title);
        }
    },
    methods : {
        onTitleChange(t : string) {
            this.title = t;
            if(this.isCustomId)
                return;

            this.id = t.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_]/g, "");
            this.checkValidation();
        },
        onArticleIdChange(id : string) {
            if(id === '') {
                this.isCustomId = false;
                this.onTitleChange(this.title);
            }
            else {
                this.id = id;
                this.isCustomId = true;
            }

            this.checkValidation();
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
        checkValidation() {
            if(this.title === '' || this.id === '') {
                this.canSave = false;
                return;
            }

            this.canSave = this.toAdd === 'article' ?
                !this.$qwiki.project?.articleExists(this.id, this.collection) :
                !this.$qwiki.project?.collectionExists(this.id)
        },
        cancelCallback() {
            this.showModal = false;
        },
        submitCallback() {
            this.showModal = false;
            
            switch (this.toAdd) {
                case 'article':
                    this.$qwiki.project?.addArticle(this.id, this.title, this.collection);
                    break;
                case 'collection':
                    this.$qwiki.project?.addCollection(this.id, this.title);
                    break;
            }

            events.emit('updatedArticles', {});
            this.$qwiki.saveSession();
        }
    }
})
</script>