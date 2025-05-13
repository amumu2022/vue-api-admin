import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "版本号为必填项", trigger: "blur" }],
  content: [{ required: true, message: "更新内容为必填项", trigger: "blur" }]
});
