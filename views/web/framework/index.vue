<!--
 * @Author: XDTEAM
 * @Date: 2025-04-08 22:17:34
 * @LastEditTime: 2025-04-08 22:48:23
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script lang="ts" setup>
import { ref } from "vue";
import Email from "./components/email.vue";
import Frame from "./components/frame.vue";

defineOptions({
  name: "WebFrame"
});
const activeName = ref("tab1");
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="框架设置" name="tab1"><Frame /></el-tab-pane>
    <el-tab-pane label="邮箱设置" name="tab2"><Email /></el-tab-pane>
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
