# AI 简历筛选与行为面试助手

> 来源：[n8n 官方模板 #3765](https://n8n.io/workflows/3765) · 5.1k 浏览 · 67 节点

用 Gemini 读取 Google Drive 中的简历，按岗位要求评分写入 Google Sheets，
并通过 Notion ATS 管理候选人 + ElevenLabs 生成语音面试问题。

- **平台**：n8n 1.x
- **所需凭据**：Google Drive、Google Sheets、Notion、Google Gemini、ElevenLabs
- **触发方式**：手动 / 定时轮询 Drive 目录
- **输入**：PDF/DOCX 简历（指定 Drive 目录）
- **输出**：评分表（Sheets）+ 候选人档案（Notion）+ 语音面试题（MP3）

## 使用步骤

1. 导入 `workflow.json`
2. 配置 5 项凭据（n8n 内置 OAuth 引导）
3. 修改岗位 JD 与评分维度提示词
4. 运行，检查 Sheets 评分结果

## 注意事项

- 简历含个人敏感信息，仅处理经授权的简历，注意脱敏与保留期限
- 自动评分仅作初筛参考，保留人工复核
