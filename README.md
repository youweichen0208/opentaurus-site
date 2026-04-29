# OpenTaurus Site

OpenTaurus 的公开网站仓库。

当前仓库只承载对外站点，不承载 `MCP`、`CLI`、测试或后端实现代码。

## Structure

```text
.
├── .github/workflows/
│   └── deploy-site.yml
├── site/
│   └── index.html
└── website-assets/
    ├── cases/
    ├── reports/
    └── screenshots/
```

## Deploy

站点通过 GitHub Pages 发布。

发布目录：

- `site/`

工作流：

- `.github/workflows/deploy-site.yml`

首次发布前需要在 GitHub 仓库设置中手动启用 Pages。
建议在 `Settings > Pages` 中将 `Source` 设为 `GitHub Actions`，避免工作流在运行时尝试创建 Pages site 而触发 `Resource not accessible by integration`。

## Content Model

当前首页采用：

- Hero
- 三入口：`MCP Tools` / `Companion CLI` / `Cloud Evidence`
- Feature bands
- Cases section

后续真实验证素材建议放到：

- `website-assets/cases/<case-slug>/`

并把首页中的占位终端块逐步替换成真实截图和脱敏摘要。
