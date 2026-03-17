# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

tweet-site — 开箱即用的推文收藏站。用户可以收藏和浏览推特上的精美图片（明星、coser 等），支持快速部署到云服务。

核心技术：react-tweet 库用于嵌入和展示推文。

目标用户：喜欢收藏推特图片的网民、明星粉丝、coser 粉丝。

纯前端静态站点，无后端。

Licensed under MIT (Kelvin Chiu, 2026).

## Tech Stack

- Vite 8 + React 19 + TypeScript
- pnpm 作为包管理器

## Commands

- `pnpm dev` — 启动开发服务器
- `pnpm build` — 构建生产版本
- `pnpm preview` — 预览生产构建
- `pnpm lint` — ESLint 检查
