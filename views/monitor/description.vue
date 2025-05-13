<script setup lang="ts">
import dayjs from "dayjs";
import { FormItemProps } from "./types";
import { ref } from "vue";

const props = defineProps<FormItemProps>();

const operationList = ref([
  { value: 0, text: "其他" },
  { value: 1, text: "修改" },
  { value: 2, text: "添加" },
  { value: 3, text: "删除" },
  { value: 4, text: "登录" },
  { value: 5, text: "上传" }
]);

const etagTypes = ref([
  { value: 0, type: "info" }, // 默认使用info类型
  { value: 1, type: "primary" },
  { value: 2, type: "warning" },
  { value: 3, type: "danger" },
  { value: 4, type: "success" },
  { value: 5, type: "info" }
]);

const methodTypes = ref({
  POST: "warning",
  PUT: "primary",
  GET: "success",
  DELETE: "danger"
});

// 添加默认值处理
const create_time = ref(
  props.create_time
    ? dayjs(props.create_time).format("YYYY年MM月DD日HH时mm分ss秒")
    : "-"
);
const methodType = props.request_params?.method
  ? methodTypes.value[props.request_params.method]
  : "info";
const statustag =
  props.status === undefined
    ? "info"
    : props.status === 0
      ? "danger"
      : "success";

// 获取操作类型的安全访问方法
const getOperationType = operation => {
  const defaultOperation = { value: 0, text: "其他" };
  if (operation === undefined || operation === null) return defaultOperation;
  return operationList.value[operation] || defaultOperation;
};

const getEtagType = operation => {
  const defaultType = { value: 0, type: "info" };
  if (operation === undefined || operation === null) return defaultType;
  return etagTypes.value[operation] || defaultType;
};
</script>

<template>
  <el-descriptions
    direction="horizontal"
    :column="2"
    :labelStyle="'white-space:nowrap;'"
    :contentStyle="'word-break:break-all;'"
    :size="'large'"
  >
    <el-descriptions-item label="操作编号:" :width="'25%'">
      {{ props.id || "-" }}
    </el-descriptions-item>
    <el-descriptions-item label="请求模块:" :width="'25%'">
      <el-text style="color: rgb(103, 194, 58)">
        {{ props.module || props.summary || "-" }}
      </el-text>
    </el-descriptions-item>
    <el-descriptions-item label="操作类型:">
      <el-tag
        size="default"
        effect="dark"
        :type="getEtagType(props.operation).type"
      >
        {{ getOperationType(props.operation).text }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="操作人:">
      {{ props.uid || props.username || "-" }}
    </el-descriptions-item>
    <el-descriptions-item label="操作人IP:">
      {{ props.ip || "-" }}
    </el-descriptions-item>
    <el-descriptions-item label="系统信息:">
      {{ props.system || "-" }}
    </el-descriptions-item>
    <el-descriptions-item label="浏览器:">
      {{ props.user_agent || "-" }}
    </el-descriptions-item>
    <el-descriptions-item label="请求链接:">
      {{ props.url || props.path || "-" }}
    </el-descriptions-item>
    <el-descriptions-item label="响应状态:">
      <el-tag size="default" :type="statustag" effect="dark">
        {{
          props.status === 1
            ? "成功"
            : props.status === 0
              ? "失败"
              : props.status
        }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item :span="2" label="请求方式:">
      <el-tag size="default" :type="methodType" effect="dark">
        {{ props.request_params?.method || props.method || "-" }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item :span="2" label="请求参数:">
      <el-text>
        {{ props.request_params?.params || "-" }}
      </el-text>
    </el-descriptions-item>
    <el-descriptions-item :span="2" label="请求体:">
      <el-text>
        {{ props.request_params?.body || "-" }}
      </el-text>
    </el-descriptions-item>
    <el-descriptions-item :span="2" label="错误详情:">
      <el-text style="color: rgb(221, 16, 16)">
        {{ props.exception || "-" }}
      </el-text>
    </el-descriptions-item>
    <el-descriptions-item :span="2" label="操作时间:">
      {{ create_time }}
    </el-descriptions-item>
  </el-descriptions>
</template>
<style>
.el-descriptions {
  margin-top: 20px;
}
</style>
