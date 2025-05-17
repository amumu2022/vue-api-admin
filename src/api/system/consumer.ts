import { http } from "@/utils/http";
import type { Result, ResultDetail } from "@/api/types";

/** 获取用户API使用统计 */
export const getUserApiStats = () => {
  return http.request<ResultDetail>(
    "get",
    "/api/consumer/panel/get_user_api_stats"
  );
};

/** 获取用户信息 */
export const getUserApiCount = () => {
  return http.request<ResultDetail>(
    "get",
    "/api/consumer/panel/get_user_api_count"
  );
};

/** 获取用户APIlog信息 */
export const getUserApiLog = (data?: object) => {
  return http.request<Result>("post", "/api/consumer/apilog/list", {
    data: data
  });
};
