# 平台引擎对比

选平台的核心原则：**先看模板生态，再看引擎能力**。你的工作流 80% 可以从现成模板改出来。

## 综合对比

| 平台 | Stars | 语言 | 部署方式 | 最适合 | 模板生态 |
|---|---|---|---|---|---|
| [n8n](https://github.com/n8n-io/n8n) | 100k+ | TS | 自托管 / 云 | 通用自动化 + SaaS 集成（800+ 连接器） | ⭐⭐⭐⭐⭐ [官方库](https://n8n.io/workflows) + 社区 8600+ 合集 |
| [Dify](https://github.com/langgenius/dify) | 100k+ | Python | 自托管 / 云 | LLM 应用、RAG、Agent、对话产品 | ⭐⭐⭐⭐ [Marketplace](https://marketplace.dify.ai/templates) |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | 90k+ | Python | 本地 / 云 GPU | 图像、视频、语音生成 | ⭐⭐⭐⭐⭐ [官方模板](https://github.com/comfy-org/workflow_templates) + [画廊](https://comfy.org/workflows) |
| [Coze Studio](https://github.com/coze-dev/coze-studio) | 40k+ | TS / Go | 自托管 | 可视化 Agent + 插件体系（字节开源） | ⭐⭐⭐ 官方插件市场 |
| [Langflow](https://github.com/langflow-ai/langflow) | 60k+ | Python | 本地 / 云 | 快速原型 RAG / Agent | ⭐⭐⭐ 内置模板 |
| [Flowise](https://github.com/FlowiseAI/Flowise) | 35k+ | TS | 本地 / 云 | 低代码 LLM 编排、聊天机器人 | ⭐⭐⭐ 社区模板 |
| [Activepieces](https://github.com/activepieces/activepieces) | 15k+ | TS | 自托管 / 云 | 轻量自动化（开源 Zapier 替代） | ⭐⭐⭐ 官方 piece 市场 |
| [gh-aw](https://github.com/github/gh-aw) | 官方 | - | GitHub Actions | 代码仓库内的 AI Agent（issue 分诊、PR 审查） | ⭐⭐⭐ 官方示例集 |

## 选型建议

- **连接 SaaS 工具为主**（邮件、表格、IM、CRM）→ n8n
- **以 LLM 为核心**（知识库问答、客服、内容生成）→ Dify 或 Coze Studio
- **图像 / 视频生成** → ComfyUI
- **纯代码、可编程编排** → LangGraph / LlamaIndex Workflows
- **围绕代码仓库的自动化** → gh-aw

## 平台间迁移

多数平台支持导出 JSON / YAML（n8n 导出 JSON、Dify 导出 DSL YAML、ComfyUI 导出 workflow.json）。
贡献到本仓库时，请在工作流目录附上导出文件 + 平台版本号。
