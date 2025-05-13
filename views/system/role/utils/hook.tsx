import dayjs from "dayjs";
import editForm from "../form.vue";
import detail from "../detail.vue";
import { message } from "@/utils/message";
import {
  getRoleList,
  createRoleApi,
  deleteRoleApi,
  UpdateRole,
  UpdateRole_status
} from "@/api/system/role";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import { deviceDetection } from "@pureadmin/utils";
const isMobile = ref(deviceDetection());
export function useRole() {
  const form = reactive({
    role_name: "",
    role_code: "",
    enable: undefined,
    currentPage: 1,
    pageSize: 10
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [5, 10, 20, 50, 100],
    background: true
  });
  const indexMethod = (index: number) => {
    return (form.currentPage - 1) * form.pageSize + index + 1;
  };

  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      minWidth: 90
    },
    {
      label: "角色编号",
      hide: true,
      prop: "id"
    },
    {
      label: "角色名称",
      prop: "role_name",
      minWidth: 120
    },
    {
      label: "角色标识",
      prop: "role_code",
      minWidth: 180,
      cellRenderer: ({ row, props }) => {
        const handleButtonClick = () => {
          openDialog("详情", row);
        };
        const showMore = row.role_code.length > 5;
        return (
          <div
            class="tag-container"
            style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"
          >
            {row.role_code?.slice(0, 5).map(userId => (
              <el-tag size={props.size} type="" effect="dark">
                {userId}
              </el-tag>
            ))}
            {showMore && (
              <el-button
                type="primary"
                size={props.size}
                link
                onClick={handleButtonClick}
              >
                查看更多
              </el-button>
            )}
          </div>
        );
      }
    },
    {
      label: "状态",
      minWidth: 100,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enable}
          active-value={true}
          inactive-value={false}
          active-text="已激活"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },

    {
      label: "修改时间",
      minWidth: 180,
      prop: "update_time",
      formatter: ({ update_time }) =>
        dayjs(update_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 110,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enable === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.role_name
      }</strong>角色吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        UpdateRole_status(row.id).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改角色状态", {
                type: "success"
              });
            }, 200);
          } else {
            message(`操作失败，${res.message}`, { type: "error" });
          }
        });
      })
      .catch(() => {
        row.enable === 0 ? (row.enable = 1) : (row.enable = 0);
      });
  }

  function handleDelete(row) {
    deleteRoleApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了角色名称为${row.role_name}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
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

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getRoleList(toRaw(form));
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

  function openDialog(title = "新增", row?: FormItemProps) {
    let component = editForm;
    if (title === "详情") {
      component = detail;
    }
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          role_name: row?.role_name ?? "",
          role_code: row?.role_code ?? ""
        }
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: deviceDetection(),
      closeOnClickModal: false,
      contentRenderer: () => h(component, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.role_name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        if (title === "详情") {
          done(); // 关闭弹框
          return null;
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              createRoleApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "编辑") {
              UpdateRole(row?.id, curData).then(async res => {
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

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    isMobile,
    pagination,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
