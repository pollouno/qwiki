<template>
    <n-popover trigger="hover" @click="showModal = true">
        <template #trigger>
            <h1 style="text-align: center;">{{ projectTitle }}</h1>
        </template>
        <span>
            <n-space justify="center">
                <n-icon><pencil/></n-icon>
                Edit
            </n-space>
        </span>
    </n-popover>
    <n-space style="margin-bottom: 12px;" justify="center">
        <n-button @click="showModal = true">
            <n-space size="small" justify="space-between">
                <n-icon><upload></upload></n-icon>
                Import
            </n-space>
        </n-button>
        <n-button @click="showModal = true">
            <n-space size="small" justify="space-between">
                <n-icon><download></download></n-icon>
                Export
            </n-space>
        </n-button>
    </n-space>
    <n-modal 
        preset="dialog"
        title="New Collection"
        positive-text="Submit"
        negative-text="Cancel"
        :show="showModal"
        @positive-click="submitCallback"
        @negative-click="cancelCallback" >
        
    </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NInput, NModal, NButton, NSpace, NIcon, NPopover } from 'naive-ui'
import { Upload, Download, Pencil } from '@vicons/tabler'

export default defineComponent({
    components: {
        NPopover, NModal, NButton, NIcon, NSpace, Pencil, Upload, Download
    },
    setup() {
        return {
            showModal: ref(false)
        }
    },
    computed : {
        projectTitle() { return this.$qwiki.project?.name ?? "Unnamed Project"; }
    },
    methods : {
        cancelCallback() {
            this.showModal = false;
        },
        submitCallback() {
            this.showModal = false;
            

        }
    }
})
</script>