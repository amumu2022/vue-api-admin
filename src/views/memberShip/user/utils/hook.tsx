import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps, RoleFormItemProps } from "./types";
import { isAllEmpty } from "@pureadmin/utils";
import { deviceDetection } from "@pureadmin/utils";
import { useCopyToClipboard } from "@pureadmin/utils";

const { clipboardValue, copied } = useCopyToClipboard();
const isMobile = ref(deviceDetection());
import {
  getUserInfo,
  getAllRoleList,
  getUserList,
  AddUser,
  DelUser,
  UpdateUser
} from "@/api/apiCtrl/memberShip";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress,
  ElMessageBox
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";

export function useUser(tableRef: Ref) {
  const form = reactive({
    username: "",
    email: "",
    enable: undefined,
    token: "",
    currentPage: 1,
    pageSize: 10
  });

  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const selectedNum = ref(0);
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

  const copyString = string => {
    clipboardValue.value = string;
    if (copied.value) {
      message(`复制成功`, { type: "success" });
    }
  };

  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      index: indexMethod,
      minWidth: 90
    },
    {
      label: "用户编号",
      prop: "id",
      hide: true
    },
    {
      label: "用户账号",
      prop: "username",
      minWidth: 120
    },
    {
      label: "角色",
      prop: "roles_name",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        // roles_name 是一个数组，需要为每个角色创建一个标签
        if (!row.roles_name || !Array.isArray(row.roles_name)) {
          return null;
        }

        const getTagType = roleName => {
          if (roleName === "管理员") {
            return "danger"; // 红色
          } else if (roleName === "SVIP用户") {
            return "success"; // 绿色
          } else if (roleName === "VIP用户") {
            return "warning"; // 橙色
          } else if (roleName === "普通用户") {
            return "primary"; // 蓝色
          }
          return "info"; // 默认灰色
        };

        return (
          <div class="flex gap-1 flex-wrap justify-center items-center">
            {row.roles_name.map((role, index) => (
              <el-tag
                key={index}
                size="small"
                type={getTagType(role)}
                effect="plain"
              >
                {role}
              </el-tag>
            ))}
          </div>
        );
      }
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 120
    },
    {
      label: "点数",
      prop: "points",
      minWidth: 60,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type="primary" effect="plain">
          {row.points}
        </el-tag>
      )
    },
    {
      label: "用户token",
      prop: "token",
      minWidth: 100,
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
      label: "状态",
      prop: "enable",
      minWidth: 90,
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
      label: "最近调用",
      minWidth: 120,
      prop: "last_call",
      cellRenderer: ({ row }) => {
        const lastCall = row?.api_calls[0]?.last_call;
        return lastCall
          ? dayjs(lastCall).format("YYYY-MM-DD HH:mm:ss")
          : "无记录";
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        !row.enable ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
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
        // 构造请求数据
        const post_data = {
          enable: row.enable
        };

        UpdateUser(row.id, post_data).then(res => {
          if (res.code === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message("已成功修改用户状态", {
                type: "success"
              });
            }, 200);
          } else {
            message(`操作失败，${res.message}`, { type: "error" });
          }
        });
      })
      .catch(() => {
        row.enable;
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    DelUser(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了用户编号为${row.id}的这条数据`, { type: "success" });
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

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getUserList(toRaw(form));
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

  async function handleUserAction(
    title: string,
    curData: FormItemProps,
    row?: FormItemProps
  ) {
    try {
      const res =
        title === "新增"
          ? await AddUser(curData)
          : await UpdateUser(row?.id, curData);
      if (res.code === 200) {
        message(`您${title}了用户名称为${curData.username}的这条数据`, {
          type: "success"
        });
        onSearch(); // 刷新表格数据
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    } catch (error) {
      message(`操作失败，${error.message}`, { type: "error" });
    }
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          username: row?.username ?? "",
          token: row?.token ?? "",
          email: row?.email ?? "",
          points: row?.points ?? 0,
          enable: row?.enable ?? true
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: deviceDetection(),
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        FormRef.validate(async valid => {
          if (valid) {
            await handleUserAction(title, curData, row);
            done(); // 关闭弹框
          }
        });
      }
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "50%",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: deviceDetection(),
      closeOnClickModal: false,
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            const new_data = { password: pwdForm.newPwd };
            const jsonStr = JSON.stringify(new_data);

            UpdateUser(row?.id, jsonStr).then(async res => {
              if (res.code === 200) {
                message(`已成功重置 ${row.username} 用户的密码`, {
                  type: "success"
                });
                done(); // 关闭弹框
                onSearch(); // 刷新表格数据
              } else {
                message(`操作失败，${res.message}`, { type: "error" });
              }
            });
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const ids = (await getUserInfo(row.id)).data.roles_id ?? [];
    addDialog({
      title: `分配用户 ${row.username} 的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        UpdateUser(row?.id, { roles: curData.ids }).then(async res => {
          if (res.code === 200) {
            message(`用户 ${row.username} 角色分配成功`, {
              type: "success"
            });
            onSearch();
          } else {
            message(`操作失败，${res.message}`, { type: "error" });
          }
          done(); // 关闭弹框
        });
      }
    });
  }

  onMounted(async () => {
    onSearch();
    // 角色列表
    const roleList = (await getAllRoleList()).data;
    roleOptions.value = roleList.results;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    isMobile,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleUpdate,
    handleDelete,
    handleReset,
    handleRole,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
