# 实操案例与代码示例：合同风险分析与合规审查

## 案例 1：一份 NDA 挖出两个高危条款

**输入**：邮件收到《保密协议》PDF（甲方模板，乙方是我们）。

**切块入库**：Text Splitter 切出 23 个条款块，向量化。

**Compliance Checker 对规则库逐条输出（节选）**：

```json
{ "findings": [
  { "rule_id": "R3", "rule": "违约金不得超过合同总额20%",
    "clause": "第9.2条", "结论": "违反",
    "严重度": "high",
    "说明": "约定违约金为'直接损失的全部金额'，无上限封顶" },
  { "rule_id": "R1", "rule": "必须含保密期限条款",
    "clause": "未提及", "结论": "未提及", "严重度": "medium",
    "说明": "全文未约定保密义务终止时点" },
  { "rule_id": "R2", "rule": "管辖地须为北京",
    "clause": "第12条", "结论": "符合", "严重度": "-", "说明": "约定北京仲裁" } ] }
```

**Calculate Risk Score**：2×high + 1×medium → **62 分（高风险）** →
Switch 走高风险支线 → Slack 法务群告警 + CLM 系统建跟进任务 + PG 留痕。

律师打开 Slack 已看到"哪两条、为什么、在哪一条"——复核从 40 分钟降到 5 分钟。

## 代码示例

### 1. 风险分计算（Calculate Risk Score 节点，权重可调）

```javascript
const findings = $input.first().json.findings || [];
const W = { high: 30, medium: 10, low: 3 };
let score = 0;
for (const f of findings) score += W[f.严重度] || 0;
score = Math.min(100, score);
const level = score >= 50 ? 'high' : score >= 20 ? 'medium' : 'low';
return [{ json: { findings, risk_score: score, risk_level: level } }];
```

### 2. 建表 SQL（首次运行前执行一次，见 TUTORIAL）

```sql
CREATE TABLE IF NOT EXISTS compliance_results (
  id serial PRIMARY KEY, contract_name text, checked_at timestamp default now(),
  risk_score int, risk_level text, findings jsonb);
CREATE TABLE IF NOT EXISTS audit_trail (
  id serial PRIMARY KEY, action text, detail jsonb, created_at timestamp default now());
```

### 3. 查询周报（每周风险分布，psql 或 n8n Postgres 节点）

```sql
SELECT date_trunc('week', checked_at) AS 周,
       count(*) AS 合同数,
       avg(risk_score)::int AS 平均风险分,
       count(*) FILTER (WHERE risk_level='high') AS 高风险数
FROM compliance_results GROUP BY 1 ORDER BY 1 DESC LIMIT 8;
```

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个合同审查工作流：
1. 合规规则库改为 Google Sheets（规则编号/规则/严重度/适用合同类型），
   审查时动态读取；NDA/采购/销售三类合同各挂一套规则
2. 报告输出：每次审查生成一份 Markdown 报告（含风险分/逐条findings/
   建议改法），存 Google Drive 并邮件法务
3. 高风险合同在 Slack 告警里 @ 当值律师（按周排班表）
输出：完整 workflow.json + 变更对照 + 规则表模板 + 验收3步。
```

迭代方向参考：合同比对（两版 diff）/ 到期提醒 / 与电子签流程衔接。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
