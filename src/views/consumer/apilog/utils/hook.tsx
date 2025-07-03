import dayjs from "dayjs";
import { getUserApiLog } from "@/api/system/consumer";
import { openIpLocation } from "@/api/common";
import type { PaginationProps } from "@pureadmin/table";
import descriptionForm from "@/views/monitor/description.vue";
import { type Ref, ref, h, toRaw, reactive, onMounted } from "vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";

const isMobile = ref(deviceDetection());
export function useRole(tableRef: Ref) {
  const form = reactive({
    status: undefined,
    free: undefined,
    time: undefined,
    summary: "",
    currentPage: 1,
    pageSize: 10
  });
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    background: true
  });
  const indexMethod = (index: number) => {
    return (form.currentPage - 1) * form.pageSize + index + 1;
  };

  const columns: TableColumnList = [
    {
      label: "列表", // 如果需要表格多选，此处label必须设置
      type: "selection"
    },
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      minWidth: 40
    },
    {
      label: "编号",
      hide: true,
      prop: "id"
    },
    {
      label: "用户",
      prop: "username",
      minWidth: 80,
      cellRenderer: ({ row }) => {
        return <span style={{ color: "blue" }}>{row.username}</span>;
      }
    },
    {
      label: "请求方式",
      prop: "method",
      minWidth: 80,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.method == "POST" ? "warning" : "danger"}
          effect="dark"
        >
          {row.method}
        </el-tag>
      )
    },
    {
      label: "API名称",
      prop: "summary",
      minWidth: 80,
      cellRenderer: ({ row }) => {
        return <span style={{ color: "red" }}>{row.summary}</span>;
      }
    },
    {
      label: "API状态",
      prop: "free",
      minWidth: 80,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type={row.free ? "success" : "warning"}>
          {row.free ? "免费" : "收费"}
        </el-tag>
      )
    },
    {
      label: "消耗点数",
      prop: "points",
      minWidth: 80,
      cellRenderer: ({ row }) => <span>{row.free ? 0 : row.points}</span>
    },
    {
      label: "IP地址",
      prop: "ip",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-button
          type="primary"
          link
          style="text-decoration: underline; padding: 0"
          onClick={() => openIpLocation(row.ip)}
        >
          {row.ip}
        </el-button>
      )
    },
    {
      label: "请求状态",
      prop: "status",
      minWidth: 60,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 200 ? "success" : "danger"}
          effect="dark"
        >
          {row.status === 200 ? "成功" : row.status}
        </el-tag>
      )
    },
    {
      label: "访问时间",
      minWidth: 150,
      prop: "create_time",
      formatter: ({ create_time }) =>
        dayjs(create_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 80,
      slot: "operation"
    }
  ];

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  function handleSizeChange(val: number) {
    form.currentPage = 1;
    form.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.currentPage = val;
    onSearch();
  }

  function openDialog(row) {
    addDialog({
      title: "日志详情",
      width: "60%",
      draggable: true,
      fullscreen: deviceDetection(),
      closeOnClickModal: true,
      contentRenderer: () => h(descriptionForm, toRaw(row)),
      footerButtons: [
        {
          label: "关闭",
          text: true,
          size: "large",
          bg: true,
          btnClick: ({ dialog: { options, index } }) => {
            closeDialog(options, index);
          }
        }
      ]
    });
  }
  async function onSearch() {
    loading.value = true;
    const { data } = await getUserApiLog(toRaw(form));
    dataList.value = data.results;
    pagination.total = data.total;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    isMobile,
    openDialog,
    onSearch,
    resetForm,
    handleCurrentChange,
    handleSizeChange,
    handleSelectionChange
  };
}
