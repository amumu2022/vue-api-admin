/*
 * @Author: XDTEAM
 * @Date: 2025-03-22 22:51:49
 * @LastEditTime: 2025-04-12 19:48:28
 * @LastEditors: XDTEAM
 * @Description:
 */
import { http } from "@/utils/http";
import type { ResultDetail } from "@/api/types";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: {
    roles_id?: [];
    user_role?: [];
  };
};

/** 获取api列表 */
export const getApiRoutes = (data?: object | string) => {
  return http.request<ResultDetail>("post", "/api/apiInfo/getApiRoutes", {
    data
  });
};

/** 获取api列表 */
export const getApiRoutesModel = (data?: object | string) => {
  return http.request<ResultDetail>("post", "/api/apiInfo/getApiRoutesModel", {
    data
  });
};

/** 更新api数据 */
export const UpdateApi = (funcName: string, data?: object | string) => {
  return http.request<Result>("put", `/api/apiInfo/update/${funcName}`, {
    data
  });
};

/** 同步API数据到数据库 */
export const DataSyncApi = () => {
  return http.request<Result>("get", `/api/apiInfo/action/DataSync`);
};

/** 获取API调用数量统计 */
export const getApiCalls = () => {
  return http.request<ResultDetail>("get", `/api/apiInfo/getApiCalls`);
};

/** 获取近7天的收费和免费API调用数据 */
export const getApiLastSevenData = () => {
  return http.request<ResultDetail>("get", `/api/apiInfo/getApiLastSevenData`);
};

/** 获取前10个调用最多的API */
export const getApiStatisticsTops = () => {
  return http.request<ResultDetail>("get", `/api/apiInfo/getApiStatisticsTops`);
};
