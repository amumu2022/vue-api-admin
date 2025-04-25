/*
 * @Author: XDTEAM
 * @Date: 2025-03-22 22:40:11
 * @LastEditTime: 2025-03-23 21:35:23
 * @LastEditors: XDTEAM
 * @Description:
 */
interface FormItemProps {
  path: string; // API路由
  summary: string; // API说明
  funcName?: string; // API函数名称
  methods?: string[]; // 请求方式
  points: number; // 权限点
  today_call?: number; // 今日调用
  total_call?: number; // 累计调用
  qps?: number; // QPS
  category?: string; // API分类
  daily_call_limit?: number; // 每日调用限制
  total_call_limit?: number; // 总调用限制
  free: boolean; // 是否免费
  enable: boolean; // 是否启用
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
