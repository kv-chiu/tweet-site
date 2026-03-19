# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FanGallery — 社交媒体图片展。把散落在 Twitter、Instagram 等平台上的高质量图片整理成独立的图片站，让粉丝沉浸式浏览。

核心技术：react-social-media-embed 库用于嵌入和展示 Twitter 推文与 Instagram 帖子。

目标用户：追星粉丝、coser 粉丝、喜欢收藏社交媒体图片的人。

纯前端静态站点，数据存储在 Git 仓库的 data 分支中。

Licensed under MIT (Kelvin Chiu, 2026).

## Tech Stack

- Vite 8 + React 19 + TypeScript
- pnpm 作为包管理器

## Commands

- `pnpm dev` — 启动开发服务器
- `pnpm build` — 构建生产版本
- `pnpm preview` — 预览生产构建
- `pnpm lint` — ESLint 检查
