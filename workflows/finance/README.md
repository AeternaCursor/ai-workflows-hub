# 金融 AI 工作流 💰

## 精选参考

| 工作流 | 平台 | 说明 |
|---|---|---|
| [anthropics/financial-services](https://github.com/anthropics/financial-services) | Claude | 11 个端到端 Agent：Pitch、市场研究、总账对账、DCF 估值等 |
| Financial Services 插件包 | Claude | `/comps` 可比公司分析、`/dcf` 现金流折现、`/earnings` 财报分析 |
| 11 个金融数据 MCP 连接器 | Claude | 顶级金融数据商接入 |

## 典型场景

- 财报摘要与研究笔记生成（人工复核后使用）
- 可比公司分析（Comps）与估值模型初稿
- 总账对账与差异定位
- 市场研究与行业扫描

## 平台模板入口

- [n8n 官方库](https://n8n.io/workflows) 搜索：`finance`、`stock`、`invoice`
- [Dify Marketplace](https://marketplace.dify.ai/templates) 搜索：`financial`、`procurement`

## 待贡献

- [ ] 财报解析 + 摘要流水线（含 Python/n8n 版本）
- [ ] 合规审查 checklist Agent
- [ ] 投资备忘录生成工作流
