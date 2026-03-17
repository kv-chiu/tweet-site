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
javascript:void((async()=>{const u=location.href;if(!/status\/\d+/.test(u))return alert('Not a tweet page');const s=(t,c)=>{const m=document.createElement('div');m.textContent=t;Object.assign(m.style,{position:'fixed',top:'20px',right:'20px',padding:'12px 20px',background:c,color:'#fff',borderRadius:'8px',zIndex:'999999',fontSize:'14px',fontFamily:'system-ui',boxShadow:'0 4px 12px rgba(0,0,0,0.3)'});document.body.appendChild(m);setTimeout(()=>m.remove(),3000)};try{const r=await fetch('https://YOUR_SITE.vercel.app/api/add-tweet',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({secret:'YOUR_SECRET',tweet:u})});const d=await r.json();s(d.error||d.message+' '+d.tweetId,d.error?'#ef4444':'#22c55e')}catch(e){s('Error: '+e.message,'#ef4444')}})())
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
