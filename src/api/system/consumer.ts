import { http } from "@/utils/http";
import type { ResultDetail } from "@/api/types";

/** 获取用户API使用统计 */
export const getUserApiStats = (data?: object) => {
  return http.request<ResultDetail>(
    "post",
    "/api/consumer/panel/get_user_api_stats",
    {
      data: data
    }
  );
};
