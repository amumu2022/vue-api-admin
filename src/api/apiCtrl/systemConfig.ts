import { http } from "@/utils/http";
import type { ResultDetail } from "@/api/types";

/** 获取系统配置 */
export const getSystemConfig = () => {
  return http.request<ResultDetail>("get", "/api/systemConfig/get");
};

/** 更新系统配置 */
export const updateSystemConfig = (data: object) => {
  return http.request<ResultDetail>("put", "/api/systemConfig/update", {
    data
  });
};
