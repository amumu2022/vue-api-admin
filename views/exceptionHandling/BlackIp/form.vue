<!--
 * @Author: XDTEAM
 * @Date: 2025-03-20 21:58:17
 * @LastEditTime: 2025-03-29 21:21:25
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { usePublicHooks } from "../hooks";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    ip: "",
    enable: false
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
        <el-form-item label="IP地址" prop="ip">
          <el-input
            v-model="newFormInline.ip"
            clearable
            placeholder="请输入IP地址"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="封禁状态">
          <el-switch
            v-model="newFormInline.enable"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="永久封禁"
            inactive-text="暂不封禁"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
