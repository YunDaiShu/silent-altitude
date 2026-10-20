# 部署（GitHub Pages）

| 项 | 值 |
|---|---|
| 线上地址 | https://yundaishu.github.io/silent-altitude/ |
| 仓库 | https://github.com/YunDaiShu/silent-altitude |
| 托管方式 | Pages，源 = `main` 分支 / 根目录 |
| 部署工具 | `scripts/deploy-gh.mjs`（走 api.github.com，不需要本机能访问 github.com） |

## 更新线上（改完文案/素材之后）

```powershell
# 1. 重新构建
.rebuild.cmd            # 产出 dist/ 与 silent-altitude.html

# 2. 部署（token 只放在环境变量里，不落盘）
$env:GITHUB_TOKEN = '<你的 classic token，需 repo 权限>'
node scripts/deploy-gh.mjs silent-altitude

# 3. 打开 https://amakehappy.github.io/silent-altitude/ ，Ctrl+F5
```

Pages 每次构建约 **40–70 秒**，可用这个查询状态：

```powershell
$h = @{ Authorization = "Bearer $env:GITHUB_TOKEN"; 'User-Agent' = 'dsh' }
(Invoke-RestMethod 'https://api.github.com/repos/YunDaiShu/silent-altitude/pages/builds/latest' -Headers $h).status   # building / built
```

## 踩过的坑（脚本里已处理）

1. **空仓库不能用 Git Data API**：`POST /git/blobs` 会返回 `409 Git Repository is empty`。脚本先通过 Contents API 提交一个 `.nojekyll` 作为种子提交。
2. **空仓库查分支返回 409 而不是 404**：脚本把两者都当作"还没有 main 分支"。
3. **必须是 public 仓库** 才能用免费 Pages。

## 素材体积（已优化，别再放大回去）

| 文件 | 原始 | 上线用 |
|---|---|---|
| `media/hero.webm` | 18.3 MB（1080p 原片，存 `_vendor/hero-source.webm`） | **402 KB**（1280×720 VP9 CRF34） |
| `media/hero.mp4` | — | **479 KB**（1280×720 H.264 CRF26，给 Safari 兜底） |
| `media/hero-poster.jpg` | — | **100 KB**（1600 宽，1.2 s 处截帧） |
| `lanyard/card-front.png` | 143 KB | **56 KB** |
| `lanyard/card-back.png` | 37.8 KB | **16.7 KB** |
| `lanyard/strap.png` | 45.2 KB | **33.2 KB** |

压缩参数（机器上无 ffmpeg 时先装 `@ffmpeg-installer/ffmpeg`，它从 npm 拉二进制、不走 GitHub）：

```powershell
ffmpeg -i _vendor/hero-source.webm -an -vf "scale=1280:-2:flags=lanczos" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -pix_fmt yuv420p media/hero.webm
ffmpeg -i _vendor/hero-source.webm -an -vf "scale=1280:-2:flags=lanczos" -c:v libx264 -crf 26 -preset medium -pix_fmt yuv420p -movflags +faststart media/hero.mp4
```

画面质量：与原始 1080p 的 PSNR ≈ 43.7 dB，首屏这种"大标题压画面"的场景肉眼看不出差别。

`src/sections/Hero.jsx` 里视频用两个 `<source>`：先 WebM（更小），再 MP4（Safari），两者都失败才触发 CSS 光影兜底。

## 换域名 / 换托管

`vite.config.js` 用 `base: './'`，`site.config.js` 里的媒体路径是相对的，所以 `dist/` 可以直接放到任何静态托管（子路径也行），不需要再改代码。

## 首屏加载顺序（别改回去）

`src/main.jsx` 在 `createRoot` 之前用 `new Image()` 预热三张工牌贴图：

```js
for (const url of [site.assets.lanyardFront, site.assets.lanyardBack, site.assets.lanyardStrap]) {
  if (url) new Image().src = url;
}
```

原因有两个：

1. 首屏视频 1.7 MB，会在解析后马上占满带宽，工牌贴图（56/17/33 KB）排到它后面，冷缓存时工牌会空框好几秒。
2. **不要用 `index.html` 里的 `<link rel="preload" as="image">`**：Vite 会把这种 href 当成待打包资源，重写成 `./assets/card-front-<hash>.png`，与运行时真正请求的 `lanyard/card-front.png` 不是同一个 URL —— 结果是**同一张图下载两遍**，还占不到缓存。

另外 `LanyardSection.jsx` 的 `useTexturesReady` 有 **1.2 秒超时兜底**：任何一张图卡住都不再阻塞 canvas 挂载。

## 改用户名之后发生的事（记录）

`AMakeHappy` → `YunDaiShu` 之后：仓库自动变成 `YunDaiShu/silent-altitude`，但 **Pages 旧域名没有重定向**（`amakehappy.github.io/...` 直接 404），新域名要等 Pages 重新构建（当时约 30 秒 404）才恢复 200。所以改完名字要重新对外发链接。