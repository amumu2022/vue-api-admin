/*
 * @Author: XDTEAM
 * @Date: 2025-03-26 21:04:52
 * @LastEditTime: 2025-06-12 22:21:12
 * @LastEditors: XDTEAM
 * @Description:
 */
import { http } from "@/utils/http";
import type { Result, ResultDetail } from "@/api/types";

export type ServerInfo = {
  success: boolean;
  message: string;
  code: number;
  data: any;
  cpuInfo?: any;
  memoryInfo?: any;
  SwapmemoryInfo?: any;
  systemInfo?: any;
  diskInfos?: any;
  python?: string;
};

// 获取日志流
export function getStreamLogs() {
  const url = "/api/monitor/logs/stream";
  return http.sse(url);
}

// 清空日志流
export const DelLogs = () => {
  return http.request<ResultDetail>("delete", "/api/monitor/logs/del");
};

/** 获取API操作日志列表 */
export const getApiList = (data?: object) => {
  return http.request<Result>("post", "/api/monitor/ApiLog/list", {
    data: data
  });
};

/** 删除API操作日志 */
export const deleteApi = userId => {
  const url = `/api/monitor/ApiLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除API操作日志 */
export const BatchDelApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/monitor/ApiLog/batch_remove",
    {
      data
    }
  );
};

/** 获取LoginAPI操作日志列表 */
export const getLoginApiList = (data?: object) => {
  return http.request<Result>("post", "/api/monitor/LoginLog/list", {
    data: data
  });
};

/** 删除LoginAPI操作日志 */
export const deleteLoginApi = userId => {
  const url = `/api/monitor/LoginLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除LoginAPI操作日志 */
export const BatchDelLoginApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/monitor/LoginLog/batch_remove",
    {
      data
    }
  );
};

/** 获取ActionLAPI操作日志列表 */
export const getActionApiList = (data?: object) => {
  return http.request<Result>("post", "/api/monitor/ActionLog/list", {
    data: data
  });
};

/** 删除ActionAPI操作日志 */
export const deleteActionApi = userId => {
  const url = `/api/monitor/ActionLog/del/${userId}`;
  return http.request<ResultDetail>("delete", url);
};

/** 批量删除ActionAPI操作日志 */
export const BatchDelActionApi = (data?: object) => {
  return http.request<ResultDetail>(
    "delete",
    "/api/monitor/ActionLog/batch_remove",
    {
      data
    }
  );
};
