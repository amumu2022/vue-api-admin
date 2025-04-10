/*
 * @Author: XDTEAM
 * @Date: 2025-04-08 22:22:46
 * @LastEditTime: 2025-04-10 22:47:59
 * @LastEditors: XDTEAM
 * @Description: 各种函数集合
 */
import { http } from "@/utils/http";
import type { ResultDetail } from "@/api/types";

/** 发送验证码邮件 */
export const SendVerifyCodeEmail = email => {
  return http.request<ResultDetail>("get", `/api/email/send/${email}`);
};

/** 发送邮件 */
export const ApiSendEmail = (data?: object) => {
  return http.request<ResultDetail>("post", `/api/email/sendToList`, {
    data
  });
};
