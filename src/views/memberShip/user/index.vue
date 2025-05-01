<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUser } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Role from "~icons/ri/admin-line";
import Password from "~icons/ri/lock-password-line";
import More from "~icons/ep/more-filled";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";

import fold_down from "~icons/ep/caret-bottom";
import fold_up from "~icons/ep/caret-top";

defineOptions({
  name: "memberShipUser"
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
  pagination,
  buttonClass,
  onSearch,
  resetForm,
  openDialog,
  handleUpdate,
  handleDelete,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  handleRole
} = useUser(tableRef);
</script>

<template>
  <div class="flex justify-between">
    <div class="w-[calc(100%)]">
      <el-form
        v-if="searchStatus"
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
      >
        <el-form-item label="用户名称：" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名称"
            clearable
            class="!w-[130px]"
            @keyup.enter="onSearch()"
          />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱号码"
            clearable
            class="!w-[130px]"
            @keyup.enter="onSearch()"
          />
        </el-form-item>
        <el-form-item label="token：" prop="token">
          <el-input
            v-model="form.token"
            placeholder="请输入用户token"
            clearable
            class="!w-[130px]"
            @keyup.enter="onSearch()"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="enable">
          <el-select
            v-model="form.enable"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
            @change="onSearch()"
          >
            <el-option label="已激活" value="true" />
            <el-option label="已停用" value="false" />
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

      <PureTableBar title="用户管理" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog()"
          >
            新增用户
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
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            stripe
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
                :icon="useRenderIcon(EditPen)"
                @click="openDialog('编辑', row)"
              />
              <el-popconfirm
                :title="`是否确认删除用户编号为${row.id}的这条数据`"
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
              <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                  @click="handleUpdate(row)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Password)"
                        @click="handleReset(row)"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Role)"
                        @click="handleRole(row)"
                      >
                        分配角色
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
