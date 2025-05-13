interface FormItemProps {
  /** 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）*/
  open_type: number;
  higherMenuOptions: Record<string, unknown>[];
  parent_id: number;
  id?: number;
  title: string;
  name: string;
  url: string;
  menu_name: string;
  sort: number;
  redirect: string;
  icon: string;
  code: string;
  // keepAlive: boolean;
  // showLink: boolean;
  // showParent: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
