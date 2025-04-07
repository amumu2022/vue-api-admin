import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { getIpList, deleteIp, UpdateIp, createIp } from "@/api/system/blackIp";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "./types";

import { ref, h, toRaw, reactive, onMounted } from "vue";
import { addDialog } from "@/components/ReDialog";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useCopyToClipboard } from "@pureadmin/utils";
import { usePublicHooks } from "../../hooks";
import { ElMessageBox } from "element-plus";

const { clipboardValue, copied } = useCopyToClipboard();
const { isMobile } = useBasicLayout();

const copyString = string => {
  clipboardValue.value = string;
  if (copied.value) {
    message(`复制成功`, { type: "success" });
  }
};

export function useRole() {
  const form = reactive({
    ip: "",
    status: undefined,
    enable: undefined,
    currentPage: 1,
    pageSize: 10
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [10, 20, 50, 100],
    background: true
  });
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();

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
      label: "IP地址",
      prop: "ip",
      minWidth: 130,
      cellRenderer: ({ row }) => (
        <el-button type="primary" onClick={() => copyString(row.ip)} link>
          {row.ip}
        </el-button>
      )
    },
    {
      label: "地址信息",
      prop: "addr",
      minWidth: 130
    },
    {
      label: "永封状态",
      prop: "enable",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enable}
          active-value={true}
          inactive-value={false}
          active-text="永久封禁"
          inactive-text="暂未封禁"
          inline-prompt
          style={switchStyle.value}
          onChange={() =>
            onChange({ ...scope, row: scope.row, type: "enable" })
          }
        />
      )
    },
    {
      label: "临封状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={true}
          inactive-value={false}
          active-text="临时封禁"
          inactive-text="暂未封禁"
          inline-prompt
          style={switchStyle.value}
          onChange={() =>
            onChange({ ...scope, row: scope.row, type: "status" })
          }
        />
      )
    },
    {
      label: "解封时间",
      minWidth: 180,
      prop: "block_time",
      formatter: ({ block_time }) => {
        if (block_time === 0) {
          return "已解封";
        }
        return dayjs(block_time * 1000).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 110,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    deleteIp(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了IP编号为${row.id}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  }

  function onChange({ row, index, type }) {
    const isEnableChange = type === "enable"; // 判断是哪个开关触发的
    const confirmMessage = isEnableChange
      ? `确认要<strong>${!row.enable ? "解除永久封禁" : "永久封禁"}IP</strong><strong style='color:var(--el-color-primary)'>${row.ip}</strong>吗?`
      : `确认要<strong>${!row.status ? "解除临时封禁" : "临时封禁"}IP</strong><strong style='color:var(--el-color-primary)'>${row.ip}</strong>吗?`;

    ElMessageBox.confirm(confirmMessage, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    })
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );

        // 构造请求数据
        const post_data = {
          enable: undefined,
          status: undefined,
          block_time: undefined
        };
        if (isEnableChange) {
          post_data.enable = row.enable;
        } else {
          post_data.status = row.status;
          post_data.block_time = row.status
            ? Math.floor(Date.now() / 1000) + 12 * 60 * 60 // 当前时间 + 12 小时
            : 0; // 如果解除封禁，block_time 设置为 0
        }
        UpdateIp(row.id, post_data).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              if (!isEnableChange) {
                onSearch();
              }
              message("已成功修改IP状态", {
                type: "success"
              });
            }, 200);
          } else {
            message(`操作失败，${res.message}`, { type: "error" });
          }
        });
      })
      .catch(() => {
        // 如果取消操作，回滚开关状态
        if (isEnableChange) {
          row.enable = !row.enable;
        } else {
          row.status = !row.status;
        }
      });
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}IP地址`,
      props: {
        formInline: {
          title,
          ip: row?.ip ?? "",
          enable: row?.enable ?? false,
          status: row?.status ?? true
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: isMobile.value ? true : false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您成功${title}了${curData.ip}的数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createIp(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            }
          }
        });
      }
    });
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getIpList(toRaw(form));
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
    pagination,
    isMobile,
    openDialog,
    onSearch,
    resetForm,
    handleDelete
  };
}
