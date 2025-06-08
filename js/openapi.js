/** 将OpenAPI格式转换为树形结构 */
const convertOpenApiToTree = (openApiData) => {
  const result = [];
  const pathMap = new Map();
  let idCounter = 1;

  // 遍历所有API路径
  for (const [path, methods] of Object.entries(openApiData.paths || {})) {
    for (const [method, details] of Object.entries(methods)) {
      const operation = details;
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
      const params =
        operation.parameters?.map((param) => ({
          name: param.name,
          in: param.in,
          required: param.required,
          description: param.description,
          schema: param.schema
        })) || [];

      // 处理requestBody和schemas
      const requestSchema =
        operation.requestBody?.content?.["application/json"]?.schema;
      let model = null;

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
        description: operation.description || "",
        params: convertParamsToArray(params),
        body: convertPropertiesToArray(model)
      });
    }
  }
  return result;
};

const convertPropertiesToArray = (item) => {
  // 初始化 body 数据
  var body =  item
    ? Object.fromEntries(
        Object.entries(item)
      )
    : {};
      
    return body;
};

const convertParamsToArray = (item) => {
  // 初始化 params 数据
  var params = item.reduce((acc, param) => {
    acc[param.name] = {
      name: param.name,
      type: param.schema?.type,
      default: param.schema?.default,
    };
    return acc;
  }, {});

    return params;
};


/**
 * 根据 funcName 获取对应的 JSON 数据
 * @param {Array} treeData - 树形结构的 API 数据
 * @param {string} id - 要查找的 id
 * @returns {Object|null} - 返回对应的 JSON 数据或 null
 */
const getApiDataByUrl = (treeData, id) => {
  for (const group of treeData) {
    for (const child of group.children) {
      console.log(child.id, id);
      if (String(child.id) === id) {
        return child;
      }
    }
  }
  return null; // 如果未找到，返回 null
};
