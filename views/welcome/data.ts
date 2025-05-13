import { ref, computed } from "vue";
import { dayjs, cloneDeep, getRandomIntBetween } from "./utils";
import { getApiCalls } from "@/api/apiCtrl/ApiManagement";
import GroupLine from "~icons/ri/group-line";
import Question from "~icons/ri/question-answer-line";
import CheckLine from "~icons/ri/chat-check-line";
import Smile from "~icons/ri/star-smile-line";

// 修改接口定义,添加top_10_apis的具体类型
interface ApiStatisticsResponse {
  total_users: number;
  user_seven_days_data: {
    new_users: number[];
    total_users: number[];
    dates: string[];
  };
  user_growth: number;

  total_apis: number;
  total_calls: number;
  today_calls: number;
  total_calls_growth: number;
  today_calls_growth: number;
  seven_days_data: {
    today_calls: number[];
    total_calls: number[];
    dates: string[];
  };
}
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function useApiData() {
  const loading = ref(true);
  const today_calls = ref([]);
  const total_users = ref([]);
  const total_calls = ref([]);
  const dataList = ref<ApiStatisticsResponse | null>(null);

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getApiCalls();
      dataList.value = data;
      today_calls.value = dataList.value?.seven_days_data.today_calls || [
        0, 0, 0, 0, 0, 0, 0
      ];
      total_calls.value = dataList.value?.seven_days_data.total_calls || [
        0, 0, 0, 0, 0, 0, 0
      ];
      total_users.value = dataList.value?.user_seven_days_data.total_users || [
        0, 0, 0, 0, 0, 0, 0
      ];
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
      name: "API总数",
      value: dataList.value?.total_apis || 0,
      percent: "+100%",
      data: []
    },
    {
      icon: Question,
      bgColor: "#fff5f4",
      color: "#e85f33",
      duration: 1600,
      name: "累计调用",
      value: dataList.value?.total_calls || 0,
      percent: `${dataList.value?.total_calls_growth}%`,
      data: total_calls.value
    },
    {
      icon: CheckLine,
      bgColor: "#eff8f4",
      color: "#26ce83",
      duration: 1500,
      name: "今日请求",
      value: dataList.value?.today_calls || 0,
      percent: `${dataList.value?.today_calls_growth}%`,
      data: today_calls.value
    },
    {
      icon: Smile,
      bgColor: "#f6f4fe",
      color: "#7846e5",
      duration: 100,
      name: "用户总数",
      value: dataList.value?.total_users || 0,
      percent: `${dataList.value?.user_growth}%`,
      data: total_users.value
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

/** 最新动态 */
const latestNewsData = cloneDeep(tableData)
  .slice(0, 14)
  .map((item, index) => {
    return Object.assign(item, {
      date: `${dayjs().subtract(index, "day").format("YYYY-MM-DD")} ${
        weekdays[dayjs().subtract(index, "day").day()]
      }`
    });
  });

export { latestNewsData };
