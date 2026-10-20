# 内容修改地图（Content Map）

改完保存即可生效的入口只有三类：**文案**（`src/site.config.js` 为主）、**媒体文件**（`public/` 下同名覆盖）、**样式与 3D 观感**（`tokens.css` / `LanyardSection.jsx`）。
改完重新生成：`dev.cmd`（自动热更新）/ `build.cmd`（产出 dist/，用于部署）/ `single.cmd`（产出可双击的 `silent-altitude.html`）。

---

## 一、文字（文案）

### 1. 主文案源：`src/site.config.js`（全站文案都从这里来）

| 行 | 字段 | 改它会改哪里 |
|---|---|---|
| 6 | `name`（当前 `Yun Daishu`） | 博客大标题（英文行）、页脚版权 `© 2026 …` |
| 7 | `nameCn`（当前 `云戴舒`） | **首屏名字行**、博客大标题下方中文名、页脚中文名 |
| 8 | `role`（当前 `Independent Art Director`） | 博客职位行（英文部分） |
| 9 | `roleCn`（当前 `独立艺术指导 · 影像与品牌叙事`） | **首屏职位行**、博客职位行中文 |
| 10 | `year: '2026'` | 页脚 `© 2026` |
| 12–14 | `bio`（两段字符串拼接） | 博客区个人简介整段 |
| 16 | `heroTitle: 'SILENT ALTITUDE'` | **首屏巨型标题**（改短词更稳，长句会自动折行） |
| 18–22 | `quote.cn / quote.en / quote.source` | 引言区中文引文 / 英文引文 / 出处 |
| 24–30 | `works[]`：`index / title / category / year` × 5 条 | 作品选集列表每一行；增删对象即增删行 |
| 32–48 | `posts[]`：`title / date / excerpt` × 3 条 | 博客区文章条目（标题 / 日期 / 摘要）；增删对象即增删条目 |
| 50–54 | `contact.email / github / x` | 落款区邮箱与两个外链 |
| 64 | `signature: '二〇二六年秋 题于深圳'` | 手写落款那一行中文 |

### 2. 组件里写死的标题/标签（不在 config，需改源码）

| 文件:行 | 现有文案 | 出现在 |
|---|---|---|
| `src/sections/Hero.jsx:53` | `Portfolio · MMXXVI` | 首屏标题上方小字（金色） |
| `src/sections/Hero.jsx:64` | `Scroll` | 首屏底部滚动提示 |
| `src/sections/Quote.jsx:16` | `Aphorism · 引言` | 引言区上方小字 |
| `src/sections/Works.jsx:11` | `作品选集` | 作品区大标题 |
| `src/sections/Works.jsx:13` | `Selected Works` | 作品区右上角英文小字 |
| `src/sections/Emblem.jsx:5` | `The Mark` | 会标区上方小字 |
| `src/sections/Emblem.jsx:31` | `SILENT ALTITUDE · KUN PENG · STUDIO OF LIN ZHAOYU · THE QUIET ASCENT ·` | 会标外圈环绕英文（`textPath`，改长会绕满一圈） |
| `src/sections/Emblem.jsx:15` | `鲲鹏线描圆形会标` | SVG 无障碍标题（不显示，屏幕阅读器用） |
| `src/sections/Emblem.jsx:54` | `鲲鹏` | 会标下方中文标题 |
| `src/sections/Emblem.jsx:56` | `The Quiet Ascent` | 会标下方英文副题 |
| `src/sections/Signature.jsx:19 / 23` | `GitHub` / `X` | 落款区两个外链文字（链接地址在 config 50–54） |
| `src/sections/Signature.jsx:31` | `All rights reserved · Shenzhen` | 页脚右下角 |
| `src/sections/LanyardSection.jsx:57` | `Journal` | 博客区上方小字 |

### 3. 浏览器标签与 SEO：`index.html`

| 行 | 内容 |
|---|---|
| 2 | `<html lang="zh-CN">` 页面语言 |
| 6 | `<title>Silent Altitude — 个人作品集</title>` 浏览器标签标题 |
| 7 | `<meta name="description" ...>` 搜索/分享摘要 |
| 8 | `<meta name="theme-color" content="#050507">` 移动端地址栏颜色 |

---

## 二、视频与图片

### 1. 首屏视频（步骤 2 的 6 秒洋红底素材放这里）

| 放这里 | 格式/建议 | 说明 |
|---|---|---|
| `public/media/hero.mp4` | H.264 MP4 或 VP9 WebM，静音、6 秒、约 1920×1080 | **文件名必须一致**；放进去即自动替换掉现在的占位光影，不用改代码 |
| `public/media/hero-poster.jpg` | 同第一帧的静帧，1920×1080 | 视频加载前的占位图 |

对应配置：`src/site.config.js:57–58`（`heroVideo` / `heroPoster`）。若想换文件名，改这两行即可；路径以 `/` 开头表示 `public/` 根。
行为：文件缺失 → `<video>` 自动卸载，退回 CSS 合成光影兜底，控制台不会报错（`Hero.jsx:42`）。

### 2. 3D 工牌素材（换自己的照片/工牌）

| 放这里 | 尺寸 | 说明 |
|---|---|---|
| `public/lanyard/card-front.png` | 900×1260（3:4.2，官方面比例 1024×1440） | 工牌正面 |
| `public/lanyard/card-back.png` | 900×1260 | 工牌背面 |
| `public/lanyard/strap.png` | 128×768 | 挂绳。**注意官方会把这张图旋转 90°**：图片"宽"沿挂绳长度方向、图片"高"跨挂绳宽度方向 |

对应配置：`src/site.config.js:59–61`。替换后若观感不对（卡片太大/太小），改 `src/sections/LanyardSection.jsx:85–98` 里的 `size`（默认 0.6）。
详见 `src/components/lanyard/README.md`。

### 3. 站点图标（favicon）

`index.html:10–12`，现在是**内联 SVG data URI**（黑底 + 金圈）。换成自己的 `.png/.ico` 时，把这段 `href` 改成例如 `href="/media/favicon.png"`，并把图片放进 `public/media/`。

### 4. 会标（鲲鹏圆徽）

不是图片文件，是**内联 SVG**，画在 `src/sections/Emblem.jsx:18–50`（`<circle>` 轨道 + 6 条 `<path>` 翅线 + 中线 + 印迹）。想整体换成自己的图案，最简单的两种做法：
- 保留外圈 `textPath` 与排版，只替换 `<g className="emblem__mark">` 里的 `path`；
- 或直接换成 `<img src="/media/emblem.svg" />`（图放 `public/media/`）。

---

## 三、颜色、字体与 3D 观感

| 文件:行 | 可改什么 |
|---|---|
| `src/styles/tokens.css:5–19` | 三个基色：`--ink` 黑 `#050507`、`--paper` 暖白 `#f4f1ea`、`--gold` 金 `#c9a13f`，以及它们的透明度档位 |
| `src/styles/tokens.css:22–25` | 字体栈：`--font-serif` / `--font-sans` / `--font-script` / `--font-han`（离线降级也在这里） |
| `src/styles/tokens.css:27–28` | `--gutter` 页边距、`--shell` 最大内容宽度 1320px |
| `index.html:13–18` | Google Fonts 引入地址（换字体时这里与 tokens 一起改） |
| `src/sections/LanyardSection.jsx:89–95` | 工牌观感：`cardColor`、`strapColor`、`metal="gold"`（可 `silver`）、`finish`、`breeze`（摆动幅度）、`intro` |
| `src/styles/sections.css:332` | `.lanyard-frame` 高度 `clamp(520px, 62vh, 660px)`，即工牌展示区高度 |
| `src/styles/sections.css:150` | `.hero__meta-han`：首屏中文名字行的字号 / 字距 / 颜色（宋体栈） |

---

## 四、改完怎么生效

| 目的 | 命令 | 结果 |
|---|---|---|
| 边改边看 | `dev.cmd` | 打开 `http://localhost:5173`，保存即热更新 |
| 部署上线 | `build.cmd` | 产出 `dist/`，整目录传到任意静态托管 |
| 双击就能看 / 交作业 | `single.cmd` | 产出 `silent-altitude.html`（单文件，媒体已内联） |

注意：`single.cmd` 会把当时的媒体文件烧进 HTML；换了视频/图片后要**重新跑一次** `single.cmd` 才会更新。

## 五、目前还不支持（要的话告诉我）

- 文章条目只有列表，**没有详情页/路由**；要 `/posts/xxx` 这种页面需要加路由（react-router 或自写 hash 路由）。
- 没有 RSS、站内搜索、多语言切换。

---

## 六、首屏视频替换细节

| 项 | 说明 |
|---|---|
| 文件 | `public/media/hero.webm`（当前示范素材，VP9；路径在 `src/site.config.js:57`）。要用 MP4 就把文件改名为 `hero.mp4` 并同步改这一行 |
| 建议规格 | 6–10 秒、1920×1080、H.264 MP4（兼容性最好）或 VP9 WebM；**整片静音**；建议 ≤ 8 MB，超过 20 MB 首屏会明显变慢 |
| 海报帧 | `public/media/hero-poster.jpg`（可选，路径在 `site.config.js:58`；不放则黑场过渡） |
| 无需改代码 | `src/sections/Hero.jsx:32-43` 已挂好 `muted autoPlay loop playsInline preload="auto"`；文件存在即自动播放，缺失时走 CSS 合成光影兜底且不报错 |
| 画面调色 | `src/styles/sections.css:62` 的 `filter: saturate(.86) contrast(1.04) brightness(.9)`——视频偏暗就调高 brightness |
| 文字可读性 | `src/styles/sections.css:88-95` 的 `.hero__shade`（暗角 + 上下压暗）；视频偏亮就加深这一层 |
| 底部溶黑 | `src/styles/sections.css:52-53` 的 `mask-image` 让视频下沿融进黑场，无需在视频里做渐隐 |
| 洋红底素材 | 任务书 10029 那种 `#FF00FF` 纯色底**不能直接放**，会整屏泛紫：要么在生成工具里要求「深色背景版」，要么先抠像（ffmpeg `colorkey`）再合成到黑场 |
| 单文件版 | 视频无法内联进 HTML。`single.cmd` 会把 `public/media/*` 镜像到 `silent-altitude.html` 旁的 `media/`，并把运行时字符串里的 `/media/` 改写成 `./media/`（已实测 file:// 下可播）；只把 HTML 单独拷走则回落到光影 |
| 示范素材 | `blog/scripts/hero-recorder.html` 是这条 8 秒示范片（山脊剪影 + 暖光 + 薄雾 + 尘埃 + 缓推镜）的录制页：改完参数用它重录，再用 `single.cmd` 打包 |
| MP4 提醒 | 浏览器 `MediaRecorder` 输出的 MP4 时间戳不可靠（实测 8 秒素材被标成 3.4 秒），要 MP4 请用真编码器（ffmpeg/H.264）导出 |