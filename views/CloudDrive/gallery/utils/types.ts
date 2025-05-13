interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  ip: string;
  block_time?: number;
  enable: boolean;
  status?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
