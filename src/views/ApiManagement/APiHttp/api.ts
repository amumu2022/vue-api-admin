import type { RequestParams } from "./types";

export const sendApiRequest = async (params: RequestParams) => {
  const { path, method: _method } = params;
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 根据不同的API路径返回模拟数据
  if (path === "/api/v1/captcha/1000") {
    return {
      code: 200,
      data: {
        text: "ABCD",
        confidence: 0.95
      },
      message: "验证码识别成功"
    };
  } else if (path === "/api/v1/captcha/2000") {
    return {
      code: 200,
      data: {
        matched: true,
        offset: 42
      },
      message: "滑动验证码验证通过"
    };
  } else if (path === "/api/v1/verify/get_jy_w") {
    return {
      code: 200,
      data: {
        w: "a1b2c3d4e5f6g7h8i9j0"
      },
      message: "W值获取成功"
    };
  }

  throw new Error("未知的API路径");
};
