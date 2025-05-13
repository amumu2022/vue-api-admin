interface FormItemProps {
  EmailSet?: EmailSet;
  emailSend?: EmailSend;
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

export type { FormItemProps, FormProps, EmailSet, EmailSend };
