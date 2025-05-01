<!--
 * @Author: XDTEAM
 * @Date: 2025-03-20 21:58:17
 * @LastEditTime: 2025-03-21 21:50:51
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Refresh from "~icons/ep/refresh";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    username: "",
    password: "",
    token: "",
    email: "",
    enable: true
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

function generateToken() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  newFormInline.value.token = token;
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
        <el-form-item label="用户账号" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户账号"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.title === '新增'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="用户密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            placeholder="请输入用户密码"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.title !== '新增'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="点数" prop="points">
          <el-input-number
            v-model="newFormInline.points"
            clearable
            placeholder="请输入点数"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.title !== '新增'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="用户token" prop="token">
          <el-input
            v-model="newFormInline.token"
            clearable
            placeholder="请输入用户token"
          >
            <template #append>
              <el-button
                :icon="useRenderIcon(Refresh)"
                @click="generateToken"
              />
            </template>
          </el-input>
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.title === '新增'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.enable"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
