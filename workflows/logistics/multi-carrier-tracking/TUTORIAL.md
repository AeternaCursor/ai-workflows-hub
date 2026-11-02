# 实操教程：三快递轨迹聚合

> 50 分钟（三家 API 注册占大头）。前置：n8n 已运行。

## 准备

- [ ] FedEx Developer Portal（developer.fedex.com）→ Production/Testing Key
- [ ] UPS Developer Kit → OAuth Client ID/Secret
- [ ] DHL Developer Portal（developer.dhl.com）→ API Key（Track 服务）

## 流程

```
输入运单（表单/Sheets）
→ Code 承运商识别（单号规则：FedEx 12/15位、UPS 1Z开头、DHL 10位纯数字）
→ 三路 HTTP 并行查询（各家 OAuth/Basic 认证不同）
→ Code 归一化（三家字段名不同 → 统一 {carrier, status, last_event, ts, exception}）
→ 异常过滤 → 表格输出 / 邮件
```

## 步骤

1. **三个 HTTP 节点各配认证**：
   - FedEx：OAuth2（API 流程配 client credentials）或 Test Key 直接 Header
   - UPS：先 POST /oauth/token 拿 token（HTTP 节点）→ 查询节点 Bearer 引用
   - DHL：Header `DHL-API-Key`
2. **承运商识别 Code**：

```javascript
const n = $json.tracking_no.trim();
const carrier = /^1Z/i.test(n) ? 'UPS' : /^\d{12,15}$/.test(n) ? 'FedEx'
             : /^\d{10}$/.test(n) ? 'DHL' : 'unknown';
return [{ json: { tracking_no: n, carrier } }];
```

3. **归一化映射表**（三家 status 字段对照，写在第二个 Code 节点）：

```javascript
const M = {
  FedEx: { 'Delivered': '已签收', 'In transit': '运输中', 'Delivery exception': '异常' },
  UPS:   { 'Delivered': '已签收', 'In Transit': '运输中', 'Exception': '异常' },
  DHL:   { 'delivered': '已签收', 'transit': '运输中', 'failure': '异常' } };
// raw.status → 中文统一状态；异常件 exception=true
```

4. 测试：表单贴 3 个真实单号（三家各一）→ Test → 输出表逐列核对 → Active

## 排错

| 报错 | 解法 |
|---|---|
| UPS 401 | token 过期：token 节点加缓存（有效期 24h，存 workflow static data） |
| FedEx 沙盒查不到 | 沙盒只有固定测试单号；用生产 Key + 少量真实单 |
| DHL 403 | 未订阅 Track 服务，portal 里补勾 |
| 单号识别错 | 手动传 carrier 字段覆盖自动识别 |
