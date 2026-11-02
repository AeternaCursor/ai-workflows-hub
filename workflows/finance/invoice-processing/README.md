# 发票识别校验与入账

> 来源：[n8n 官方模板 #4247](https://n8n.io/workflows/4247) · 13.7k 浏览 · 22 节点

对上传的发票做 OCR 提取 → OpenRouter LLM 校验（金额/税号/日期一致性）→
结果与异常标记写入 Google Sheets，供财务复核。

- **平台**：n8n 1.x
- **所需凭据**：OpenRouter API Key、Google Sheets OAuth
- **触发方式**：手动上传 / 监听邮件附件
- **输入**：发票图片或 PDF
- **输出**：结构化发票台账（含校验结果列）

## 使用步骤

1. 导入 `workflow.json`
2. 配置 OpenRouter（含视觉模型，如 GPT-4o / Qwen-VL）与 Google Sheets
3. 建立台账 Sheet 并映射列
4. 试跑样例发票，核对 OCR 精度后放量

## 注意事项

- LLM 提取的金额必须抽样人工核对，勿直接对接付款
- 敏感发票建议自托管 n8n 并启用磁盘加密
