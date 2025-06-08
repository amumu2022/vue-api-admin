<!--
 * @Author: XDTEAM
 * @Date: 2025-06-05 21:50:06
 * @LastEditTime: 2025-06-07 23:29:07
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Plus from "~icons/ep/plus";
import Remove from "~icons/ep/minus";

const props = defineProps<{
  name: string; // 用于区分不同的配置
}>();

// 动态表单数据
const cookiesList = ref<string[]>([]);

// 加载数据
async function reloadData() {
  const post_data = { name: props.name };
  const { data } = await getDockData(post_data);
  if (data.length !== 0) {
    const cookies = data[0].data.cookies;
    cookiesList.value = cookies || [""];
  } else {
    cookiesList.value = [""];
  }
}

// 保存数据
async function saveData() {
  if (cookiesList.value.some(cookie => !cookie.trim())) {
    message("所有输入框内容不能为空", { type: "warning" });
    return;
  }
  const post_data = { name: props.name, data: { cookies: cookiesList.value } };
  const data = await UpdateDock(props.name, post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadData();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

// 添加输入框
function addCookie() {
  cookiesList.value.push("");
}

// 删除输入框
function removeCookie(index: number) {
  if (cookiesList.value.length > 1) {
    cookiesList.value.splice(index, 1);
  } else {
    message("至少需要一个输入框", { type: "warning" });
  }
}

// 打开魔搭社区页面
function openModelScope() {
  window.open("https://www.modelscope.cn/", "_blank");
}

onBeforeMount(() => {
  reloadData();
});
</script>

<template>
  <el-form label-width="82px">
    <el-form-item label="🔺">
      <el-row :gutter="10">
        <!-- 描述文本 -->
        <el-col :xs="14" :sm="14" :md="20" :lg="20" :xl="20">
          <span style="color: red; font-weight: bold"
            >请填写魔搭社区的 m_session_id</span
          >
        </el-col>
        <!-- 跳转按钮 -->
        <el-col :xs="10" :sm="10" :md="4" :lg="4" :xl="4" class="button-group">
          <el-button type="primary" @click="openModelScope">
            点我跳转
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>

    <template v-for="(cookie, index) in cookiesList" :key="index">
      <el-form-item :label="'Cookie ' + (index + 1)">
        <el-row :gutter="10">
          <!-- 输入框列 -->
          <el-col :xs="14" :sm="14" :md="20" :lg="20" :xl="20">
            <el-input
              v-model="cookiesList[index]"
              clearable
              placeholder="请输入Cookie"
            />
          </el-col>
          <!-- 按钮组列 -->
          <el-col
            :xs="10"
            :sm="10"
            :md="4"
            :lg="4"
            :xl="4"
            class="button-group"
          >
            <el-button
              :icon="useRenderIcon(Plus)"
              type="primary"
              @click="addCookie"
            />
            <el-button
              type="danger"
              :icon="useRenderIcon(Remove)"
              @click="removeCookie(index)"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" @click="saveData">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.button-group {
  display: flex;
  justify-content: space-between;
}
</style>
