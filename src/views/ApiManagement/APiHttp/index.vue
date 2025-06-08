<script lang="ts" setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import type { ApiGroup, ApiItem } from "./types";
import { sendApiRequest, convertOpenApiToTree } from "./api";
import { getApiRoutesModel } from "@/api/apiCtrl/ApiManagement";
import { ref, onMounted, reactive } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { storageLocal } from "@pureadmin/utils";

const emojis = ["😀", "😎", "🤩", "👻", "🦄", "🌈", "🍕", "🚀", "🎯", "💡"];

const groupEmojis = ref<Record<number, string>>({});
const getGroupEmoji = (groupId: number) => {
  if (!groupEmojis.value[groupId]) {
    groupEmojis.value[groupId] =
      emojis[Math.floor(Math.random() * emojis.length)];
  }
  return groupEmojis.value[groupId];
};

const apiGroups = ref<ApiGroup[]>(null);

const activeNames = ref<string[]>([]);
const activeApi = ref<ApiItem | null>(null);
const baseUrl = ref("");
const token = ref("");
const paramsData = ref({});
const bodyData = ref({});
const responseData = ref("");
const loading = ref(true);

const paramState = reactive({
  val: JSON.stringify(paramsData),
  data: paramsData,
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 0
});

const bodyState = reactive({
  val: JSON.stringify(bodyData),
  data: bodyData,
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 0
});

async function onSearch() {
  loading.value = true;
  const { data } = await getApiRoutesModel();
  let newData = convertOpenApiToTree(data);
  apiGroups.value = newData;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onMounted(() => {
  const apihttp_data = storageLocal().getItem<Record<string, any>>("apihttp");
  baseUrl.value = apihttp_data?.baseUrl;
  token.value = apihttp_data?.token; // 不再报错
  onSearch();
});

const handleSelectApi = (item: ApiItem) => {
  activeApi.value = item;
  // 初始化params和body数据
  paramsData.value = item.params?.reduce(
    (acc, param) => {
      acc[param.name] = param.schema?.default ?? "";
      return acc;
    },
    {} as Record<string, any>
  );

  bodyData.value = item.model?.properties
    ? Object.fromEntries(
        Object.entries(item.model.properties).map(([key, prop]) => [
          key,
          prop.default ?? ""
        ])
      )
    : {};
};

const handleSendRequest = async (item: ApiItem) => {
  storageLocal().setItem("apihttp", {
    token: token.value,
    baseUrl: baseUrl.value
  });

  try {
    const response = await sendApiRequest({
      baseUrl: baseUrl.value,
      token: token.value,
      path: item.path,
      method: item.methods[0],
      params: paramsData.value,
      body: bodyData.value
    });
    responseData.value =
      "```json\n" + JSON.stringify(response, null, 2) + "\n```";
  } catch (error) {
    responseData.value =
      "```text\n" +
      (error instanceof Error ? error.message : "请求失败") +
      "\n```";
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
          <span class="value"
            ><strong>{{ activeApi?.summary }}</strong></span
          >
        </div>
        <div class="info-row">
          <span class="label">API路径:</span>
          <span class="value"
            ><strong>{{ activeApi?.path }}</strong></span
          >
          <span class="label">请求方式:</span>
          <el-tag
            :type="
              activeApi?.methods[0].toLowerCase() === 'get'
                ? 'success'
                : activeApi?.methods[0].toLowerCase() === 'post'
                  ? 'warning'
                  : 'primary'
            "
            effect="dark"
          >
            {{ activeApi?.methods[0] }}
          </el-tag>
        </div>
        <div class="info-row" style="gap: 15px">
          <el-input
            v-model="baseUrl"
            placeholder="请求基础地址"
            style="flex: 2"
          />
          <el-input v-model="token" placeholder="Token" style="flex: 1" />

          <el-button type="primary" @click="handleSendRequest(activeApi)">
            发送请求
          </el-button>
        </div>
      </div>

      <el-tabs type="">
        <el-tab-pane label="请求参数">
          <vue-json-pretty
            v-model:data="paramsData"
            :deep="paramState.deep"
            :show-double-quotes="paramState.showDoubleQuotes"
            :show-line="paramState.showLine"
            :show-length="paramState.showLength"
            :show-icon="paramState.showIcon"
            :show-line-number="paramState.showLineNumber"
            :editable="paramState.editable"
            :editable-trigger="paramState.editableTrigger as any"
          />
        </el-tab-pane>

        <el-tab-pane label="请求体">
          <vue-json-pretty
            v-model:data="bodyData"
            :deep="bodyState.deep"
            :show-double-quotes="bodyState.showDoubleQuotes"
            :show-line="bodyState.showLine"
            :show-length="bodyState.showLength"
            :show-icon="bodyState.showIcon"
            :show-line-number="bodyState.showLineNumber"
            :editable="bodyState.editable"
            :editable-trigger="bodyState.editableTrigger as any"
          />
        </el-tab-pane>
      </el-tabs>

      <div class="response-viewer">
        <h3>响应结果</h3>
        <md-editor
          v-model="responseData"
          :preview="true"
          :showCodeArea="false"
          :toolbars="['pageFullscreen', 'previewOnly']"
          :style="{
            height: responseData
              ? `${Math.min(Math.max(250, responseData.split('\n').length * 20), 600)}px`
              : '250px'
          }"
        />
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

    .response-viewer {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      margin-bottom: 20px;
      margin-top: 20px;

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
