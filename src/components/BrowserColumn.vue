<!-- <style>
    .n-divider {
        margin-top: 24px !important;
        margin-bottom: 3px !important;
    }
</style> -->

<template>
    <n-space vertical>
        <add-collection-modal />
        <n-divider style="margin: 10px 0 3px 0;"></n-divider>
        <browser-tree />
    </n-space>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NDivider } from 'naive-ui'
import { NSpace } from 'naive-ui'
import AddCollectionModal from './EditProjectModal.vue'
import BrowserTree from './BrowserTree.vue'

export default defineComponent({
    components: {
       BrowserTree ,NDivider, NSpace, AddCollectionModal
    },
    computed: {
        projectTitle() { return this.$qwiki.project?.name ?? "Unnamed Project"; }
    }
})
</script>