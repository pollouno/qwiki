<template>
    <n-popselect :options="options" @update:value="onAction" trigger="click" :show-checkmark="false">
        <n-button>Actions...</n-button>
    </n-popselect>
    <n-modal
        v-model:show="showMoveModal"
        preset="dialog"
        @positive-click="onMove"
        @negative-click="() => { showMoveModal = false }"
        title="Move to..."
        positive-text="Move"
        negative-text="Cancel"
    >
        <n-select v-model:value="moveTo" :options="collections"/>
    </n-modal>
    <n-modal
        v-model:show="showDeleteModal"
        preset="confirm"
        title="Delete Article?"
        @positive-click="onDelete"
        @negative-click="() => { showDeleteModal = false }"
        positive-text="Delete"
        negative-text="Cancel"
    />
</template>
<script lang="ts">
import { NButton, NPopselect, NModal, NSelect } from 'naive-ui';
import { ref } from 'vue';

export default {
    data() {
        return {
            showMoveModal   : ref(false),
            showDeleteModal : ref(false),
            moveTo : ref(''),
            options : [
                { label : 'Move to...', value : 'move' },
                { label : 'Delete Article', value : 'delete' }
            ]
        }
    },
    computed : {
        collections() {
            const arr = [] as { label : string, value : string }[];

            this.$qwiki.project?.collections.forEach(c => {
                arr.push({ label : c.name == 'root' ? 'Select a collection' : c.name, value : c.id });
            });

            return arr;
        }
    },
    components : {
        NButton, NPopselect, NSelect, NModal
    },
    emits : [ 'delete', 'move' ],
    methods : {
        onAction(value : string) {
            switch (value) {
                case 'move':
                    this.moveTo = this.$route.params.collection as string ?? 'root';
                    this.showMoveModal = true;
                    break;
                case 'delete':
                    this.showDeleteModal = true;
                    break;
            }
        },
        onDelete() {
            this.$emit('delete');
        },
        onMove() {
            this.$emit('move', this.moveTo);
        }
    }
}
</script>