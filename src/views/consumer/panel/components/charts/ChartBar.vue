<script setup lang="ts">
import { useDark, useECharts } from "@pureadmin/utils";
import { type PropType, ref, computed, watch, nextTick } from "vue";

interface DataItem {
  date: string;
  count: number;
}

const { isDark } = useDark();
const theme = computed(() => (isDark.value ? "dark" : "light"));
const chartRef = ref();
const { setOptions } = useECharts(chartRef, {
  theme
});

const props = defineProps({
  chartData: {
    type: Array as PropType<DataItem[]>,
    default: () => []
  }
});

watch(
  () => props.chartData,
  async () => {
    await nextTick();
    setOptions({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "3%",
        containLabel: true // 确保坐标轴标签显示完整
      },
      xAxis: {
        type: "category",
        data: props.chartData.map(item => item.date),
        axisLabel: {
          fontSize: 12,
          interval: 0,
          rotate: 45, // 旋转标签以防止重叠
          formatter: (value: string) => {
            // 只显示月和日
            return value.slice(5);
          }
        }
      },
      yAxis: {
        type: "value",
        name: "数量",
        nameTextStyle: {
          padding: [0, 0, 0, 40] // 调整名称位置
        },
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          type: "bar",
          data: props.chartData.map(item => item.count),
          barWidth: "40%",
          itemStyle: {
            color: "#41b6ff",
            borderRadius: [4, 4, 0, 0]
          }
        }
      ]
    });
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 365px" />
</template>
