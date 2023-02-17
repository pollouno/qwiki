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
        <n-button @click="importFile">
            <n-space size="small" justify="space-between">
                <n-icon><upload></upload></n-icon>
                Import
            </n-space>
        </n-button>
        <input type="file" accept=".qwiki" style="display: none;" ref="fileInput" @change="onFileImported"/>
        <n-button @click="onExport">
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
import events from '@/ts/events'

export default defineComponent({
    components: {
        NPopover, NModal, NButton, NIcon, NSpace, Pencil, Upload, Download
    },
    setup() {
        return {
            showModal: ref(false),
            fileInput: ref()
        }
    },
    computed : {
        projectTitle() { return this.$qwiki.project?.name ?? "Unnamed Project"; }
    },
    methods : {
        importFile() {
            this.fileInput.click();
        },
        onFileImported(event : any) {
            const files = event?.target?.files;

            if(!files) {
                console.error('Error reading project file!');
                return;
            }

            const fileReader = new FileReader();
            
            fileReader.addEventListener('load', () => {
                if(this.$qwiki.loadFromFile(fileReader.result as string)) {
                    console.log(`Project ${this.$qwiki.project?.name} loaded successfully!`);
                    events.emit('updatedArticles', {});
                }
                else
                    console.error('Error processing project file!');
            });
            fileReader.readAsText(files[0]);
        },
        onExport() {
            const project = JSON.stringify(this.$qwiki.getProjectFile());
            const url = window.URL.createObjectURL(
                new Blob([ project ], { type : 'text/plain' })
            );
            //TODO: add 'save to...' functionality.
            const link = document.createElement('a')
            link.href = url;
            link.setAttribute('download', `${this.$qwiki.project?.id}.qwiki`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        cancelCallback() {
            this.showModal = false;
        },
        submitCallback() {
            this.showModal = false;
        }
    }
})
</script>