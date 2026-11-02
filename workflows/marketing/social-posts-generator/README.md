# 社媒内容批量生成与发布

> 来源：[n8n 官方模板 #8965](https://n8n.io/workflows/8965) · 1.9k 浏览 · 43 节点

用 Gemini 生成图文内容，经 Kie.ai / Zernio API 生成配图并自动发布到多个社媒平台。

- **平台**：n8n 1.x
- **所需凭据**：Gemini API Key、Kie.ai API Key、Zernio API Key（HTTP Request 节点内配置）
- **触发方式**：手动 / 定时 / 表单输入主题
- **输入**：内容主题或选题列表
- **输出**：多平台发布的图文内容

## 使用步骤

1. 导入 `workflow.json`
2. 在 HTTP Request 节点填入各平台 API Key（Header Auth）
3. 调整品牌语气提示词与发布账号映射
4. 小流量试运行，确认各平台发布成功

## 注意事项

- 各平台 API 有频控，间隔节点建议 ≥ 10 分钟
