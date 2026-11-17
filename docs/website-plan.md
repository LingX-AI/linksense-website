# LinkSense 独立官网方案

2026-11-16 · 历史草案，已由 Exo Ape 方向取代。当前页面和启动方式见 [README](../README.md)，视觉和动效的实际适配见[设计记录](design-notes.md)。

现有 `linksense-site` 是已经上线的 Next.js / Fumadocs 站，包含官网首页、安装和文档。这里新建 TanStack Start SSR 官网，不在原项目中换框架。已核对 [现有首页](https://linksense.org/)、[简中文档](https://linksense.org/doc/zh-CN/)、[英文文档](https://linksense.org/doc/) 和 [在线体验](https://explore.linksense.org/) 的公开入口；文档继续由现站维护。

## 用户与主线

业务使用者想知道能交付什么；团队负责人想知道方法怎样复用；部署评估者要快速找到模型、权限与安装条件。首页用一件可看见结果的任务回答前两个问题，部署页回答第三个。

> **做完一项工作，留下一套方法。**
>
> LinkSense 是可自托管的团队 Agent 工作空间。用你的资料和工具交付报告、表格和文档，再把验证过的做法发布为同事可以复用的技能或应用。
>
> **在线体验**　**自托管部署**

主展示场景建议用模拟采购数据，实际在 LinkSense 中跑通并录制：**上传供应商报价表 → 生成比价表和采购简报 → 将方法整理成采购应用，授权采购组复用**。演示不暗示任务会自动发布应用；录制中应显示使用者如何创建、分享，再由有权限的同事运行。文件和截图用可公开的样例，标注为产品演示。

[同类官网调研](research/official-product-references-2026-11-16.md)提供对照：从 Kortix 看如何组织团队能力与部署路径，从 WorkBuddy 和 Eigent 看如何呈现一件具体任务，从 Manus 和 Genspark Business 看成果展示，从 Dify 看部署与治理入口。这些是内容参考，不用竞品素材作官网画面。

## 视觉和动效

沿用 [上一次 LinkSense 官网底稿](../../linksense/docs/research/linksense-website-content-2026-10-16.md)已选的 **Cuberto**。借用大字号、首屏分行揭示、圆角宽画幅影片和错落排版；用 LinkSense 自己的字标、品牌蓝和实际产品界面定调。

- **首屏**：偏暖的白底、两行实色大标题，正文和双按钮。页首露出下方的实际工作台海报。沿用现官网品牌蓝 `#1765ED`，只用在主要按钮、焦点和有语义的连接路径上。
- **演示**：滚到浅底与石墨黑的交界处，让工作台占满内容宽度。三个阶段可点击：任务、成果、共享；画面从工作台切到比价表中可阅读的几行，再到采购应用的授权与复用。细蓝线两端对齐对应的文件与台前画面，切换阶段时描亮一次。不做持续粒子、发光球、紫蓝渐变或虚构的聊天输入框。
- **余下页面**：交替展示宽画幅的办公成果与竖幅的能力详情；深色整段解释自托管和治理。先用产品画面证明能力，再补说明，不堆等宽功能卡和营销形容词。
- **交互**：标题与说明分别揭示；宽屏影片仅做轻微遮罩和缩放；按钮有短距离反馈；移动端按同样顺序阅读，视频自愿播放。首版保留浏览器原生滚动和指针，不做全屏路由转场、滚动接管或 WebGL。减少动态时直接显示终态与海报，任何动画不阻挡链接。

`bryce-nice-site-creator` 的六个原站：[Cuberto](https://cuberto.com/)（本方案主参考）、[Dennis Snellenberg](https://dennissnellenberg.com/)（大字与弧形转场）、[Exo Ape](https://www.exoape.com/)（影片与错落版式）、[Unseen Studio](https://unseen.co/)（沉浸空间）、[Aimg](https://animg.vercel.app/)（轻量工具布局）、[Appwrite](https://appwrite.io/)（开发者平台与控制台展示）。

## 首版页面

| 页面 | 范围 |
| --- | --- |
| 首页 `/` 与语言对应路径 | 定位与两个行动入口 → 一段任务演示 → 完成、沉淀、复用三步 → 自托管、模型与权限 → 体验 / 部署。知识、连接器、自动化放回场景中，不做三套目录。 |
| 自托管 `/install/` 与语言对应路径 | Core / Full 差异、Linux / macOS 的适用条件、按选项生成的安装提示和复制操作、完整部署文档。两者是部署配置，Full 额外提供文档处理、索引与知识检索，不包装成收费档位。沿用现有 `edition` 和 `platform` 深链接。 |
| 文档、GitHub、在线体验 | 链接现有入口。官网没有登录或任务执行，体验按钮进现有工作台。 |

优先复用 [现有授权素材说明](../../linksense-site/public/media/README.md)中的字标、产品短片和海报。已有产品录像是英文画面，先用作验证过渡素材；新采购示例在实际流程录制后再替换。主影片用本地优化媒体与可读海报，不直接使用原始大 GIF；旁边提供阶段说明，非播放状态也能了解任务。

## 实现和验收

1. **独立 SSR 项目。** TanStack Start + React 19 + TypeScript + Vite + Tailwind v4，Node.js 24、独立 pnpm 锁文件。文件路由和内容随站点构建；标题、正文、导航和 SEO 元数据由服务端输出 HTML，客户端增强菜单、演示和复制。动效用 CSS 和 `motion/react`，只对有明确收益的段落增加依赖。不需要产品 API、CMS、数据库、登录或模型服务。
2. **先做一屏再铺开。** 先提供可在本地浏览的首页首屏和任务三阶段，检查桌面与移动布局；确认画面与文案后完成安装页及六语言。保留现站 `/` 的英文映射与 `/zh/`、`/es/`、`/pt/`、`/fr/`、`/ja/`，对应页面有独立 canonical、`hreflang` 和分享图。预览响应发送 `noindex`。
3. **按行为验收。** 用生产构建检查直接请求两页就有正文与元数据、没有 hydration 错误；验证六语言和安装选项深链接、404、复制反馈以及跳转。用 Codex 浏览器检查桌面与窄屏画面、键盘、减少动态、关闭 JS 时的基本导航，以及演示开关之间的状态；检查首屏媒体大小及页面布局是否在加载时跳动。
4. **上线另议。** 先独立预览。若后续接管主域，只切换官网路由；上线前回归 `/doc/*`、文档搜索、重定向、所需静态资源、`/llms.txt` 和现有安装链接，并保留回退旧首页的方法。当前没有选择生产运行目标，也不变更 Cloudflare、主域或体验站。

产品事实以 [LinkSense 中文 README](https://github.com/LingX-AI/LinkSense/blob/main/README.zh-CN.md)与当前文档为准。官网不承诺认证、性能收益、档位价格或数据永不外发；外部模型和连接器的数据流取决于配置。实现依据：[TanStack Start SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)、[SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo)。
