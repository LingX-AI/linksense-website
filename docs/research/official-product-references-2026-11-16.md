# LinkSense 独立官网：同类产品参考调研

调研日期：2026-11-16（Asia/Shanghai）。

范围：为独立营销官网规划筛选同类产品，核对官方公开页面的定位、内容与信息架构。产品能力以官方网页文本和文档为准，没有登录或运行竞品。视觉仅抽查了 Kortix 和 Appwrite 的桌面首屏；未验证滚动、动画、移动端、性能及产品宣传的实际效果。下文“可借鉴”均为规划建议，不代表已确认的设计或已实现内容。

## 比较基线

产品来源仓库为同级 `linksense` 目录，读取时分支为 `feat`，基线提交为 `d9350da473808e3e152af74b7f71141a9dcd1fb5`。本轮只以现有 [中文 README](../../../linksense/README.zh-CN.md) 和 [英文 README](../../../linksense/README.md) 确认 LinkSense 的公开定位：

比较定位（概括）：**面向组织、可自主部署的 Agent 工作空间；完成任务并交付文件，按权限共享 Knowledge、Skills、Plugins、Applications，通过连接器或 MCP 使用业务系统，并提供成员、模型、额度、用量和审计管理。**

README 还确认 Web、消息渠道和定时任务入口，以及外部或兼容自建模型端点。比较重点因此是“任务交付 + 可复用组织能力 + 受控连接 + 部署治理”，不能仅按聊天、模型聚合或工作流画布寻找参考。[L1][L2]

公开文案的边界同样来自 README：Full 增加内置文档解析、索引和检索；安全隔离边界是用户 Worker，同一用户任务可访问共享文件；外部服务会接收按配置发送的数据。因此不能从竞品迁入“每任务独立电脑”“所有数据绝不外发”“全离线”或“零幻觉”等承诺。[L1][L2]

## 九个官网及借鉴范围

| 产品与官方入口 | 已核实的重叠与差异 | 值得借鉴的内容和信息架构（建议） | 不应直接迁入 LinkSense |
| --- | --- | --- | --- |
| **Kortix**：[kortix.com](https://kortix.com/) | 当前首页定位已是 **CompanyOS**。共享 Agents、Skills、Apps、Drive、Connectors、Automations，并列 Web/渠道、自有部署和模型选择，与 LinkSense 的组织工作空间方向很接近；另强调公司配置放入 Git、开发框架及每 session 的电脑。[K1] | 按“组成能力 → 使用入口 → 运行与治理”拆导航；先用工作空间与行业任务解释成果，再说明开放源码和部署。适合参考如何把能力目录讲成一套组织工作方式。[K1] | 不照搬 CompanyOS 命名、公司即代码的技术主线、连接器数量及每 session 独立电脑的隔离承诺；技术配置示例不宜占据 LinkSense 面向普通成员的首屏。 |
| **腾讯 WorkBuddy**：[官网](https://www.workbuddy.cn/) · [腾讯云产品页](https://cloud.tencent.com/product/workbuddy) | 同样面向需要完成任务和交付文件的人群，也是 LinkSense README 点名的对标产品。产品页着重展示本地文件、云端任务及团队复用；企业版另有私有化部署选项。[L2][W1][W2] | 用周报、资料汇总等办公任务直接解释结果，再让个人体验和企业评估分流。[W1] | 不据此宣称 LinkSense 已有同等桌面能力；也不要把 WorkBuddy 写成只有个人版或只有 SaaS。[W1][W2] |
| **Eigent**：[eigent.ai](https://www.eigent.ai/) | 以开放源码 Cowork 为入口，强调模型选择、本地/自托管、Skills/Connectors、可复用 Space，以及结果审阅。与任务执行、组织上下文及共享能力很接近；当前表达仍有明显桌面/本地工作取向。[E1] | 首页使用具体研究任务，呈现对话、过程、执行上下文和输出文件；再解释“配置一次、重复使用”和部署/模型/审阅。适合参考如何证明工作确实完成，并把控制能力放在相关上下文中。[E1] | 不把其下载入口变成 LinkSense 已有桌面交付承诺；不复制演示中的结果、耗时或企业认证图标。其官网明确部分合规工作仍在推进，更不能将这些标识移作 LinkSense 背书。[E1] |
| **Manus**：[manus.im](https://manus.im/) · [功能目录](https://manus.im/features) | 官网围绕建站、幻灯片、研究、Skills、Projects、自动化和 MCP 连接等结果与工作方式组织能力；与任务到交付物重叠。公开首页的叙事重心是直接发起工作，组织自主部署并非本次页面的主线。[M1][M2] | 首页先呈现用户能做的事，功能目录以 Build/Create/Research/Automate/Connect 分组；将细节、帮助和信任入口放入后续导航。适合学习动词与成果导向的表达。[M1][M2] | 不把无登录演示输入框包装成真实可执行入口；不照搬其原生移动应用、游戏、视频等全部产品范围，也不把极简任务入口当成足够的企业采购说明。 |
| **Genspark**：[genspark.ai](https://www.genspark.ai/) · [Business](https://www.genspark.ai/business) | Business 页明确是组织 AI 工作空间，覆盖自主 agents、Docs/Sheets/Slides、连接器、自定义 skills、团队权限和审计，与 LinkSense 的交付及组织使用重叠。其页面还推广原生办公编辑器、邮件和硬件等更广产品族。[G1][G2] | Business 页按产品能力、可执行任务、连接系统、职能场景、治理、方案和行动入口展开；输出类别和工作职能之间的映射很清楚。规划时优先参考 Business 页，而非根页面庞大的工具列表。[G1][G2] | 不宣传 LinkSense 已有同等原生办公协作、硬件或邮件客户端；不复制模型、连接器、团队数量及合规认证。避免把官网扩成大量重复的“AI XX Generator”入口。 |
| **Dify**：[dify.ai](https://dify.ai/) · [Enterprise](https://dify.ai/dify-enterprise) | 围绕 agent/workflow 构建、Knowledge Pipeline、插件市场、发布和监控；有模型与部署选择、访问管理。与能力建设和治理重叠，但更突出 AI 应用开发与编排平台，而 LinkSense README 的第一使用动作是执行任务。[D1][D2] | 产品菜单把 Build 与 Deploy 分开；首页清晰区分 Cloud、Enterprise、Community，详情再讲治理。适合参考“能完成什么”和“怎样落地”分别讲清的结构。[D1][D2] | 不把 LinkSense 的 Core/Full 误写成社区/企业收费等级；不照搬 Kubernetes、SCIM、SLA、隔离网络、认证或客户成绩等尚未由 LinkSense 当前来源证明的能力。 |
| **n8n**：[n8n.io](https://n8n.io/) · [Enterprise](https://n8n.io/enterprise/) | 官方主线是可理解的 agents 与 workflows，强调集成、人工审批、执行历史、自托管和治理；与系统连接、自动化、追溯重叠。它以可视化工作流为主要组织形式，与 LinkSense 的对话任务工作台不同。[N1][N2] | 将真实业务触发、处理过程、人工决策和最终结果放在同一场景；再解释连接、可见性、部署与企业控制。适合参考如何以具体过程证明“接入业务”。[N1][N2] | 不让用户误以为 LinkSense 已有同等节点编辑器、逐节点重跑或流程版本能力；不复制其工作流 UI、集成规模、客户效益数字及许可证表述。 |
| **Relevance AI**：[relevanceai.com](https://relevanceai.com/) · [Enterprise](https://relevanceai.com/enterprise) | 以业务 agents、构建和持续运营为中心，公开讲权限、审批、追踪、成本和集成；与共享能力及可治理自动化重叠。其首页更强调业务团队从用例识别到生产运营的导入过程。[R1][R2] | 导航先区分 Solutions、Customers、Product、Resources、Enterprise；首页以业务结果与实施路径建立理解，再说明控制与连接。适合参考管理员和业务负责人的评估问题。[R1][R2] | 不迁入其 ROI、自治等级、部署服务时限或客户评价；本轮没有证实其与 LinkSense 相同的源码许可、自有部署及普通任务工作台边界，不据缺少证据宣称其“不支持”。 |
| **Flowith**：[flowith.io](https://flowith.io/) · [官方上手文档](https://flowith.io/docs/en/canvas/landing/) | 官方资料确认 Flow、Projects、Knowledge Garden/Market、模型选择和创作成果上下文，和知识辅助工作、成果组织有交集；更突出可视化创作空间。本轮根域文本跳转到 `/blank`，不据此判定官网布局。[F1][F2] | 可参考把知识作为工作上下文，以及用可复用示例帮助用户开始任务；官方内容还将“公开界面存在”和“账号可用能力”分开，值得借鉴这种证据边界。[F1][F2] | 不复制无限画布作为 LinkSense 产品界面；不使用旧 Neo 文案推导无限步数/上下文，不从文档或静态节点推断官网动画。视觉参考优先级低于前五项。 |

## 推荐优先级与组合方式

这是按 LinkSense 当前定位作出的编辑判断，并非竞品能力排名：

1. **Kortix + Eigent：产品结构。** 研究组织能力、任务过程、共享上下文、部署与治理如何形成完整故事。[K1][E1]
2. **WorkBuddy + Manus + Genspark Business：成果表达。** 研究如何让陌生访客快速看懂“提交什么、执行什么、最终拿到什么”，将实际界面与交付物关联。[W1][M1][M2][G2]
3. **Dify：落地说明。** 研究如何给普通使用者和部署评估者提供清楚、独立的路径。[D1][D2]

n8n 与 Relevance AI 用于补充业务场景和治理内容；Flowith 用于补充知识到成果的叙事。首版不宜将八站的菜单和功能区全部叠加。

可用于后续方案的内容主线建议为：**完成一项工作 → 看见真实成果 → 沉淀与共享能力 → 连接已有系统 → 自主部署与统一治理 → 体验或部署**。首页只保留足以理解价值与作出下一步决定的信息，操作步骤继续链接现有文档。这是规划建议，尚未制作页面、录制演示或确认路由。另通过 Codex 浏览器查看了 Kortix 和 Appwrite（视觉参考，不是同类产品）的桌面首屏；未对这两站做动效、移动端或无障碍审计。

## 后续视觉核验清单

代表样本优先查看 Kortix、Eigent、Manus、Genspark Business 与 Dify。浏览器核验应分别记录首屏、完整页面、导航、桌面/移动端及减少动态效果设置；只有实际观察到的行为才能进入“已验证动效”记录。

正式官网材料必须使用 LinkSense 自有界面、可公开样本、真实可下载成果和获授权证据。竞品截图、商标、客户 Logo、评价、统计、案例与产品演示只作比较证据，不直接作为 LinkSense 素材。

本轮没有修改应用代码、依赖、路由、部署或现有文档，也没有运行产品测试。官方宣传与实际可用性、账户套餐、地区、权限和部署版本之间的差异仍需后续验证。

## 来源

所有外部来源均为第一方官方页面；访问日期为 2026-11-16。页面当前内容可能随时变化，未注明日期的网页不能当作长期版本规格。

- [L1] [LinkSense 中文 README](../../../linksense/README.zh-CN.md)。
- [L2] [LinkSense 英文 README](../../../linksense/README.md)。
- [K1] [Kortix 官网](https://kortix.com/)。
- [W1] [腾讯云 WorkBuddy 产品页](https://cloud.tencent.com/product/workbuddy)；[WorkBuddy 官网](https://www.workbuddy.cn/) 可打开，产品特性以可读的腾讯云官方内容核对。
- [W2] [腾讯云 WorkBuddy Enterprise 版本说明](https://cloud.tencent.com/document/product/1831/134332)。
- [E1] [Eigent 官网](https://www.eigent.ai/)。
- [M1] [Manus 官网](https://manus.im/)。
- [M2] [Manus 功能目录](https://manus.im/features)。
- [G1] [Genspark 官网](https://www.genspark.ai/)。
- [G2] [Genspark for Business](https://www.genspark.ai/business)。
- [D1] [Dify 官网](https://dify.ai/)。
- [D2] [Dify Enterprise](https://dify.ai/dify-enterprise)。
- [N1] [n8n 官网](https://n8n.io/)。
- [N2] [n8n Enterprise](https://n8n.io/enterprise/)。
- [R1] [Relevance AI 官网](https://relevanceai.com/)。
- [R2] [Relevance AI Enterprise](https://relevanceai.com/enterprise)。
- [F1] [Flowith 官方上手文档](https://flowith.io/docs/en/canvas/landing/)。
- [F2] [Flowith 当前工作区说明](https://flowith.io/blog/meet-agent-neo/)；页面内注明其来源检查时间为 2026-08-01，本轮只将其作为官方边界说明，并以当日可访问表面核对入口。
