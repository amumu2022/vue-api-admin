<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "~icons/ep/delete";
import AddFile from "~icons/ep/document-add";
import AddFold from "~icons/ri/folder-add-fill";
import Open from "~icons/ri/book-open-fill";
import Copy from "~icons/ri/file-copy-2-fill";
import Back from "~icons/ri/arrow-go-back-fill";
import ArrowDown from "~icons/ep/caret-bottom";
defineOptions({
  name: "WebFile"
});

const {
  loading,
  columns,
  dataList,
  BackRoute,
  copyString,
  exportExcel,
  onSearch,
  openDialog
} = useRole();
</script>

<template>
  <div class="main">
    <PureTableBar title="文件" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="warning"
          :icon="useRenderIcon(Back)"
          circle
          @click="BackRoute"
        />

        <div
          class="flex flex-wrap items-center"
          style="margin-right: 10px; margin-left: 10px"
        >
          <el-dropdown>
            <el-button type="primary" :icon="useRenderIcon(ArrowDown)">
              新增
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :icon="useRenderIcon(AddFile)"
                  @click="openDialog('新增文件')"
                  >新增文件</el-dropdown-item
                >
                <el-dropdown-item
                  :icon="useRenderIcon(AddFold)"
                  @click="openDialog('新增文件夹')"
                  >新增文件夹</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <el-button type="success" @click="exportExcel">导出</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          row-key="id"
          adaptive
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          stripe
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              circle
              type="primary"
              :size="size"
              :icon="useRenderIcon(Open)"
              @click="openDialog('打开', row)"
            />
            <el-button
              class="reset-margin"
              circle
              type="warning"
              :size="size"
              :icon="useRenderIcon(Copy)"
              @click="copyString(row.path)"
            />
            <el-popconfirm
              :title="`是否确认删除文件名称为${row.name}的这条数据`"
              @confirm="openDialog('删除', row)"
              ><template #reference>
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
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
