# tweet-site

开箱即用的推文收藏站。收藏和浏览推特上的精美图片，支持瀑布流 / 相册两种视图，一键部署到 Vercel。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkv-chiu%2Ftweet-site)

## Quick Start

```bash
# 安装依赖
pnpm install

# 复制配置文件
cp public/site.example.json public/site.json
cp public/tweets.example.json public/tweets.json

# 编辑 tweets.json，填入你想收藏的推文 ID
# 启动开发服务器
pnpm dev
```

## Configuration

- `public/site.json` — 站点标题、描述、默认视图、列数、每批加载数
- `public/tweets.json` — 推文 ID 列表（支持纯 ID 或完整 URL）

## Tech Stack

Vite 8 + React 19 + TypeScript + react-tweet

## License

MIT
