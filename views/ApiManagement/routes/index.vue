<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDept } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import fold_down from "~icons/ep/caret-bottom";
import fold_up from "~icons/ep/caret-top";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({
  name: "ApiManagementRoutes"
});
onMounted(() => {
  searchStatus.value = !isMobile.value;
});
function changeStatus() {
  searchStatus.value = !searchStatus.value;
}
const searchStatus = ref(false);
const formRef = ref();
const tableRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  isMobile,
  DataSync,
  onSearch,
  resetForm
} = useDept();
</script>

<template>
  <div class="main">
    <el-form
      v-if="searchStatus"
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="API名称：" prop="summary">
        <el-input
          v-model="form.summary"
          placeholder="请输入API名称"
          clearable
          class="!w-[135px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>
      <el-form-item label="启用状态：" prop="enable">
        <el-select
          v-model="form.enable"
          placeholder="请选择启用状态"
          clearable
          class="!w-[135px]"
          @change="onSearch()"
        >
          <el-option label="已激活" :value="true" />
          <el-option label="已停用" :value="false" />
        </el-select>
      </el-form-item>

      <el-form-item label="收费状态：" prop="free">
        <el-select
          v-model="form.free"
          placeholder="请选择收费状态"
          clearable
          class="!w-[135px]"
          @change="onSearch()"
        >
          <el-option label="免费" :value="true" />
          <el-option label="收费" :value="false" />
        </el-select>
      </el-form-item>

      <el-form-item label="Token状态：" prop="token">
        <el-select
          v-model="form.token"
          placeholder="请选择Token状态"
          clearable
          class="!w-[135px]"
          @change="onSearch()"
        >
          <el-option label="需要" :value="true" />
          <el-option label="不需要" :value="false" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="API列表"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="danger"
          :icon="useRenderIcon(AddFill)"
          @click="DataSync"
        >
          数据同步
        </el-button>

        <el-button
          :icon="
            searchStatus ? useRenderIcon(fold_up) : useRenderIcon(fold_down)
          "
          @click="changeStatus"
        />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          adaptive
          :adaptiveConfig="{ offsetBottom: 45 }"
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{}" />
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
