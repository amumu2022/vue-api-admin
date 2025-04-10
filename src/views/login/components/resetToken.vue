<script setup lang="ts">
import { ref, reactive, h } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { updateRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import email from "@iconify-icons/ep/iphone";
import { useUserStoreHook } from "@/store/modules/user";
import { SendVerifyCodeEmail } from "@/api/system/api";
import { resetToken } from "@/api/apiCtrl/memberShip";
import { ElMessageBox } from "element-plus";
import TokenDialog from "./TokenDialog.vue";

defineProps({
  currentPage: {
    type: Number,
    default: 4
  }
});
const loading = ref(false);
const ruleForm = reactive({
  email: "",
  verifyCode: "",
  token: "",
  username: ""
});
const ruleFormRef = ref<FormInstance>();
const { isDisabled, text, start } = useVerifyCode();

const handleSendVerifyCode = async () => {
  if (!ruleForm.email) {
    message("请输入邮箱账号", { type: "warning" });
    return;
  }
  try {
    const data = await SendVerifyCodeEmail(ruleForm.email);
    const { success } = data;
    start(ruleFormRef.value, "email");
    if (!success) {
      message(data.message, { type: "error" });
      return;
    } else {
      message("验证码已发送", { type: "success" });
    }
  } catch (error) {}
};

const resetUserToken = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  try {
    await formEl.validate();
    const data = await resetToken({
      email: ruleForm.email,
      verifyCode: ruleForm.verifyCode,
      username: ruleForm.username,
      token: ruleForm.token
    });
    const { success } = data;
    if (!success) {
      message(data.message, { type: "error" });
      loading.value = false;
      return;
    }
    loading.value = false;
    if (data.data) {
      ElMessageBox({
        title: "重置Token成功",
        message: h(TokenDialog, { userData: data.data }),
        showConfirmButton: false,
        showCancelButton: false,
        closeOnClickModal: false
      });
    }
  } catch (error: any) {
    loading.value = false;
  }
};

function onBack() {
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="updateRules"
    size="large"
  >
    <Motion>
      <el-form-item prop="username">
        <el-input
          v-model="ruleForm.username"
          clearable
          placeholder="用户账号"
          :prefix-icon="useRenderIcon(User)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="token">
        <el-input
          v-model="ruleForm.token"
          clearable
          show-password
          placeholder="原始Token"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>

    <Motion>
      <el-form-item prop="email">
        <el-input
          v-model="ruleForm.email"
          clearable
          placeholder="邮箱账号"
          :prefix-icon="useRenderIcon(email)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="100">
      <el-form-item prop="verifyCode">
        <div class="flex justify-between w-full">
          <el-input
            v-model="ruleForm.verifyCode"
            clearable
            placeholder="验证码"
            :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
          />
          <el-button
            :disabled="isDisabled"
            class="ml-2"
            @click="handleSendVerifyCode"
          >
            {{ text.length > 0 ? text + "秒后重新获取" : "获取验证码" }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="resetUserToken(ruleFormRef)"
        >
          确定重置
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="300">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          返回
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
