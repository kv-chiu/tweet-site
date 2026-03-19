# tweet-site

开箱即用的推文收藏站。收藏和浏览推特 / Instagram 上的精美图片，支持瀑布流视图，一键部署到 Vercel。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkv-chiu%2Ftweet-site)

## Quick Start

```bash
# 安装依赖
pnpm install

# 复制配置文件
cp public/site.example.json public/site.json

# 编辑 data.json，填入你想收藏的内容
# 启动开发服务器
pnpm dev
```

## Configuration

- `public/site.json` — 站点标题、描述、列数、每批加载数
- `public/data.json` — 内容列表，支持多数据源（tweet / instagram）

```json
[
  { "type": "tweet", "id": "推文ID或URL" },
  { "type": "instagram", "id": "shortcode" }
]
```

## Tech Stack

Vite 8 + React 19 + TypeScript + react-social-media-embed

## License

MIT
