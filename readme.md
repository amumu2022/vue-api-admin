<div align="center">

# 晚风API 后台管理系统

![晚风API](https://socialify.git.ci/amumu2022/vue-api-admin/image?font=Jost&description=1&descriptionEditable=%E4%B8%80%E4%B8%AA%E5%9F%BA%E4%BA%8EPython%E7%9A%84Api%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0&logo=https%3A%2F%2Fgitee.com%2Fxdteam-mumu%2Fvue-api-admin%2Fraw%2Fmaster%2Fdocs%2Fimage%2Flogo.png&name=1&owner=1&forks=1&issues=1&pulls=1&pattern=Diagonal+Stripes&stargazers=1&theme=Auto)

![Python](https://img.shields.io/badge/Python->=3.10-red)
![Node](https://img.shields.io/badge/Node->=V22.14.0-green)
![Vue](https://img.shields.io/badge/Vue-v3.5.13-pink)
![Element](https://img.shields.io/badge/Element-Plus-blue)
[![QQ](https://img.shields.io/badge/Chat-QQ-91A1E7)](https://qm.qq.com/q/lebtXGD6qk)

</div>


基于 FastAPI + Vue3 + Element UI 的现代化前后端分离开发平台，融合了 RBAC 权限管理、动态路由和 JWT 鉴权，内置130+条api接口。

### 特性

- **最流行技术栈**：基于 Python 3.10 和 FastAPI 高性能异步框架，结合 Vue3 和 Vite 等前沿技术进行开发。
- **系统JWT鉴权**：使用 JSON Web Token（JWT）进行身份验证和授权，增强应用的安全性。
- **颗粒度权限管理**：系统支持细粒度的权限管理,可以针对不同用户设置不同的访问权限。
- **接口鉴权**：使用token作为密钥，绑定用户信息，无token无法使用。
- **免费和收费功能切换**：可实现api的免费和收费功能切换，实现按需付费。
- **恶意请求检测和自动加黑名单**：系统会自动检测恶意请求,并将其加入黑名单,以保护系统安全。
- **自定义QPS限制**：可以对每条API进行QPS限制。


### 在线预览

 - API文档： <https://wanfeng-api.apifox.cn/>
 - 官网： <http://api.levial.dpdns.org/>
 - 服务地址： <http://http://api.levial.dpdns.org/api/v1/>


### 登录页

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/登录页.png)

### 注册页

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/注册页.png)

### 自助查询

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/point查询.png)

### token重置

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/token重置.png)

### 工作台

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/首页.png)

### 用户管理

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/用户管理.png)

### 角色管理

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/角色管理.png)

### 接口监控

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/接口监控.png)

### 登录日志

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/登录日志.png)

### 黑名单管理

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/黑名单管理.png)

### 路径详细

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/路径详细.png)

### 接口请求

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/接口请求.png)

### 平台对接

![image](https://gitee.com/xdteam-mumu/vue-api-admin/raw/master/docs/image/平台对接.png)


### 本地启动

#### 后端

启动项目需要以下环境：

- Python >=3.10

#### 方法一（推荐）：使用 poetry 安装依赖

1. 安装 poetry

```sh
pip install poetry
```

2. 创建并激活虚拟环境

```sh
python -m venv myapi

source .myapi/bin/activate  # Linux/Mac
# 或
.\myapi\Scripts\activate  # Windows
```

3. 安装依赖

```sh
poetry install
``` 

4. 初始化数据

```sh
python cli/init.py
```


5. 启动服务

```sh
python app.py
```


服务现在应该正在运行，访问 <http://localhost:8633/docs> 查看API文档

#### 前端

启动项目需要以下环境：

- node v18.8.0+

#### 方法一：下载打包源码

```text
https://github.com/amumu2022/vue-api-admin/releases/download/latest/dist.zip
```

可直接部署到虚拟主机

也可通过1panel或宝塔进行部署

注意：需要对 `/api/` 配置反代，代理到你的后端地址

#### 方法二：下载源码

```sh
# 克隆项目仓库
git clone https://github.com/amumu2022/vue-api-admin.git
# 进入项目目录
cd vue-api-admin
# 安装依赖
pnpm install
# 启动前端服务
pnpm dev
```

##### 访问

<http://localhost:5177>

username：admin

password：123456

### 进群交流

进群的条件是给项目一个star，小小的star是作者维护下去的动力。

你可以在群里提出任何疑问，我会尽快回复答疑。[![QQ](https://img.shields.io/badge/Chat-QQ-91A1E7)](https://qm.qq.com/q/lebtXGD6qk)

### 鸣谢

· [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 提供美观功能齐全的VUE开发模板

### Visitors Count

<img align="left" src = "https://profile-counter.glitch.me/vue-api-admin/count.svg" alt="Loading">
