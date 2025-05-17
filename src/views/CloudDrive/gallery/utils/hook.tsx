import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getImageList, XFJParse, deleteImage } from "@/api/private/cloudDrive";
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
    type: undefined,
    uploader: undefined,
    time: undefined,
    currentPage: 1,
    pageSize: 10
  });
  const dataList = ref([]);
  const loading = ref(true);
  const imageUrl = ref(""); // 存储当前预览的图片URL

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

  const handlePreview = async row => {
    loading.value = true;
    try {
      const ImageInfo = await XFJParse({
        image_url: row.image_url,
        access_password: row.access_password
      });
      if (!ImageInfo.success) {
        message(`解析失败: ${ImageInfo.message}`, { type: "error" });
        return;
      }
      imageUrl.value = ImageInfo.data.link;
    } catch (error) {
      message(`解析失败: ${error.message}`, { type: "error" });
    } finally {
      loading.value = false;
    }
  };

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
      label: "图片",
      prop: "image",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <div style="cursor: pointer;">
          <el-image
            style="width: 50px; height: 50px"
            src={
              row.fileIcon
                ? row?.fileIcon
                : "https://fakeimg.pl/50x50/?retina=1&text=%E9%A2%84%E8%A7%88&font=noto"
            }
            fit="cover"
            preview-teleported
            preview-src-list={imageUrl.value ? [imageUrl.value] : []}
            initial-index={0}
            loading="lazy"
            onClick={() => handlePreview(row)}
          />
        </div>
      )
    },
    {
      label: "图片类型",
      prop: "typeData",
      minWidth: 120,
      cellRenderer: ({ row }) => (
        <el-tag type="success">
          {`${row.parrent_type} - ${row.child_type}`}
        </el-tag>
      )
    },
    {
      label: "图片大小",
      prop: "file_size",
      minWidth: 100,
      formatter: ({ file_size }) => {
        return file_size.toFixed(2) + " KB";
      }
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
      label: "上传者",
      prop: "uploader",
      minWidth: 100
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
    deleteImage(row.id).then(async res => {
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
    const { data } = await getImageList(toRaw(form));
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
    previewUrl,
    imageUrl
  };
}
