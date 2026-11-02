# 实操案例与代码示例：邮件摘要 Agent

## 案例 1：一天 23 封邮件 → 3 句话晨报

**输入**（昨天收件箱 23 封，节选）：

| 发件人 | 主题 |
|---|---|
| boss@company.com | 【今日必须】Q4 预算表今晚 8 点前回签 |
| hr@company.com | 年假余额年底清零提醒 |
| noreply@aws.com | Your bill is available ($312.40) |
| marketing@x.io | 限时 5 折！AI 大课 |

**Summarize 节点实际发给 OpenAI 的内容**（简化）：

```json
{"emails": [
  {"from": "boss@company.com", "subject": "【今日必须】Q4 预算表今晚8点前回签", "snippet": "请审批附件…"},
  {"from": "hr@company.com", "subject": "年假余额年底清零提醒", "snippet": "…"}
]}
```

**AI 输出（你早上收到的邮件正文，示例）**：

```
【必须回复】
1. 老板：Q4 预算表今晚 20:00 前回签（附件待审）

【只需知晓】
2. HR：年假年底清零，剩余 4 天
3. AWS 账单 $312.40 已出，较上月 +12%

【可忽略】
4. 营销邮件 ×19（课程促销/社区通知/周报订阅）
```

23 封 → 3 句话，30 秒读完。这就是 Active 开着后每天早上 7 点发生的事。

## 代码示例

### 1. 提示词（直接抄进 Summarize 节点）

```
你是我的邮件秘书。输入是过去24小时邮件的JSON数组（from/subject/snippet）。
输出中文摘要，分三档：
【必须回复】需要我今天行动的（谁+什么事+截止时间）
【只需知晓】一句话一条
【可忽略】同类合并计数（如"营销邮件×19"）
没有邮件时只回复"昨日无邮件"。不要编造输入里没有的信息。
```

### 2. 让 OpenAI 节点输出稳定 JSON（Model Output 改 JSON mode 后的解析 Code 节点）

```javascript
// Parse AI Review 后接一个 Code 节点，容错解析
const raw = $input.first().json.message?.content ?? $input.first().json.text ?? '';
try {
  const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)[0]);
  return [{ json: { ok: true, ...parsed } }];
} catch {
  return [{ json: { ok: false, raw } }]; // 解析失败原样透传，便于排查
}
```

### 3. 用 curl 直连 OpenAI 验证你的 Key（跑不通先查这个）

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer $YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"回复OK两个字母"}]}'
```

## 案例 2（进阶）：周报汇总版——一周邮件压成一张作战表

场景：管理者只看周报。在原流程上加"周聚合支线"：Schedule Trigger 改为每周五 17:00，
Gmail Fetch 时间窗改为 7 天，提示词升级为周报体。

**AI 输出（示例，周五 17:02 收到）**：

```
【本周必办未闭环】
1. Q4 预算表：周一收到，截至今天未回签 ⚠️（催办：老板）

【本周已决事项】2 条
【邮件量统计】共 141 封 | 老板 22 | 客户A 18 | 营销 71
【下周预告】下周一 AWS 续费到期（供应商账单）

【Top3 发件人需求画像】
- 老板：审批类为主，平均期望响应 <4h
- 客户A：交付节点确认，集中在周二/四
```

**关键改造（3 处）**：

1. Trigger：`Daily 7AM` → 复制一条 `Friday 5PM`，时间窗 `Past 7 Days`
2. Fetch 后加聚合 Code 节点：

```javascript
const emails = $input.all().map(i => i.json);
const bySender = {};
for (const e of emails) {
  const k = e.from?.value?.[0]?.address ?? e.from ?? 'unknown';
  bySender[k] = (bySender[k] ?? 0) + 1;
}
const top = Object.entries(bySender).sort((a, b) => b[1] - a[1]).slice(0, 3);
return [{ json: { total: emails.length, top_senders: top, emails } }];
```

3. 提示词追加：

```
末尾输出【Top3 发件人需求画像】：对 top_senders 中每人，归纳其邮件主题类型与响应预期。
标 ⚠️ 的条目 = 超过 48 小时未回复的事项，从邮件时间戳计算。
```

## 用 AI 迭代这个工作流（专属提示词）

把下面整段 + workflow.json（记得删 credentials 段）发给 AI：

```
你是 n8n 工程师。改造这个邮件摘要工作流：
1. 摘要改为推送飞书群机器人（webhook 地址用占位符 FEISHU_WEBHOOK），
   删除 Send Summary 的 Gmail 发送，保留本地执行记录
2. Gmail Fetch 增加过滤：跳过 noreply@ 和 newsletter 标签的邮件
3. 摘要提示词加"统计各发件人出现次数，top3 单列一节"
输出：完整可导入的 workflow.json + 节点变更对照表 + 验收3步。
```

迭代方向参考：换 DeepSeek 降成本 / 加午间第二次摘要 / 按 VIP 发件人单独全文转发。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
