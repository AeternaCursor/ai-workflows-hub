# PDF 一键生成测验题（Google Forms）

> 来源：[n8n 官方模板 #12012](https://n8n.io/workflows/12012) · 17 节点

上传课程 PDF → OpenAI 按知识点生成选择题 → 自动创建 Google Forms 测验，
教师只做最终审校。

- **平台**：n8n 1.x
- **所需凭据**：OpenAI API Key、Google Drive（读 PDF）、Google Forms（写测验）
- **触发方式**：手动上传 / 监听 Drive 目录
- **输入**：教材或讲义 PDF
- **输出**：带答案解析的 Google Forms 测验链接

## 使用步骤

1. 导入 `workflow.json`
2. 连接 OpenAI、Google Drive、Google Forms 凭据
3. 调整出题提示词（题型/难度/数量）
4. 上传一份 PDF 试跑，核对生成质量

## 延伸场景

- 企业培训考核自动出题
- 题库沉淀：结果同时写入 Google Sheets 便于复用
