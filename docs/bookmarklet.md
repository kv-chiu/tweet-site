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
javascript:void(fetch('https://YOUR_SITE.vercel.app/api/add-tweet',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer YOUR_SECRET'},body:JSON.stringify({tweet:location.href})}).then(r=>r.json()).then(d=>{const m=document.createElement('div');m.textContent=d.error||`Added ${d.tweetId}`;Object.assign(m.style,{position:'fixed',top:'20px',right:'20px',padding:'12px 20px',background:d.error?'#ef4444':'#22c55e',color:'#fff',borderRadius:'8px',zIndex:'999999',fontSize:'14px',fontFamily:'system-ui',boxShadow:'0 4px 12px rgba(0,0,0,0.3)'});document.body.appendChild(m);setTimeout(()=>m.remove(),3000)}).catch(()=>alert('Failed')))
```

## 使用

1. 在推特/X 上打开一条推文
2. 点击书签栏的书签
3. 右上角弹出绿色 toast 提示 "Added xxxx"
4. Vercel 自动重新部署，几十秒后站点更新
