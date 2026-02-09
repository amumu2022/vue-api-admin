// API页面专用JS - api.js
// 图标库 - 随机图标类名
const iconClasses = [
  "fas fa-font", "fas fa-sliders-h", "fas fa-key", "fas fa-video",
  "fas fa-film", "fas fa-play-circle", "fas fa-cloud-download-alt",
  "fas fa-code", "fas fa-cog", "fas fa-database", "fas fa-wifi",
  "fas fa-shield-alt", "fas fa-camera", "fas fa-headphones", "fas fa-music"
];

// 全局缓存API数据
let cachedApiData = null;

// 获取URL参数
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// 处理URL中的category参数
function handleUrlCategory() {
  const category = getUrlParameter('category');
  if (category) {
    // 查找对应的导航标签并激活
    const navPills = document.querySelectorAll(".nav-pill");
    navPills.forEach(function(pill) {
      pill.classList.remove("active");
      if (pill.getAttribute("data-category") === category) {
        pill.classList.add("active");
      }
    });
    
    // 显示对应的分类
    if (category === "all") {
      showAllApis();
    } else {
      showCategoryApis(category);
      scrollToCategory(category);
    }
  }
}

// 动态获取API数据
function fetchApiData() {
  if (cachedApiData) {
    renderApiData(cachedApiData);
    generateApiNavPills(cachedApiData);
    handleUrlCategory();
    return;
  }

  $.ajax({
    url: "/api/apiInfo/getApiRoutes",
    type: "POST",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ summary: "", pageSize: 10, currentPage: 1 }),
    success: function(response) {
      $(".loader").hide();
      if (response.code === 200 && response.success && response.data && response.data.length > 0) {
        cachedApiData = response.data;
        renderApiData(response.data);
        generateApiNavPills(response.data);
        handleUrlCategory();
      } else {
        $("#api-content").html('<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>没有获取到API数据</p></div>');
      }
    },
    error: function(xhr, status, error) {
      $(".loader").hide();
      $("#api-content").html('<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>API请求失败: ' + error + '</p></div>');
    }
  });
}

// 渲染API数据
function renderApiData(categories) {
  let contentHtml = "";
  categories.forEach(function(category) {
    if (!category.children || category.children.length === 0) return;
    let apiCardsHtml = "";
    category.children.forEach(function(api) {
      const randomIcon = iconClasses[Math.floor(Math.random() * iconClasses.length)];
      apiCardsHtml += createCardHTML(api, randomIcon);
    });
    contentHtml += '<div class="category-section" data-category-name="' + category.name + '">' +
      '<h2 class="category-title">' + category.name + '</h2>' +
      '<p class="category-subtitle">' + category.children.length + '个API服务</p>' +
      '<div class="api-grid">' + apiCardsHtml + '</div></div>';
  });
  $("#api-content").html(contentHtml);
  $(".api-card").on("click", function() {
    const path = $(this).data("path");
    if (path) window.open("desc.html?url=" + path, "_blank");
  });
}

// 创建卡片HTML
function createCardHTML(api, iconClass) {
  const disableClass = api.enable ? "" : "disable";
  const displayPoints = api.free ? 0 : api.points;
  return '<div class="api-card ' + disableClass + '" data-path="' + (api.path || "") + '">' +
    '<div class="card-header"><div class="card-icon"><i class="' + iconClass + '"></i></div>' +
    '<div class="card-status ' + (api.enable ? "status-active" : "status-inactive") + '">' + (api.enable ? "正常" : "维护") + '</div></div>' +
    '<h3 class="card-title">' + api.summary + '</h3>' +
    '<p class="card-description">' + api.description.split("\n")[0] + '</p>' +
    '<div class="call-count">调用: <strong>' + api.total_call + '</strong></div>' +
    '<div class="card-meta">' +
    '<div class="meta-item"><i class="fas ' + (api.free ? "fa-check-circle free-true" : "fa-times-circle free-false") + '"></i>' +
    '<span class="' + (api.free ? "free-true" : "free-false") + '">' + (api.free ? "免费" : "付费") + '</span></div>' +
    '<div class="meta-item"><i class="fas ' + (api.token ? "fa-key token-true" : "fa-unlock token-false") + '"></i>' +
    '<span class="' + (api.token ? "token-true" : "token-false") + '">' + (api.token ? "需密钥" : "免密") + '</span></div></div>' +
    '<div class="stats-row"><div class="stats-item"><i class="fas fa-tachometer-alt"></i><span>QPS: ' + api.qps + '</span></div>' +
    '<div class="stats-item"><i class="fas fa-coins"></i><span>积分: ' + displayPoints + '/次</span></div></div></div>';
}

// 生成API导航标签
function generateApiNavPills(apiData) {
  const apiNav = document.getElementById("api-nav-pills");
  if (!apiNav || !apiData) return;
  
  let navHtml = '<a class="nav-pill active" data-category="all">所有接口</a>';
  apiData.forEach(function(category) {
    if (category.name && category.children && category.children.length > 0) {
      navHtml += '<a class="nav-pill" data-category="' + category.name + '">' + category.name + '</a>';
    }
  });
  apiNav.innerHTML = navHtml;
  
  const navPills = apiNav.querySelectorAll(".nav-pill");
  navPills.forEach(function(pill) {
    pill.addEventListener("click", function(e) {
      e.preventDefault();
      navPills.forEach(function(p) { p.classList.remove("active"); });
      this.classList.add("active");
      const category = this.getAttribute("data-category");
      if (category === "all") {
        showAllApis();
      } else {
        showCategoryApis(category);
        scrollToCategory(category);
      }
    });
  });
}

// 显示所有API
function showAllApis() {
  document.querySelectorAll(".category-section").forEach(function(section) {
    section.style.display = "block";
    section.querySelectorAll(".api-card").forEach(function(card) { card.style.display = ""; });
  });
}

// 显示指定分类
function showCategoryApis(categoryName) {
  document.querySelectorAll(".category-section").forEach(function(section) {
    const title = section.querySelector(".category-title");
    section.style.display = (title && title.textContent.trim() === categoryName) ? "block" : "none";
  });
}

// 滚动到分类
function scrollToCategory(categoryName) {
  document.querySelectorAll(".category-title").forEach(function(title) {
    if (title.textContent.trim() === categoryName) {
      title.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// 搜索功能
function setupAdvancedSearch() {
  const searchBox = document.getElementById("api-search");
  if (!searchBox) return;
  
  searchBox.addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase().trim();
    const apiCards = document.querySelectorAll(".api-card");
    const categorySections = document.querySelectorAll(".category-section");
    
    if (searchTerm === "") {
      categorySections.forEach(function(s) { s.style.display = "block"; });
      apiCards.forEach(function(c) { c.style.display = ""; });
      return;
    }
    
    const matchedCategories = new Set();
    apiCards.forEach(function(card) {
      const title = card.querySelector(".card-title").textContent.toLowerCase();
      const desc = card.querySelector(".card-description").textContent.toLowerCase();
      const categorySection = card.closest(".category-section");
      if (title.includes(searchTerm) || desc.includes(searchTerm)) {
        card.style.display = "";
        if (categorySection) matchedCategories.add(categorySection);
      } else {
        card.style.display = "none";
      }
    });
    
    // 隐藏不包含搜索内容的分类
    categorySections.forEach(function(section) {
      section.style.display = matchedCategories.has(section) ? "block" : "none";
    });
  });
}

// 处理侧边栏API类型点击
function handleSidebarCategoryClick(category) {
  // 更新导航标签的活动状态
  const navPills = document.querySelectorAll(".nav-pill");
  navPills.forEach(function(pill) {
    pill.classList.remove("active");
    if (pill.getAttribute("data-category") === category) {
      pill.classList.add("active");
    }
  });
  
  // 显示对应的分类
  if (category === "all") {
    showAllApis();
  } else {
    showCategoryApis(decodeURIComponent(category));
    scrollToCategory(decodeURIComponent(category));
  }
  
  // 更新URL但不刷新页面
  const newUrl = category === "all" ? "./api.html" : `./api.html?category=${category}`;
  history.pushState({category: category}, "", newUrl);
}

// 处理浏览器前进/后退按钮
function setupPopStateHandler() {
  window.addEventListener("popstate", function(event) {
    if (event.state && event.state.category !== undefined) {
      const category = event.state.category;
      // 更新导航标签的活动状态
      const navPills = document.querySelectorAll(".nav-pill");
      navPills.forEach(function(pill) {
        pill.classList.remove("active");
        if (pill.getAttribute("data-category") === category) {
          pill.classList.add("active");
        }
      });
      // 显示对应的分类
      if (category === "all") {
        showAllApis();
      } else {
        showCategoryApis(decodeURIComponent(category));
        scrollToCategory(decodeURIComponent(category));
      }
    }
  });
}

// 初始化API页面
$(document).ready(function() {
  setupAdvancedSearch();
  fetchApiData();
  setupPopStateHandler();
  // 将handleSidebarCategoryClick函数暴露到全局作用域
  window.handleSidebarCategoryClick = handleSidebarCategoryClick;
});
