import dayjs from "dayjs";
import editForm from "../form.vue";
import { FolderOpened, Document } from "@element-plus/icons-vue";

import { message } from "@/utils/message";
import {
  getFileData,
  UpdateFile,
  createFileApi,
  getFileContent,
  deleteFileApi,
  createFoldApi,
  getFileLastData
} from "@/api/system/file";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import { deviceDetection } from "@pureadmin/utils";
const isMobile = ref(deviceDetection());
import { h, ref, toRaw, reactive, onMounted, computed } from "vue";
import { useCopyToClipboard } from "@pureadmin/utils";

const { clipboardValue, copied } = useCopyToClipboard();

const copyString = string => {
  clipboardValue.value = string;
  if (copied.value) {
    message(`复制成功`, { type: "success" });
  }
};

export function useRole() {
  const form = reactive({
    currentPage: 1,
    pageSize: 10
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);

  const exportExcel = () => {
    ExportExcel(dataList, columns);
  };

  const rightRoute = ref("");
  const mainRoute = ref("");
  function BackRoute() {
    onSearchLastRoute(rightRoute.value);
  }

  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      minWidth: 20
    },
    {
      label: "编号",
      prop: "id",
      hide: true
    },
    {
      label: "路径",
      prop: "path",
      hide: true
    },
    {
      label: "是否文件",
      prop: "isDir",
      hide: true
    },
    {
      label: "后缀",
      prop: "extension",
      hide: true
    },
    {
      label: "名称",
      prop: "name",
      sortable: true,
      minWidth: 120,
      cellRenderer: ({ row }) => {
        const handleButtonClick = () => {
          openDialog("打开", row);
        };

        const renderIcon = iconComponent => (
          <div style="display: flex; align-items: center">
            <el-icon>{iconComponent}</el-icon>
            <span>&nbsp; &nbsp; </span>
            <el-button
              type={row.isDir ? "danger" : "primary"}
              onClick={handleButtonClick}
              link
            >
              {row.name}
            </el-button>
          </div>
        );

        return row.isDir
          ? renderIcon(<FolderOpened />)
          : renderIcon(<Document />);
      }
    },
    {
      label: "大小",
      sortable: true,
      prop: "size",
      minWidth: 80,
      cellRenderer: ({ row }) => {
        return (
          <div>
            {row.size}
            <span>&nbsp;</span>KB
          </div>
        );
      }
    },
    {
      label: "修改时间",
      sortable: true,
      minWidth: 120,
      prop: "update_time",
      formatter: ({ update_time }) =>
        dayjs(update_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    deleteFileApi(row.id).then(async res => {
      if (res.code === 200) {
        message(`您删除了文件ID为${row.id}的这条数据`, {
          type: "success"
        });
        await onSearch();
      } else {
        message(`操作失败，${res.message}`, { type: "error" });
      }
    });
  }

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  async function onSearch() {
    loading.value = true;
    const { data } = await getFileData(toRaw(form));
    dataList.value = data.items;
    mainRoute.value = data.path;
    rightRoute.value = data.path;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearchRoute(route: string) {
    const post_data = { route: route };
    loading.value = true;
    const { data } = await getFileData(post_data);
    dataList.value = data.items;
    rightRoute.value = data.path;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function onSearchLastRoute(route: string) {
    const post_data = { route: route };
    loading.value = true;
    const { data } = await getFileLastData(post_data);
    dataList.value = data.items;
    rightRoute.value = data.path;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function openDialog(title = "打开", row?: FormItemProps) {
    if (title === "打开") {
      const post_date = {
        route: row.path
      };
      if (row.isDir) {
        onSearchRoute(row.path);
      } else {
        getFileContent(post_date).then(async res => {
          if (res.code === 200) {
            row.content = res.data;
            addDialog({
              title: `${title}文件`,
              props: {
                formInline: {
                  title,
                  content: row?.content ?? "",
                  extension: row?.extension ?? "",
                  name: row?.name ?? "",
                  parent_path: row?.parent_path ?? "",
                  path: row?.path ?? ""
                }
              },
              width: "46%",
              draggable: true,
              fullscreen: deviceDetection(),
              fullscreenIcon: true,
              closeOnClickModal: false,
              contentRenderer: () => h(editForm, { ref: formRef }),
              beforeSure: (done, { options }) => {
                const FormRef = formRef.value.getRef();
                const curData = options.props.formInline as FormItemProps;
                function chores() {
                  message(`您编辑了文件为${curData.name}的这条数据`, {
                    type: "success"
                  });
                  done();
                  onSearchRoute(row.parent_path);
                }
                FormRef.validate(valid => {
                  if (valid) {
                    UpdateFile(curData).then(async res => {
                      if (res.code === 200) {
                        await chores();
                      } else {
                        message(`操作失败，${res.message}`, {
                          type: "error"
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            message(`操作失败，${res.message}`, { type: "error" });
          }
        });
      }

      return;
    } else if (title === "删除") {
      const post_date = { path: row.path };

      deleteFileApi(post_date).then(async res => {
        if (res.code === 200) {
          message(`您删除了文件名为${row.name}的这条数据`, {
            type: "success"
          });
          await onSearch();
        } else {
          message(`操作失败，${res.message}`, { type: "error" });
        }
      });

      return;
    }

    addDialog({
      title: `${title}`,
      props: {
        formInline: {
          title,
          content: row?.content ?? "",
          name: row?.name ?? "",
          path: row?.path ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了文件为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增文件") {
              curData.path = rightRoute.value;
              console.log(curData);
              createFileApi(curData).then(async res => {
                if (res.code === 200) {
                  await chores();
                } else {
                  message(`操作失败，${res.message}`, { type: "error" });
                }
              });
            } else if (title === "新增文件夹") {
              curData.path = rightRoute.value;
              createFoldApi(curData).then(async res => {
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

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    exportExcel,
    selectedNum,
    isMobile,
    onSearch,
    copyString,
    BackRoute,
    buttonClass,
    openDialog,
    handleDelete
  };
}
