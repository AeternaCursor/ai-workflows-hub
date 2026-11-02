# 行业标杆参考实现

值得整仓学习的高质量项目 —— 学习它们如何**按行业组织 Agent 与工作流**。

## 金融 💰

### [anthropics/financial-services](https://github.com/anthropics/financial-services)
Anthropic 官方出品的金融行业参考套件，GitHub 热榜项目：
- **11 个端到端 Agent**：Pitch Agent、Market Researcher、GL Reconciler（总账对账）等
- **8 个垂直行业插件**：按 FSI 细分领域打包的技能、斜杠命令、数据连接器（`/comps`、`/dcf`、`/earnings`）
- **11 个顶级金融数据商 MCP 连接器**
- 覆盖投行、股票研究、私募股权、财富管理四大场景
- 双轨输出：Claude Cowork 插件 或 Managed Agents API 自行部署

**值得学习**：目录按 Agent / 垂直插件 / 连接器三层组织，每层自包含。

## 营销 / 销售 📣

### [filip-michalsky/SalesGPT](https://github.com/filip-michalsky/SalesGPT)
LangChain 构建的对话式销售 Agent：
- 可配置销售阶段（开场 → 需求分析 → 方案展示 → 促单）
- 商品知识库 + 异议处理提示词
- 附 FastAPI 服务，可直接 fork 定制

## 电商 🛒

### [Awesome-AI-GitHub：Commerce Agents & Ops Skills](https://dingminghbut.github.io/Awesome-AI-GitHub/agents.html)
追踪 96 个电商运营 Agent 项目（商家运营、Listing、定价、广告、CRM、订单处理、SOP），
其中 63 个近期活跃。**适合按图索骥找具体行业的成熟实现**。

## 软件研发 💻

### [github/gh-aw](https://github.com/github/gh-aw)
GitHub 官方 Agentic Workflows（技术预览，MIT）：
- 自然语言 Markdown → GitHub Actions
- 内置守卫、权限、审计与成本控制
- 支持 Copilot / Claude / Codex / Antigravity 作为执行引擎

## 空白区（贡献机会 🎯）

以下行业本仓库已用 n8n 模板补齐首个实现，但仍欢迎更强的端到端开源方案：

- ⚖️ **法务**：已收录合同风险分析（[workflows/legal](../workflows/legal)），可再补合同比对、法规检索
- 🏥 **医疗**：病历整理、随访自动化（注意合规红线）
- 🏭 **制造**：设备报告、质检文档
- 🏗️ **咨询**：访谈纪要 → 交付物生成
- 📊 **会计**：记账流水线、审计程序、报税准备
