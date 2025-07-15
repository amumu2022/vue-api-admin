// 动态获取API数据
function fetchApiModelData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${CONFIG.API_BASE_URL}/api/apiInfo/getApiRoutesModel`,
      type: "GET",
      headers: {
        Accept: "application/json, text/plain, */*"
      },
      success: function (response) {
        if (response.code === 200 && response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.message || "获取API数据失败"));
        }
      },
      error: function (xhr, status, error) {
        reject(new Error(error));
      }
    });
  });
}

// 从URL获取url参数
function getUrlFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("url");
}

function getRootPath() {
  const { origin, pathname } = window.location;
  // 获取到最后一个/，保留目录部分
  const dir = pathname.substring(0, pathname.lastIndexOf("/") + 1);
  return origin + dir;
}

// 创建API详情页面
async function createApiHTML() {
  try {
    // 获取url
    const url = getUrlFromURL();
    if (!url) {
      throw new Error("缺少url参数");
    }

    // 获取API数据
    const apiModelData = await fetchApiModelData();
    const apiTree = convertOpenApiToTree(apiModelData);
    const apiData = getApiDataByUrl(apiTree, url);

    if (!apiData) {
      throw new Error(`找不到url为${url}的API`);
    }

    // 渲染页面内容
    document.querySelector(".api-title").textContent = apiData.summary;
    // 修改这里，拼接根路径和apiData.path
    document.getElementById("apiUrl").textContent =
      getRootPath().replace(/\/$/, "") + apiData.path;
    document.getElementById("apiMethod").textContent =
      apiData.methods.join("/");
    document.getElementById("apiFormat").textContent = "JSON";
    document.getElementById("apiDescription").innerHTML = apiData.description
      .replace(/\n/g, "<br>") // 将换行符替换为 <br>
      .replace(/ /g, "&nbsp;"); // 将空格替换为 &nbsp;

    // 渲染Query参数表格
    renderQueryParams(apiData);
    // 渲染Body参数表格
    renderBodyParams(apiData);
    // 设置事件监听器
    setupEventListeners();
  } catch (error) {
    console.error("初始化API详情页失败:", error);
    document.querySelector(".api-card").innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${error.message || "初始化API详情页失败"}</p>
      </div>
    `;
  }
}

// 渲染Query参数
function renderQueryParams(apiData) {
  const tbody = document.querySelector("#queryParamsTable tbody");
  tbody.innerHTML = "";

  if (!apiData.params) return;

  for (const [param, details] of Object.entries(apiData.params)) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="param-name">${param}</td>
      <td><span class="param-optional">否</span></td>
      <td><span class="param-type">${details.type || "string"}</span></td>
      <td>${details.default || ""}</td>
      <td>${details.name || ""}</td>
    `;
    tbody.appendChild(row);
  }
}

// 渲染Body参数
function renderBodyParams(apiData) {
  const tbody = document.querySelector("#bodyParamsTable tbody");
  tbody.innerHTML = "";

  if (!apiData.body || !apiData.body.properties) return;

  const requiredFields = apiData.body.required || [];

  for (const [param, details] of Object.entries(apiData.body.properties)) {
    const isRequired = requiredFields.includes(param);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="param-name">${param}</td>
      <td><span class="${isRequired ? "param-required" : "param-optional"}">
        ${isRequired ? "是" : "否"}
      </span></td>
      <td><span class="param-type">${details.type || "string"}</span></td>
      <td>${details.description || ""}</td>
    `;
    tbody.appendChild(row);
  }
}

// 设置事件监听器
function setupEventListeners() {
  // 复制API URL
  document.getElementById("apiUrl").addEventListener("click", copyApiUrl);

  // 设置悬停效果
  document.getElementById("apiUrl").addEventListener("mouseenter", function () {
    this.style.backgroundColor = "rgba(43, 138, 240, 0.2)";
    this.title = "点击复制接口地址";
  });

  document.getElementById("apiUrl").addEventListener("mouseleave", function () {
    this.style.backgroundColor = "";
  });
}

// 显示Toast通知
function showToast(message) {
  const toast = document.getElementById("toast");
  if (message) {
    toast.querySelector("span").textContent = message;
  }
  toast.style.display = "flex";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

// 复制API URL
function copyApiUrl() {
  const url = document.getElementById("apiUrl").textContent.trim();

  // 创建临时textarea用于复制
  const textarea = document.createElement("textarea");
  textarea.value = url;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    showToast("接口地址已复制!");
  } catch (err) {
    showToast("复制失败，请手动复制");
  }

  // 清除临时元素
  document.body.removeChild(textarea);
}

// 初始化页面
document.addEventListener("DOMContentLoaded", createApiHTML);
