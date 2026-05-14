# OpenTaurus Site

OpenTaurus 的公开网站仓库。

当前仓库只承载对外站点，不承载 `MCP`、`CLI`、测试或后端实现代码。
站点前端现已全面切换到 `Vite + Vue 3`。

## Structure

```text
.
├── .github/workflows/
│   └── deploy-site.yml
├── public/
│   └── assets/
├── scripts/
│   └── postbuild.mjs
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   └── router/
├── index.html
├── package.json
├── vite.config.js
└── website-assets/
    ├── cases/
    ├── reports/
    └── screenshots/
```

## Deploy

站点通过 GitHub Pages 发布。

开发命令：

- `npm install`
- `npm run dev`
- `npm run build`

构建产物目录：

- `dist/`

发布说明：

- 生产构建会额外生成 `dist/404.html`，用于 GitHub Pages 下的 SPA 路由回退。

工作流：

- `.github/workflows/deploy-site.yml`

首次发布前需要在 GitHub 仓库设置中手动启用 Pages。
建议在 `Settings > Pages` 中将 `Source` 设为 `GitHub Actions`，避免工作流在运行时尝试创建 Pages site 而触发 `Resource not accessible by integration`。

## Content Model

当前 Vue 站点采用：

- Hero
- 多入口导航：`MCP` / `CLI` / `Agent 配置`
- MCP 总览页与分类子页
- 场景数据驱动的动态演示块

后续真实验证素材建议放到：

- `website-assets/cases/<case-slug>/`

并把页面中的截图主导内容逐步替换成结构化输出卡片，截图下沉为折叠证据。
