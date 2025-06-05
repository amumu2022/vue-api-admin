<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { message } from "@/utils/message";
import { LZYcloudDriveSet } from "../../utils/types";

const props = defineProps<{
  name: string; // 用于区分不同的配置
}>();

const newFormInline = ref<LZYcloudDriveSet>({
  username: "",
  password: "",
  folfer_id: "",
  size: 10
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
      username: back?.username || "",
      password: back?.password || "",
      folfer_id: back?.folfer_id || "",
      size: back?.size || 10
    };
  }
}

onBeforeMount(() => {
  reloadData();
});
</script>

<template>
  <el-form :model="newFormInline" label-width="82px">
    <el-form-item label="用户名：" prop="username">
      <el-input
        v-model="newFormInline.username"
        clearable
        placeholder="请输入用户名"
      />
    </el-form-item>

    <el-form-item label="密码：" prop="password">
      <el-input
        v-model="newFormInline.password"
        clearable
        placeholder="请输入密码"
        type="password"
      />
    </el-form-item>

    <el-form-item label="文件夹ID：" prop="folfer_id">
      <el-input
        v-model="newFormInline.folfer_id"
        clearable
        placeholder="请输入文件夹ID"
      />
    </el-form-item>

    <el-form-item label="大小(MB)" prop="size">
      <el-input-number
        v-model="newFormInline.size"
        :min="1"
        :max="100"
        clearable
        placeholder="请输入大小限制"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveData">保存</el-button>
    </el-form-item>
  </el-form>
</template>
