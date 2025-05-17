import { ref, computed } from "vue";
import { dayjs, getRandomIntBetween } from "./utils";
import { getUserApiCount } from "@/api/system/consumer";
import GroupLine from "~icons/ri/group-line";
import Question from "~icons/ri/question-answer-line";
import CheckLine from "~icons/ri/chat-check-line";
import Smile from "~icons/ri/star-smile-line";

// 修改接口定义,添加top_10_apis的具体类型
interface ApiStatisticsResponse {
  points: number;
  today_count: number;
  total_count: number;
  role: string[];
}

export function useApiData() {
  const loading = ref(true);
  const dataList = ref<ApiStatisticsResponse | null>(null);

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getUserApiCount();
      dataList.value = data;
    } catch (error) {
      console.error("Failed to fetch API statistics:", error);
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  }

  const chartData = computed(() => [
    {
      icon: GroupLine,
      bgColor: "#effaff",
      color: "#41b6ff",
      duration: 2200,
      name: "我的点数",
      value: dataList.value?.points || 0,
      percent: "+100%",
      data: []
    },
    {
      icon: Question,
      bgColor: "#fff5f4",
      color: "#e85f33",
      duration: 1600,
      name: "我的角色",
      value: dataList.value?.role,
      percent: "",
      data: []
    },
    {
      icon: CheckLine,
      bgColor: "#eff8f4",
      color: "#26ce83",
      duration: 1500,
      name: "今日请求",
      value: dataList.value?.today_count || 0,
      percent: "+100%",
      data: []
    },
    {
      icon: Smile,
      bgColor: "#f6f4fe",
      color: "#7846e5",
      duration: 100,
      name: "累计请求",
      value: dataList.value?.total_count || 0,
      percent: "+100%",
      data: []
    }
  ]);

  return {
    loading,
    dataList,
    chartData,
    onSearch
  };
}

// 保持其他静态数据不变
export const progressData = [
  {
    week: "周一",
    percentage: 85,
    duration: 110,
    color: "#41b6ff"
  },
  {
    week: "周二",
    percentage: 86,
    duration: 105,
    color: "#41b6ff"
  },
  {
    week: "周三",
    percentage: 88,
    duration: 100,
    color: "#41b6ff"
  },
  {
    week: "周四",
    percentage: 89,
    duration: 95,
    color: "#41b6ff"
  },
  {
    week: "周五",
    percentage: 94,
    duration: 90,
    color: "#26ce83"
  },
  {
    week: "周六",
    percentage: 96,
    duration: 85,
    color: "#26ce83"
  },
  {
    week: "周日",
    percentage: 100,
    duration: 80,
    color: "#26ce83"
  }
].reverse();

export const tableData = Array.from({ length: 30 }).map((_, index) => {
  return {
    id: index + 1,
    requiredNumber: getRandomIntBetween(13500, 19999),
    questionNumber: getRandomIntBetween(12600, 16999),
    resolveNumber: getRandomIntBetween(13500, 17999),
    satisfaction: getRandomIntBetween(95, 100),
    date: dayjs().subtract(index, "day").format("YYYY-MM-DD")
  };
});
