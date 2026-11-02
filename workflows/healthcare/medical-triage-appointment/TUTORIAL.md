# 实操教程：AI 预检分诊与预约自动化

> 45 分钟。前置：n8n 已运行 + Google 账号 + Jotform 免费账号。

## 准备

- [ ] Jotform 建一张问诊表（字段：姓名/症状描述/持续时间/期望时间/联系电话）
- [ ] OpenAI / DeepSeek Key
- [ ] Gmail + Google Calendar

## 流程

```
Jotform Trigger（新提交）
→ GPT-4 紧急度分级（prompt 严格限定"只排序不诊断"）
→ Switch 三分支：
   高危 → 立即邮件值班医生 + 电话提醒字段
   常规 → Google Calendar 建预约（30min slot）→ 确认邮件患者
   低危 → 排候补队列（Sheets）+ 邮件告知等待
```

## 步骤

1. **Jotform**：Trigger 节点 → Create credential（API Key 在 Jotform Settings → API）→ 选表单
2. **分诊提示词（核心，安全边界写在最前）**：

```
你是诊所预检助手，只做紧急度排序，不做任何诊断。
输入患者自述。输出 JSON：{level: "high|normal|low", reason: "≤20字", red_flag: true/false}
判定规则：
- 出现胸痛/呼吸困难/大出血/意识模糊/儿童高热抽搐 → high + red_flag
- 持续>72h 或影响睡眠 → normal
- 轻微且<24h → low
red_flag=true 时 reason 固定为"症状符合急症指征，建议立即就医"。
禁止输出用药、病名猜测。
```

3. **Calendar 节点**：Calendar 选诊所预约日历，事件标题 `患者姓名（normal）`，
   时间取表单"期望时间"四舍五入到半点
4. 测试三种输入（CASES 有现成话术）各跑一遍 → 开 Active

## 排错

| 报错 | 解法 |
|---|---|
| Jotform 不触发 | 表单要"启用"状态；Trigger 选对 formId |
| Calendar 时间冲突 | 加 Code 检查 slot 占用，冲突顺延 30min |
| 模型输出病名 | 提示词加"禁止输出病名"并温度调 0；仍犯换 gpt-4o |
