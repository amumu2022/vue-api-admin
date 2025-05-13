import { getAllRoleList } from "@/api/apiCtrl/memberShip";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";

export function useRole() {
  const form = reactive({
    name: "",
    currentPage: 1,
    pageSize: 10
  });
  const dataList = ref([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes: [5],
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
      minWidth: 60
    },
    {
      label: "角色编号",
      hide: true,
      prop: "id"
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "角色权限",
      prop: "permissions",
      minWidth: 280,
      cellRenderer: ({ row, props }) => {
        return (
          <div
            class="tag-container"
            style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"
          >
            {row.permissions?.map(permission => (
              <el-tag size={props.size} type="primary" effect="dark">
                {permission.name}
              </el-tag>
            ))}
          </div>
        );
      }
    }
  ];

  async function onSearch() {
    loading.value = true;
    const { data } = await getAllRoleList();
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
    onSearch,
    resetForm
  };
}
