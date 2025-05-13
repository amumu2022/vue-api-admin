interface FormItemProps {
  id?: number;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  name: string;
  size?: string;
  path?: string;
  parent_path?: string;
  content?: string;
  extension?: string;
  isDir?: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
