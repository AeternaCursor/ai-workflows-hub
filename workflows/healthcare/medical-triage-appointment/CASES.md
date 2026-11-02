# 实操案例与代码示例：AI 预检分诊与预约

## 案例 1：三条自述，三种分流

| 患者自述 | AI 分级 | 系统动作 |
|---|---|---|
| "胸口压榨样疼 20 分钟，出冷汗" | **high + red_flag** | 立即邮件值班医生（红字"急症指征"）+ 患者收"请立即就医"短信模板 |
| "偏头痛三天，晚上睡不好" | normal | 日历排入明天 10:00 → 确认邮件 |
| "嗓子有点痒，不到一天" | low | 进候补 Sheets → "48h 内如加重可优先安排" |

**Switch 分支后的输出 JSON（high 例）**：

```json
{ "level": "high", "red_flag": true,
  "reason": "症状符合急症指征，建议立即就医" }
```

## 代码示例

### 1. 时间槽冲突检查（Calendar 前置 Code 节点）

```javascript
// 输入：期望时间 + 日历当日已占用时段
const want = new Date($input.first().json['期望时间']);
const busy = $input.first().json['busy_slots'] || []; // Calendar Get Events 输出
const clash = busy.some(b => {
  const s = new Date(b.start), e = new Date(b.end);
  return want >= s && want < e;
});
if (clash) want.setMinutes(want.getMinutes() + 30); // 顺延半小时
return [{ json: { slot: want.toISOString() } }];
```

### 2. 三条测试话术（验收用，直接贴进 Jotform）

```
高危：胸口压榨样疼20分钟，出冷汗
常规：偏头痛三天，晚上睡不好
低危：嗓子有点痒，不到一天
```

## 用 AI 迭代这个工作流（专属提示词）

```
改造此分诊工作流：1) 候补队列每天早上自动尝试填补当日空槽（低危患者依次发"今日可约"邮件，先回复先得）；
2) 高危分支增加短信通道；3) 每周统计三类占比入 Sheets。
输出完整 workflow.json + 验收3步。
```
