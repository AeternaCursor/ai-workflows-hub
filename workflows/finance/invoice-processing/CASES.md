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
