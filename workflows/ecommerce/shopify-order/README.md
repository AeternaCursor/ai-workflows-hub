# Shopify 订单自动履约

> 来源：[n8n 官方模板 #3296](https://n8n.io/workflows/3296) · 3.1k 浏览 · 13 节点

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

监听 Shopify 新订单，自动完成核对、通知仓储与物流、更新订单状态的履约闭环。

- **平台**：n8n 1.x
- **所需凭据**：Shopify Admin API（Access Token）
- **触发方式**：Shopify Webhook（订单创建事件）
- **输入**：Shopify 订单（商品、收货地址、金额）
- **输出**：履约通知 + 状态回写

## 使用步骤

1. 导入 `workflow.json`
2. 配置 Shopify 凭据（Admin API token + Webhook 权限）
3. 按仓库/物流商修改通知节点（Email / Slack / 仓储系统 API）
4. 用测试订单跑通全链路后再上线

## 注意事项

- Webhook 需在 Shopify 后台或经 n8n 自动注册
- 金额与地址校验建议保留人工抽检
