import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive, watch } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import ThumbUp from "~icons/ri/thumb-up-line";
import Hearts from "~icons/ri/hearts-line";
import Empty from "./empty.svg?component";
import dayjs from "dayjs";

export function useColumns(topApiList) {
  const dataList = ref([]);
  const loading = ref(true);
  const indexMethod = (index: number) => {
    return index + 1;
  };
  // 初始化数据
  dataList.value = topApiList.value;
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      minWidth: 50
    },
    // {
    //   sortable: true,
    //   label: "函数名称",
    //   prop: "funcName"
    // },
    {
      sortable: true,
      label: "API名称",
      prop: "summary",
      minWidth: 120
    },
    {
      sortable: true,
      label: "点数",
      prop: "points",
      minWidth: 60
    },
    {
      sortable: true,
      label: "今日调用",
      minWidth: 100,
      prop: "today_call",
      filterMultiple: false,
      filterClassName: "pure-table-filter",
      filters: [
        { text: "≥16000", value: "more" },
        { text: "<16000", value: "less" }
      ],
      filterMethod: (value, { requiredNumber }) => {
        return value === "more"
          ? requiredNumber >= 16000
          : requiredNumber < 16000;
      },
      cellRenderer: ({ row }) => (
        <div class="flex justify-center w-full">
          <span class="flex items-center w-[60px]">
            <span class="ml-auto mr-2">{row.today_call}</span>
            <iconifyIconOffline
              icon={row.today_call > 200 ? Hearts : ThumbUp}
              color="#e85f33"
            />
          </span>
        </div>
      )
    },
    {
      sortable: true,
      label: "累计调用",
      minWidth: 100,
      prop: "total_call",
      filterMultiple: false,
      filterClassName: "pure-table-filter",
      filters: [
        { text: "≥16000", value: "more" },
        { text: "<16000", value: "less" }
      ],
      filterMethod: (value, { requiredNumber }) => {
        return value === "more"
          ? requiredNumber >= 16000
          : requiredNumber < 16000;
      },
      cellRenderer: ({ row }) => (
        <div class="flex justify-center w-full">
          <span class="flex items-center w-[60px]">
            <span class="ml-auto mr-2">{row.total_call}</span>
            <iconifyIconOffline
              icon={row.total_call > 200 ? Hearts : ThumbUp}
              color="#e85f33"
            />
          </span>
        </div>
      )
    },
    {
      sortable: true,
      label: "统计日期",
      prop: "update_time",
      minWidth: 130,
      cellRenderer: ({ row }) => {
        const lastCall = row?.update_time;
        return lastCall
          ? dayjs(lastCall).format("YYYY-MM-DD HH:mm:ss")
          : "无记录";
      }
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    layout: "prev, pager, next",
    total: topApiList.value.length,
    align: "center"
  });

  function onCurrentChange(page: number) {
    console.log("onCurrentChange", page);
    loading.value = true;
    delay(300).then(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    dataList.value = topApiList.value;
    pagination.total = dataList.value.length;
    loading.value = false;
  });

  // 更新表格显示
  watch(topApiList, newVal => {
    dataList.value = newVal;
    pagination.total = newVal.length;
  });

  return {
    Empty,
    loading,
    columns,
    dataList,
    pagination,
    onCurrentChange
  };
}
