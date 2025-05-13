// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id?: number;
  module?: string;
  summary?: string;
  operation?: number;
  uid?: string;
  username?: string;
  ip?: string;
  system?: string;
  user_agent?: string;
  url?: string;
  path?: string;
  status?: number;
  request_params?: {
    method?: string;
    params?: any;
    body?: any;
  };
  exception?: string;
  create_time?: string;
  method?: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
