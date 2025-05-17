<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import fold_down from "~icons/ep/caret-bottom";
import fold_up from "~icons/ep/caret-top";
import { ref, onMounted } from "vue";
onMounted(() => {
  searchStatus.value = !isMobile.value;
});
function changeStatus() {
  searchStatus.value = !searchStatus.value;
}
const searchStatus = ref(false);
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import View from "~icons/ep/view";

const statusTypes = [
  { value: 0, text: "失败" },
  { value: 1, text: "成功" }
  // 添加更多操作类型...
];

const FreeTypes = [
  { value: true, text: "免费" },
  { value: false, text: "收费" }
];

defineOptions({
  name: "UserApiMonitor"
});

const formRef = ref();
const tableRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  isMobile,
  openDialog,
  onSearch,
  handleSizeChange,
  resetForm,
  handleCurrentChange,
  handleSelectionChange
} = useRole(tableRef);
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
          class="!w-[260px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>

      <el-form-item label="API状态：" prop="free">
        <el-select
          v-model="form.free"
          placeholder="请选择"
          clearable
          class="!w-[260px]"
          @change="onSearch()"
        >
          <el-option
            v-for="(item, index) in FreeTypes"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="响应状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择"
          clearable
          class="!w-[260px]"
          @change="onSearch()"
        >
          <el-option
            v-for="(item, index) in statusTypes"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <label class="el-form-item__label is-required font-bold"
          >请求时间：</label
        >
        <el-date-picker
          v-model="form.time"
          class="!w-[380px]"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
        />
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

    <PureTableBar title="Api日志列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
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
          @selection-change="handleSelectionChange"
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
