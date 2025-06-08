// 图标库 - 随机图标类名
const iconClasses = [
  "fas fa-font",
  "fas fa-sliders-h",
  "fas fa-key",
  "fas fa-video",
  "fas fa-film",
  "fas fa-play-circle",
  "fas fa-cloud-download-alt",
  "fas fa-code",
  "fas fa-cog",
  "fas fa-database",
  "fas fa-wifi",
  "fas fa-shield-alt",
  "fas fa-camera",
  "fas fa-headphones",
  "fas fa-music",
];

// 全局缓存API数据
let cachedApiData = null;

// 主题切换功能
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  // 检查本地存储或系统偏好
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "dark" || (!storedTheme && prefersDarkScheme)) {
    document.body.setAttribute("data-theme", "dark");
    themeIcon.className = "fas fa-sun";
  } else {
    document.body.setAttribute("data-theme", "light");
    themeIcon.className = "fas fa-moon";
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.body.setAttribute("data-theme", "light");
      themeIcon.className = "fas fa-moon";
      localStorage.setItem("theme", "light");
    } else {
      document.body.setAttribute("data-theme", "dark");
      themeIcon.className = "fas fa-sun";
      localStorage.setItem("theme", "dark");
    }
  });
}

// 动态获取API数据
function fetchApiData() {
  // 如果已有缓存数据，直接使用
  if (cachedApiData) {
    renderApiData(cachedApiData);
    return;
  }

  $.ajax({
    url: `${CONFIG.API_BASE_URL}/api/apiInfo/getApiRoutes`,
    type: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      summary: "",
      pageSize: 10,
      currentPage: 1,
    }),
    success: function (response) {
      // 隐藏加载指示器
      $(".loader").hide();

      if (
        response.code === 200 &&
        response.success &&
        response.data &&
        response.data.length > 0
      ) {
        // 缓存API数据
        cachedApiData = response.data;
        
        // 更新API信息
        renderApiInfo(response);

        // 计算API总数（从响应中的total字段获取）
        const apiCount = calculateTotalApis(response.data);
        $("#api-count").text(apiCount);

        // 渲染API数据
        renderApiData(response.data);
      } else {
        // 显示错误信息
        $("#api-content").html(`
          <div class="error-message">
              <i class="fas fa-exclamation-triangle"></i>
              <p>${response.message || "没有获取到API数据，请稍后再试"}</p>
          </div>
        `);
      }
    },
    error: function (xhr, status, error) {
      console.error("API请求错误:", error);
      // 隐藏加载指示器
      $(".loader").hide();
      // 显示错误信息
      $("#api-content").html(`
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>API请求失败: ${error}</p>
        </div>
      `);
    },
  });
}

// 计算API总数（如果响应中没有提供total字段）
function calculateTotalApis(categories) {
  let total = 0;
  categories.forEach((category) => {
    if (category.children && category.children.length > 0) {
      total += category.children.length;
    }
  });
  return total;
}

// 渲染API信息（版本、开发者等）
function renderApiInfo(response) {
  const apiInfoHtml = `
    <p>版本: ${response.version || "1.0.0"} | 开发者: ${
    response.auth || "XD Team"
  }</p>
    <p>${response.notice || "微信公众号：自由小屋"}</p>
    <p>技术支持: <a href="mailto:${
      response.email || "xdteam01@163.com"
    }">${response.email || "xdteam01@163.com"}</a></p>
  `;
  $("#api-info").html(apiInfoHtml);
}

// 渲染API数据
function renderApiData(categories) {
  let contentHtml = "";

  // 遍历每个分类
  categories.forEach((category) => {
    if (!category.children || category.children.length === 0) return;

    let apiCardsHtml = "";

    // 生成该分类下的API卡片
    category.children.forEach((api) => {
      // 随机选择图标
      const randomIcon =
        iconClasses[Math.floor(Math.random() * iconClasses.length)];

      apiCardsHtml += createCardHTML(api, randomIcon);
    });

    // 添加分类区域
    contentHtml += `
      <div class="category-section">
        <h2 class="category-title">${category.name}</h2>
        <p class="category-subtitle">${category.children.length}个API服务</p>
        <div class="api-grid">
          ${apiCardsHtml}
        </div>
      </div>
    `;
  });

  // 更新页面内容
  $("#api-content").html(contentHtml);

  // 绑定卡片点击事件
  $(".api-card").on("click", function () {
    const id = $(this).data("id");
    if (id) {
      window.open(`desc.html?id=${id}`, "_blank");
    }
  });
}

// 创建卡片HTML结构
function createCardHTML(api, iconClass) {
  const disableClass = api.enable ? "" : "disable";
  const displayPoints = api.free ? 0 : api.points;

  return `
    <div class="api-card ${disableClass}" 
      data-id="${api.id || ''}" 
      data-path="${api.path || ''}" 
      data-url="${api.url || ''}" 
      data-funcname="${api.funcName || ''}">
      <div class="card-header">
        <div class="card-icon">
          <i class="${iconClass}"></i>
        </div>
        <div class="card-status ${api.enable ? "status-active" : "status-inactive"}">
          ${api.enable ? "正常" : "维护"}
        </div>
      </div>
      <h3 class="card-title">${api.summary}</h3>
      <p class="card-description">${api.description}</p>
      <div class="call-count">调用: <strong>${api.total_call}</strong></div>
      <div class="card-meta">
        <div class="meta-item">
          <i class="fas ${api.free ? "fa-check-circle free-true" : "fa-times-circle free-false"}"></i>
          <span class="${api.free ? "free-true" : "free-false"}">${api.free ? "免费" : "付费"}</span>
        </div>
        <div class="meta-item">
          <i class="fas ${api.token ? "fa-key token-true" : "fa-unlock token-false"}"></i>
          <span class="${api.token ? "token-true" : "token-false"}">${api.token ? "需密钥" : "免密"}</span>
        </div>
      </div>
      <div class="stats-row">
        <div class="stats-item">
          <i class="fas fa-tachometer-alt"></i>
          <span>QPS: ${api.qps}</span>
        </div>
        <div class="stats-item">
          <i class="fas fa-coins"></i>
          <span>积分: ${displayPoints}/次</span>
        </div>
      </div>
    </div>
  `;
}

// 初始化页面
$(document).ready(function () {
  setupThemeToggle();
  fetchApiData();

  // 搜索功能
  $("#api-search").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    const apiCards = $(".api-card");

    apiCards.each(function () {
      const title = $(this).find(".card-title").text().toLowerCase();
      const desc = $(this).find(".card-description").text().toLowerCase();

      if (title.includes(searchTerm) || desc.includes(searchTerm)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
});
