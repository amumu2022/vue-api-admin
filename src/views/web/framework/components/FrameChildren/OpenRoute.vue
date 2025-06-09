<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getDockData, UpdateDock, getModelsApi } from "@/api/system/dock";
import { message } from "@/utils/message";
import { storageLocal } from "@pureadmin/utils";
import { OpenRouteSet } from "../../utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Refresh from "~icons/ep/Refresh";

const props = defineProps<{
  name: string; // 用于区分不同的配置
}>();

const newFormInline = ref<OpenRouteSet>({
  ApiKey: "",
  model: ""
});

const short_name_list = ref<{ value: string; label: string }[]>([]);

async function refreshModels() {
  try {
    const { data } = await getModelsApi();
    if (data && Array.isArray(data)) {
      short_name_list.value = data.map(item => ({
        value: item.model,
        label: item.model
      }));

      storageLocal().setItem("openroute", { data: short_name_list.value });
      message("模型列表已刷新", { type: "success" });
    }
  } catch (error) {
    message("刷新模型列表失败", { type: "error" });
  }
}

onMounted(() => {
  const openroute_data =
    storageLocal().getItem<Record<string, any>>("openroute");
  if (openroute_data && openroute_data.data) {
    short_name_list.value = openroute_data.data;
  } else {
    refreshModels(); // 如果本地没有数据，则刷新获取
  }
  reloadData();
});

async function saveData() {
  const post_data = { name: props.name, data: newFormInline.value };
  const data = await UpdateDock(props.name, post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadData();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadData() {
  const post_data = { name: props.name };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value = {
      ApiKey: back?.ApiKey || "",
      model: back?.model || ""
    };
  }
}

function openLink() {
  window.open("https://openrouter.ai/", "_blank");
}
</script>

<template>
  <el-form :model="newFormInline" label-width="82px">
    <el-form-item label="🔺">
      <el-row :gutter="10">
        <!-- 描述文本 -->
        <el-col :xs="14" :sm="14" :md="20" :lg="20" :xl="20">
          <span style="color: red; font-weight: bold"
            >请填写openrouter的 ApiKey</span
          >
        </el-col>
        <!-- 跳转按钮 -->
        <el-col :xs="10" :sm="10" :md="4" :lg="4" :xl="4" class="button-group">
          <el-button type="primary" @click="openLink"> 点我跳转 </el-button>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="ApiKey：" prop="ApiKey">
      <el-input
        v-model="newFormInline.ApiKey"
        clearable
        placeholder="请输入ApiKey"
      />
    </el-form-item>

    <el-form-item label="模型：" prop="model">
      <el-select-v2
        v-model="newFormInline.model"
        filterable
        :options="short_name_list"
        placeholder="请选择模型"
        style="width: 400px"
      />
      <el-button
        class="reset-margin"
        circle
        type="primary"
        :icon="useRenderIcon(Refresh)"
        style="margin-left: 20px"
        @click="refreshModels"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveData">保存</el-button>
    </el-form-item>
  </el-form>
</template>
