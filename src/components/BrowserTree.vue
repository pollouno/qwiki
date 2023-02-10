<template>
    <n-input v-model:value="search" placeholder="Search"/>
    <add-article-modal />
    <n-tree
        :data="treeData"
        :pattern="search"
        :show-irrelevant-nodes="false"
        v-model:selected-keys="selected"
        @drop="onDrop"
        block-line
        virtual-scroll
        draggable
    />
</template>

<script lang="ts">
import events from '@/ts/events';
import { NInput, NTree, type TreeDropInfo, type TreeOption } from 'naive-ui';
import AddArticleModal from './AddArticleModal.vue';
import { ref } from 'vue';

    export default {
        data() {
            return {
                search : ref(''),
                treeData : [] as TreeOption[],
                selected : [] as string[]
            }
        },
        mounted() {
            this.getTreeData();
            events.on('updatedArticles', () => { this.getTreeData(); })
        },
        components : {
            NTree, NInput, AddArticleModal
        },
        methods : {
            getTreeData() {
                const data = [] as TreeOption[];

                this.$qwiki.project?.getCollection()?.articles.forEach(a => {
                    data.push({
                        label : a.title,
                        key : 'root:'+ a.id
                    })
                });
                this.$qwiki.project?.collections.forEach(c => {
                    if(c.id == 'root')
                        return;
                    
                    const children = [] as TreeOption[];

                    c.articles.forEach(a => {
                        children.push({
                            label : a.title,
                            key : `${c.id}:${a.id}`
                        });
                    });

                    data.push({
                        label : c.name,
                        key : c.id+':',
                        children : children
                    });
                });

                console.log("Got TreeData!", data);

                this.treeData = data;
            },
            onDrop(info : TreeDropInfo) {
                if(!this.$qwiki.project)
                    return;

                const fromKey = (info.dragNode.key as string).split(':');
                const toKey   = (info.node.key as string).split(':');

                const from = {
                    isCollection : fromKey[1] == "",
                    collection : fromKey[0],
                    article : fromKey[1],
                    index : -1
                };
                from.index = from.isCollection ?
                                  this.$qwiki.project.indexOfCollection(from.collection) :
                                  this.$qwiki.project.indexOfArticle(from.article, from.collection)
                const to = {
                    isCollection : toKey[1] == "",
                    collection : toKey[0],
                    article : toKey[1],
                    index : -1
                };
                to.index = to.isCollection ?
                                  this.$qwiki.project.indexOfCollection(to.collection) :
                                  this.$qwiki.project.indexOfArticle(to.article, to.collection)

                                  
                if(from.index == -1 || to.index == -1) return;

                if(!from.isCollection && !to.isCollection && from.collection != to.collection) {
                    this.$qwiki.project?.moveToCollection(from.article, to.collection, from.article);
                    events.emit('updatedArticles', {});
                    return;
                }
                
                switch (info.dropPosition) {
                    case "after":
                        if(!from.isCollection && to.isCollection) {
                            this.$qwiki.project.moveToCollection(from.article, 'root', from.collection);
                        }
                        break;
                    case "before":
                        if(!from.isCollection && to.isCollection) {
                            this.$qwiki.project.moveToCollection(from.article, 'root', from.collection);
                        }
                        break;
                    case "inside":
                        if(from.isCollection)
                            return;
                        
                        this.$qwiki.project?.moveToCollection(from.article, to.collection, from.collection);
                        break;
                }
                events.emit('updatedArticles', {});
            }
        },
        watch : {
            selected(newValue) {
                if(newValue.length == 0)
                    return;
                
                const collection = (newValue[0] as string).split(':')[0];
                const article    = (newValue[0] as string).split(':')[1];

                this.$router.push(`/c/${collection}/${article}`);
            }
        }
    }
</script>