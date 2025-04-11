<script setup lang="ts">
import { ref, reactive, h } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { updateRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";
import Iphone from "@iconify-icons/ep/iphone";
import User from "@iconify-icons/ri/user-3-fill";
import { useUserStoreHook } from "@/store/modules/user";
import { RegisterUser } from "@/api/apiCtrl/memberShip";
import { SendVerifyCodeEmail } from "@/api/system/api";
import { ElMessageBox } from "element-plus";
import TokenDialog from "./TokenDialog.vue";

defineProps({
  currentPage: {
    type: Number,
    default: 1
  }
});

const checked = ref(false);
const loading = ref(false);
const ruleForm = reactive({
  username: "",
  email: "",
  verifyCode: "",
  password: "",
  repeatPassword: ""
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

const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (ruleForm.password !== value) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

const onUpdate = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  try {
    await formEl.validate();
    if (checked.value) {
      const data = await RegisterUser({
        username: ruleForm.username,
        email: ruleForm.email,
        verifyCode: ruleForm.verifyCode,
        password: ruleForm.password
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
          title: "注册成功",
          message: h(TokenDialog, { userData: data.data }),
          showConfirmButton: false,
          showCancelButton: false,
          closeOnClickModal: false
        });
      }
    } else {
      loading.value = false;
      message("请勾选隐私政策", { type: "warning" });
    }
  } catch (fields) {
    loading.value = false;
  }
};

function onBack() {
  useVerifyCode().end();
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

    <Motion :delay="100">
      <el-form-item prop="email">
        <el-input
          v-model="ruleForm.email"
          clearable
          placeholder="邮箱账号"
          :prefix-icon="useRenderIcon(Iphone)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
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

    <Motion :delay="200">
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          clearable
          show-password
          placeholder="密码"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
        <el-input
          v-model="ruleForm.repeatPassword"
          clearable
          show-password
          placeholder="确认密码"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="300">
      <el-form-item>
        <el-checkbox v-model="checked"> 我已仔细阅读并接受 </el-checkbox>
        <el-button link type="primary"> 隐私政策 </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="350">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="onUpdate(ruleFormRef)"
        >
          确定注册
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="400">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          返回
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
