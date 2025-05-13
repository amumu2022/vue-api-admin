import type { OptionsType } from "@/components/ReSegmented";

const TokenOptions: Array<OptionsType> = [
  {
    label: "需要",
    icon: "mingcute:check-2-fill",
    tip: "需要token",
    value: true
  },
  {
    label: "不需要",
    tip: "不需要token",
    icon: "mingcute:close-fill",
    value: false
  }
];

const StatusOptions: Array<OptionsType> = [
  {
    label: "启用",
    icon: "mingcute:check-2-fill",
    tip: "API启用状态",
    value: true
  },
  {
    label: "关闭",
    icon: "mingcute:close-fill",
    tip: "API关闭状态",
    value: false
  }
];

const FreeOptions: Array<OptionsType> = [
  {
    label: "免费",
    icon: "mingcute:check-2-fill",
    tip: "API免费使用",
    value: true
  },
  {
    label: "收费",
    icon: "mingcute:close-fill",
    tip: "API收费使用",
    value: false
  }
];

export { TokenOptions, FreeOptions, StatusOptions };
