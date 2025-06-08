export type Result = {
  success: boolean;
  data?: {
    /** 列表数据 */
    results: any;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    size?: number;
    /** 当前页数 */
    page?: number;
  };
};

export type ResultDetail = {
  success: boolean;
  message: string;
  code: number;
  total?: number;
  data: any;
};

export type MockDetail = {
  success?: boolean;
  data: any;
};

export interface Data {
  items?: any;
  item?: any;
  results?: any;
  result?: any;
}
