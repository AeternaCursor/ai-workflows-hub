# 实操案例与代码示例：三快递轨迹聚合

## 案例 1：一屏看穿 20 个海外包裹

**输入**（Sheets 一列 20 个单号，节选）：

```
1Z999AA10123456784   ← UPS
7712238155           ← DHL
794658921355         ← FedEx
```

**聚合输出（节选）**：

| 单号 | 承运商 | 状态 | 最后节点 | 异常 |
|---|---|---|---|---|
| 1Z999AA…6784 | UPS | 运输中 | 深圳转运 已出境 | |
| 7712238155 | DHL | **异常** | 清关文件缺失，联系承运商 | ⚠️ |
| 794658921355 | FedEx | 已签收 | 前台代收 | |

运营动作：只剩 DHL 那单要人处理——20 单盯成 1 单。

## 代码示例

### 1. UPS token 获取（HTTP 节点，配 Basic Auth = ClientID:Secret）

```bash
curl -X POST https://onlinetools.ups.com/security/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "$UPS_CLIENT_ID:$UPS_SECRET" -d "grant_type=client_credentials"
# 响应 access_token 填入查询节点 Bearer，24h 有效
```

### 2. 异常告警规则（归一化后 Code 节点）

```javascript
const rows = $input.all().map(i => i.json);
const BAD = ['清关', '派送失败', '地址异常', '拒收'];
const alert = rows.filter(r => BAD.some(b => (r.last_event || '').includes(b))
  || r.exception);
return [{ json: { total: rows.length, alert_count: alert.length, alert } }];
// alert_count>0 → 邮件/IM 告警；=0 静默
```

## 用 AI 迭代这个工作流（专属提示词）

```
改造此物流聚合工作流：1) 加国内段（顺丰/极兔 API 或快递100聚合）；
2) 定时每2小时只刷新未签收件，全部签收自动停止刷新该单；
3) 超时未动（>48h 无新节点）单独标 stagnant 告警。
输出完整 workflow.json + 验收3步。
```
