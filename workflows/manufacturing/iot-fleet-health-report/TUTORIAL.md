# 实操教程：IoT 设备健康日报

> 40 分钟。每日自动收到"哪些设备快坏了"的邮件。前置：n8n 已运行。

## 准备

- [ ] Azure IoT Hub 的共享访问策略连接串（Portal → IoT Hub → Shared access policies，iothubowner）
- [ ] OpenAI / DeepSeek Key
- [ ] Gmail（收日报）

## 流程（4 段）

```
Schedule（每日 8:00）
→ HTTP 拉 Azure IoT Hub 遥测（SAS Token 认证，接口 /devices/query）
→ Code 归一化（按设备聚合：均值/离线次数/错误码分布）
→ OpenAI 分析 → Gmail 发送日报
```

## 步骤

1. **Azure HTTP 节点**：Authentication 选 Generic → Header Auth；
   Name `Authorization`，Value 为生成的 SAS Token（Azure Portal 用工具生成，或用
   Node/Python 按 HMAC-SHA256 签名，见 CASES 代码示例）
2. **归一化 Code 节点**：把每设备 24h 遥测压成 {deviceId, avg_temp, offline_count, top_error}
3. **AI 分析提示词**（决定日报质量）：

```
你是设备可靠性工程师。输入设备指标数组。输出中文日报：
【今日异常】离线≥3次 或 温度均值超阈值(45°C) 的设备，逐台：设备号+异常+建议动作
【趋势预警】连续3天温度爬升的设备点名
【健康概览】在线率、平均温度一行
只依据输入数据，禁止推测具体产线信息。
```

4. Gmail 节点收件人填自己 → Test workflow → 收到样例日报后开 Active

## 排错

| 报错 | 解法 |
|---|---|
| Azure 401 | SAS Token 过期：共享策略重新生成；Token 有效期别设太短 |
| 遥测为空 | IoT Hub 无数据或 query 语法错：先用 CASES 里的 curl 单测 |
| AI 把正常当异常 | 阈值写进提示词并给出判断公式，模型只做格式化与解释 |
