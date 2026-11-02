# 三快递（FedEx/UPS/DHL）轨迹聚合

> 来源：[n8n 官方模板 #16338](https://n8n.io/workflows/16338) · 28 节点
> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

输入一批运单号，自动识别承运商，并行查询 FedEx / UPS / DHL 轨迹，
聚合去重后输出统一状态表，异常件（清关/派送失败）高亮。

- **平台**：n8n 1.x
- **所需凭据**：FedEx API Key、UPS API（Client ID/Secret）、DHL API Key（三家开发者平台均免费注册）
- **触发方式**：手动 / Web 表单 / 定时扫 Sheets 运单列
- **输入**：运单号列表（可不填承运商）
- **输出**：统一格式状态表（承运商/最新节点/是否异常/最后更新时间）

## 适用

跨境/物流/电商团队批量盯单；个人海淘党盯包裹同理。
