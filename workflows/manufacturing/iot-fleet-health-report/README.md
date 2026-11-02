# IoT 设备健康日报（Azure IoT Hub + AI）

> 来源：[n8n 官方模板 #18399](https://n8n.io/workflows/18399) · 22 节点
> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

每日拉取 Azure IoT Hub 设备遥测，OpenAI 分析异常模式，生成设备健康日报邮件。

- **平台**：n8n 1.x
- **所需凭据**：Azure IoT Hub（HTTP + SAS Token）、OpenAI API Key、Gmail
- **触发方式**：每日定时
- **输入**：设备遥测数据（温度/在线率/错误码）
- **输出**：AI 健康日报邮件（异常设备清单 + 趋势判断）

## 注意事项

设备数据含产线信息，报告邮件注意收件范围。
