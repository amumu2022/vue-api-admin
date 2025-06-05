<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { message } from "@/utils/message";
import { QQhttpSet } from "../../utils/types";

const props = defineProps<{
  name: string; // 用于区分不同的配置
}>();

const newFormInline = ref<QQhttpSet>({
  url: "",
  bot_id: ""
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
      url: back?.url || "",
      bot_id: back?.bot_id || ""
    };
  }
}

onBeforeMount(() => {
  reloadData();
});
</script>

<template>
  <el-form :model="newFormInline" label-width="82px">
    <el-form-item label="URL：" prop="url">
      <el-input
        v-model="newFormInline.url"
        clearable
        placeholder="请输入URL地址"
      />
    </el-form-item>

    <el-form-item label="机器人：" prop="bot_id">
      <el-input
        v-model="newFormInline.bot_id"
        clearable
        placeholder="请输入机器人账号"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveData">保存</el-button>
    </el-form-item>
  </el-form>
</template>
