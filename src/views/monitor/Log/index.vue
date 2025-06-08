<!--
 * @Author: xdteam
 * @Date: 2024-05-05 23:07:11
 * @LastEditTime: 2025-06-07 23:35:25
 * @LastEditors: XDTEAM
 * @Description: 
 * @FilePath: \vue-pure-admin\src\views\personal\features\logs\index.vue
 * 版权声明
-->
<template>
  <el-card class="log-card">
    <template #header>
      <div style="display: flex; align-items: center">
        <div style="margin-right: 30px">消息日志</div>
        <el-button type="primary" size="small" @click="clearLogs"
          >清空日志</el-button
        >
      </div>
    </template>

    <el-scrollbar
      ref="scrollbarRef"
      height="calc(90vh - 100px)"
      always
      @scroll="handleScroll"
    >
      <div class="log-container">
        <div
          v-for="(log, index) in parsedLogs"
          :key="index"
          class="log-item"
          :class="log.levelClass"
        >
          <span class="log-timestamp">{{ log.timestamp }}</span>
          <span class="log-content" v-html="log.htmlContent" />
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts" setup>
import { useLogStream } from "./utils/hook";

const { scrollbarRef, parsedLogs, handleScroll, clearLogs } = useLogStream();
</script>

<style>
.log-card {
  height: 90vh;
}

.log-container {
  background-color: #24292f;
  padding: 10px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.log-item {
  margin: 0;
  white-space: pre-wrap;
  font-family: "Fira Mono", "Consolas", monospace;
  font-size: 15px;
  line-height: 1.7;
  display: flex;
  align-items: flex-start;
}

.log-timestamp {
  color: #4ecb72; /* 常绿色 */
  margin-right: 10px;
  min-width: 170px;
  font-weight: bold;
  letter-spacing: 1px;
}

.log-content {
  flex: 1;
  word-break: break-all;
}

/* 日志等级颜色 */
.log-info {
  color: #fff;
}
.log-error {
  color: #ff4d4f;
}
.log-warning {
  color: #ffd666;
}
.log-debug {
  color: #40a9ff;
}
.log-success {
  color: #4ecb72;
}

:deep(.el-scrollbar__bar) {
  background-color: rgba(255, 255, 255, 0.1);
}
:deep(.el-scrollbar__thumb) {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 移动端样式 */
@media (max-width: 768px) {
  .log-container {
    overflow-x: auto; /* 启用水平滚动 */
  }

  .log-item {
    align-items: center;
    line-height: 1.5;
    min-width: 1000px; /* 设置最小宽度，确保内容可以水平滚动 */
  }

  .log-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
