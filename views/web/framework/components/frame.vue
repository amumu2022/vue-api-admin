<!--
 * @Author: XDTEAM
 * @Date: 2025-04-08 22:17:34
 * @LastEditTime: 2025-04-08 22:52:50
 * @LastEditors: XDTEAM
 * @Description: 
-->
<script setup lang="ts">
import Card from "@/components/ReCard/Card.vue";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { h } from "vue";
import Sign from "./FrameChildren/Sign.vue";
import Empty from "./FrameChildren/Empty.vue";

interface Product {
  index: number;
  isSetup: boolean;
  type: number;
  name: string;
  description: string;
}

const isMobile = ref(deviceDetection());
const productList: Product[] = [
  {
    index: 4,
    isSetup: true,
    type: 4,
    name: "框架设置",
    description: "如何连接到你的xdBot"
  },
  {
    index: 1,
    isSetup: true,
    type: 1,
    name: "签到设置",
    description: "机器人签到游戏的相关设置"
  },
  {
    index: 2,
    isSetup: true,
    type: 2,
    name: "文转图设置",
    description: "文字转图片的设置专区"
  },
  {
    index: 3,
    isSetup: true,
    type: 3,
    name: "卡片兑换",
    description: "在这里你可以对卡片兑换进行一些设置"
  },
  {
    index: 5,
    isSetup: false,
    type: 3,
    name: "更多",
    description: "在这里你可以对卡片兑换进行一些设置"
  }
];

const handleManageProduct = (product: Product) => {
  let component: any = Empty;
  if (product.index == 1) {
    component = Sign;
  } else if (product.index == 2) {
    component = Sign;
  } else {
    component = Empty;
  }
  openDialog(product.name, component);
};

function openDialog(name: string, component: any) {
  addDialog({
    title: `${name}`,
    width: "46%",
    draggable: true,
    fullscreenIcon: true,
    fullscreen: deviceDetection(),
    contentRenderer: () => h(component)
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
