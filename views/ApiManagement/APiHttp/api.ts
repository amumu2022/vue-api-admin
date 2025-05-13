import type { RequestParams } from "./types";
import type { ApiGroup, ApiItem } from "@/views/ApiManagement/APiHttp/types";
import { message } from "@/utils/message";

export const sendApiRequest = async (params: RequestParams) => {
  const { baseUrl, path, method, token, params: queryParams, body } = params;

  // 处理URL拼接
  const url = baseUrl.endsWith("/")
    ? `${baseUrl}${path.startsWith("/") ? path.slice(1) : path}`
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  // 处理查询参数
  const searchParams = new URLSearchParams();
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  // 添加token参数
  if (token) {
    searchParams.append("token", token);
  }

  // 构建完整URL
  const fullUrl = `${url}?${searchParams.toString()}`;

  // 模拟请求
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const init: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    // GET/HEAD请求不能有body
    if (method !== "GET" && method !== "HEAD" && body) {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, init);
    message(`请求成功`, { type: "success" });
    return await response.json();
  } catch (error) {
    message(`API请求错误`, { type: "error" });
    console.error("API请求错误:", error);
    throw error;
  }
};

/** 将OpenAPI格式转换为树形结构 */
export const convertOpenApiToTree = (
  openApiData: Record<string, any>
): ApiGroup[] => {
  const result: ApiGroup[] = [];
  const pathMap = new Map<string, ApiGroup>();
  let idCounter = 1;

  // 遍历所有API路径
  for (const [path, methods] of Object.entries(openApiData.paths || {})) {
    for (const [method, details] of Object.entries(methods as object)) {
      const operation = details as any;
      const tag = operation.tags?.[0] || "未分类";

      // 查找或创建分组
      let group = pathMap.get(tag);
      if (!group) {
        group = {
          id: idCounter++,
          name: tag,
          children: []
        };
        pathMap.set(tag, group);
        result.push(group);
      }

      // 提取parameters和requestBody
      const params: ApiItem["params"] =
        operation.parameters?.map((param: any) => ({
          name: param.name,
          in: param.in,
          required: param.required,
          description: param.description,
          schema: param.schema
        })) || [];

      // 处理requestBody和schemas
      const requestSchema =
        operation.requestBody?.content?.["application/json"]?.schema;
      let model: ApiItem["model"] = null;

      if (requestSchema?.$ref) {
        // 处理$ref引用
        const refName = requestSchema.$ref.split("/").pop();
        model = openApiData.components?.schemas?.[refName]
          ? {
              ...openApiData.components.schemas[refName]
            }
          : null;
      } else if (requestSchema) {
        // 直接使用schema
        model = {
          ...requestSchema
        };
      }

      // 添加API项
      group.children.push({
        id: idCounter++,
        parent_id: group.id,
        funcName: operation.operationId || "",
        methods: [method.toUpperCase()],
        path: path,
        summary: operation.summary || "",
        params: params,
        model: model
      });
    }
  }
  console.log(result);
  return result;
};
