<!--
 * @Author: XDTEAM
 * @Date: 2025-03-20 21:58:17
 * @LastEditTime: 2025-03-22 21:46:31
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script setup lang="ts">
import { useRole } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({
  name: "memberShipRole"
});

const { loading, columns, dataList, pagination, onSearch } = useRole();
</script>

<template>
  <div class="main">
    <PureTableBar title="角色列表" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          stripe
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
