# AI Workflows Hub 🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/AeternaCursor/ai-workflows-hub)](https://github.com/AeternaCursor/ai-workflows-hub/commits/main)
[![Timeline](https://img.shields.io/badge/AI%20%E5%8F%91%E5%B1%95%E5%8F%B2-%E5%8A%A8%E7%94%BB%E6%97%B6%E9%97%B4%E7%BA%BF-4fc3f7)](https://aeternacursor.github.io/ai-workflows-hub/)
[![Issues](https://img.shields.io/github/issues/AeternaCursor/ai-workflows-hub)](https://github.com/AeternaCursor/ai-workflows-hub/issues)

> 各行业、各领域的 AI 工作流资源中心：精选模板、行业参考实现、平台引擎导航。
> Curated AI workflows across industries — templates, reference implementations, and platform engines.

## 这个仓库是什么

一个**跨平台、按行业分类**的 AI 工作流精选库：

- 🏭 **按行业找**：金融、营销、电商、法务、HR、教育、内容创作、客服、软件研发、通用办公
- 🧰 **按平台找**：n8n / Dify / Coze Studio / Langflow / Flowise / ComfyUI / GitHub Agentic Workflows
- 📦 **拿来即用**：每个条目注明运行平台、所需凭据、可导入文件
- 🕰️ **AI 发展史**：[动画时间线](https://aeternacursor.github.io/ai-workflows-hub/)，从 1943 年人工神经元到 Agent 时代
- 🔄 **持续维护**：每周定时捕捉新动态，[AI 提示词驱动更新](prompts/update-hub.md)

## 快速开始

1. 想直接用工作流 → 从 [模板合集](resources/template-collections.md) 里挑一个导入
2. 想按行业看 → 进入 [workflows/](workflows/) 目录选行业
3. 不知道选哪个平台 → 看 [平台对比](resources/platforms.md)
4. 想看 AI 发展史 → 打开[动画时间线](https://aeternacursor.github.io/ai-workflows-hub/)（或本地 `timeline/index.html`）
5. 想贡献自己的工作流 → 读 [贡献指南](CONTRIBUTING.md)

完整说明见 [USAGE.md](USAGE.md)。

## 行业 × 平台 索引

| 行业 | 目录 | 推荐平台 | 现成参考 |
|---|---|---|---|
| 💰 金融 | [workflows/finance](workflows/finance) | Claude / Dify | [anthropics/financial-services](https://github.com/anthropics/financial-services)（11 个 Agent） |
| 📣 营销 | [workflows/marketing](workflows/marketing) | n8n / Dify | [SalesGPT](https://github.com/filip-michalsky/SalesGPT)、Dify SEO Agent |
| 🛒 电商 | [workflows/ecommerce](workflows/ecommerce) | n8n / Coze | [Commerce Agents 目录](https://dingminghbut.github.io/Awesome-AI-GitHub/agents.html) |
| ⚖️ 法务 | [workflows/legal](workflows/legal) | Dify / Langflow | 合同审查（开源空白区，欢迎贡献） |
| 👥 人力资源 | [workflows/hr](workflows/hr) | n8n / Dify | 招聘筛选、入职自动化 |
| 🎓 教育 | [workflows/education](workflows/education) | Dify / Flowise | 课程生成、答疑 Agent |
| 🎬 内容创作 | [workflows/media](workflows/media) | ComfyUI | [官方模板库](https://github.com/comfy-org/workflow_templates)、[工作流画廊](https://comfy.org/workflows) |
| 💬 客服 | [workflows/customer-service](workflows/customer-service) | Dify / Coze | 工单分类、智能应答 |
| 💻 软件研发 | [workflows/software-dev](workflows/software-dev) | GitHub / n8n | [gh-aw](https://github.com/github/gh-aw)（Agentic Workflows） |
| 🗂️ 通用办公 | [workflows/general-office](workflows/general-office) | n8n | 邮件、会议纪要、文档处理 |

## 平台速查

| 平台 | 定位 | 模板生态 | 详情 |
|---|---|---|---|
| [n8n](https://github.com/n8n-io/n8n) | 通用工作流自动化 + AI 节点 | [官方库](https://n8n.io/workflows) 数千个 | [platforms.md](resources/platforms.md) |
| [Dify](https://github.com/langgenius/dify) | LLM 应用 / Agent / RAG | [Marketplace](https://marketplace.dify.ai/templates) | [platforms.md](resources/platforms.md) |
| [Coze Studio](https://github.com/coze-dev/coze-studio) | 可视化 Agent 平台（字节开源） | 官方插件市场 | [platforms.md](resources/platforms.md) |
| [Langflow](https://github.com/langflow-ai/langflow) | 拖拽式 RAG / Agent 构建 | 内置模板 | [platforms.md](resources/platforms.md) |
| [Flowise](https://github.com/FlowiseAI/Flowise) | 低代码 LLM 编排 | 社区模板 | [platforms.md](resources/platforms.md) |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | 图像 / 视频生成工作流 | [官方模板](https://github.com/comfy-org/workflow_templates) + [画廊](https://comfy.org/workflows) | [platforms.md](resources/platforms.md) |
| [gh-aw](https://github.com/github/gh-aw) | GitHub Actions 里跑 AI Agent | 官方示例集 | [platforms.md](resources/platforms.md) |

## 目录结构

```
ai-workflows-hub/
├── workflows/          # 按行业分类的工作流（每个行业一个目录）
│   ├── finance/        # 金融
│   ├── marketing/      # 营销
│   └── ...
├── resources/          # 资源导航
│   ├── platforms.md            # 平台引擎对比
│   ├── template-collections.md # 通用模板合集
│   └── industry-references.md  # 行业标杆参考实现
├── timeline/           # AI 发展史动画时间线（编辑 data.js 即可扩展）
├── prompts/            # AI 维护提示词（update-hub.md）
├── .github/workflows/  # 每周定时动态捕捉提醒
├── USAGE.md            # 使用说明
├── CHANGELOG.md        # 更新日志
├── CONTRIBUTING.md     # 贡献指南
└── LICENSE             # MIT
```

## 维护机制

AI 发展快，本仓库用「定时提醒 + AI 提示词」保持更新：

```
每周一 09:00 GitHub Actions 自动建周报 Issue
   → 复制 prompts/update-hub.md 给任意 AI 助手
   → AI 检索本周动态 → 按规范更新对应文件 → 人工审阅合并
```

详见 [USAGE.md](USAGE.md) 的「维护者日常更新」一节。

## 贡献

欢迎提交你所在行业的 AI 工作流！格式见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可

[MIT](LICENSE) — 仓库原创内容按 MIT 使用；引用的外部项目请遵循其各自的开源协议。
