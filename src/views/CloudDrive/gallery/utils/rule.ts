/*
 * @Author: XDTEAM
 * @Date: 2025-03-20 21:58:17
 * @LastEditTime: 2025-03-21 21:16:24
 * @LastEditors: XDTEAM
 * @Description:
 */
import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** IP地址正则 */
export const REGEXP_IP =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/** 自定义表单规则校验 */
export const formRules = reactive<FormRules>({
  ip: [
    { required: true, message: "IP地址为必填项", trigger: "blur" },
    {
      pattern: REGEXP_IP,
      message: "请输入正确的IP地址格式",
      trigger: "blur"
    }
  ]
});
