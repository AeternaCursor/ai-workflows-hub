# 人力资源 AI 工作流 👥

## 典型场景

- 简历筛选与打分（JD 匹配度排序）
- 面试题生成与面试纪要整理
- 入职 / 离职流程自动化
- 员工 FAQ 机器人（制度问答）

## 精选参考

| 工作流 | 平台 | 说明 |
|---|---|---|
| 简历解析 + 评分 | n8n | [官方库](https://n8n.io/workflows) 搜索 `resume`，邮件附件 → 解析 → 表格打分 |
| HR 知识库问答 | Dify | 制度文档入库 → RAG 问答机器人 |

## 平台模板入口

- [n8n 官方库](https://n8n.io/workflows) 搜索：`hr`、`resume`、`onboarding`
- [Dify Marketplace](https://marketplace.dify.ai/templates) 搜索：`HR`

## 注意事项

- 简历属个人敏感信息，处理时注意脱敏与最小化收集
- 自动筛选决策应保留人工复核环节

## 待贡献

- [ ] JD → 面试题生成工作流
- [ ] 入职材料自动收集与核查
- [ ] 员工满意度调研 → 分析报告
