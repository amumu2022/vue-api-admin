<script setup lang="ts">
import { ref, onMounted } from "vue";
import DownloadIcon from "@iconify-icons/ep/download";
import UpdateIcon from "@iconify-icons/ep/refresh";
import ReloadIcon from "@iconify-icons/ep/refresh-right";
import { ElMessage, ElMessageBox } from "element-plus";
// 定义数据
const backendSourceType = ref("official");
const frontendSourceType = ref("official");
const backendCustomUrl = ref("");
const frontendCustomUrl = ref("");
const isBackendUpdating = ref(false);
const isFrontendUpdating = ref(false);
const backendProgress = ref(0);
const frontendProgress = ref(0);
const activeTab = ref("backend");

// 版本号信息
const currentBackendVersion = ref("1.0.0");
const latestBackendVersion = ref("");
const hasBackendUpdate = ref(false);
const currentFrontendVersion = ref("1.0.0");
const latestFrontendVersion = ref("");
const hasFrontendUpdate = ref(false);
const isCheckingVersions = ref(false);

// 官方源URL
const backendOfficialUrl =
  "https://github.com/amumu2022/vue-api-admin/releases/download/latest/dist.zip";
const frontendOfficialUrl =
  "https://github.com/amumu2022/vue-api-admin/releases/download/latest/dist.zip";

// 验证表单数据
const validateBackendForm = () => {
  if (backendSourceType.value === "custom" && !backendCustomUrl.value) {
    ElMessage.error("请输入后端自定义源URL");
    return false;
  }
  return true;
};

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
    // 模拟从服务器检查后端版本
    await new Promise(resolve => setTimeout(resolve, 1000));
    latestBackendVersion.value = "1.1.0"; // 模拟返回的最新版本
    hasBackendUpdate.value =
      latestBackendVersion.value !== currentBackendVersion.value;

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

// 下载文件函数
const downloadFile = async (url: string): Promise<Blob | null> => {
  try {
    // 创建XMLHttpRequest对象
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    // 设置进度函数
    const updateProgress = (isBackend: boolean) => (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        if (isBackend) {
          backendProgress.value = progress;
        } else {
          frontendProgress.value = progress;
        }
      }
    };

    // 监听进度事件
    xhr.onprogress =
      activeTab.value === "backend"
        ? updateProgress(true)
        : updateProgress(false);

    // 返回Promise以便使用async/await
    return new Promise((resolve, reject) => {
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const blob = xhr.response;

          try {
            // 打印保存路径信息
            console.log("文件下载完成，准备保存");
            console.log("文件类型:", blob.type);
            console.log("文件大小:", (blob.size / 1024).toFixed(2) + " KB");

            // 返回blob数据
            resolve(blob);
          } catch (error) {
            console.error("处理文件出错:", error);
            reject(null);
          }
        } else {
          console.error("下载文件出错, 状态码:", xhr.status);
          reject(null);
        }
      };

      xhr.onerror = () => {
        console.error("下载文件网络错误");
        reject(null);
      };

      // 开始下载
      xhr.send();
    });
  } catch (error) {
    console.error("下载文件异常:", error);
    return null;
  }
};

// 保存文件函数
const saveFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);

  // 打印下载链接和文件名
  console.log("文件保存信息:");
  console.log("- 文件名:", filename);
  console.log("- 临时URL:", url);

  // 触发下载
  a.click();

  // 清理
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// 更新后端
const updateBackend = async () => {
  if (!validateBackendForm()) return;

  // 确认提示
  try {
    await ElMessageBox.confirm(
      "更新后端将会替换当前服务端内容，请确保已备份重要数据。是否继续？",
      "警告",
      {
        confirmButtonText: "确认更新",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
  } catch (error) {
    return; // 用户取消操作
  }

  // 获取下载URL
  const downloadUrl =
    backendSourceType.value === "official"
      ? backendOfficialUrl
      : backendCustomUrl.value;

  // 开始更新
  isBackendUpdating.value = true;
  backendProgress.value = 0;

  try {
    // 这里是模拟调用后端API
    ElMessage.info("正在更新后端，请稍候...");

    // 模拟API调用
    await new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        backendProgress.value = progress;
        if (progress >= 100) {
          clearInterval(interval);
          resolve(true);
        }
      }, 300);
    });

    isBackendUpdating.value = false;
    ElMessage.success("后端更新成功！");

    // 更新当前版本
    if (backendSourceType.value === "official" && hasBackendUpdate.value) {
      currentBackendVersion.value = latestBackendVersion.value;
      hasBackendUpdate.value = false;
    }
  } catch (error) {
    isBackendUpdating.value = false;
    backendProgress.value = 0;
    ElMessage.error("更新失败，请稍后重试");
    console.error("更新失败:", error);
  }
};

// 更新前端（下载到本地）
const updateFrontend = async () => {
  if (!validateFrontendForm()) return;

  // 获取下载URL
  const downloadUrl =
    frontendSourceType.value === "official"
      ? frontendOfficialUrl
      : frontendCustomUrl.value;

  // 开始更新
  isFrontendUpdating.value = true;
  frontendProgress.value = 0;

  try {
    // 下载文件
    ElMessage.info("正在下载前端更新包，请稍候...");
    const fileBlob = await downloadFile(downloadUrl);

    if (!fileBlob) {
      throw new Error("下载失败");
    }

    // 下载完成，保存文件
    let filename = "frontend-update";
    if (isZipFile(downloadUrl)) {
      filename += ".zip";
    } else {
      filename += downloadUrl.substring(downloadUrl.lastIndexOf("."));
    }

    saveFile(fileBlob, filename);
    isFrontendUpdating.value = false;
    ElMessage.success("前端更新包下载完成！");

    // 更新当前版本
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

          <el-tabs v-model="activeTab" class="update-tabs">
            <el-tab-pane label="后端更新" name="backend">
              <div class="version-info">
                <span>当前版本: {{ currentBackendVersion }}</span>
                <el-tag
                  v-if="hasBackendUpdate"
                  type="warning"
                  size="small"
                  class="ml-2"
                >
                  有新版本 {{ latestBackendVersion }}
                </el-tag>
              </div>

              <el-form label-position="top">
                <!-- 源选择 -->
                <el-form-item label="更新源">
                  <el-radio-group v-model="backendSourceType">
                    <el-radio value="official">官方源</el-radio>
                    <el-radio value="custom">自定义源</el-radio>
                  </el-radio-group>
                </el-form-item>

                <!-- 自定义源URL输入框 -->
                <el-form-item
                  v-if="backendSourceType === 'custom'"
                  label="URL地址"
                >
                  <el-input
                    v-model="backendCustomUrl"
                    placeholder="请输入后端更新包URL"
                    :disabled="isBackendUpdating"
                  />
                  <div class="url-tips">
                    请输入完整的URL地址，支持ZIP格式压缩包
                  </div>
                </el-form-item>

                <!-- 显示官方源地址 -->
                <el-form-item
                  v-if="backendSourceType === 'official'"
                  label="官方源地址"
                >
                  <el-input
                    v-model="backendOfficialUrl"
                    disabled
                    placeholder="官方更新源地址"
                  />
                </el-form-item>

                <!-- 更新进度条 -->
                <el-form-item v-if="isBackendUpdating">
                  <el-progress
                    :percentage="backendProgress"
                    :status="backendProgress === 100 ? 'success' : ''"
                    :indeterminate="backendProgress === 0"
                  />
                </el-form-item>

                <!-- 更新按钮 -->
                <el-form-item>
                  <el-button
                    type="primary"
                    :loading="isBackendUpdating"
                    :disabled="isBackendUpdating"
                    @click="updateBackend"
                  >
                    <IconifyIconOffline :icon="UpdateIcon" class="mr-1" />
                    {{ isBackendUpdating ? "更新中..." : "更新后端" }}
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="前端更新" name="frontend">
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
                  <div class="url-tips">
                    请输入完整的URL地址，支持ZIP格式压缩包
                  </div>
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
            </el-tab-pane>
          </el-tabs>

          <!-- 更新说明 -->
          <div class="update-tips">
            <p><strong>更新说明：</strong></p>
            <p>1. 后端更新：通过API接口更新服务器端代码</p>
            <p>2. 前端更新：下载更新包到本地进行部署</p>
            <p>3. 自定义源：可设置非官方的更新源进行更新</p>
            <p>4. 更新前请确保已备份重要数据</p>
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
