# 实操案例与代码示例：Shopify 订单自动履约

## 案例 1：一笔测试单的完整数据流

**输入**：开发店铺下一单（测试支付 ¥199，2 个 SKU，收件人张三）。

**① Get all Unfulfilled orders 返回（节选）**：

```json
{ "id": 528461, "email": "test@shop.com", "financial_status": "paid",
  "total_price": "199.00", "line_items": [
    { "sku": "MUG-01", "title": "马克杯", "quantity": 1 },
    { "sku": "TEE-02", "title": "T恤", "quantity": 1 }] }
```

**② Filter Orders 通过**：`financial_status = paid` ✅（未支付的测试单在此被拦）

**③ Mark fulfillment orders as fulfilled 请求体**：

```json
{ "fulfillment": {
    "message": "Auto-fulfilled by n8n",
    "notify_customer": false,
    "tracking_info": { "number": "", "company": "" } } }
```

**结果**：Shopify 后台订单 528461 → Fulfilled ✅，用时 4 秒（人工操作约 2 分钟）。

## 代码示例

### 1. 缺货预警分支（插在 Mark 之前，Code 节点）

```javascript
// 输入：当前订单 line_items；输出：是否全部有库存
const items = $input.first().json.line_items || [];
const STOCK = { 'MUG-01': 12, 'TEE-02': 0 }; // 练手版写死；正式版接库存API/Sheets
const shortage = items.filter(i => (STOCK[i.sku] ?? 0) < i.quantity);
return [{ json: { can_fulfill: shortage.length === 0, shortage } }];
```

接一个 IF：`can_fulfill=false` → 走"通知运营补货"支线，不再自动标记发货。

### 2. 批量拉取订单的 curl（调试 Filter 用）

```bash
curl -s "https://YOUR-SHOP.myshopify.com/admin/api/2024-10/orders.json?status=unfulfilled&financial_status=paid" \
  -H "X-Shopify-Access-Token: $SHOPIFY_TOKEN" | jq '.orders[] | {id, total_price, email}'
```

### 3. 履约标记改用 GraphQL（免 REST 版本号烦恼，2024+ 推荐）

```graphql
mutation markDone($id: ID!) {
  fulfillmentCreateV2(fulfillment: { lineItemsByFulfillmentOrder: [
    { fulfillmentOrderId: $id } ] }) {
    fulfillment { status }
    userErrors { message }
  }
}
```

## 案例 2（进阶）：高价值订单转人工审批——自动化不等于全自动

场景：客单价 > ¥5000 的订单不敢让机器直接发货。加一道"人工卡点"。

**数据流**：

```
Get all Unfulfilled orders → IF 金额>5000?
   ├─ 否 → 原自动履约支线（不变）
   └─ 是 → Slack 审批卡片（附订单详情+客户备注）
          → 员工点"批准"按钮 → n8n Webhook 收到 → 走履约支线
          → 24h 未处理 → 升级提醒 @店长
```

**Slack 审批卡片 payload（HTTP 节点请求体，交互按钮版）**：

```json
{ "text": "高价值订单待审批",
  "blocks": [
    { "type": "section", "text": { "type": "mrkdwn",
      "text": "*订单 #{{order_id}}* ¥{{amount}}\n客户：{{name}}（{{email}}）\nSKU：{{skus}}" } },
    { "type": "actions", "elements": [
      { "type": "button", "action_id": "approve_ship",
        "style": "primary", "text": { "type": "plain_text", "text": "批准发货" } },
      { "type": "button", "action_id": "hold_review",
        "style": "danger", "text": { "type": "plain_text", "text": "转人工核查" } } ] } ] }
```

**超时升级（Wait 节点 + IF）**：

```
发卡后 → Wait 24h → IF 该订单仍 unfulfilled（再查一次 Shopify）
        → 是 → Slack @店长 "审批超时：#{{order_id}}"
```

**价值**：机器处理 95% 常规单，人只看 5% 高风险单——这是订单类自动化上生产前的标准护栏。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个 Shopify 履约工作流：
1. 在标记发货前加库存检查（库存表用 Google Sheets，表头 SKU/数量，
   匹配当前订单 line_items；缺货则跳过该单并 Slack 通知运营）
2. Mark fulfillment 改带物流单号：从 HTTP 节点获取（地址占位 LOGISTICS_API）
3. 每天执行完在 Sheets 追加一行统计：日期/处理单数/缺货单数
输出：完整 workflow.json + 变更说明 + 验收3步（含如何造缺货测试单）。
```

迭代方向参考：接云仓 API / 异常单（地址不全）转人工 / 多店铺循环。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
