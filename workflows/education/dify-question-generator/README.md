# Dify 智能出卷（网页/文本 → 带答案试卷）

> 来源：[awesome-dify-workflow · edu_question_gen](https://github.com/aircrushin/awesome-dify-workflow/blob/main/DSLs/edu_question_gen.yml) · DSL v0.1.3
> 🧪 实测状态：workflow 文件为官方原版（导入即用）；教程为文档级（参数依据官方文档编写，未逐机真机验证）

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)
> 📄 产出格式预览：[sample-output.md](sample-output.md)（按提示词结构复现的完整试卷样例）

教师填一张表单（年级/科目/题型/数量/难度/参考资料），Dify 自动抓取或读取
参考资料，两段 LLM（出题 → 校对）产出带标准答案标记的 Markdown 试卷。
本库首个 Dify 工作流，与
[PDF 一键生成测验题](../pdf-quiz-generator/)（n8n 版）构成同场景跨平台对照。

- **平台**：Dify（自托管或云版，0.6+ 均可导入）
- **所需凭据**：任一已配置的 LLM（模板默认 AWS Bedrock Claude 3.5 Sonnet，
  导入后可一键切换 OpenAI / DeepSeek / 通义等任意模型）
- **触发方式**：Dify 画布"运行"，或发布为 Web 应用给教师使用
- **输入**：8 个表单项（参考资料 URL 或纯文本、年级、科目、题型、数量、主题、难度、备注）
- **输出**：Markdown 试卷（单选 `- (x)`、多选 `- [x]`、填空 `- R:=答案` 标记标准答案）

## 使用步骤

1. Dify → 导入 DSL → 上传 `workflow.yml`
2. 两个 LLM 节点换成你已配置的模型
3. 填表单 → 运行 → 复制试卷 Markdown

## 注意

- 参考资料为可选：不填则纯按科目/主题出题；填 URL 自动用内置网页爬虫抓取（免费）
- "网页爬虫"为 Dify 内置工具，无需额外 API Key
