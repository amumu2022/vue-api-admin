<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { IconSelect } from "@/components/ReIcon";
import Segmented from "@/components/ReSegmented";
import { menuTypeOptions } from "./utils/enums";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    open_type: 0,
    higherMenuOptions: [],
    parent_id: 0,
    title: "",
    name: "",
    url: "",
    menu_name: "",
    sort: 99,
    redirect: "",
    icon: "",
    code: "",
    keepAlive: false,
    showLink: true,
    showParent: false
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="菜单类型">
          <Segmented
            v-model="newFormInline.open_type"
            :options="menuTypeOptions"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item v-if="newFormInline.open_type !== 0" label="上级菜单">
          <el-cascader
            v-model="newFormInline.parent_id"
            class="w-full"
            :options="newFormInline.higherMenuOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单排序">
          <el-input-number
            v-model="newFormInline.sort"
            class="w-full!"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-show="newFormInline.open_type !== 3"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="菜单图标">
          <IconSelect v-model="newFormInline.icon" class="w-full" />
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.open_type === 3"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <!-- 按钮级别权限设置 -->
        <el-form-item label="权限标识" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入权限标识"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.open_type !== 3"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item
          v-if="newFormInline.open_type == 1"
          label="组件名称"
          prop="menu_name"
        >
          <el-input
            v-model="newFormInline.menu_name"
            clearable
            placeholder="请输入组件定义的name，defineOptions中的name"
          />
        </el-form-item>
      </re-col>

      <template
        v-if="newFormInline.open_type == 0 || newFormInline.open_type == 1"
      >
        <re-col>
          <el-form-item label="页面路径" prop="url">
            <el-input
              v-model="newFormInline.url"
              clearable
              placeholder="请输入前端项目views文件内的页面路径"
            />
          </el-form-item>
        </re-col>
      </template>

      <template v-if="newFormInline.open_type == 3">
        <re-col>
          <el-form-item label="网站地址" prop="url">
            <el-input
              v-model="newFormInline.url"
              clearable
              placeholder="请输入外部网站地址或者内部网站相对地址"
            />
          </el-form-item>
        </re-col>
      </template>

      <template v-if="newFormInline.open_type == 4">
        <re-col>
          <el-form-item label="网站地址" prop="url">
            <el-input
              v-model="newFormInline.url"
              clearable
              placeholder="请输入外部网站地址，必须以https://或者http://开头"
            />
          </el-form-item>
        </re-col>
      </template>

      <!-- <re-col
        v-show="newFormInline.open_type !== 3"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="菜单">
          <Segmented
            :modelValue="newFormInline.showLink ? 0 : 1"
            :options="showLinkOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.showLink = value;
              }
            "
          />
        </el-form-item>
      </re-col>

      <re-col
        v-show="newFormInline.open_type < 2"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="缓存页面">
          <Segmented
            :modelValue="newFormInline.keepAlive ? 0 : 1"
            :options="keepAliveOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.keepAlive = value;
              }
            "
          />
        </el-form-item>
      </re-col> -->
    </el-row>
  </el-form>
</template>
