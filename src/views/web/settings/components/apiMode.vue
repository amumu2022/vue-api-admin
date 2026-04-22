<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import {
  getSystemConfig,
  updateSystemConfig
} from "@/api/apiCtrl/systemConfig";

const loading = ref(true);
const selfUseMode = ref(false);
const tokenMode = ref(false);

async function loadConfig() {
  loading.value = true;
  try {
    const { data } = await getSystemConfig();
    for (const item of data) {
      if (item.key === "self_use_mode") {
        selfUseMode.value = item.value;
      } else if (item.key === "token_mode") {
        tokenMode.value = item.value;
      }
    }
  } finally {
    loading.value = false;
  }
}

function onToggle(key: string, value: boolean, label: string) {
  const action = value ? "开启" : "关闭";
  ElMessageBox.confirm(
    `确认要<strong style='color:var(--el-color-primary)'>${action}</strong>${label}吗？`,
    "系统提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  )
    .then(() => {
      updateSystemConfig({ configs: { [key]: value } }).then(res => {
        if (res.success) {
          message(`${label}已${action}`, { type: "success" });
        } else {
          message(`操作失败：${res.message}`, { type: "error" });
          revertToggle(key);
        }
      });
    })
    .catch(() => {
      revertToggle(key);
    });
}

function revertToggle(key: string) {
  if (key === "self_use_mode") {
    selfUseMode.value = !selfUseMode.value;
  } else if (key === "token_mode") {
    tokenMode.value = !tokenMode.value;
  }
}

onMounted(() => {
  loadConfig();
});
</script>

<template>
  <div v-loading="loading">
    <div class="config-item">
      <div class="config-info">
        <div class="config-title">自用模式</div>
        <div class="config-desc">
          开启后，仅SVIP用户和管理员可使用所有API，其他用户将被拒绝访问
        </div>
      </div>
      <el-switch
        v-model="selfUseMode"
        active-text="已开启"
        inactive-text="已关闭"
        inline-prompt
        style="--el-switch-on-color: #6abe39; --el-switch-off-color: #e84749"
        @change="val => onToggle('self_use_mode', val as boolean, '自用模式')"
      />
    </div>

    <el-divider style="margin: 12px 0" />

    <div class="config-item">
      <div class="config-info">
        <div class="config-title">TOKEN模式</div>
        <div class="config-desc">
          开启后，所有API都需要token才能使用，不管原本API是否要求token验证
        </div>
      </div>
      <el-switch
        v-model="tokenMode"
        active-text="已开启"
        inactive-text="已关闭"
        inline-prompt
        style="--el-switch-on-color: #6abe39; --el-switch-off-color: #e84749"
        @change="val => onToggle('token_mode', val as boolean, 'TOKEN模式')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.config-info {
  flex: 1;
  margin-right: 20px;
}

.config-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.config-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
