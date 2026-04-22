// 首页专用JS - home.js

// 主题切换功能
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
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

// 初始化侧边栏
function initSidebar() {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  menuToggle.addEventListener("click", function () {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  sidebarToggle.addEventListener("click", function () {
    if (window.innerWidth >= 1024) {
      sidebar.classList.toggle("collapsed");
      document.body.classList.toggle("sidebar-hidden");
    } else {
      if (sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        document.body.style.overflow = "";
      } else {
        sidebar.classList.add("active");
        sidebarOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    }
  });

  function closeSidebar() {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  sidebarOverlay.addEventListener("click", closeSidebar);

  // 子菜单展开/收起
  const submenuItems = document.querySelectorAll(".has-submenu");
  submenuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      const submenuId = this.getAttribute("data-menu") + "-submenu";
      const submenu = document.getElementById(submenuId);

      this.classList.toggle("expanded");
      submenu.classList.toggle("expanded");

      submenuItems.forEach((otherItem) => {
        if (otherItem !== this) {
          const otherSubmenuId = otherItem.getAttribute("data-menu") + "-submenu";
          const otherSubmenu = document.getElementById(otherSubmenuId);
          otherItem.classList.remove("expanded");
          otherSubmenu.classList.remove("expanded");
        }
      });
    });
  });
}

// 获取API数据并计算统计信息
function fetchApiStats() {
  $.ajax({
    url: "/api/apiInfo/getApiRoutes",
    type: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      summary: "",
      pageSize: 10,
      currentPage: 1
    }),
    success: function (response) {
      if (response.code === 200 && response.success && response.data) {
        calculateAndDisplayStats(response.data);
        renderApiInfo(response);
        // 生成API子菜单
        generateApiSubmenu(response.data);
      }
    },
    error: function (xhr, status, error) {
      console.error("API请求错误:", error);
    }
  });
}

// 动态生成API子菜单
function generateApiSubmenu(apiData) {
  const apiSubmenu = document.getElementById("api-submenu");
  if (!apiSubmenu || !apiData) return;
  
  let submenuHtml = '<a href="./api.html" class="submenu-item">所有接口</a>';
  apiData.forEach(category => {
    if (category.name && category.children && category.children.length > 0) {
      submenuHtml += `<a href="./api.html?category=${encodeURIComponent(category.name)}" class="submenu-item">${category.name}</a>`;
    }
  });
  
  apiSubmenu.innerHTML = submenuHtml;
}

// 计算并显示统计数据
function calculateAndDisplayStats(categories) {
  let totalApis = 0;
  let availableApis = 0;
  let todayCall = 0;
  let totalCall = 0;

  categories.forEach((category) => {
    if (category.children && category.children.length > 0) {
      category.children.forEach((api) => {
        totalApis++;
        // 可用接口：enable为true的
        if (api.enable === true) {
          availableApis++;
        }
        // 今日请求：today_call
        if (api.today_call) {
          todayCall += api.today_call;
        }
        // 累计请求：total_call
        if (api.total_call) {
          totalCall += api.total_call;
        }
      });
    }
  });

  // 动画显示数字
  animateNumber("total-api-count", totalApis);
  animateNumber("available-api-count", availableApis);
  animateNumber("today-call-count", todayCall);
  animateNumber("total-call-count", totalCall);
}

// 数字动画效果
function animateNumber(elementId, targetNumber) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const duration = 1500;
  const startTime = performance.now();
  const startNumber = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeProgress);
    element.textContent = formatNumber(currentNumber);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// 格式化数字（添加千位分隔符）
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 渲染API信息
function renderApiInfo(response) {
  const apiInfoHtml = `
    <p>版本: ${response.version || "1.0.0"} | 开发者: ${response.auth || "XD Team"}</p>
    <p>${response.notice || "微信公众号：自由小屋"}</p>
    <p>技术支持: <a href="mailto:${response.email || "xdteam01@163.com"}">${response.email || "xdteam01@163.com"}</a></p>
  `;
  $("#api-info").html(apiInfoHtml);
}

// 显示指定页面
function showPage(pageId) {
  const pages = document.querySelectorAll(".page-content");
  pages.forEach(page => page.classList.remove("active"));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
  }
}

// 初始化页面切换
function initPageSwitch() {
  // 侧边栏菜单切换
  const navHome = document.getElementById("nav-home");
  const navVip = document.getElementById("nav-vip");
  
  if (navHome) {
    navHome.addEventListener("click", function() {
      document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
      this.classList.add("active");
      showPage("home-content");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  
  if (navVip) {
    navVip.addEventListener("click", function() {
      document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
      this.classList.add("active");
      showPage("vip-content");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  
  // 快速入口VIP卡片点击
  const vipQuickLink = document.querySelector('.quick-link-card[data-page="vip"]');
  if (vipQuickLink) {
    vipQuickLink.addEventListener("click", function() {
      document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
      if (navVip) navVip.classList.add("active");
      showPage("vip-content");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// 初始化页面
$(document).ready(function () {
  setupThemeToggle();
  initSidebar();
  initPageSwitch();
  fetchApiStats();

  // 返回顶部按钮功能
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
