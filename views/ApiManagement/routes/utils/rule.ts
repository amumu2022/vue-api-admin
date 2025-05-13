/*
 * @Author: XDTEAM
 * @Date: 2025-03-20 21:58:17
 * @LastEditTime: 2025-03-23 21:05:23
 * @LastEditors: XDTEAM
 * @Description:
 */
import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  username: [
    { required: true, message: "用户账号为必填项", trigger: "blur" },
    {
      min: 3,
      max: 10,
      message: "用户名长度必须在3到10位之间",
      trigger: "blur"
    }
  ]
});
