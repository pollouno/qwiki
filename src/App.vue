<script setup lang="ts">
import BrowserColumn from "./components/BrowserColumn.vue";
import MainColumn from "./components/NavTabs.vue";
import { NLayout, NLayoutSider, NLayoutContent } from "naive-ui";
</script>

<template>
    <n-layout has-sider>
        <n-layout-sider content-style="padding: 12px;">
            <BrowserColumn/>
        </n-layout-sider>
        <n-layout-content content-style="padding: 12px;">
            <MainColumn/>
        </n-layout-content>
    </n-layout>
</template>