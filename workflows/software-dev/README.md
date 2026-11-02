# 软件研发 AI 工作流 💻

## 精选参考

| 工作流 | 平台 | 说明 |
|---|---|---|
| [github/gh-aw](https://github.com/github/gh-aw) | GitHub Actions | 官方 Agentic Workflows：Markdown 定义 → Actions 运行，含权限/审计/成本控制 |
| Repo Assist | gh-aw | 定时运行：issue 分诊、修 bug、补测试，月度活跃报告 |
| [PR 自动审查](https://n8n.io/workflows/3804-automated-pr-code-reviews-with-github-gpt-4-and-google-sheets-best-practices/) | n8n | GitHub PR → 提取 diff → GPT-4 按团队规范（Google Sheets 维护）生成审查意见 |
| [GitHub 自动化枢纽](https://n8n.io/workflows/4629-github-automation-hub-complete-api-controls-for-ai-agents/) | n8n | SSE 端点 + MCP，让任意 AI Agent 操控 GitHub API |

## 典型场景

- issue 自动打标签、分诊、复现
- PR 代码审查与规范检查
- 定时依赖升级 + 回归测试
- commit message / changelog 自动生成

## 平台模板入口

- [n8n 官方库](https://n8n.io/workflows) 搜索：`github`、`code review`、`ci`

## 待贡献

- [ ] issue → 复现 → 修复 PR 的完整闭环（gh-aw 版）
- [ ] 多语言单元测试生成工作流
- [ ] 技术债周报生成
