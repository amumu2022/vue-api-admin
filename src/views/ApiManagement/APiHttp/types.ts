export interface ApiItem {
  id: number;
  parent_id: number | null;
  enable: boolean;
  funcName: string;
  methods: string[];
  path: string;
  free: boolean;
  today_call: number;
  total_call: number;
  daily_call_limit: number;
  total_call_limit: number;
  points: number;
  summary: string;
}

export interface ApiGroup {
  id: number;
  name: string;
  children: ApiItem[];
}

export interface RequestParams {
  baseUrl: string;
  token: string;
  path: string;
  method: string;
  body: any;
}
