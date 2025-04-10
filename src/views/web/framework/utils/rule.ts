/*
 * @Author: XDTEAM
 * @Date: 2025-04-08 22:17:34
 * @LastEditTime: 2025-04-10 22:58:58
 * @LastEditors: XDTEAM
 * @Description:
 */
import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 定义邮箱正则表达式 */
export const REGEXP_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

/** 邮箱配置表单规则校验 */
const emailConfigRules = reactive<FormRules>({
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入邮箱地址"));
        } else if (!REGEXP_EMAIL.test(value)) {
          callback(new Error("请输入正确的邮箱地址格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  code: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入授权码"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  observer: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请选择运行商"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

/** 邮箱配置表单规则校验 */
const emailSendRules = reactive<FormRules>({
  mailto_list: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入邮箱地址"));
        } else if (!REGEXP_EMAIL.test(value)) {
          callback(new Error("请输入正确的邮箱地址格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  title: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("邮件主题为必填项"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  text: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("邮件内容为必填项"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
export { emailConfigRules, emailSendRules };
