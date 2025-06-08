<script setup lang="ts">
import { useRole } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "~icons/ep/delete";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
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

defineOptions({
  name: "CloudDriveManagement"
});

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  isMobile,
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
      <el-form-item label="类型：" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择"
          clearable
          class="!w-[160px]"
          @change="onSearch()"
        >
          <el-option label="r18-动漫" value="1" />
          <el-option label="r18-萝莉" value="2" />
          <el-option label="r18-性感" value="3" />
          <el-option label="壁纸-手机" value="4" />
          <el-option label="壁纸-电脑" value="5" />
          <el-option label="美图-动漫" value="6" />
          <el-option label="美图-性感" value="7" />
          <el-option label="更多" value="8" />
        </el-select>
      </el-form-item>

      <el-form-item label="上传用户：" prop="uploader">
        <el-input
          v-model="form.uploader"
          placeholder="请输入上传用户"
          clearable
          class="!w-[120px]"
          @keyup.enter="onSearch()"
        />
      </el-form-item>

      <el-form-item>
        <label class="el-form-item__label is-required font-bold"
          >上传时间：</label
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

    <PureTableBar title="图片列表" :columns="columns" @refresh="onSearch">
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
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-popconfirm
              :title="`是否确认删除图片编号为${row.id}的这条数据`"
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
