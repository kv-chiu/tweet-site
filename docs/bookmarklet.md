# Bookmarklet 使用指南

## 配置

1. 在 Vercel 项目设置中添加环境变量：
   - `GITHUB_TOKEN` — GitHub Personal Access Token（需要 `repo` 权限）
   - `GITHUB_REPO` — 仓库全名，如 `kv-chiu/tweet-site`
   - `API_SECRET` — 自定义密钥，用于验证请求

2. 确保仓库中已有 `public/data.json` 文件（否则 API 无法读取）。

## 安装书签

创建书签，替换 `YOUR_SITE` 和 `YOUR_SECRET`：

```
javascript:void(window.open('https://YOUR_SITE.vercel.app/add.html?secret=YOUR_SECRET&tweet='+encodeURIComponent(location.href),'_blank','width=420,height=200'))
```

## 使用

**添加推文：** 在推特/X 上打开一条推文 → 点击书签 → 弹窗显示绿色 "Added" → 2 秒后自动关闭

**删除推文：** 访问 `https://YOUR_SITE.vercel.app?secret=YOUR_SECRET` 进入管理模式 → 点击推文上的 ✕ 按钮删除

## 排查问题

- 确认在推文详情页使用（URL 包含 `/status/数字`）
- 确认 Vercel 环境变量 `GITHUB_TOKEN`、`GITHUB_REPO`、`API_SECRET` 已设置
- 确认仓库中存在 `public/data.json`
- 如果提示 "Unauthorized"，检查 `API_SECRET` 是否与 Vercel 环境变量一致
