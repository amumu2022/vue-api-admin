import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getImageMapList, deleteImageMap } from "@/api/private/cloudDrive";
import type { PaginationProps } from "@pureadmin/table";
import { ref, toRaw, reactive, onMounted } from "vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useCopyToClipboard } from "@pureadmin/utils";

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
    platform: undefined,
    time: undefined,
    image_url: undefined,
    MD5: undefined,
    currentPage: 1,
    pageSize: 10
  });
  const dataList = ref([]);
  const loading = ref(true);

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

  const previewVisible = ref(false);
  const previewUrl = ref("");

  const columns: TableColumnList = [
    {
      label: "列表",
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
      label: "图片地址",
      prop: "image_url",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <el-button
          type="primary"
          onClick={() =>
            copyString(`${row.image_url}密码:${row.access_password}`)
          }
          link
        >
          {`点我复制`}
        </el-button>
      )
    },
    {
      label: "平台",
      prop: "platform",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        const platformMap = {
          LZ: { label: "蓝奏云", type: "primary" },
          LD: { label: "雷电云", type: "success" },
          WY: { label: "网易云", type: "warning" },
          ILZ: { label: "蓝奏云优享版", type: "danger" },
          XFJ: { label: "小飞机云盘", type: "info" }
        };

        const platform = platformMap[row.platform] || {
          label: row.platform,
          type: "default"
        };

        return <el-tag type={platform.type}>{platform.label}</el-tag>;
      }
    },
    {
      label: "图片大小",
      prop: "file_size",
      minWidth: 100,
      formatter: ({ file_size }) => {
        const mb_size = file_size / 1024 / 1024;
        return mb_size.toFixed(2) + " MB";
      }
    },
    {
      label: "上传时间",
      minWidth: 180,
      prop: "created_at",
      formatter: ({ created_at }) => {
        return dayjs(created_at).format("YYYY-MM-DD HH:mm:ss");
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
    deleteImageMap(row.id).then(async res => {
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

  function handleSizeChange(val: number) {
    form.currentPage = 1;
    form.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.currentPage = val;
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getImageMapList(toRaw(form));
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
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleDelete,
    previewVisible,
    previewUrl
  };
}
