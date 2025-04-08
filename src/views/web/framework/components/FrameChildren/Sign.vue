<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { getDockData, UpdateDock } from "@/api/system/dock";
import { message } from "@/utils/message";
import { FormProps } from "../../utils/types";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    sign: {
      name: "",
      range1: 1,
      range2: 99
    }
  })
});

const newFormInline = ref(props.formInline);

async function saveSign() {
  const post_data = { name: "sign", data: newFormInline.value.sign };
  const data = await UpdateDock("sign", post_data);
  if (data.success) {
    message(data.message, { type: "success" });
    reloadSign();
  } else {
    message(`操作失败，${data.message}`, { type: "warning" });
  }
}

async function reloadSign() {
  const post_data = { name: "sign" };
  const { data } = await getDockData(post_data);
  if (data.length != 0) {
    const back = data[0].data;
    newFormInline.value.sign = {
      name: back?.name,
      range1: back?.range1,
      range2: back?.range2
    };
  }
}

onBeforeMount(() => {
  reloadSign();
});
</script>

<template>
  <el-form :model="newFormInline" label-width="82px">
    <el-form-item label="金币名称：" prop="name">
      <el-input
        v-model="newFormInline.sign.name"
        clearable
        placeholder="请输入金币名称"
      />
    </el-form-item>

    <el-form-item label="最低金币：" prop="range1">
      <el-input-number
        v-model="newFormInline.sign.range1"
        :min="1"
        :max="1999999999"
      />
    </el-form-item>

    <el-form-item label="最高金币：" prop="range2">
      <el-input-number
        v-model="newFormInline.sign.range2"
        :min="1"
        :max="1999999999"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveSign">保存</el-button>
    </el-form-item>
  </el-form>
</template>
