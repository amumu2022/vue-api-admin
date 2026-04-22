/**
 * @Author: XDTEAM
 * @Date: 2026-01-27 21:40:00
 * @Description: 公共布局框架 - 用于渲染侧边栏、顶部导航、页脚等公共组件
 */

// 渲染侧边栏
function renderSidebar(activePage) {
  const sidebarHtml = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <img src="./resources/logo.png" alt="WanFeng API" class="sidebar-logo-img" />
          <span class="sidebar-text">晚风 API</span>
        </div>
        <a href="./admin/index.html" class="sidebar-user-btn">
          <i class="fas fa-user"></i>
          <span class="sidebar-text">用户中心</span>
        </a>
      </div>
      <div class="sidebar-menu">
        <div class="menu-section">
          <a href="./index.html" class="menu-item-link">
            <div class="menu-item ${activePage === 'home' ? 'active' : ''}" data-page="home">
              <i class="fas fa-home"></i>
              <span class="sidebar-text">系统首页</span>
            </div>
          </a>
          <a href="./vip.html" class="menu-item-link">
            <div class="menu-item ${activePage === 'vip' ? 'active' : ''}" data-page="vip">
              <i class="fas fa-crown"></i>
              <span class="sidebar-text">专业会员</span>
            </div>
          </a>
        </div>
        <div class="menu-section">
          <div class="menu-item has-submenu ${activePage === 'api' ? 'expanded' : ''}" data-menu="api">
            <i class="fas fa-plug"></i>
            <span class="sidebar-text">API</span>
            <i class="fas fa-chevron-down submenu-toggle"></i>
          </div>
          <div class="submenu ${activePage === 'api' ? 'expanded' : ''}" id="api-submenu">
            <!-- API子菜单将通过JS动态生成 -->
          </div>
        </div>
        <div class="menu-section">
          <div class="menu-item has-submenu" data-menu="news">
            <i class="fas fa-newspaper"></i>
            <span class="sidebar-text">动态</span>
            <i class="fas fa-chevron-down submenu-toggle"></i>
          </div>
          <div class="submenu" id="news-submenu">
            <div class="submenu-item" data-type="weibo">微博热点</div>
            <div class="submenu-item" data-type="bilibili">哔哩哔哩热点</div>
            <div class="submenu-item" data-type="zhihu">知乎热点</div>
            <div class="submenu-item" data-type="baidu">百度热点</div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
  `;
  return sidebarHtml;
}

// 渲染顶部导航
function renderTopNav(title) {
  return `
    <nav class="top-nav">
      <div class="nav-left">
        <button class="menu-toggle" id="menu-toggle"><i class="fas fa-bars"></i></button>
        <div class="brand"><div class="logo">${title || '晚风 API服务'}</div></div>
      </div>
      <div class="nav-right">
        <button class="theme-toggle" id="theme-toggle"><i class="fas fa-moon"></i></button>
        <button class="sidebar-toggle" id="sidebar-toggle" title="切换菜单栏"><i class="fas fa-bars"></i></button>
      </div>
    </nav>
  `;
}

// 渲染页脚
function renderFooter() {
  return `
    <footer class="footer compact-footer">
      <p>© 2026 晚风 API服务 | 稳定、高效、安全的API服务</p>
      <div class="footer-links-inline">
        <a href="https://github.com/amumu2022/vue-api-admin.git" target="_blank">GitHub</a>
        <a href="https://wanfeng-api.apifox.cn/" target="_blank">Apifox 文档</a>
        <a href="./index.html">返回首页</a>
      </div>
    </footer>
  `;
}

// 渲染返回顶部按钮
function renderBackToTop() {
  return '<div class="back-to-top" id="back-to-top"><i class="fas fa-arrow-up"></i></div>';
}

// 初始化页面布局
function initLayout(activePage, pageTitle) {
  // 在body开头插入侧边栏
  const sidebarHtml = renderSidebar(activePage);
  document.body.insertAdjacentHTML('afterbegin', sidebarHtml);

  // 找到container并插入顶部导航
  const container = document.querySelector('.container');
  if (container) {
    container.insertAdjacentHTML('afterbegin', renderTopNav(pageTitle));
    container.insertAdjacentHTML('beforeend', renderFooter());
  }

  // 在body末尾插入返回顶部按钮
  document.body.insertAdjacentHTML('beforeend', renderBackToTop());

  // 初始化公共功能
  initCommonFeatures();

  // 加载API菜单数据
  loadApiMenu();
}

// 初始化公共功能
function initCommonFeatures() {
  // 主题切换
  setupThemeToggle();

  // 侧边栏功能
  initSidebarToggle();

  // 子菜单展开/收起
  initSubmenuToggle();

  // 返回顶部
  initBackToTop();
}

// 主题切换
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDarkScheme)) {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = document.body.getAttribute("data-theme");
      if (currentTheme === "dark") {
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        this.innerHTML = '<i class="fas fa-moon"></i>';
      } else {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        this.innerHTML = '<i class="fas fa-sun"></i>';
      }
    });
  }
}

// 侧边栏切换
function initSidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const overlay = document.getElementById("sidebar-overlay");

  // 桌面端侧边栏折叠
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      document.body.classList.toggle("sidebar-hidden");
      localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
    });
  }

  // 移动端菜单切换
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : "";
    });
  }

  // 点击遮罩关闭侧边栏
  if (overlay) {
    overlay.addEventListener("click", function () {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // 恢复侧边栏状态
  const sidebarCollapsed = localStorage.getItem("sidebarCollapsed");
  if (sidebarCollapsed === "true" && sidebar) {
    sidebar.classList.add("collapsed");
    document.body.classList.add("sidebar-hidden");
  }
}

// 子菜单展开/收起
function initSubmenuToggle() {
  const submenuItems = document.querySelectorAll(".menu-item.has-submenu");
  submenuItems.forEach(item => {
    item.addEventListener("click", function () {
      const menuId = this.getAttribute("data-menu");
      const submenu = document.getElementById(menuId + "-submenu");
      
      // 切换当前子菜单
      this.classList.toggle("expanded");
      if (submenu) {
        submenu.classList.toggle("expanded");
      }
    });
  });
}

// 返回顶部
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
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
  }
}

// 加载API菜单数据
function loadApiMenu() {
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
        generateApiSubmenu(response.data);
      }
    },
    error: function () {
      console.error("API菜单加载失败");
    }
  });
}

// 动态生成API子菜单
function generateApiSubmenu(apiData) {
  const apiSubmenu = document.getElementById("api-submenu");
  if (!apiSubmenu || !apiData) return;
  
  let submenuHtml = '<a href="./api.html" class="submenu-item" data-category="all">所有接口</a>';
  apiData.forEach(category => {
    if (category.name && category.children && category.children.length > 0) {
      submenuHtml += `<a href="#" class="submenu-item" data-category="${encodeURIComponent(category.name)}">${category.name}</a>`;
    }
  });
  
  apiSubmenu.innerHTML = submenuHtml;
  
  // 为API子菜单项添加点击事件
  const submenuItems = apiSubmenu.querySelectorAll('.submenu-item');
  submenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      
      // 如果当前不在API页面，则跳转到API页面
      if (!window.location.pathname.includes('api.html')) {
        window.location.href = './api.html' + (category && category !== 'all' ? `?category=${category}` : '');
        return;
      }
      
      // 如果已在API页面，则使用无刷新切换
      if (typeof handleSidebarCategoryClick === 'function') {
        handleSidebarCategoryClick(category);
      }
    });
  });
}
