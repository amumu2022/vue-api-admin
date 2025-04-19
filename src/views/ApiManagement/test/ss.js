function convertToTree(openapiData) {
  const tree = [];

  Object.keys(openapiData).forEach(path => {
    Object.keys(openapiData[path]).forEach(method => {
      const operation = openapiData[path][method];
      const tag = operation.tags && operation.tags[0];

      let parentIndex = tree.findIndex(item => item.name === tag);
      if (parentIndex === -1) {
        parentIndex = tree.length;
        tree.push({
          id: parentIndex + 1,
          parent_id: null,
          name: tag || "Other",
          children: [],
          params: [],
          model: []
        });
      }

      const childId = `${parentIndex + 1}-${tree[parentIndex].children.length + 1}`;
      const parameters = operation.parameters || [];
      const requestBody = operation.requestBody
        ? operation.requestBody.content["application/json"].schema
        : {};

      tree[parentIndex].children.push({
        id: parseInt(childId),
        parent_id: tree[parentIndex].id,
        enable: true,
        funcName: operation.operationId.split("_")[0],
        methods: [method.toUpperCase()],
        path: path,
        summary: operation.summary,
        parameters: parameters.map((param, index) => ({
          paramId: index + 1,
          name: param.name,
          in: param.in,
          description: param.description,
          required: param.required,
          schema: param.schema
        })),
        requestBody: requestBody
      });
    });
  });

  return tree;
}

// 示例数据
const openapiJson = {
  openapi: "3.1.0",
  info: {
    title: "FastAPI",
    version: "0.1.0"
  },
  paths: {
    "/api/v1/captcha/1000": {
      get: {
        tags: ["验证码识别"],
        summary: "识别文字验证码",
        description: "识别数字验证码\n:param image: 图片base64编码\n:return:",
        operationId: "captcha_text_api_v1_captcha_1000_get",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/captchaModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/captcha/2000": {
      post: {
        tags: ["验证码识别"],
        summary: "识别滑动验证码",
        description:
          "识别滑动验证码\n:param bg_base64: 图片base64编码\n:param slice_base64: 图片base64编码\n:return:",
        operationId: "captcha_slice_api_v1_captcha_2000_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SlicpImageModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/verify/get_jy_w": {
      post: {
        tags: ["验证码识别"],
        summary: "获取极验V4的W值",
        description: "生成极验V4的w\n:return:",
        operationId: "get_w_api_v1_verify_get_jy_w_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JYV4"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/video/parse": {
      post: {
        tags: ["视频平台解析"],
        summary: "全解析",
        description:
          "解析链接，从所有网络下载视频/提取图像，支持100多个平台的视频分辨率\n:param post: 会自动匹配链接\n:return:",
        operationId: "video_parse_api_v1_video_parse_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UrlModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/video/v2/parse": {
      post: {
        tags: ["视频平台解析"],
        summary: "全解析V2",
        description:
          "解析链接，从所有网络下载视频/提取图像，支持100多个平台的视频分辨率\n:param post: 会自动匹配链接\n:return:",
        operationId: "video_parse_v2_api_v1_video_v2_parse_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UrlModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/video/v3/parse": {
      post: {
        tags: ["视频平台解析"],
        summary: "全解析V3",
        description:
          "解析链接，从所有网络下载视频/提取图像，支持100多个平台的视频分辨率\n:param post: 会自动匹配链接\n:return:",
        operationId: "video_parse_v3_api_v1_video_v3_parse_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UrlModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/parse/weiyun": {
      post: {
        tags: ["视频平台解析"],
        summary: "微云图片解析直链",
        description:
          "用于解析微云分享链接中的图片直链地址。\n:param post: 会自动匹配链接\n:return:",
        operationId: "MciAnalysis_api_v1_parse_weiyun_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UrlModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/parse/bilibili/image": {
      post: {
        tags: ["视频平台解析"],
        summary: "bilibili图片解析直链",
        description:
          "用于解析哔哩哔哩分享链接中的图片直链地址。\n:param post: 会自动匹配链接\n:return:",
        operationId: "BiliAnalysis_api_v1_parse_bilibili_image_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UrlModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/parse/musicqs/music": {
      post: {
        tags: ["视频平台解析"],
        summary: "汽水音乐解析",
        description: "汽水音乐解析API\n:param post: 会自动匹配链接\n:return:",
        operationId: "QSMusicAnalysis_api_v1_parse_musicqs_music_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UrlModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/kg_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷狗点歌v1",
        description: "酷狗点歌v1\n:param keyword:\n:return:",
        operationId: "kugou_order_v1_api_v1_music_order_kg_v1_get",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Keyword"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/kg_v2": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷狗点歌v2",
        description: "酷狗点歌v2\n:param keyword:\n:return:",
        operationId: "kugou_order_v2_api_v1_music_order_kg_v2_get",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Keyword"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/kg_v3": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷狗点歌v3",
        description: "酷狗点歌v3\n:param keyword:\n:return:",
        operationId: "kugou_order_v3_api_v1_music_order_kg_v3_get",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Keyword"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/kg_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷狗解析-适合没有song_id的歌曲(V1-V2)",
        description:
          "酷狗解析-适合没有song_id的歌曲\n:param hash:\n:param album_id:\n:return:",
        operationId: "kugou_parse_ALB_api_v1_music_parse_kg_v1_get",
        parameters: [
          {
            name: "hash",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Hash"
            }
          },
          {
            name: "album_id",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Album Id"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/kg_v2": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷狗解析-适合有song_id的歌曲(V3)",
        description:
          "酷狗解析-适合有song_id的歌曲\n:param hash:\n:param album_id:\n:param song_id:\n:return:",
        operationId: "kugou_parse_EID_api_v1_music_parse_kg_v2_get",
        parameters: [
          {
            name: "hash",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Hash"
            }
          },
          {
            name: "album_id",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Album Id"
            }
          },
          {
            name: "song_id",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Song Id"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/kg_v3": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷狗解析-适合有song_id的歌曲(V3)",
        description:
          "酷狗解析，成功率低\n:param hash:\n:param album_id:\n:return:",
        operationId: "kugou_parse_simple_api_v1_music_parse_kg_v3_get",
        parameters: [
          {
            name: "hash",
            in: "query",
            required: false,
            schema: {
              default: "3C1C679B224D0812113E536B9ADBEECA",
              title: "Hash"
            }
          },
          {
            name: "album_id",
            in: "query",
            required: false,
            schema: {
              default: "58101997",
              title: "Album Id"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/wy_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "网易点歌v1",
        description: "网易点歌\n:param keyword:\n:param num:\n:return:",
        operationId: "wy_order_v1_api_v1_music_order_wy_v1_get",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Keyword"
            }
          },
          {
            name: "num",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
              title: "Num"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/wy_v2": {
      get: {
        tags: ["音乐点歌"],
        summary: "网易点歌v2-已失效",
        description:
          "网易点歌\n:param keyword:\n:param page:\n:param type: 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频\n:return:",
        operationId: "wy_order_v2_api_v1_music_order_wy_v2_get",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Keyword"
            }
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 1,
              title: "Page"
            }
          },
          {
            name: "type",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 1,
              title: "Type"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/wy_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "网易解析v1",
        description: "网易解析\n:param id:\n:return:",
        operationId: "wy_parse_v1_api_v1_music_parse_wy_v1_get",
        parameters: [
          {
            name: "id",
            in: "query",
            required: false,
            schema: {
              anyOf: [
                {
                  type: "string"
                },
                {
                  type: "integer"
                }
              ],
              default: "1975781518",
              title: "Id"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/wy_v2": {
      get: {
        tags: ["音乐点歌"],
        summary: "网易解析v2-最新加密算法",
        description: "网易解析\n:param id:\n:return:",
        operationId: "wy_parse_v2_api_v1_music_parse_wy_v2_get",
        parameters: [
          {
            name: "id",
            in: "query",
            required: false,
            schema: {
              anyOf: [
                {
                  type: "string"
                },
                {
                  type: "integer"
                }
              ],
              default: "1975781518",
              title: "Id"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/kw_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷我点歌v1",
        description: "酷我点歌V1\n:param song:\n:param num:\n:return:",
        operationId: "kw_order_v1_api_v1_music_order_kw_v1_get",
        parameters: [
          {
            name: "song",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Song"
            }
          },
          {
            name: "num",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
              title: "Num"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/kw_v2": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷我点歌v2",
        description: "酷我点歌V2\n:param song:\n:param num:\n:return:",
        operationId: "kw_order_v2_api_v1_music_order_kw_v2_get",
        parameters: [
          {
            name: "song",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Song"
            }
          },
          {
            name: "num",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
              title: "Num"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/kw_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷我解析v1-速度较慢",
        description: "酷我解析v1\n:param id:\n:return:",
        operationId: "kw_parse_v1_api_v1_music_parse_kw_v1_get",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Id"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/kw_v2": {
      get: {
        tags: ["音乐点歌"],
        summary: "酷我解析v2-速度更快",
        description: "酷我解析v2\n:param id:\n:return:",
        operationId: "kw_parse_v2_api_v1_music_parse_kw_v2_get",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Id"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/mg_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "咪咕点歌v1",
        description: "咪咕点歌v1\n:param keyword:\n:param num:\n:return:",
        operationId: "migu_order_v1_api_v1_music_order_mg_v1_get",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Keyword"
            }
          },
          {
            name: "num",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
              title: "Num"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/mg_v2": {
      get: {
        tags: ["音乐点歌"],
        summary: "咪咕点歌v2",
        description: "咪咕点歌v2\n:param keyword:\n:param num:\n:return:",
        operationId: "migu_order_v2_api_v1_music_order_mg_v2_get",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "雷雨季节",
              title: "Keyword"
            }
          },
          {
            name: "num",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 50,
              title: "Num"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/mg_v1": {
      get: {
        tags: ["音乐点歌"],
        summary: "咪咕解析v1",
        description: "咪咕解析v1\n:param id:\n:param copyrightId:\n:return:",
        operationId: "migu_parse_v1_api_v1_music_parse_mg_v1_get",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Id"
            }
          },
          {
            name: "copyrightId",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Copyrightid"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/order/qq_v1": {
      post: {
        tags: ["音乐点歌"],
        summary: "QQ音乐点歌v1",
        description: "QQ音乐点歌v1\n:param keyword:\n:param num:\n:return:",
        operationId: "yqq_order_v1_api_v1_music_order_qq_v1_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/QQOrder"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/music/parse/qq_v1": {
      post: {
        tags: ["音乐点歌"],
        summary: "QQ音乐解析v1",
        description: "QQ音乐解析v1\n:param songmid:\n:return:",
        operationId: "yqq_parse_v1_api_v1_music_parse_qq_v1_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/QQParse"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/random/superpower": {
      get: {
        tags: ["随机常量"],
        summary: "随机超能力",
        operationId: "get_superpower_api_v1_random_superpower_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/taobao_image": {
      get: {
        tags: ["随机常量"],
        summary: "随机买家秀",
        operationId: "get_taobao_image_api_v1_random_taobao_image_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/yiyan": {
      get: {
        tags: ["随机常量"],
        summary: "随机一言",
        operationId: "get_yiyan_api_v1_random_yiyan_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/tuwan": {
      get: {
        tags: ["随机常量"],
        summary: "随机兔玩美女",
        operationId: "get_tuwan_api_v1_random_tuwan_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/food": {
      get: {
        tags: ["随机常量"],
        summary: "随机一种食物",
        operationId: "get_food_api_v1_random_food_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/lifeRestart": {
      get: {
        tags: ["随机常量"],
        summary: "人生重开模拟器",
        operationId: "get_lifeRestart_api_v1_random_lifeRestart_get",
        parameters: [
          {
            name: "type",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "json",
              title: "Type"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/random/video": {
      get: {
        tags: ["随机常量"],
        summary: "随机获取分类短视频",
        operationId: "get_videos_image_api_v1_random_video_get",
        parameters: [
          {
            name: "type",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "",
              title: "Type"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/random/dance_video": {
      get: {
        tags: ["随机常量"],
        summary: "随机跳舞视频",
        operationId: "get_dance_image_api_v1_random_dance_video_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/kfcv50": {
      get: {
        tags: ["随机常量"],
        summary: "KFCV50文案",
        operationId: "get_kfcv50_api_v1_random_kfcv50_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/wallpaper": {
      get: {
        tags: ["随机常量"],
        summary: "随机获取妹子图片，丝袜图居多，手机端",
        operationId: "get_wallpaper_api_v1_random_wallpaper_get",
        parameters: [
          {
            name: "type",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "",
              title: "Type"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/random/mao": {
      get: {
        tags: ["随机常量"],
        summary: "随机获取猫羽雫图片",
        operationId: "get_maoyuwen_api_v1_random_mao_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/changya": {
      get: {
        tags: ["随机常量"],
        summary: "随机唱鸭API",
        operationId: "get_changya_api_v1_random_changya_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/random/maren": {
      get: {
        tags: ["随机常量"],
        summary: "随机骂人文案",
        operationId: "get_maren_api_v1_random_maren_get",
        parameters: [
          {
            name: "level",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "max",
              title: "Level"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tuchuang/v1": {
      post: {
        tags: ["图床"],
        summary: "雷电图床",
        description: "雷电模拟器图床\n:param file: 图片二进制文件\n:return:",
        operationId: "loadImageLeiD_api_v1_tuchuang_v1_post",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Body_loadImageLeiD_api_v1_tuchuang_v1_post"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tuchuang/v2": {
      post: {
        tags: ["图床"],
        summary: "蓝奏云图床",
        description: "蓝奏云图床\n:param file: 图片二进制文件\n:return:",
        operationId: "loadImageLanZ_api_v1_tuchuang_v2_post",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Body_loadImageLanZ_api_v1_tuchuang_v2_post"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tuchuang/v3": {
      post: {
        tags: ["图床"],
        summary: "网易云图床",
        description:
          "网易严选图床\n:param file: 图片二进制文件\n:param filename: 文件名\n:return: 上传结果",
        operationId: "loadImageWangY_api_v1_tuchuang_v3_post",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Body_loadImageWangY_api_v1_tuchuang_v3_post"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/cloud/lanzou/login": {
      post: {
        tags: ["网盘类型"],
        summary: "蓝奏云登录获取cookie",
        description: "蓝奏云登录\n:param post: \n:return:",
        operationId: "LanZouLogin_api_v1_cloud_lanzou_login_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LanZouInfo"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/cloud/lanzou/get_file_info_by_id": {
      post: {
        tags: ["网盘类型"],
        summary: "蓝奏云通过 id 获取文件信息",
        description:
          "通过 id 获取文件信息\n:param file_id: \n:param post: \n:return:",
        operationId:
          "LanZou_get_file_info_by_id_api_v1_cloud_lanzou_get_file_info_by_id_post",
        parameters: [
          {
            name: "file_id",
            in: "query",
            required: true,
            schema: {
              anyOf: [
                {
                  type: "integer"
                },
                {
                  type: "string"
                }
              ],
              title: "File Id"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LanZouCookies"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/cloud/lanzou/get_dir_list": {
      post: {
        tags: ["网盘类型"],
        summary: "获取子文件夹列表",
        description:
          "获取子文件夹列表\n:param folder_id: \n:param post: \n:return:",
        operationId:
          "LanZou_yget_dir_list_api_v1_cloud_lanzou_get_dir_list_post",
        parameters: [
          {
            name: "folder_id",
            in: "query",
            required: true,
            schema: {
              anyOf: [
                {
                  type: "integer"
                },
                {
                  type: "string"
                }
              ],
              title: "Folder Id"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LanZouCookies"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/cloud/lanzou/get_file_list": {
      post: {
        tags: ["网盘类型"],
        summary: "获取文件列表",
        description:
          "获取文件列表\n:param folder_id: \n:param post: \n:return:",
        operationId:
          "LanZou_yget_file_list_api_v1_cloud_lanzou_get_file_list_post",
        parameters: [
          {
            name: "folder_id",
            in: "query",
            required: true,
            schema: {
              anyOf: [
                {
                  type: "integer"
                },
                {
                  type: "string"
                }
              ],
              title: "Folder Id"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LanZouCookies"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/cloud/lanzou/upload_files": {
      post: {
        tags: ["网盘类型"],
        summary: "上传文件",
        description:
          "蓝奏云上传\n:param folder_id: \n:param file: 图片二进制文件\n:return:",
        operationId:
          "LanZou_upload_files_api_v1_cloud_lanzou_upload_files_post",
        parameters: [
          {
            name: "folder_id",
            in: "query",
            required: true,
            schema: {
              title: "Folder Id"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Body_LanZou_upload_files_api_v1_cloud_lanzou_upload_files_post"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/cloud/lanzou/parse": {
      post: {
        tags: ["网盘类型"],
        summary: "蓝奏云直链解析",
        description: "蓝奏云直链解析\n:param post:\n:return:",
        operationId: "LanZouParse_api_v1_cloud_lanzou_parse_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LanZouLink"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/audio/dingzhen": {
      post: {
        tags: ["语音生成"],
        summary: "获取丁真语音包",
        description: "获取丁真语音包",
        operationId: "getDingZhen_api_v1_audio_dingzhen_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AiAudioModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/audio/lumi": {
      post: {
        tags: ["语音生成"],
        summary: "获取鹿鸣语音包",
        description: "获取鹿鸣语音包",
        operationId: "getLumi_api_v1_audio_lumi_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AiAudioModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/audio/naitang": {
      post: {
        tags: ["语音生成"],
        summary: "获取奶糖语音包",
        operationId: "getNaitang_api_v1_audio_naitang_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AiAudioModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/kimi/models": {
      get: {
        tags: ["chatgpt"],
        summary: "获取kimi模型",
        description: "获取models",
        operationId: "get_kimi_models_api_v1_chat_kimi_models_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/kimi/completions": {
      post: {
        tags: ["chatgpt"],
        summary: "kimi对话",
        description:
          "流式对话补全\nArgs:\n    model: 模型名称\n    messages: 参考gpt系列消息格式，多轮对话请完整提供上下文\n    refresh_token: 用于刷新access_token的refresh_token\n    use_search: 是否开启联网搜索\n    ref_conv_id: 引用会话ID\n    stream: 是否采用流式输出\n\nReturns:",
        operationId: "create_kimi_completion_api_v1_chat_kimi_completions_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/KimiModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/kimi/create_id": {
      post: {
        tags: ["chatgpt"],
        summary: "kimi获取对话id",
        description:
          "创建一个新的会话。\n:param model: 使用的模型名称，如 'kimi'。\n:param name: 会话的名称。\n:param refresh_token: 用于刷新access_token的refresh_token。\n:return: 会话的 ID。\n:raises Exception: 如果请求失败。",
        operationId: "create_kimi_conversation_api_v1_chat_kimi_create_id_post",
        parameters: [
          {
            name: "refresh_token",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Refresh Token"
            }
          },
          {
            name: "model",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "kimi",
              title: "Model"
            }
          },
          {
            name: "name",
            in: "query",
            required: false,
            schema: {
              default: "未命名对话",
              title: "Name"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/akash/models": {
      get: {
        tags: ["chatgpt"],
        summary: "获取akash模型",
        description: "获取models",
        operationId: "get_akash_models_api_v1_chat_akash_models_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/akash/completions": {
      post: {
        tags: ["chatgpt"],
        summary: "akash对话",
        description:
          "流式对话补全\nArgs:\n    model: 模型名称\n    messages: 参考gpt系列消息格式，多轮对话请完整提供上下文\n    refresh_token: 用于刷新access_token的refresh_token\n    use_search: 是否开启联网搜索\n    ref_conv_id: 引用会话ID\n    stream: 是否采用流式输出\n\nReturns:",
        operationId:
          "create_akash_completion_api_v1_chat_akash_completions_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AkashModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/akash/image/generations": {
      post: {
        tags: ["chatgpt"],
        summary: "akash生成图片",
        description:
          "AI图片生成\nArgs:\n    model:\n    prompt: 提示词\n\nReturns:",
        operationId:
          "generate_akash_images_api_v1_chat_akash_image_generations_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AkashImageModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/qwen/models": {
      get: {
        tags: ["chatgpt"],
        summary: "获取qwen模型",
        description: "获取models",
        operationId: "get_qwen_models_api_v1_chat_qwen_models_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/qwen/completions": {
      post: {
        tags: ["chatgpt"],
        summary: "qwen对话",
        description:
          "流式对话补全\nArgs:\n    model: 模型名称\n    messages: 参考gpt系列消息格式，多轮对话请完整提供上下文\n    ticket: \n    ref_conv_id: 引用会话ID\n    stream: 是否采用流式输出\n\nReturns:",
        operationId: "create_qwen_completion_api_v1_chat_qwen_completions_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/QWenModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/chat/qwen/image/generations": {
      post: {
        tags: ["chatgpt"],
        summary: "qwen生成图片",
        description:
          "AI图片生成\nArgs:\n    model:\n    prompt: 提示词\n    ticket:\n\nReturns:",
        operationId:
          "generate_qwen_images_api_v1_chat_qwen_image_generations_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/QWenImageModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/get/image/models": {
      get: {
        tags: ["文生图"],
        summary: "获取支持的模型列表",
        description: "获取模型列表\n:param post: \n:return:",
        operationId: "getModels_api_v1_get_image_models_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/image/task/status": {
      get: {
        tags: ["文生图"],
        summary: "专业版文生图进度",
        description: "专业版文生图进度\n:param post: \n:return:",
        operationId: "getProfessionalTaskStatus_api_v1_image_task_status_get",
        parameters: [
          {
            name: "taskId",
            in: "query",
            required: true,
            schema: {
              anyOf: [
                {
                  type: "string"
                },
                {
                  type: "integer"
                }
              ],
              title: "Taskid"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/image/professional/task/submit": {
      post: {
        tags: ["文生图"],
        summary: "专业版文生图",
        description: "专业版文生图\n:param post: \n:return:",
        operationId:
          "getProfessionalImage_api_v1_image_professional_task_submit_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AiImageModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/image/professional/getImageCaption": {
      post: {
        tags: ["文生图"],
        summary: "专业版图生文",
        description: "专业版图生文\n:param post: \n:return:",
        operationId:
          "getImageCaption_api_v1_image_professional_getImageCaption_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AiImageCaption"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/image/professional/CopyImage": {
      post: {
        tags: ["文生图"],
        summary: "一键模仿图",
        description: "专业版一键图生图\n:param post: \n:return:",
        operationId: "CopyPic_api_v1_image_professional_CopyImage_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AiImageCaption"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/app/checkLogin": {
      get: {
        tags: ["QQ功能实现"],
        summary: "小程序登录",
        description: "QQ_小程序通用验证\n:param code:\n:return:",
        operationId: "getApplets_login_check_api_v1_qq_app_checkLogin_get",
        parameters: [
          {
            name: "code",
            in: "query",
            required: true,
            schema: {
              title: "Code"
            }
          },
          {
            name: "appid",
            in: "query",
            required: true,
            schema: {
              title: "Appid"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/app/getLoginCode": {
      get: {
        tags: ["QQ功能实现"],
        summary: "获取小程序登录码",
        description: "获取小程序登录码\n:return: 登录码",
        operationId: "getApplets_login_url_api_v1_qq_app_getLoginCode_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/express/getLoginData": {
      get: {
        tags: ["QQ功能实现"],
        summary: "获取快递100登录信息",
        description:
          "快递100_验证\n:param code: 通用code\n:return: token, openid, logintoken",
        operationId: "kuaidi100_check_api_v1_qq_express_getLoginData_get",
        parameters: [
          {
            name: "code",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Code"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/express/getExpressName": {
      post: {
        tags: ["QQ功能实现"],
        summary: "获取快递运营信息",
        description:
          "快递100_根据快递号查运营物流\n:param express_code: 物流号\n:param openid:\n:param logintoken:\n:return:",
        operationId:
          "kuaidi100_get_yunying_api_v1_qq_express_getExpressName_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/KuaidiInfo"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/express/getExpressData": {
      post: {
        tags: ["QQ功能实现"],
        summary: "获取快递物流",
        description:
          "快递100查快递\n:param token:\n:param num: 快递单号\n:param openid:\n:param logintoken:\n:return:",
        operationId: "kuaidi100_search_api_v1_qq_express_getExpressData_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/KuaidiInfo"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/safety/getSafeData": {
      post: {
        tags: ["QQ功能实现"],
        summary: "获取QQ违规记录",
        description:
          "QQ安全中心_查违规\n:param openid:\n:param safeid:\n:return:",
        operationId: "QQ_safecenter_search_api_v1_qq_safety_getSafeData_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SafeCenter"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/safety/getLoginData": {
      get: {
        tags: ["QQ功能实现"],
        summary: "获取QQ安全中心登录信息",
        description: "QQ安全中心_验证\n:param code:\n:return:",
        operationId: "QQ_safecenter_check_api_v1_qq_safety_getLoginData_get",
        parameters: [
          {
            name: "code",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Code"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/getQQLevel": {
      get: {
        tags: ["QQ功能实现"],
        summary: "获取等级信息-私人",
        operationId: "getQQLevel_api_v1_qq_getQQLevel_get",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LevelInfo"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/qzone/login": {
      get: {
        tags: ["QQ功能实现"],
        summary: "获取QQ空间登录图片",
        description: "获取QQ空间登录\n:param daid:\n:return:",
        operationId: "getQzoneLoginImage_api_v1_qq_qzone_login_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/qzone/checkLogin": {
      post: {
        tags: ["QQ功能实现"],
        summary: "检验QQ空间登录",
        description: "检验QQ空间登录\n:return:",
        operationId: "checkQzoneLogin_api_v1_qq_qzone_checkLogin_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/QRLogin"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/login": {
      get: {
        tags: ["QQ功能实现"],
        summary: "获取QQ登录图片",
        description: "获取QQ登录图片\n:param type: 登陆类型\n:return:",
        operationId: "getQQLoginImage_api_v1_qq_login_get",
        parameters: [
          {
            name: "type",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Type"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/checkLogin": {
      post: {
        tags: ["QQ功能实现"],
        summary: "检验QQ登录",
        description:
          "检验QQ登录\n:param type: 登陆类型\n:param qrsig:\n:return:",
        operationId: "checkQQLogin_api_v1_qq_checkLogin_post",
        parameters: [
          {
            name: "type",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Type"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/QRLogin"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/task/add_friends": {
      post: {
        tags: ["QQ功能实现"],
        summary: "QQ添加好友任务-私人",
        description: "QQ添加好友任务\n:return:",
        operationId: "Task_add_friends_api_v1_qq_task_add_friends_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CommonCookiesModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/task/daily_sign": {
      post: {
        tags: ["QQ功能实现"],
        summary: "QQ每日签到任务-私人",
        description: "QQ每日签到任务\n:return:",
        operationId: "Task_daily_sign_api_v1_qq_task_daily_sign_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CommonCookiesModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/task/send_qzone": {
      post: {
        tags: ["QQ功能实现"],
        summary: "QQ空间签到任务-私人",
        description: "QQ空间签到任务\n:return:",
        operationId: "Task_send_qzone_api_v1_qq_task_send_qzone_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CommonCookiesModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/qq/info/getLevelInfo": {
      get: {
        tags: ["QQ功能实现"],
        summary: "获取指定用户等级信息-公开",
        description: "获取QQ等级信息\n:param uin:\n:return:",
        operationId: "Func_getLevelInfo_api_v1_qq_info_getLevelInfo_get",
        parameters: [
          {
            name: "uin",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Uin"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/user/get_login_url": {
      get: {
        tags: ["哔哩哔哩"],
        summary: "哔哩哔哩获取登录链接",
        description: "获取qr_key",
        operationId: "get_login_url_api_v1_bilibili_user_get_login_url_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/user/check_login": {
      get: {
        tags: ["哔哩哔哩"],
        summary: "哔哩哔哩登录检测",
        description: "检测是否登录",
        operationId: "check_login_api_v1_bilibili_user_check_login_get",
        parameters: [
          {
            name: "authkey",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Authkey"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/get_dynamic_list": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "根据uid查询动态主信息",
        description:
          "根据uid查询动态主信息\n:param uid:\n:return: Dict，code=-1，访问出错；code=-2，暂无动态；code=-3，异常错误；code=1，正常",
        operationId: "get_dynamic_list_api_v1_bilibili_get_dynamic_list_post",
        parameters: [
          {
            name: "uid",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Uid"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/action_focus": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "关注/取消关注up",
        description:
          "关注/取消关注up\n:param uid: 对方的\n:param cookie:\n:param type: 1关注；2取消\n:return:",
        operationId: "action_focus_api_v1_bilibili_action_focus_post",
        parameters: [
          {
            name: "uid",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Uid"
            }
          },
          {
            name: "type",
            in: "query",
            required: true,
            schema: {
              type: "integer",
              title: "Type"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/get_self_info": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "获取用户个人信息",
        description: "获取用户个人信息\n:param cookie:\n:return:",
        operationId: "get_self_info_api_v1_bilibili_get_self_info_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/get_user_status": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "查询每日奖励状态",
        description: "获取个人今日状态\n:param cookie:\n:return:",
        operationId:
          "get_user_today_status_api_v1_bilibili_get_user_status_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/get_random_video": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "获取随机视频",
        description: "获取随机视频",
        operationId: "get_random_video_api_v1_bilibili_get_random_video_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/action_video_like": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "点赞视频（web端）",
        description: "点赞视频（web端）\n:param type: 1点赞；2取消\n:return:",
        operationId: "action_video_like_api_v1_bilibili_action_video_like_post",
        parameters: [
          {
            name: "type",
            in: "query",
            required: true,
            schema: {
              type: "integer",
              title: "Type"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VideoActionModel"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/action_video_coin": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "投币视频（web端）",
        description:
          "投币视频（web端）\n:param multiply: 投币数量\n:param select_like: 是否附加点赞      \n:return:",
        operationId: "action_video_coin_api_v1_bilibili_action_video_coin_post",
        parameters: [
          {
            name: "select_like",
            in: "query",
            required: false,
            schema: {
              type: "boolean",
              default: true,
              title: "Select Like"
            }
          },
          {
            name: "multiply",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              default: 2,
              title: "Multiply"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VideoActionModel"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/action_video_share": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "分享视频 （Web端）",
        description: "分享视频 （Web端）\n:return:",
        operationId:
          "action_video_share_api_v1_bilibili_action_video_share_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VideoActionModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/action_video_triple": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "一键三连",
        description: "一键三连视频（web端）\n:return:",
        operationId:
          "action_video_triple_api_v1_bilibili_action_video_triple_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VideoActionModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/refresh": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "更新cookies",
        description: "刷新Cookie\n:param refresh_token: \n:return:",
        operationId: "refresh_cookies_api_v1_bilibili_refresh_post",
        parameters: [
          {
            name: "refresh_token",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Refresh Token"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/exit": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "退出登录",
        description: "退出登录(web端)\n:return:",
        operationId: "exit_api_v1_bilibili_exit_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/getWbi": {
      get: {
        tags: ["哔哩哔哩"],
        summary: "WBI 签名算法",
        description: "WBI 签名算法\n:return:",
        operationId: "getWbiSign_api_v1_bilibili_getWbi_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/bilibili/search": {
      post: {
        tags: ["哔哩哔哩"],
        summary: "综合搜索",
        description:
          "综合搜索\n:return:\n:param keyword: \n:param search_type: 搜索类型",
        operationId: "search_api_v1_bilibili_search_post",
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Keyword"
            }
          },
          {
            name: "search_type",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "video",
              title: "Search Type"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CookieModel"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/email/get_email/v1": {
      get: {
        tags: ["邮箱类型"],
        summary: "获取邮箱号V1",
        description: "获取邮箱号",
        operationId: "get_mail_24mail_api_v1_email_get_email_v1_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/email/get_content/v1": {
      post: {
        tags: ["邮箱类型"],
        summary: "获取邮箱内容V1",
        description: "获取邮箱内容\n:param post: \n:return: content",
        operationId:
          "get_email_content_24mail_api_v1_email_get_content_v1_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Email24"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/email/get_email/v2": {
      get: {
        tags: ["邮箱类型"],
        summary: "获取邮箱号V2",
        description: "获取邮箱号",
        operationId: "get_mail_api_v1_email_get_email_v2_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/email/get_content/v2": {
      get: {
        tags: ["邮箱类型"],
        summary: "获取邮箱内容V2",
        description: "获取邮箱内容\n:param email: \n:return: content",
        operationId: "get_email_content_api_v1_email_get_content_v2_get",
        parameters: [
          {
            name: "email",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Email"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/webtools/get_qrcode": {
      get: {
        tags: ["站长工具"],
        summary: "生成二维码",
        description: "借用api生成二维码\n:param text: 文本或网址\n:return:",
        operationId: "get_qrcode_api_v1_webtools_get_qrcode_get",
        parameters: [
          {
            name: "text",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Text"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/webtools/get_ip_addr": {
      get: {
        tags: ["站长工具"],
        summary: "获取指定api地址",
        description: "获取指定api地址\n:param ip: \n:return:",
        operationId: "get_ip_addr_api_v1_webtools_get_ip_addr_get",
        parameters: [
          {
            name: "ip",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Ip"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/webtools/get_ip_local": {
      get: {
        tags: ["站长工具"],
        summary: "获取公网IP",
        description: "获取公网IP\n:param ip: \n:return:",
        operationId: "get_ip_local_api_v1_webtools_get_ip_local_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/webtools/get_ip_data": {
      get: {
        tags: ["站长工具"],
        summary: "获取指定api运营商信息",
        description: "获取指定api地址及运营商\n:param ip: \n:return:",
        operationId: "get_ip_data_api_v1_webtools_get_ip_data_get",
        parameters: [
          {
            name: "ip",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Ip"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/dcd/car_sales": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取懂车帝当月销量",
        description: "获取懂车帝当月销量\n: type: 返回类型\n:return:",
        operationId: "dongchedi_month_sales_api_v1_spider_dcd_car_sales_get",
        parameters: [
          {
            name: "type",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: "json",
              title: "Type"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/hot/weibo": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取微博热点信息",
        description: "获取微博热点信息\n:return:",
        operationId: "get_hot_weibo_api_v1_spider_hot_weibo_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/hot/bilibili": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取哔哩哔哩热点信息",
        description: "获取哔哩哔哩热点信息\n:return:",
        operationId: "get_hot_bilibili_api_v1_spider_hot_bilibili_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/hot/zhihu": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取知乎热点信息",
        description: "获取知乎热点信息\n:return:",
        operationId: "get_hot_zhihu_api_v1_spider_hot_zhihu_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/hot/baidu": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取百度热点信息",
        description: "获取百度热点信息\n:return:",
        operationId: "get_hot_baidu_api_v1_spider_hot_baidu_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/news/lishi": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取历史今天",
        description: "获取历史今天\n:return:",
        operationId: "get_lishi_today_api_v1_spider_news_lishi_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/news/it": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取IT资讯",
        description: "获取IT资讯\n:return:",
        operationId: "get_it_news_api_v1_spider_news_it_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/news/game": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取游戏资讯",
        description: "获取游戏资讯\n:return:",
        operationId: "get_game_news_api_v1_spider_news_game_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/bilibili/funs": {
      get: {
        tags: ["网络数据专区"],
        summary: "获取B站新番",
        description: "获取B站新番\n:return:",
        operationId: "get_bilibili_fun_api_v1_spider_bilibili_funs_get",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    },
    "/api/v1/spider/wx/pic": {
      get: {
        tags: ["网络数据专区"],
        summary: "根据微信公众号连接获取图片",
        description: "根据微信公众号连接获取图片",
        operationId: "get_WxPic_api_v1_spider_wx_pic_get",
        parameters: [
          {
            name: "url",
            in: "query",
            required: true,
            schema: {
              type: "string",
              title: "Url"
            }
          }
        ],
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/text/filter": {
      post: {
        tags: ["文本审核"],
        summary: "DFA算法文本过滤",
        description: "DFA算法文本过滤",
        operationId: "filterKeywords_api_v1_text_filter_post",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/textModel"
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          },
          422: {
            description: "Validation Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v2/test": {
      post: {
        tags: ["测试"],
        summary: "测试",
        description: "DFA算法文本过滤",
        operationId: "test_api_v2_test_post",
        responses: {
          200: {
            description: "Successful Response",
            content: {
              "application/json": {
                schema: {}
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      AiAudioModel: {
        properties: {
          text: {
            type: "string",
            title: "Text",
            description: "生成语音的文本内容"
          }
        },
        type: "object",
        required: ["text"],
        title: "AiAudioModel",
        description: "语音生成"
      },
      AiImageCaption: {
        properties: {
          imageUrl: {
            type: "string",
            title: "Imageurl",
            description: "图像的URL地址"
          }
        },
        type: "object",
        required: ["imageUrl"],
        title: "AiImageCaption",
        description: "图像反追踪"
      },
      AiImageModel: {
        properties: {
          prompt: {
            type: "string",
            title: "Prompt",
            description: "生成图像的提示词"
          },
          negativePrompt: {
            anyOf: [
              {
                type: "string"
              },
              {
                type: "null"
              }
            ],
            title: "Negativeprompt",
            description: "生成图像的负向提示词",
            default: ""
          },
          size: {
            anyOf: [
              {
                items: {
                  type: "integer"
                },
                type: "array"
              },
              {
                type: "null"
              }
            ],
            title: "Size",
            description: "生成图像的尺寸",
            default: [1440, 1440]
          },
          model: {
            type: "string",
            title: "Model",
            description: "使用的图像生成模型"
          },
          num: {
            anyOf: [
              {
                type: "integer"
              },
              {
                type: "null"
              }
            ],
            title: "Num",
            description: "生成的图像数量",
            default: 1
          }
        },
        type: "object",
        required: ["prompt", "model"],
        title: "AiImageModel",
        description: "图像生成"
      },
      AkashImageModel: {
        properties: {
          prompt: {
            type: "string",
            title: "Prompt",
            description: "生成图像的提示词",
            default: "提示词"
          },
          model: {
            type: "string",
            title: "Model",
            description: "使用的Akash模型",
            default: "AkashGen"
          },
          wait_for_image: {
            type: "boolean",
            title: "Wait For Image",
            description: "是否等待图片生成完成，默认为True",
            default: true
          }
        },
        type: "object",
        title: "AkashImageModel",
        description: "AkashAi"
      },
      AkashModel: {
        properties: {
          messages: {
            items: {
              type: "object"
            },
            type: "array",
            title: "Messages",
            description: "对话消息列表"
          },
          ref_conv_id: {
            type: "string",
            title: "Ref Conv Id",
            description: "引用的对话ID",
            default: ""
          },
          stream: {
            type: "boolean",
            title: "Stream",
            description: "是否流式返回",
            default: false
          },
          model: {
            type: "string",
            title: "Model",
            description: "使用的Akash模型",
            default: "Meta-Llama-3-3-70B-Instruct"
          },
          cookies: {
            additionalProperties: {
              type: "string"
            },
            type: "object",
            title: "Cookies",
            description: "请求的cookies",
            default: {}
          }
        },
        type: "object",
        required: ["messages"],
        title: "AkashModel",
        description: "AkashAi"
      },
      Body_LanZou_upload_files_api_v1_cloud_lanzou_upload_files_post: {
        properties: {
          file: {
            type: "string",
            format: "binary",
            title: "File"
          }
        },
        type: "object",
        required: ["file"],
        title: "Body_LanZou_upload_files_api_v1_cloud_lanzou_upload_files_post"
      },
      Body_loadImageLanZ_api_v1_tuchuang_v2_post: {
        properties: {
          file: {
            type: "string",
            format: "binary",
            title: "File"
          }
        },
        type: "object",
        required: ["file"],
        title: "Body_loadImageLanZ_api_v1_tuchuang_v2_post"
      },
      Body_loadImageLeiD_api_v1_tuchuang_v1_post: {
        properties: {
          file: {
            type: "string",
            format: "binary",
            title: "File"
          }
        },
        type: "object",
        required: ["file"],
        title: "Body_loadImageLeiD_api_v1_tuchuang_v1_post"
      },
      Body_loadImageWangY_api_v1_tuchuang_v3_post: {
        properties: {
          file: {
            type: "string",
            format: "binary",
            title: "File"
          }
        },
        type: "object",
        required: ["file"],
        title: "Body_loadImageWangY_api_v1_tuchuang_v3_post"
      },
      CommonCookiesModel: {
        properties: {
          cookies: {
            additionalProperties: {
              type: "string"
            },
            type: "object",
            title: "Cookies",
            description: "QQ cookies 字典"
          }
        },
        type: "object",
        required: ["cookies"],
        title: "CommonCookiesModel",
        description: "QQ cookies"
      },
      CookieModel: {
        properties: {
          cookies: {
            additionalProperties: {
              type: "string"
            },
            type: "object",
            title: "Cookies",
            description: "请求的cookies"
          }
        },
        type: "object",
        required: ["cookies"],
        title: "CookieModel"
      },
      Email24: {
        properties: {
          sid: {
            type: "string",
            title: "Sid",
            description: "会话ID"
          },
          email: {
            type: "string",
            title: "Email",
            description: "临时邮箱地址"
          }
        },
        type: "object",
        required: ["sid", "email"],
        title: "Email24",
        description: "24临时邮箱"
      },
      HTTPValidationError: {
        properties: {
          detail: {
            items: {
              $ref: "#/components/schemas/ValidationError"
            },
            type: "array",
            title: "Detail"
          }
        },
        type: "object",
        title: "HTTPValidationError"
      },
      JYV4: {
        properties: {
          sliceLeft: {
            type: "integer",
            title: "Sliceleft",
            description: "滑块左侧的位置"
          },
          lot_number: {
            type: "string",
            title: "Lot Number",
            description: "批次号"
          },
          datetime: {
            type: "string",
            title: "Datetime",
            description: "日期时间"
          },
          captcha_id: {
            type: "string",
            title: "Captcha Id",
            description: "验证码ID"
          }
        },
        type: "object",
        required: ["sliceLeft", "lot_number", "datetime", "captcha_id"],
        title: "JYV4",
        description: "极验V4"
      },
      KimiModel: {
        properties: {
          messages: {
            items: {
              type: "object"
            },
            type: "array",
            title: "Messages",
            description: "对话消息列表"
          },
          ref_conv_id: {
            type: "string",
            title: "Ref Conv Id",
            description: "引用的对话ID",
            default: ""
          },
          stream: {
            type: "boolean",
            title: "Stream",
            description: "是否流式返回",
            default: false
          },
          model: {
            type: "string",
            title: "Model",
            description: "使用的kimi模型",
            default: "kimi"
          },
          refresh_token: {
            type: "string",
            title: "Refresh Token",
            description: "刷新令牌"
          },
          use_search: {
            type: "boolean",
            title: "Use Search",
            description: "是否使用搜索功能",
            default: true
          }
        },
        type: "object",
        required: ["messages", "refresh_token"],
        title: "KimiModel",
        description: "kimiAi"
      },
      KuaidiInfo: {
        properties: {
          express_code: {
            type: "string",
            title: "Express Code",
            description: "快递单号"
          },
          phone: {
            anyOf: [
              {
                type: "string"
              },
              {
                type: "null"
              }
            ],
            title: "Phone",
            description: "手机号，顺丰需要（可选）"
          },
          openid: {
            anyOf: [
              {
                type: "string"
              },
              {
                type: "null"
              }
            ],
            title: "Openid",
            description: "OpenID（可选）"
          },
          token: {
            type: "string",
            title: "Token",
            description: "访问令牌"
          },
          loginToken: {
            type: "string",
            title: "Logintoken",
            description: "登录令牌"
          }
        },
        type: "object",
        required: ["express_code", "token", "loginToken"],
        title: "KuaidiInfo",
        description: "快递查询"
      },
      LanZouCookies: {
        properties: {
          cookies: {
            additionalProperties: {
              type: "string"
            },
            type: "object",
            title: "Cookies",
            description: "蓝奏云的cookies"
          },
          uid: {
            type: "string",
            title: "Uid",
            description: "用户ID"
          }
        },
        type: "object",
        required: ["cookies", "uid"],
        title: "LanZouCookies",
        description: "蓝奏云cookies"
      },
      LanZouInfo: {
        properties: {
          account: {
            type: "string",
            title: "Account",
            description: "蓝奏云账号"
          },
          password: {
            type: "string",
            title: "Password",
            description: "蓝奏云密码"
          }
        },
        type: "object",
        required: ["account", "password"],
        title: "LanZouInfo",
        description: "蓝奏云登录"
      },
      LanZouLink: {
        properties: {
          url: {
            type: "string",
            title: "Url",
            description: "蓝奏云文件的直链"
          },
          password: {
            anyOf: [
              {
                type: "string"
              },
              {
                type: "null"
              }
            ],
            title: "Password",
            description: "蓝奏云文件的密码（可选）"
          }
        },
        type: "object",
        required: ["url"],
        title: "LanZouLink",
        description: "蓝奏云直链解析"
      },
      LevelInfo: {
        properties: {
          p_skey: {
            type: "string",
            title: "P Skey",
            description: "QQ p_skey"
          },
          skey: {
            type: "string",
            title: "Skey",
            description: "QQ skey"
          },
          qq: {
            type: "string",
            title: "Qq",
            description: "QQ号码"
          }
        },
        type: "object",
        required: ["p_skey", "skey", "qq"],
        title: "LevelInfo",
        description: "QQ等级查询"
      },
      QQOrder: {
        properties: {
          cookies: {
            additionalProperties: {
              type: "string"
            },
            type: "object",
            title: "Cookies",
            description: "QQ cookies 字典",
            default: {}
          },
          keyword: {
            type: "string",
            title: "Keyword",
            description: "搜索关键词"
          },
          num: {
            anyOf: [
              {
                type: "integer"
              },
              {
                type: "null"
              }
            ],
            title: "Num",
            description: "搜索结果数量，默认为10",
            default: 10
          }
        },
        type: "object",
        required: ["keyword"],
        title: "QQOrder"
      },
      QQParse: {
        properties: {
          cookies: {
            additionalProperties: {
              type: "string"
            },
            type: "object",
            title: "Cookies",
            description: "QQ cookies 字典",
            default: {}
          },
          songmid: {
            type: "string",
            title: "Songmid",
            description: "歌曲的MID"
          }
        },
        type: "object",
        required: ["songmid"],
        title: "QQParse"
      },
      QRLogin: {
        properties: {
          qrsig: {
            type: "string",
            title: "Qrsig",
            description: "二维码签名"
          },
          s_url: {
            type: "string",
            title: "S Url",
            description: "扫描URL"
          }
        },
        type: "object",
        required: ["qrsig", "s_url"],
        title: "QRLogin",
        description: "QQ扫码登录校验"
      },
      QWenImageModel: {
        properties: {
          model: {
            type: "string",
            title: "Model",
            description: "使用的千问图像模型",
            default: "wanxiang"
          },
          prompt: {
            type: "string",
            title: "Prompt",
            description: "生成图像的提示词",
            default: "提示词"
          },
          ticket: {
            type: "string",
            title: "Ticket",
            description: "访问令牌"
          }
        },
        type: "object",
        required: ["ticket"],
        title: "QWenImageModel",
        description: "千问Ai"
      },
      QWenModel: {
        properties: {
          messages: {
            items: {
              type: "object"
            },
            type: "array",
            title: "Messages",
            description: "对话消息列表"
          },
          ref_conv_id: {
            type: "string",
            title: "Ref Conv Id",
            description: "引用的对话ID",
            default: ""
          },
          stream: {
            type: "boolean",
            title: "Stream",
            description: "是否流式返回",
            default: false
          },
          model: {
            type: "string",
            title: "Model",
            description: "使用的千问模型",
            default: "qwen"
          },
          ticket: {
            type: "string",
            title: "Ticket",
            description: "访问令牌"
          }
        },
        type: "object",
        required: ["messages", "ticket"],
        title: "QWenModel",
        description: "千问Ai"
      },
      SafeCenter: {
        properties: {
          openid: {
            type: "string",
            title: "Openid",
            description: "OpenID"
          },
          safeid: {
            type: "string",
            title: "Safeid",
            description: "安全ID"
          }
        },
        type: "object",
        required: ["openid", "safeid"],
        title: "SafeCenter",
        description: "违规查询"
      },
      SlicpImageModel: {
        properties: {
          slice_base64: {
            type: "string",
            title: "Slice Base64",
            description: "滑动验证码切片的Base64编码"
          },
          bg_base64: {
            type: "string",
            title: "Bg Base64",
            description: "滑动验证码背景的Base64编码"
          }
        },
        type: "object",
        required: ["slice_base64", "bg_base64"],
        title: "SlicpImageModel",
        description: "滑动验证码"
      },
      UrlModel: {
        properties: {
          url: {
            type: "string",
            title: "Url"
          }
        },
        type: "object",
        required: ["url"],
        title: "UrlModel"
      },
      ValidationError: {
        properties: {
          loc: {
            items: {
              anyOf: [
                {
                  type: "string"
                },
                {
                  type: "integer"
                }
              ]
            },
            type: "array",
            title: "Location"
          },
          msg: {
            type: "string",
            title: "Message"
          },
          type: {
            type: "string",
            title: "Error Type"
          }
        },
        type: "object",
        required: ["loc", "msg", "type"],
        title: "ValidationError"
      },
      VideoActionModel: {
        properties: {
          cookies: {
            additionalProperties: {
              type: "string"
            },
            type: "object",
            title: "Cookies",
            description: "请求的cookies"
          },
          aid: {
            anyOf: [
              {
                type: "integer"
              },
              {
                type: "null"
              }
            ],
            title: "Aid",
            description: "稿件的aid"
          },
          bvid: {
            anyOf: [
              {
                type: "string"
              },
              {
                type: "null"
              }
            ],
            title: "Bvid",
            description: "稿件的bvid"
          }
        },
        type: "object",
        required: ["cookies"],
        title: "VideoActionModel",
        description: "稿件观众操作"
      },
      captchaModel: {
        properties: {
          image_base64: {
            type: "string",
            title: "Image Base64",
            description: "验证码图像的Base64编码"
          }
        },
        type: "object",
        required: ["image_base64"],
        title: "captchaModel",
        description: "验证码"
      },
      textModel: {
        properties: {
          text: {
            type: "string",
            title: "Text"
          }
        },
        type: "object",
        required: ["text"],
        title: "textModel"
      }
    }
  }
};
console.log(JSON.stringify(convertToTree(openapiJson), null, 2));
