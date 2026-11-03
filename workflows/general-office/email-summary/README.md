# 邮件摘要 Agent

> 来源：[n8n 官方模板 #2722](https://n8n.io/workflows/2722) · 42k 浏览（高人气）· 9 节点
> 🧪 实测状态：workflow 文件为官方原版（导入即用）；教程为文档级（参数依据官方文档编写，未逐机真机验证）

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

Gmail 收到新邮件后自动调用 OpenAI 生成中文摘要，按重要度分级后推送——
入门 n8n + LLM 的最佳第一课。

- **平台**：n8n 1.x
- **所需凭据**：Gmail OAuth、OpenAI API Key
- **触发方式**：Gmail 新邮件事件（即时）
- **输入**：新邮件全文
- **输出**：结构化摘要（主题/要点/待办/紧急度）

## 使用步骤

1. 导入 `workflow.json`
2. 连接 Gmail（OAuth 引导）与 OpenAI 凭据
3. 自定义摘要提示词与推送渠道（默认 Gmail 回信/标签）
4. 激活即可

## 适合改造方向

- 改推送到 Telegram/飞书/Slack
- 按发件人白名单过滤
- 串联日历节点自动安排待办
