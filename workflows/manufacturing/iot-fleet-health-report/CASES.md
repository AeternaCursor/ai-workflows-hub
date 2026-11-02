# 实操案例与代码示例：IoT 设备健康日报

## 案例 1：42 台设备找出 3 台"准故障"

**输入**（节选归一化后）：

```json
[ { "deviceId": "press-07", "avg_temp": 47.2, "offline_count": 4, "top_error": "E-112" },
  { "deviceId": "press-08", "avg_temp": 41.0, "offline_count": 0, "top_error": "-" } ]
```

**AI 日报输出（示例）**：

```
【今日异常】3 台
1. press-07：温度均值 47.2°C（阈值45）+ 离线 4 次 + E-112 高频 → 建议今日检修冷却回路
2. cnc-03：离线 3 次，无错误码 → 疑网络侧，查车间 AP
3. oven-11：连续 3 天温度爬升 41.8→43.6→45.1 → 趋势预警，列入下周保养
【健康概览】在线率 92.9%（39/42），均温 38.4°C
```

维护工按单干活，不再凭经验巡检。

## 代码示例

### 1. Azure IoT Hub SAS Token 签名（python，生成后填 Header Auth）

```python
import base64, hmac, hashlib, time, urllib.parse

def sas_token(uri, key, policy, days=7):
    expiry = int(time.time()) + days * 86400
    scope = urllib.parse.quote(uri, safe='')
    sig = base64.b64encode(hmac.new(base64.b64decode(key),
        f"{scope}\n{expiry}".encode(), hashlib.sha256).digest())
    return f"SharedAccessSignature sr={scope}&sig={urllib.parse.quote(sig)}&se={expiry}&skn={policy}"

print(sas_token("your-hub.azure-devices.net", "<BASE64_KEY>", "iothubowner"))
```

### 2. 遥测查询单测（curl，调不通先跑它）

```bash
curl "https://YOUR-HUB.azure-devices.net/devices/query?api-version=2023-06-30" \
  -X POST -H "Authorization: $SAS_TOKEN" -H "Content-Type: application/json" \
  -d '{"query":"SELECT * FROM devices"}' | jq '.[0:3]'
```

## 用 AI 迭代这个工作流（专属提示词）

```
改造此 IoT 日报工作流：1) 异常设备同时推送企业微信机器人；
2) 日报附 7 天温度趋势（从 InfluxDB 读历史）；3) E-112 类高频错误码自动关联知识库给出处置 SOP。
输出完整 workflow.json + 验收3步。
```
