<!--
 * @Author: XDTEAM
 * @Date: 2025-04-09 23:47:32
 * @LastEditTime: 2025-04-10 20:40:43
 * @LastEditors: XDTEAM
 * @Description: 用户信息弹窗
-->
<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { useCopyToClipboard } from "@pureadmin/utils";
import { message } from "@/utils/message";
const { clipboardValue, copied } = useCopyToClipboard();

const props = defineProps({
  userData: {
    type: Object,
    required: true,
    default: () => ({
      username: "",
      email: "",
      points: 0,
      token: "",
      enable: false,
      roles_name: []
    })
  }
});

const copyString = async () => {
  clipboardValue.value = props.userData.token;
  if (copied.value) {
    message(`复制成功`, { type: "success" });
  } else {
    message(`复制失败`, { type: "error" });
  }
};
</script>

<template>
  <div class="user-info-dialog">
    <div class="info-grid">
      <div class="info-item">
        <span class="label">用户名:</span>
        <span class="value">{{ userData.username }}</span>
      </div>

      <div class="info-item">
        <span class="label">邮箱:</span>
        <span class="value">{{ userData.email }}</span>
      </div>

      <div class="info-item">
        <span class="label">剩余点数:</span>
        <span class="value">{{ userData.points }}</span>
      </div>

      <div class="info-item">
        <span class="label">Token:</span>
        <span class="value token">{{ userData.token }}</span>
      </div>

      <div class="info-item">
        <span class="label">用户状态:</span>
        <span
          class="value"
          :style="{ color: userData.enable ? '#67C23A' : '#F56C6C' }"
        >
          {{ userData.enable ? "已启用" : "已禁用" }}
        </span>
      </div>

      <div class="info-item">
        <span class="label">用户权限:</span>
        <span class="value">{{ userData.roles_name.join(", ") }}</span>
      </div>
    </div>

    <div class="button-group">
      <el-button type="primary" @click="copyString">复制Token</el-button>
      <el-button @click="ElMessageBox.close()">关闭</el-button>
    </div>
  </div>
</template>

<style scoped>
.user-info-dialog {
  padding: 15px;
  max-width: 500px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  width: 80px;
  color: #909399;
  font-weight: 500;
}

.value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.token {
  color: #409eff;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
