<script setup lang="ts">
import { ref, onMounted } from "vue";
import DownloadIcon from "~icons/ep/download";
import UpdateIcon from "~icons/ep/refresh";
import ReloadIcon from "~icons/ep/refresh-right";
import { ElMessage } from "element-plus";
import { downloadByUrl } from "@pureadmin/utils";

function down() {
  downloadByUrl(
    "https://github.com/xiaoxian521/xiaoxian521/archive/refs/heads/main.zip",
    "xiaoxian521.zip"
  );
}

// 定义数据
const frontendSourceType = ref("official");
const frontendCustomUrl = ref("");
const isFrontendUpdating = ref(false);
const frontendProgress = ref(0);

// 版本号信息
const currentFrontendVersion = ref("1.0.0");
const latestFrontendVersion = ref("");
const hasFrontendUpdate = ref(false);
const isCheckingVersions = ref(false);

// 官方源URL
const frontendOfficialUrl =
  "https://github.com/amumu2022/vue-api-admin/releases/download/latest/dist.zip";

// 验证表单数据
const validateFrontendForm = () => {
  if (frontendSourceType.value === "custom" && !frontendCustomUrl.value) {
    ElMessage.error("请输入前端自定义源URL");
    return false;
  }
  return true;
};

// 检查文件是否是zip格式
const isZipFile = (url: string) => {
  return url.toLowerCase().endsWith(".zip");
};

// 检查版本更新
const checkVersionUpdates = async () => {
  isCheckingVersions.value = true;

  try {
    // 模拟从服务器检查前端版本
    await new Promise(resolve => setTimeout(resolve, 800));
    latestFrontendVersion.value = "1.0.5"; // 模拟返回的最新版本
    hasFrontendUpdate.value =
      latestFrontendVersion.value !== currentFrontendVersion.value;

    ElMessage.success("版本检查完成");
  } catch (error) {
    console.error("检查版本更新失败:", error);
    ElMessage.error("检查版本更新失败，请稍后重试");
  } finally {
    isCheckingVersions.value = false;
  }
};

// 更新前端（下载到本地）
const updateFrontend = async () => {
  if (!validateFrontendForm()) return;

  const downloadUrl =
    frontendSourceType.value === "official"
      ? frontendOfficialUrl
      : frontendCustomUrl.value;

  isFrontendUpdating.value = true;
  frontendProgress.value = 0;

  try {
    ElMessage.info("正在下载前端更新包，请稍候...");

    // 使用 downloadByUrl 简化下载逻辑
    let filename = "frontend-update";
    if (isZipFile(downloadUrl)) {
      filename += ".zip";
    } else {
      filename += downloadUrl.substring(downloadUrl.lastIndexOf("."));
    }

    await downloadByUrl(downloadUrl, filename);

    isFrontendUpdating.value = false;
    ElMessage.success("前端更新包下载完成！");

    if (frontendSourceType.value === "official" && hasFrontendUpdate.value) {
      currentFrontendVersion.value = latestFrontendVersion.value;
      hasFrontendUpdate.value = false;
    }
  } catch (error) {
    isFrontendUpdating.value = false;
    frontendProgress.value = 0;
    ElMessage.error("下载失败，请稍后重试");
    console.error("下载失败:", error);
  }
};
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span class="update-badge navbar-bg-hover select-none">
      <span class="header-update-icon">
        <IconifyIconOffline :icon="UpdateIcon" />
      </span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <div class="update-panel">
          <div class="update-header">
            <h3 class="update-title">系统更新</h3>
            <el-button
              type="primary"
              link
              size="small"
              :loading="isCheckingVersions"
              @click="checkVersionUpdates"
            >
              <IconifyIconOffline :icon="ReloadIcon" class="mr-1" />
              刷新
            </el-button>
          </div>

          <div class="version-info">
            <span>当前版本: {{ currentFrontendVersion }}</span>
            <el-tag
              v-if="hasFrontendUpdate"
              type="warning"
              size="small"
              class="ml-2"
            >
              有新版本 {{ latestFrontendVersion }}
            </el-tag>
          </div>

          <el-form label-position="top">
            <!-- 源选择 -->
            <el-form-item label="更新源">
              <el-radio-group v-model="frontendSourceType">
                <el-radio value="official">官方源</el-radio>
                <el-radio value="custom">自定义源</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 自定义源URL输入框 -->
            <el-form-item
              v-if="frontendSourceType === 'custom'"
              label="URL地址"
            >
              <el-input
                v-model="frontendCustomUrl"
                placeholder="请输入前端更新包URL"
                :disabled="isFrontendUpdating"
              />
              <div class="url-tips">请输入完整的URL地址，支持ZIP格式压缩包</div>
            </el-form-item>

            <!-- 显示官方源地址 -->
            <el-form-item
              v-if="frontendSourceType === 'official'"
              label="官方源地址"
            >
              <el-input
                v-model="frontendOfficialUrl"
                disabled
                placeholder="官方更新源地址"
              />
            </el-form-item>

            <!-- 更新进度条 -->
            <el-form-item v-if="isFrontendUpdating">
              <el-progress
                :percentage="frontendProgress"
                :status="frontendProgress === 100 ? 'success' : ''"
                :indeterminate="frontendProgress === 0"
              />
            </el-form-item>

            <!-- 更新按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                :loading="isFrontendUpdating"
                :disabled="isFrontendUpdating"
                @click="updateFrontend"
              >
                <IconifyIconOffline :icon="DownloadIcon" class="mr-1" />
                {{ isFrontendUpdating ? "下载中..." : "下载更新" }}
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 更新说明 -->
          <div class="update-tips">
            <p><strong>更新说明：</strong></p>
            <p>1. 选择更新源：官方源或自定义源</p>
            <p>2. 下载更新包到本地进行部署</p>
            <p>3. 更新前请确保已备份重要数据</p>
          </div>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.update-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-update-icon {
    font-size: 18px;
  }
}

.update-panel {
  padding: 15px;
  width: 350px;

  .update-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .update-title {
      margin: 0;
      font-size: 16px;
      font-weight: bold;
      color: var(--el-text-color-primary);
    }
  }

  .update-tabs {
    margin-bottom: 10px;
  }

  .version-info {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
}

.url-tips {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.update-tips {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #ebeef5;
  font-size: 13px;
  color: #606266;

  p {
    margin: 5px 0;
    line-height: 1.5;
  }
}
</style>
