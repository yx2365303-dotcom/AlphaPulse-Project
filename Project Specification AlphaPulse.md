# Project Specification: AlphaPulse - Financial Intelligence Hub (CN Version)

1. 项目概述 (Project Overview)
AlphaPulse 是一个现代化的金融数据仪表盘，用于每日复盘和量化分析。它将展示存储在 Supabase 中的 A 股市场数据（如涨跌停、龙虎榜、板块热度）。
核心要求：
• 全中文界面 (Mandatory): 所有的按钮、标签、提示信息、表格表头必须使用 简体中文 (Simplified Chinese)。
• 护眼模式: 专为长时间盯盘设计，避免高对比度的纯黑白。
• 模块化: 预留 AI 接口。
2. 技术栈要求 (Tech Stack)
• 框架: Next.js 14+ (App Router)
• 语言: TypeScript
• 样式: Tailwind CSS
• 组件库: Shadcn/ui (现代、模块化、无障碍)
• 图表: Recharts (用于可视化金融趋势)
• 后端/数据库: Supabase (PostgreSQL) & Supabase Auth
• 状态管理: React Query (TanStack Query)
3. UI/UX 设计规范 (Design Guidelines)
• 语言: 简体中文 (Simplified Chinese)。
• 主题: “护眼”深色模式 (Eye-Friendly Dark Mode)。
• 背景色：使用深蓝灰或深锌色 (Deep Slate/Zinc, e.g., #0f172a)，禁止使用纯黑 (#000000)。
• 文字颜色：使用灰白色 (text-slate-300)，降低视觉疲劳。
• 强调色：使用柔和的青色或靛蓝色，避免刺眼的霓虹色。
• 布局:
• 顶部导航栏: Logo (AlphaPulse), 导航选项卡, 日期选择器, 用户头像/登出。
• 内容区: 卡片式布局，高密度数据展示但保持清晰。
4. 核心功能需求 (Functional Requirements)
4.1. 用户认证 (Authentication)
• 集成 Supabase Auth (邮箱/密码登录)。
• 所有页面均为受保护路由，未登录用户自动跳转至登录页。
• 登录页文案示例：“欢迎回到 AlphaPulse”，“请登录您的账户”。
4.2. 基于时间的日期逻辑 (The "7 PM Rule")
• 默认显示日期逻辑:
• 若当前时间 < 19:00: 默认显示 昨天 的数据。
• 若当前时间 >= 19:00: 默认显示 今天 的数据。
• 日期选择器: 用户可以手动选择过去 2 年内的任意日期，但首次加载必须遵循上述规则。
4.3. 功能模块 (Tabs & Features)
请创建以下 4 个主要选项卡（Tabs），并使用中文命名：
5. 打板专题 (Market Mood)
• 数据源: limit_list_ths (涨停列表), limit_step (连板天梯)。
• 界面:
• 今日数据概览: 显示涨停家数、炸板率等核心指标。
• 涨停梯队: 可视化展示（如：7板、5板、4板...），显示连板高度。
• 涨停明细表: 包含股票代码、名称、涨停原因 (lu_desc)、封单额等。
6. 龙虎榜 (Top List)
• 数据源: top_list (每日明细), top_inst (机构明细)。
• 界面: 重点展示机构净买入 (net_buy > 0) 的个股列表，高亮显示知名游资席位。
7. 板块风口 (Sectors)
• 数据源: limit_cpt_list (最强板块), kpl_concept (题材数据)。
• 界面: 热力图或排行榜，展示今日最强概念板块及其涨停家数。
8. AI 投研 (AI Analyst)
• 界面: 这是一个预留的扩展模块。
• 布局: 右侧或独立面板，设计一个对话框接口：“请输入您想分析的股票或板块...”。
• 代码实现: 定义一个 AIAnalysisService 接口，目前仅在控制台输出日志，方便后续接入大模型 API。
9. 数据库字段映射 (Supabase Schema Context)
请根据以下表结构生成 TypeScript 类型定义：
• limit_list_ths: (trade_date, ts_code, name, price, limit_type, lu_desc, status...)
• top_list: (trade_date, ts_code, name, net_amount, reason...)
• limit_step: (trade_date, ts_code, nums...)
• limit_cpt_list: (trade_date, ts_code, name, up_stat, rank...)
10. 实现步骤建议
11. Setup: 初始化 Next.js 项目，配置 Shadcn/ui，设置全局语言为中文。
12. Auth: 创建中文登录页面。
13. Logic: 编写 getDateStatus() 工具函数实现 19:00 的时间判断逻辑。
14. Components: 创建 StockTable (股票表格) 和 LadderChart (连板梯队图)。
15. Integration: 连接 Supabase 拉取数据。