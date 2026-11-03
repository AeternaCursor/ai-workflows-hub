# 教育 AI 工作流 🎓

## 典型场景

- 课程大纲与讲义生成
- 题目生成与自动批改（客观题 + 作文评分）
- 个性化答疑 Agent（基于课程知识库 RAG）
- 学情分析报告

## 精选参考

| 工作流 | 平台 | 说明 |
|---|---|---|
| 📦 [PDF 一键生成测验题](pdf-quiz-generator/)（已收录） | n8n | 教材 PDF → OpenAI 出题 → Google Forms 测验 |
| 📦 [Dify 智能出卷](dify-question-generator/)（已收录） | Dify | 网页/文本 → 两段 LLM（出题+审校）→ 带答案 Markdown 试卷 |
| 多步 RAG 答疑管线 | Dify | [Marketplace](https://marketplace.dify.ai/templates) 官方示例：问题抽取 → 循环检索 → 引用生成 |
| Quiz 生成器 | Flowise / Langflow | 知识点 → 选择题/简答题 + 答案解析 |

## 平台模板入口

- [Dify Marketplace](https://marketplace.dify.ai/templates) 搜索：`education`、`quiz`
- [n8n 官方库](https://n8n.io/workflows) 搜索：`education`、`summary`（讲义摘要类）

## 待贡献

- [ ] 教材 → 知识点卡片生成流水线
- [ ] 作文批改工作流（评分维度可配置）
- [ ] 错题本自动归集
