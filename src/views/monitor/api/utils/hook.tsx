import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getApiList, deleteApi, BatchDelApi } from "@/api/system/monitor";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import descriptionForm from "@/views/monitor/description.vue";
import { type Ref, ref, h, toRaw, reactive, onMounted } from "vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { useCopyToClipboard } from "@pureadmin/utils";

const { clipboardValue, copied } = useCopyToClipboard();
const isMobile = ref(deviceDetection());
export function useRole(tableRef: Ref) {
  const form = reactive({
    username: "",
    status: undefined,
    free: undefined,
    token: "",
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

  const copyString = string => {
    clipboardValue.value = string;
    if (copied.value) {
      message(`复制成功`, { type: "success" });
    }
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
      label: "用户token",
      prop: "token",
      minWidth: 80,
      cellRenderer: ({ row }) => {
        const handleButtonClick = () => {
          copyString(row.token);
        };

        return (
          <el-button type="primary" onClick={handleButtonClick} link>
            点击复制
          </el-button>
        );
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
      minWidth: 100
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
      width: 110,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    deleteApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了日志ID为${row.id}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空接口的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    BatchDelApi(getKeyList(curSelected, "id")).then(async res => {
      if (res.code === 200) {
        message(`已删除日志编号为 ${getKeyList(curSelected, "id")} 的数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
      tableRef.value.getTableRef().clearSelection();
    });
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
    const { data } = await getApiList(toRaw(form));
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
    onbatchDel,
    openDialog,
    onSearch,
    resetForm,
    handleDelete,
    onSelectionCancel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
