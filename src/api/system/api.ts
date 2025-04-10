import { http } from "@/utils/http";
import type { ResultDetail } from "@/api/types";

/** 发送验证码邮件 */
export const SendVerifyCodeEmail = email => {
  return http.request<ResultDetail>("get", `/api/email/send/${email}`);
};
