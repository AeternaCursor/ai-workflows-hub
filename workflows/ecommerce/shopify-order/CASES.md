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
