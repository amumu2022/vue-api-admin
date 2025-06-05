<!--
 * @Author: XDTEAM
 * @Date: 2025-04-08 22:17:34
 * @LastEditTime: 2025-06-05 22:08:53
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script setup lang="ts">
import Card from "@/components/ReCard/Card.vue";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { ref, h } from "vue";
import Lanzou from "./FrameChildren/lanzou.vue";
import QQHttp from "./FrameChildren/QQHttp.vue";
import CreatingSpace from "./FrameChildren/creatingSpace.vue";
import Empty from "./FrameChildren/Empty.vue";

interface Product {
  index: number;
  isSetup: boolean;
  type: number;
  name: string;
  description: string;
  configName: string; // 新增字段，用于传递给通用组件
}

const isMobile = ref(deviceDetection());
const productList: Product[] = [
  {
    index: 1,
    isSetup: true,
    type: 4,
    name: "蓝奏云网盘",
    description: "设置您的蓝奏云基础信息",
    configName: "lanzouyun"
  },
  {
    index: 2,
    isSetup: true,
    type: 1,
    name: "蓝奏云优享版",
    description: "设置您的蓝奏云优享版基础信息",
    configName: "lanzouyun_pro"
  },
  {
    index: 3,
    isSetup: true,
    type: 2,
    name: "小飞机网盘",
    description: "设置您的小飞机网盘基础信息",
    configName: "xiaofeiji"
  },
  {
    index: 4,
    isSetup: true,
    type: 3,
    name: "创空间Cookies配置",
    description: "创空间是一个包含诸多免费模型的AI网站",
    configName: "chuangkongjian"
  },
  {
    index: 5,
    isSetup: true,
    type: 4,
    name: "QQHttp",
    description: "调用类似于Napcat等框架的QQHttp接口",
    configName: "qqhttp"
  },
  {
    index: 6,
    isSetup: false,
    type: 3,
    name: "更多",
    description: "在这里你可以对卡片兑换进行一些设置",
    configName: "more"
  }
];

const handleManageProduct = (product: Product) => {
  let component: any = Empty;
  if (product.index === 1 || product.index === 2 || product.index === 3) {
    component = Lanzou;
  } else if (product.index === 4) {
    component = CreatingSpace;
  } else if (product.index === 5) {
    component = QQHttp;
  } else {
    component = Empty;
  }
  openDialog(product.name, component, product.configName);
};

function openDialog(name: string, component: any, configName: string) {
  addDialog({
    title: `${name}`,
    width: "46%",
    draggable: true,
    fullscreenIcon: true,
    fullscreen: deviceDetection(),
    contentRenderer: () =>
      h(component, {
        name: configName // 将配置名称传递给通用组件
      })
  });
}
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-for="(product, index) in productList"
      :key="index"
      :xs="24"
      :sm="12"
      :md="8"
      :lg="6"
      :xl="4"
    >
      <Card :product="product" @manage-product="handleManageProduct" />
    </el-col>
  </el-row>
</template>
