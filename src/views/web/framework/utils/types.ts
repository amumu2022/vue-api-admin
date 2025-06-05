/*
 * @Author: XDTEAM
 * @Date: 2025-05-15 20:01:40
 * @LastEditTime: 2025-06-05 21:53:36
 * @LastEditors: XDTEAM
 * @Description:
 */
interface FormItemProps {
  EmailSet?: EmailSet;
  emailSend?: EmailSend;
}

/**
 * 蓝奏云/蓝奏云优享版/小飞机网盘设置
 */
interface LZYcloudDriveSet {
  username: string;
  password: string;
  folfer_id: string;
  size: number;
}

/**
 * 创空间Cookies设置
 */
interface CreatingSpaceSet {
  data: [];
}

/**
 * QQhttp设置
 */
interface QQhttpSet {
  url: string;
  bot_id: string;
}

/**
 * 邮件设置
 */
interface EmailSet {
  email?: string;
  code?: string;
  observer?: string;
}

/**
 * 邮件发信设置
 */
interface EmailSend {
  plain?: number;
  mailto_list?: string;
  title?: string;
  text?: string;
}

interface FormProps {
  formInline?: FormItemProps;
}

export type {
  FormItemProps,
  FormProps,
  LZYcloudDriveSet,
  CreatingSpaceSet,
  QQhttpSet
};
