<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "~icons/ep/delete";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import View from "~icons/ep/view";
import fold_down from "~icons/ep/caret-bottom";
import fold_up from "~icons/ep/caret-top";
import AddFill from "~icons/ri/add-circle-line";

import { ref, onMounted } from "vue";
onMounted(() => {
  searchStatus.value = !isMobile.value;
});
function changeStatus() {
  searchStatus.value = !searchStatus.value;
}
const searchStatus = ref(false);

defineOptions({
  name: "blacklistManagement"
});

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  isMobile,
  openDialog,
  onSearch,
  resetForm,
  handleDelete,
  handleSizeChange,
  handleCurrentChange
} = useRole();
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
      <el-form-item label="IP地址：" prop="ip">
        <el-input
          v-model="form.ip"
          placeholder="请输入IP地址"
          clearable
          class="!w-[120px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>

      <el-form-item label="永封状态：" prop="enable">
        <el-select
          v-model="form.enable"
          placeholder="请选择"
          clearable
          class="!w-[160px]"
          @change="onSearch()"
        >
          <el-option label="永久封禁" value="true" />
          <el-option label="暂未封禁" value="false" />
        </el-select>
      </el-form-item>

      <el-form-item label="临封状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择"
          clearable
          class="!w-[160px]"
          @change="onSearch()"
        >
          <el-option label="临时封禁" value="true" />
          <el-option label="暂未封禁" value="false" />
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

    <PureTableBar title="黑名单IP列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          添加IP
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
          row-key="id"
          adaptive
          stripe
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              circle
              type="primary"
              :size="size"
              :icon="useRenderIcon(View)"
              @click="openDialog(row)"
            />
            <el-popconfirm
              :title="`是否确认删除IP编号为${row.id}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  circle
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                />
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
