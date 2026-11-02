# 实操案例与代码示例：发票识别校验与入账

## 案例 1：两张发票，一张通过一张拦截

**输入**：`C:\invoices\` 放两张 PDF——A（供应商"华信科技"，税号主数据里有），
B（"XX贸易"，税号不在主数据）。

**Text Extractor 对 A 的输出（节选）**：

```json
{ "supplier": "华信科技有限公司", "tax_id": "91330100MA2XYZ3456",
  "amount": 8600.00, "invoice_date": "2026-10-28", "items": 3 }
```

**Validation 节点比对结果**：

| 发票 | 主数据匹配 | 金额 | 结论 | 台账记录 |
|---|---|---|---|---|
| A 华信 | 税号命中 ✅ | 8600 ≤ 阈值 10000 | **通过** | 唯一键 `MA2XYZ3456-8600-20261028` |
| B XX贸易 | 税号未命中 ❌ | 3200 | **异常：供应商主数据缺失** | 异常说明列标红 |

财务只处理 B 一张——AI 已经替你筛掉了 90% 的机械核对。

## 代码示例

### 1. Validation 节点完整逻辑（可直接替换模板同名 Code 节点）

```javascript
const inv = $input.first().json;                 // 发票字段
const master = $('Fetch Master Data').all().map(i => i.json); // 主数据行
const hit = master.find(m => m['税号'] === inv.tax_id);

const issues = [];
if (!hit) issues.push('供应商主数据缺失');
if (hit && hit['供应商'] !== inv.supplier) issues.push('名称与税号不一致');
if (inv.amount > 10000) issues.push('金额超1万需人工审批');

return [{ json: { ...inv, 校验结果: issues.length ? '异常' : '通过',
  异常说明: issues.join('；'), 供应商匹配: hit ? '是' : '否' } }];
```

### 2. 防重复入账：唯一键生成（模板 Generate Unique Key 的思路）

```javascript
const j = $input.first().json;
return [{ json: { ...j,
  唯一键: `${j.tax_id}-${j.amount}-${j.invoice_date}` } }]; // 同票二次进来自动识别
```

（在 Send Invoice Data 前加 IF：台账中已存在该唯一键 → 跳过并通知）

### 3. OpenRouter 视觉模型提取字段的提示词（Text Extractor 节点内）

```
从发票文本中提取 JSON：{supplier, tax_id, amount(数字，含税总额),
invoice_date(YYYY-MM-DD), invoice_no}。金额去掉千分位和¥。
字段缺失填 null，禁止猜测。文本：{{ $json.text }}
```

## 案例 2（进阶）：月度对账——台账自动汇总 + 异常清单邮件

场景：月底财务要的是"供应商对账单 + 未处理异常清单"。台账表已经攒了一个月数据，
加一条月度支线聚合输出。

**数据流**：

```
Schedule（每月1号 9:00）→ 读台账 Sheet（上月范围）
→ Code 聚合：按供应商汇总金额/张数/异常数
→ LLM 生成对账摘要（波动说明：环比增减超过30%的要点名）
→ 生成新 Sheet"XX月对账单" + 异常明细单独邮件财务
```

**聚合 Code 节点（对账核心）**：

```javascript
const rows = $input.all().map(i => i.json).filter(r => r['日期']?.startsWith('2026-10'));
const by = {};
for (const r of rows) {
  const k = r['供应商'] ?? '未知';
  by[k] ??= { 金额: 0, 张数: 0, 异常: 0 };
  by[k]['金额'] += Number(r['金额(含税)'] || 0);
  by[k]['张数']++;
  if (r['校验结果'] === '异常') by[k]['异常']++;
}
return Object.entries(by).map(([k, v]) => ({ json: { 供应商: k, ...v } }));
```

**对账摘要提示词**：

```
你是财务助理。输入按供应商聚合的月度数据，输出：
1. 总额/总张数/异常率 一行
2. 环比说明：金额占比>15% 或 异常>0 的供应商逐一点名（数值+一句判断）
3. 【建议核查】列出异常≥2 张的供应商
语气客观，只陈述数据可支撑的结论。
```

**产出示例**：`10月对账：38 张 / ¥182,400 / 异常 5 张(13%)；华信科技 ¥96,200 占53%环比+61%，需核查大额集中原因…`——财务从半天核对变 10 分钟审阅。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个发票工作流：
1. 触发改为 Gmail：附件为 PDF 的邮件自动进流程，正文抄送说明列
2. 加重复报销检测：写台账前查"唯一键"是否已存在，存在则不写入
   并给财务群发提醒
3. 月末自动汇总：每月1号统计上月异常清单发邮件
输出：完整 workflow.json + 变更对照 + 验收3步（如何造重复发票测试）。
```

迭代方向参考：对接 OA 审批流 / 识别火车票住宿费 / 多币种。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
