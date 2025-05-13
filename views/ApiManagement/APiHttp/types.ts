export interface ApiItem {
  id: number;
  parent_id: number | null;
  enable?: boolean;
  funcName: string;
  methods: string[];
  path: string;
  free?: boolean;
  today_call?: number;
  total_call?: number;
  daily_call_limit?: number;
  total_call_limit?: number;
  points?: number;
  summary: string;
  params?: Array<{
    name: string;
    in: string;
    required: boolean;
    description?: string;
    schema?: {
      type?: string;
      default?: any;
      title?: string;
      description?: string;
      format?: string;
    };
  }>;
  model?: {
    $ref?: string;
    type?: string;
    title?: string;
    description?: string;
    properties?: Record<
      string,
      {
        type: string;
        default?: any;
        title?: string;
        description?: string;
        format?: string;
      }
    >;
    required?: string[];
  };
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
  params?: Record<string, any>;
  body?: any;
}
