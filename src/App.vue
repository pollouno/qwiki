<script lang="ts">
import BrowserColumn from "./components/BrowserColumn.vue";
import { NLayout, NLayoutSider, NLayoutContent, NConfigProvider } from "naive-ui";
import { darkTheme } from "naive-ui";

export default {
    data() {
        return { darkTheme : darkTheme }
    },
    components : {
        NConfigProvider, NLayout, NLayoutSider, BrowserColumn, NLayoutContent
    },
    beforeMount() {
        if(!this.$qwiki.loadSession())
            this.$qwiki.createProject("new_project", "New Project");
    }
}
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <n-layout has-sider style="height: 100%">
            <n-layout-sider :width="290" content-style="padding: 12px" bordered>
                <BrowserColumn/>
            </n-layout-sider>
            <n-layout-content content-style="padding: 12px;">
                <RouterView />
            </n-layout-content>
        </n-layout>
    </n-config-provider>
</template>