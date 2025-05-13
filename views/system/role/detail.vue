<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "查看",
    role_name: "",
    enable: "",
    role_code: []
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

onMounted(() => {});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-descriptions class="margin-top" direction="vertical" :column="3">
    <el-descriptions-item :span="5">
      <template #label>
        <div class="cell-item">角色名称</div>
      </template>
      {{ newFormInline.role_name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">角色标识</div>
      </template>
      <div class="tag-container">
        <el-tag
          v-for="userId in newFormInline.role_code"
          :key="userId"
          type="primary"
          effect="dark"
        >
          {{ userId }}
        </el-tag>
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.tag {
  margin: 10px 5px;
}

.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
</style>
