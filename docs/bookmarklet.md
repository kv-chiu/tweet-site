# Bookmarklet 使用指南

## 配置

1. 在 Vercel 项目设置中添加环境变量：
   - `GITHUB_TOKEN` — GitHub Personal Access Token（需要 `repo` 权限）
   - `GITHUB_REPO` — 仓库全名，如 `kv-chiu/tweet-site`
   - `API_SECRET` — 自定义密钥，用于验证请求

2. 确保仓库中已有 `public/tweets.json` 文件（否则 API 无法读取）。

## 安装书签

创建一个新书签，将下面的代码作为 URL（替换 `YOUR_SITE` 和 `YOUR_SECRET`）：

```
javascript:void(window.open('https://YOUR_SITE.vercel.app/add.html?secret=YOUR_SECRET&tweet='+encodeURIComponent(location.href),'_blank','width=420,height=200'))
```

## 使用

1. 在推特/X 上打开一条推文
2. 点击书签栏的书签
3. 右上角弹出 toast：
   - 绿色 "Added xxxx" — 添加成功
   - 红色 — 显示具体错误信息
4. 刷新站点即可看到新推文（GitHub raw 有 ~5 分钟 CDN 缓存）

## 排查问题

- 确认在推文详情页使用（URL 包含 `/status/数字`）
- 确认 Vercel 环境变量 `GITHUB_TOKEN`、`GITHUB_REPO`、`API_SECRET` 已设置
- 确认仓库中存在 `public/tweets.json`
- 如果提示 "Unauthorized"，检查 `API_SECRET` 是否与 Vercel 环境变量一致
