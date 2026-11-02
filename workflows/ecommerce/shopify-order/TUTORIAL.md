# 实操教程：Shopify 订单自动履约

> 全程约 40 分钟。跑通后：每 30 分钟自动拉取未发货订单 → 逐单走履约流程 → 标记完成。
> 前置：n8n 已运行 + 一个 Shopify 店铺（有后台管理员权限）。

## 你需要准备

- [ ] Shopify 店铺的 Admin API Access Token（后台 → Settings → Apps and sales channels
      → Develop apps → Create an app → 勾选 `read_orders`、`write_fulfillments` 权限 →
      Install app → 复制 Admin API token，只显示一次）
- [ ] 无 Shopify 店铺？注册 Partner 账号可免费开**开发店铺**（dev store）用来练手

## 第一步：认识流程（忽略便签，核心 7 节点）

```
Schedule Trigger（每30分钟）
→ Get all Unfulfilled orders（Shopify 官方节点）
→ Filter Orders（过滤测试单/异常单）
→ Loop Over Items（逐单处理）
→ Get Fulfillment Orders（HTTP 查履约单号）
→ Set Global（汇总参数）
→ Mark fulfillment orders as fulfilled（HTTP 标记发货）
```

## 第二步：配置 Shopify 凭据

1. 点 **Get all Unfulfilled orders** 节点 → Credential → Create New：
   - API Token：粘贴第一步准备的 Token
   - Shop Subdomain：你的店铺域名前缀（xxx.myshopify.com 填 xxx）
2. 该节点 Resource 选 **Order**，Operation 选 **Get Many**，Return All 开启。

## 第三步：配置两个 HTTP 节点的认证

两个 httpRequest 节点（Get/Mark fulfillment）用的是 Shopify REST API：

1. 点开 **Get Fulfillment Orders**：
   - URL 形如 `https://{{你的店铺}}.myshopify.com/admin/api/2024-10/fulfillment_orders.json`
   - Authentication → **Generic Credential Type → Header Auth** →
     New credential：Name 填 `X-Shopify-Access-Token`，Value 填 Token
2. **Mark fulfillment orders as fulfilled** 节点同样配一份 Header Auth。

## 第四步：定制 Filter（强烈建议）

点开 **Filter Orders**，加条件把练手期的干扰单排除，例如：
`Financial Status equals paid` + `Total Price > 0`。
首次运行建议再临时加一条 `Email equals 你的测试邮箱`，只处理你自己的下单。

## 第五步：端到端试跑

1. 在 Shopify 开发店铺下一笔测试单（Test mode 支付，不扣钱）
2. n8n 点 **Test workflow** → 观察 Loop 逐单执行、最后 Mark fulfilled 变绿
3. 回 Shopify 后台看该订单 → Fulfillment 状态变为 **Fulfilled** ✅
4. 确认无误后开 Active，并把 Schedule Trigger 保持默认 30 分钟

## 接入你的真实仓储/物流（进阶）

当前模板的"发货动作"就是标记 Shopify 已发货。真实场景在这一步之前插入：
- 通知云仓：加一个 HTTP Request POST 云仓下单接口
- 通知物流商：加大客户 API/电子面单节点
- 人工兜底：加 IF 判断（SKU 缺货 → 发飞书/Slack 给运营人工处理）

## 常见报错

| 报错 | 解法 |
|---|---|
| 401/403 | Token 权限没勾 `write_fulfillments`，回 Develop apps 补权限重装 |
| 429 Too Many Requests | 店铺订单量大：Schedule 拉长到 60 分钟，或 Loop 节点开 batching 间隔 |
| fulfillment_orders 返回空 | 该订单不是"可履约"状态（如未支付/已取消），被 Filter 放进来了，收紧过滤条件 |
