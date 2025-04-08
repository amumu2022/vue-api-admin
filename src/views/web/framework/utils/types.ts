interface FormItemProps {
  email?: EmailSet;
  emailSend?: EmailSend;
  chatgpt?: ChatGPT;
  ai?: AiSet;
  zhipu?: ZhiPu;
  sign?: Sign;
  card?: Card;
  text2pic?: Text2Pic;
  frame?: Frame;
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
  email?: string;
  code?: string;
  observer?: string;
  plain?: number;
  receiving?: string;
  title?: string;
  text?: string;
}

/**
 * ChatGPT设置
 */
interface ChatGPT {
  chat_key?: string;
  proxy?: string;
  model?: string;
  max_tokens?: string;
  continuousConversation?: boolean;
}

/**
 * 智谱AI大模型设置
 */
interface ZhiPu {
  chat_key?: string;
  model?: string;
  max_tokens?: string;
  continuousConversation?: boolean;
}

/**
 * AI 设置
 */
interface AiSet {
  type?: number;
}

/**
 * 签到设置
 */
interface Sign {
  name?: string;
  range1?: number;
  range2?: number;
}

/**
 * 卡片兑换
 */

interface Card {
  unblocking?: number; //解禁卡
  prohibition?: number; //禁言卡
  title?: number; //头衔卡
  upgrade?: number; //升管卡}
}

/**
 * 框架设置
 */

interface Frame {
  ws_url: string; //ws连接
}

/**
 * 文转图设置
 */

interface Text2Pic {
  font?: {
    model?: number;
    font_type?: string;
    font_color?: string;
    bg_color?: string;
    line_color?: string;
  };
  text?: {
    center?: number;
    convert_link?: number;
    word_limit?: number;
  };
}

interface FormProps {
  formInline?: FormItemProps;
}

export type { FormItemProps, FormProps };
