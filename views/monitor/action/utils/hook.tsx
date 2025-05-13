import dayjs from "dayjs";
import { message } from "@/utils/message";
import {
  getActionApiList,
  deleteActionApi,
  BatchDelActionApi
} from "@/api/system/monitor";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";
import descriptionForm from "@/views/monitor/description.vue";
import { type Ref, ref, h, toRaw, reactive, onMounted } from "vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
const isMobile = ref(deviceDetection());

export function useRole(tableRef: Ref) {
  const form = reactive({
    uid: "",
    status: "",
    operation: "",
    module: "",
    currentPage: 1,
    pageSize: 10
  });

  const operationTypes = [
    { value: 0, text: "其他" },
    { value: 1, text: "修改" },
    { value: 2, text: "添加" },
    { value: 3, text: "删除" },
    { value: 4, text: "登录" },
    { value: 5, text: "上传" }
    // 添加更多操作类型...
  ];
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
      minWidth: 50
    },
    {
      label: "编号",
      hide: true,
      prop: "id"
    },
    {
      label: "业务模块",
      prop: "module",
      minWidth: 160,
      cellRenderer: ({ row }) => {
        return <span style={{ color: "blue" }}>{row.module}</span>;
      }
    },
    {
      label: "用户",
      prop: "uid",
      minWidth: 100
    },
    {
      label: "操作类型",
      prop: "operation",
      minWidth: 100,
      cellRenderer: ({ row, props }) => {
        const etagTypes = [
          { value: 0, text: "" },
          { value: 1, text: null },
          { value: 2, text: "warning" },
          { value: 3, text: "danger" },
          { value: 4, text: "success" },
          { value: 5, text: "info" }
          // 添加更多操作类型...
        ];
        const operationType = operationTypes[row.operation].text;
        const etagType = etagTypes[row.operation].text;
        return (
          <el-tag size={props.size} type={etagType} effect="dark">
            {operationType}
          </el-tag>
        );
      }
    },

    {
      label: "请求方式",
      prop: "method",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        let color = "";
        let method = "";
        method = row.request_params.method;
        if (method == "GET") {
          color = "green";
        } else if (method == "POST") {
          color = "#e6a23c";
        } else if (method == "PUT") {
          color = "blue";
        } else {
          color = "red";
        }
        return <span style={{ color: color }}>{method}</span>;
      }
    },
    {
      label: "IP地址",
      prop: "ip",
      minWidth: 100
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 0 ? "danger" : "success"}
          effect="dark"
        >
          {row.status === 0 ? "失败" : "成功"}
        </el-tag>
      )
    },
    {
      label: "访问时间",
      minWidth: 180,
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
    deleteActionApi(row.id).then(async res => {
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
    BatchDelActionApi(getKeyList(curSelected, "id")).then(async res => {
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
      fullscreenIcon: true,
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
    const { data } = await getActionApiList(toRaw(form));
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
