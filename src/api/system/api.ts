import { http } from "@/utils/http";
import type { ResultDetail } from "@/api/types";

/** 发送邮件 */
export const ApiSendEmail = (data?: object) => {
  return http.request<ResultDetail>("post", "/api/send_email", {
    data
  });
};
