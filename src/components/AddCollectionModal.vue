<template>
    <n-button @click="showModal = true">
        {{ buttonText }}
    </n-button>
    <n-modal :show="showModal" preset="dialog" title="New Collection"
        positive-text="Submit" negative-text="Cancel" @positive-click="submitCallback" @negative-click="cancelCallback">
        <n-input placeholder="Enter article ID here..." v-model:value="collectionId" />
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NInput, NModal, NButton } from 'naive-ui'
import storage from '@/ts/storage'
import { reject } from 'lodash'
import store from '@/ts/store'

export default defineComponent({
    components: {
        NModal, NInput, NButton
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