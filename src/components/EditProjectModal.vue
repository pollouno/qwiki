<template>
    <n-button @click="showModal = true">
        <n-space size="small" justify="space-between">
            <n-icon><pencil></pencil></n-icon>
            {{ buttonText }}
        </n-space>
    </n-button>
    <n-modal :show="showModal" preset="dialog" title="New Collection"
        positive-text="Submit" negative-text="Cancel" @positive-click="submitCallback" @negative-click="cancelCallback">
        <n-input placeholder="Enter collection ID here..." v-model:value="collectionId" />
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NInput, NModal, NButton, NSpace, NIcon } from 'naive-ui'
import storage from '@/ts/storage'
import { reject } from 'lodash'
import store from '@/ts/store'
import { Pencil } from '@vicons/tabler'

export default defineComponent({
    components: {
        NModal, NInput, NButton, NIcon, NSpace, Pencil
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
            collectionId: ref("new_collection"),
            showModal: ref(false)
        }
    },
    methods : {
        cancelCallback() {
            this.$emit('cancel');
            this.showModal = false;
        },
        submitCallback() {
            this.showModal = false;
            const success = storage.addCollection(this.collectionId) ? false : true;
            
            return new Promise<string | void>((resolve) => {
                if(success) {
                    store.currentCollection = this.collectionId;
                    this.$emit('save');
                    resolve();
                } else {
                    reject(`Collection with ID ${this.collectionId} already exists!`);
                }

            });
        }
    }
})
</script>