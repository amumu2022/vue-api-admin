/*
 * @Author: XDTEAM
 * @Date: 2025-04-08 22:19:31
 * @LastEditTime: 2025-04-08 22:19:38
 * @LastEditors: XDTEAM
 * @Description:
 */
import { http } from "@/utils/http";
import type { ResultDetail } from "@/api/types";

/** 获取对接配置 */
export const getDockData = (data?: object) => {
  return http.request<ResultDetail>("post", `/api/set/dock/list`, { data });
};

/** 配置添加 */
export const createDockApi = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/set/dock/add", {
    data
  });
};

/** 更新配置数据 */
export const UpdateDock = (name: string, data?: object | string) => {
  return http.request<ResultDetail>("put", `/api/set/dock/${name}/info`, {
    data
  });
};
