/*
 * @Author: XDTEAM
 * @Date: 2025-04-08 22:19:31
 * @LastEditTime: 2025-05-01 14:31:58
 * @LastEditors: XDTEAM
 * @Description:
 */
import { http } from "@/utils/http";
import type { Result, ResultDetail } from "@/api/types";

/** 小飞机直链获取 */
export const XFJParse = (data?: object | string) => {
  return http.request<ResultDetail>("post", "/api/cloudDrive/xfj/parse", {
    data
  });
};


/** 获取美图列表 */
export const getImageList = (data?: object | string) => {
  return http.request<Result>("post", "/api/cloudDrive/setu/get", {
    data
  });
};


/** 删除美图 */
export const deleteImage = id => {
  const url = `/api/cloudDrive/setu/del/${id}`;
  return http.request<ResultDetail>("delete", url);
};


/** 获取音乐列表 */
export const getMusicList = (data?: object | string) => {
  return http.request<Result>("post", "/api/cloudDrive/music/get", {
    data
  });
};


/** 删除音乐 */
export const deleteMusic = id => {
  const url = `/api/cloudDrive/music/del/${id}`;
  return http.request<ResultDetail>("delete", url);
};
