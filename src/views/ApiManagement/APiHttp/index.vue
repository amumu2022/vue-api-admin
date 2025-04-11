<script lang="ts" setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import type { ApiGroup, ApiItem } from "./types";

const emojis = ["😀", "😎", "🤩", "👻", "🦄", "🌈", "🍕", "🚀", "🎯", "💡"];

const groupEmojis = ref<Record<number, string>>({});
const getGroupEmoji = (groupId: number) => {
  if (!groupEmojis.value[groupId]) {
    groupEmojis.value[groupId] =
      emojis[Math.floor(Math.random() * emojis.length)];
  }
  return groupEmojis.value[groupId];
};
import { sendApiRequest } from "./api";
import { getApiRoutes } from "@/api/apiCtrl/ApiManagement";
import { ref, onMounted, reactive } from "vue";

const apiGroups = ref<ApiGroup[]>(null);

const activeNames = ref<string[]>([]);
const activeApi = ref<ApiItem | null>(null);
const baseUrl = ref("");
const token = ref("");
const requestBody = ref({});
const responseData = ref("");
const loading = ref(true);

async function onSearch() {
  loading.value = true;
  const { data } = await getApiRoutes({});
  let newData = data;
  apiGroups.value = newData;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onMounted(() => {
  onSearch();
});

const handleSelectApi = (item: ApiItem) => {
  activeApi.value = item;
  requestBody.value = {};
};

const state = reactive({
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 3
});

const handleSendRequest = async (item: ApiItem) => {
  try {
    const response = await sendApiRequest({
      baseUrl: baseUrl.value,
      token: token.value,
      path: item.path,
      method: item.methods[0],
      body: requestBody.value
    });
    responseData.value = JSON.stringify(response, null, 2);
  } catch (error) {
    responseData.value = error instanceof Error ? error.message : "请求失败";
  }
};
</script>

<template>
  <div class="api-container">
    <div class="left-panel">
      <el-scrollbar>
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item
            v-for="group in apiGroups"
            :key="group.id"
            :name="group.id"
          >
            <template #title>
              <span
                style="margin-left: 10px; font-size: 16px; font-weight: bold"
              >
                {{ getGroupEmoji(group.id) }} {{ group.name }}
              </span>
            </template>
            <div
              v-for="item in group.children"
              :key="item.id"
              class="api-item"
              :class="{ active: activeApi?.id === item.id }"
              @click="handleSelectApi(item)"
            >
              {{ item.summary }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>

    <div v-show="activeApi" class="right-panel">
      <div class="api-info">
        <div class="info-row">
          <span class="label">功能描述:</span>
          <span class="value">{{ activeApi?.summary }}</span>
        </div>
        <div class="info-row">
          <span class="label">API路径:</span>
          <span class="value">{{ activeApi?.path }}</span>
          <el-button type="primary" @click="handleSendRequest(activeApi)">
            发送请求
          </el-button>
        </div>
        <div class="info-row" style="gap: 15px">
          <el-input
            v-model="baseUrl"
            placeholder="请求基础地址"
            style="flex: 2"
          />
          <el-input v-model="token" placeholder="Token" style="flex: 1" />
        </div>
      </div>

      <div class="request-editor">
        <h3>请求体</h3>
        <vue-json-pretty
          v-model="requestBody"
          :deep="3"
          :show-line="true"
          :show-line-number="true"
          :show-double-quotes="true"
          :show-length="true"
          :editable="true"
          :max-line-count="6"
        />
      </div>

      <div class="response-viewer">
        <h3>响应结果</h3>
        <pre>{{ responseData }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-container {
  display: flex;
  height: 100%;

  .left-panel {
    width: 240px;
    margin-right: 10px;
    border-right: 1px solid #ebeef5;
    padding-right: 10px;
    height: calc(100vh - 40px);
    position: fixed;

    .api-item {
      padding: 10px;
      margin-left: 25px;
      margin-bottom: 5px;
      border-radius: 4px;
      cursor: pointer;

      &.active {
        background-color: #f5f7fa;
        color: #409eff;
      }
    }
  }

  .right-panel {
    flex: 1;
    height: calc(100vh - 40px);
    overflow-y: auto;
    margin-left: 250px;

    .api-info {
      margin-bottom: 20px;

      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        .label {
          width: 80px;
          color: #909399;
        }

        .value {
          flex: 1;
          margin-right: 15px;
        }
      }
    }

    .request-editor,
    .response-viewer {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;

      h3 {
        margin-top: 0;
        margin-bottom: 15px;
      }
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
