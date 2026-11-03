# AI 代码审查与 PR 自动打标

> 来源：[n8n 官方模板 #11967](https://n8n.io/workflows/11967) · 22 节点
> 🧪 实测状态：workflow 文件为官方原版（导入即用）；教程为文档级（参数依据官方文档编写，未逐机真机验证）

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

GitHub 新 PR → 提取 diff → GPT-4o-mini 按团队规范审查 → 自动打标签 →
结果推送 Slack，维护者只需看摘要。

- **平台**：n8n 1.x
- **所需凭据**：GitHub（OAuth/Token）、OpenAI API Key、Slack（Bot Token）
- **触发方式**：GitHub Webhook（PR 创建/更新事件）
- **输入**：Pull Request diff
- **输出**：PR 评论/标签 + Slack 通知

## 使用步骤

1. 导入 `workflow.json`
2. 配置 GitHub、OpenAI、Slack 三项凭据
3. 在审查提示词节点里写入团队代码规范（可外置到 Google Sheet 维护）
4. 用测试仓库 PR 验证全链路后接入正式仓库

## 与 gh-aw 的取舍

- 想要 GitHub 原生方案（Actions 里跑 Agent）：见 [gh-aw](https://github.com/github/gh-aw)
- 本模板胜在跨仓库灵活、审查规则集中管理
