<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import TokenDialog from "./TokenDialog.vue";
import { ref, reactive, h } from "vue";
import { userInfo } from "@/api/apiCtrl/memberShip";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "~icons/ri/lock-fill";
import email from "~icons/ep/iphone";
import type { FormInstance } from "element-plus";
import { updateRules } from "../utils/rule";

defineProps({
  currentPage: {
    type: Number,
    default: 3
  }
});
const loading = ref(false);

const ruleForm = reactive({
  username: "",
  token: ""
});

const ruleFormRef = ref<FormInstance>();

const userInfoSearch = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  try {
    await formEl.validate();
    const data = await userInfo({
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
        title: "查询成功",
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
          placeholder="用户名"
          :prefix-icon="useRenderIcon(email)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item prop="token">
        <el-input
          v-model="ruleForm.token"
          clearable
          show-password
          placeholder="Token"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="userInfoSearch(ruleFormRef)"
        >
          查询
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

<style scoped>
.user-search-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
