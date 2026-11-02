# 法务 AI 工作流 ⚖️

> ⚠️ 开源空白区：目前尚缺成熟的端到端开源实现，是最值得贡献的方向之一。
> 所有输出仅供律师复核，不构成法律意见。

## 典型场景

- 合同审查：风险条款识别、偏离标准条款的标记
- 合同比对：多版本 diff、关键条款变更提取
- 法规检索与合规检查清单生成
- 案例摘要与类案检索

## 平台模板入口

- [Dify Marketplace](https://marketplace.dify.ai/templates) 搜索：`legal`、`contract`
- [n8n 官方库](https://n8n.io/workflows) 搜索：`document`、`pdf`（文档处理类节点可组装）
- 自建参考架构：Langflow / Flowise + RAG 知识库（法条 + 范本合同）

## 推荐技术路线

```
合同 PDF → 文本抽取（LlamaParse/MinerU）→ 条款切分入库（向量库）
       → 风险识别 Agent（提示词 + 检查清单）→ 输出审查报告（人工复核）
```

## 待贡献

- [ ] 标准合同审查提示词集（中英文）
- [ ] 合同比对工作流（n8n / Dify 版）
- [ ] 劳动法 / 公司法合规检查清单 Agent
