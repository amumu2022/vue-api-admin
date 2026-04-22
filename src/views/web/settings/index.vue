<script lang="ts" setup>
import { ref } from "vue";
import ApiMode from "./components/apiMode.vue";
import AutoBan from "./components/autoBan.vue";

defineOptions({
  name: "WebSettings"
});
const activeName = ref("tab1");
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="API访问模式" name="tab1"><ApiMode /></el-tab-pane>
    <el-tab-pane label="IP自动封禁" name="tab2"><AutoBan /></el-tab-pane>
  </el-tabs>
</template>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
