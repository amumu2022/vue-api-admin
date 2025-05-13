/*
 * @Author: XDTEAM
 * @Date: 2025-05-11 15:47:48
 * @LastEditTime: 2025-05-11 18:00:28
 * @LastEditors: XDTEAM
 * @Description:
 */
import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  // menu_name: [{ required: true, message: "路由名称为必填项", trigger: "blur" }],
  url: [{ required: true, message: "路由路径为必填项", trigger: "blur" }],
  code: [{ required: true, message: "权限标识为必填项", trigger: "blur" }]
});
