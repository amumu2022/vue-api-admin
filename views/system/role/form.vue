<script setup lang="ts">
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { handleTreeEx } from "@/utils/tree";
import { getRoutesData } from "@/api/system/menu";
import { ref, onMounted } from "vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    role_name: "",
    title: "",
    enable: "0",
    role_code: []
  })
});

const loading = ref(true);
const ruleFormRef = ref();
const dataList = ref([]);
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

async function onSearch() {
  loading.value = true;
  const { data } = await getRoutesData();
  const newData = data;
  dataList.value = handleTreeEx(newData);
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onMounted(() => {
  onSearch();
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-position="top"
    label-width="82px"
  >
    <el-form-item label="角色名称" prop="role_name">
      <el-input
        v-model="newFormInline.role_name"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>

    <el-form-item label="菜单权限" prop="role_code" style="width: 100%">
      <el-tree-select
        v-model="newFormInline.role_code"
        :data="dataList"
        multiple
        accordion
        :render-after-expand="false"
        show-checkbox
        check-strictly
        check-on-click-node
        style="width: 100%"
      />
    </el-form-item>
  </el-form>
</template>
