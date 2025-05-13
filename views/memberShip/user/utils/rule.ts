/*
 * @Author: XDTEAM
 * @Date: 2025-03-20 21:58:17
 * @LastEditTime: 2025-03-21 21:16:24
 * @LastEditors: XDTEAM
 * @Description:
 */
import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isEmail } from "@pureadmin/utils";
/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,12}$/;

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
  ],

  password: [
    { required: true, message: "用户密码为必填项", trigger: "blur" },
    {
      pattern: REGEXP_PWD,
      message: "密码必须为8-12位数字、字母、符号的任意两种组合",
      trigger: "blur"
    }
  ],
  email: [
    { required: true, message: "邮箱为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("请输入正确的邮箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
