<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import {
  getSystemConfig,
  updateSystemConfig
} from "@/api/apiCtrl/systemConfig";

const loading = ref(true);
const autoBanEnabled = ref(false);
const autoBanKeywords = ref<string[]>([]);
const newKeyword = ref("");

async function loadConfig() {
  loading.value = true;
  try {
    const { data } = await getSystemConfig();
    for (const item of data) {
      if (item.key === "auto_ban_enabled") {
        autoBanEnabled.value = item.value;
      } else if (item.key === "auto_ban_keywords") {
        autoBanKeywords.value = item.value || [];
      }
    }
  } finally {
    loading.value = false;
  }
}

function onToggle(value: boolean) {
  const action = value ? "开启" : "关闭";
  ElMessageBox.confirm(
    `确认要<strong style='color:var(--el-color-primary)'>${action}</strong>自动封禁吗？`,
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
      updateSystemConfig({ configs: { auto_ban_enabled: value } }).then(
        res => {
          if (res.success) {
            message(`自动封禁已${action}`, { type: "success" });
          } else {
            message(`操作失败：${res.message}`, { type: "error" });
            autoBanEnabled.value = !autoBanEnabled.value;
          }
        }
      );
    })
    .catch(() => {
      autoBanEnabled.value = !autoBanEnabled.value;
    });
}

function addKeyword() {
  const kw = newKeyword.value.trim();
  if (!kw) {
    message("关键词不能为空", { type: "warning" });
    return;
  }
  if (autoBanKeywords.value.includes(kw)) {
    message("关键词已存在", { type: "warning" });
    return;
  }
  autoBanKeywords.value.push(kw);
  updateSystemConfig({
    configs: { auto_ban_keywords: autoBanKeywords.value }
  }).then(res => {
    if (res.success) {
      message("关键词添加成功", { type: "success" });
      newKeyword.value = "";
    } else {
      autoBanKeywords.value.pop();
      message(`操作失败：${res.message}`, { type: "error" });
    }
  });
}

function removeKeyword(index: number) {
  const removed = autoBanKeywords.value.splice(index, 1);
  updateSystemConfig({
    configs: { auto_ban_keywords: autoBanKeywords.value }
  }).then(res => {
    if (res.success) {
      message("关键词删除成功", { type: "success" });
    } else {
      autoBanKeywords.value.splice(index, 0, ...removed);
      message(`操作失败：${res.message}`, { type: "error" });
    }
  });
}

onMounted(() => {
  loadConfig();
});
</script>

<template>
  <div v-loading="loading">
    <div class="config-item">
      <div class="config-info">
        <div class="config-title">自动封禁</div>
        <div class="config-desc">
          开启后，IP归属地包含关键词的IP将在触发限流时被自动永久封禁
        </div>
      </div>
      <el-switch
        v-model="autoBanEnabled"
        active-text="已开启"
        inactive-text="已关闭"
        inline-prompt
        style="--el-switch-on-color: #6abe39; --el-switch-off-color: #e84749"
        @change="val => onToggle(val as boolean)"
      />
    </div>

    <el-divider style="margin: 12px 0" />

    <div class="config-title" style="margin-bottom: 4px">封禁关键词</div>
    <div class="config-desc" style="margin-bottom: 10px">
      IP归属地信息包含以下任一关键词时，将被自动永久封禁（如：优刻云、阿里云）
    </div>

    <div style="display: flex; gap: 8px; margin-bottom: 10px">
      <el-input
        v-model="newKeyword"
        placeholder="输入关键词"
        clearable
        style="max-width: 260px"
        @keyup.enter="addKeyword"
      />
      <el-button type="primary" @click="addKeyword">添加</el-button>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 6px">
      <el-tag
        v-for="(keyword, index) in autoBanKeywords"
        :key="index"
        closable
        type="danger"
        @close="removeKeyword(index)"
      >
        {{ keyword }}
      </el-tag>
      <el-empty
        v-if="autoBanKeywords.length === 0"
        description="暂无关键词"
        :image-size="50"
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
