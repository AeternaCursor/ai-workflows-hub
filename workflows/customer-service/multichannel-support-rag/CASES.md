# 实操案例与代码示例：缓存优先 RAG 客服应答

## 案例 1：同一个问题问两遍，第二遍零成本秒回

**第一遍**（缓存未命中，走完整 RAG）：

```
用户：你们支持7天无理由退货吗？
decompose_query → 拆出标准问句"退货政策-无理由退货期限"
Search LangCache → 未命中
search_node1（Redis 向量检索）→ 命中 FAQ#12"自签收起7天内可无理由退货，需保持吊牌完整…"
synthesize_response → "您好，我们支持自签收之日起 7 天无理由退货，商品需保持吊牌完好…"
evaluate_quality → 0.92 分 ✅ → Save to LangCache
耗时 4.2s，消耗 OpenAI tokens ≈ 1,800
```

**第二遍**（用户换个说法问）：

```
用户：买错了还能退不
Search LangCache → 语义命中（相似度 0.94）→ 直接返回缓存答案
耗时 0.6s，tokens = 0
```

**月度账**：假设 60% 命中率 → API 成本直降六成，P95 响应从 4s 降到 1s 内。这就是"缓存优先"架构的全部意义。

## 代码示例

### 1. 灌 FAQ 知识库（替换 example Data 的 JSON，经 Default Data Loader 入库）

```json
[
  { "question": "退货政策-无理由退货期限", "answer": "自签收起7天内可无理由退货，需保持吊牌完整、未洗涤。内衣食品不支持。" },
  { "question": "物流-发货时效", "answer": "工作日16:00前下单当天发货，偏远地区+2天，可在订单页实时查单。" },
  { "question": "发票-如何开具", "answer": "订单页-申请开票，支持电子普票与增值税专票，24h内开具发送邮箱。" }
]
```

（生产环境接 Google Sheets/Notion，运营改表即更新知识库）

### 2. 答案质量评分提示词（evaluate_quality 节点）

```
给客服答案打分（0-1，两位小数）：
- 0.9+：直接解决问题且语气得体
- 0.7-0.89：能解决但啰嗦/缺一个关键细节
- <0.7：答非所问、含糊或与知识库矛盾
只输出数字。
用户问题：{{question}}
知识库片段：{{context}}
候选答案：{{answer}}
```

低于 0.8 → 走 increase iteration 重写（上限 2 次），这是"低分重试"支线的开关。

### 3. Redis Stack 快速自检（灌库后验证向量索引建好了）

```bash
docker exec -it redis redis-cli FT.INFO idx
# 关注 NUMDOCS 是否等于你的 FAQ 条数；为 0 = 灌库支线没跑
```

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个缓存优先 RAG 客服工作流：
1. 入口从聊天窗改为飞书机器人（Long Connection 或 Webhook），保持返回格式
2. 知识库源改为 Google Sheets（表头：问题/标准答案/更新时间），
   Schedule 支线每天增量同步（按更新时间过滤）
3. 未命中且低分重试仍失败时，转人工：写"待人工"表 + 通知客服群
输出：完整 workflow.json + 变更对照 + 验收3步（含如何验证缓存命中）。
```

迭代方向参考：多语言缓存键 / 高频未命中问题自动生成新 FAQ 草稿 / 满意度打点。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
