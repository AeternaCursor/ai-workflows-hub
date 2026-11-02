# 实操教程：合同风险分析与合规审查

> 全程约 60 分钟。跑通后：合同从邮件/Webhook 进入 → 条款切块入向量库 →
> AI 按合规规则库逐条比对 → 风险分级：高风险 Slack 告警、全部结果入库留痕。
> ⚠️ 输出仅供律师复核，不构成法律意见；合同是敏感文件，建议自托管跑。
> 前置：n8n 已运行 + Docker。

## 你需要准备

- [ ] OpenAI API Key（Chat + Embeddings）
- [ ] PostgreSQL（存审查结果与审计留痕）：`docker run -d --name pg -p 5432:5432 -e POSTGRES_PASSWORD=demo123 postgres:16`
- [ ] Slack Bot Token（高风险告警用；不要可删 Alert 节点）
- [ ] 你的**合规规则库**：一张 Google Sheet 或 TXT，每行一条规则
      （例：`违约金上限不得超过合同总额20%`、`必须含保密条款`、`管辖地须为北京`——先写 5 条练手）

## 第一步：认识流程（一图看懂）

```
入口三选一（模板都给了）：Gmail - Contract Emails / Webhook - Contract Upload
                        / Schedule（定时扫合同库）
→ Merge All Contract Sources → Extract Contract Content（PDF→文本）
→ Text Splitter - Clause Chunking（按条款切块）
→ 向量化：Document Loader + OpenAI Embeddings → Vector Store（InMemory，跑批内有效）
分析：OpenAI Chat Model + Compliance Checker（Agent）
     + Structured Parser（输出结构化合规结论）
→ Calculate Risk Score（Code 算风险分）
分发：Route by Risk Level（Switch：高/中/低）
     高 → Alert - High Risk Contracts（Slack）+ Update CLM System
     中 → Send to Dashboard API
     低 → Update ERP System
留痕：Prepare Audit Trail → Store Compliance Results / Store Audit Trail（两个 Postgres）
```

## 第二步：配凭据（4 个）

| 节点 | 凭据 |
|---|---|
| OpenAI Embeddings / OpenAI Chat Model | OpenAI Key（同一个） |
| Gmail Trigger（选这个入口最省事） | Google OAuth |
| Store Compliance Results / Store Audit Trail | Postgres：Host 127.0.0.1:5432，库 postgres，用户 postgres，密码 demo123 |
| Alert - High Risk Contracts | Slack Bot Token |

## 第三步：灌合规规则（关键）

点开 **AI Agent - Compliance Checker**，把规则写进 Prompt（或由前置节点从 Sheet 读入）：

```
你是合同合规审查员。逐条对照以下规则审查合同条款：
{{规则库}}
对每条规则输出：{rule_id, 条款引用, 结论: 符合/违反/未提及, 严重度: high/medium/low, 说明}
高风险情形：违约金超限、缺少保密条款、单方解除权、无限连带责任。
不确定时标"未提及"而不是猜测。
```

## 第四步：建两张 PG 表

在 Postgres 里执行（n8n 可用 Code 节点或 psql）：

```sql
CREATE TABLE compliance_results (id serial, contract_name text, checked_at timestamp,
  risk_score int, findings jsonb);
CREATE TABLE audit_trail (id serial, action text, detail jsonb, created_at timestamp default now());
```

两个 Postgres 节点的 SQL 分别 INSERT 这两张表。

## 第五步：试跑

1. **Test workflow**（Gmail 入口则给自己的邮箱发一封带 PDF 合同的邮件触发）
2. 全绿后查库：`docker exec -it pg psql -U postgres -c "SELECT contract_name, risk_score, jsonb_pretty(findings) FROM compliance_results;"`
3. 高风险规则命中的合同 → Slack 频道应收到告警 ✅
4. 正式化：入口收敛为 Gmail Trigger（常驻），Schedule 那条支线删除避免重复跑

## 常见报错

| 报错 | 解法 |
|---|---|
| PG 连接失败 | 容器没起/端口占用；`docker ps` 检查 |
| Embeddings 429 | 大合同切块多，Text Splitter 的 chunk 调大到 1500 字符 |
| findings 全"未提及" | 合同文本没进上下文：检查 Extract → Splitter → Loader 连线 |
| Switch 全走低风险 | Calculate Risk Score 的阈值写死了，按你的 findings 权重调 |
