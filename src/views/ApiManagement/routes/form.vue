<!--
 * @Author: XDTEAM
 * @Date: 2025-03-20 21:58:17
 * @LastEditTime: 2025-06-10 21:28:01
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { usePublicHooks } from "../hooks";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    funcName: "",
    path: "",
    summary: "",
    methods: [],
    points: 0,
    today_call: 0,
    total_call: 0,
    qps: 0,
    category: "",
    daily_call_limit: 0,
    total_call_limit: 0
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);
function getRef() {
  return ruleFormRef.value;
}

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
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="函数名称" prop="funcName">
          <el-input v-model="newFormInline.funcName" readonly />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="API路由" prop="path">
          <el-input v-model="newFormInline.path" readonly />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="API说明" prop="summary">
          <el-input v-model="newFormInline.summary" readonly />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="请求方式" prop="methods">
          <el-select
            v-model="newFormInline.methods"
            multiple
            disabled
            placeholder="请选择请求方式"
          >
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="今日调用" prop="today_call">
          <el-input v-model="newFormInline.today_call" readonly />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="累计调用" prop="total_call">
          <el-input v-model="newFormInline.total_call" readonly />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="权限点" prop="points">
          <el-input-number
            v-model="newFormInline.points"
            clearable
            placeholder="请输入权限点"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="QPS" prop="qps">
          <el-input-number
            v-model="newFormInline.qps"
            clearable
            placeholder="请设置QPS"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="每日调用" prop="daily_call_limit">
          <el-input-number
            v-model="newFormInline.daily_call_limit"
            clearable
            placeholder="请输入每日调用限制"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="总调用限制" prop="total_call_limit">
          <el-input-number
            v-model="newFormInline.total_call_limit"
            clearable
            placeholder="请输入总调用限制"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
