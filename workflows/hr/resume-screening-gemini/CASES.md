# 实操案例与代码示例：AI 简历筛选与行为面试助手

## 案例 1：一份"3 年经验投 5 年岗"的简历怎么被筛出来

**输入**：候选人王小明，应聘"后端工程师（要求：3 年+ Go/Python，有高并发经验）"，
上传 PDF 简历。

**Applicant Qualifications 抽取结果（节选）**：

```json
{ "years_of_exp": 3.5, "languages": ["Python", "Go"],
  "high_concurrency": "是：电商秒杀系统，单机 8k QPS",
  "education": "本科 计算机科学与技术", "notable": "开源项目 contributer" }
```

**HR Expert 评分输出**：

```json
{ "match_score": 78,
  "硬性达标": true,
  "亮点": ["秒杀系统实战与量化数据", "开源社区贡献"],
  "疑虑": ["无团队管理经验", "跳槽频率2年/次"],
  "面试问题": [
    "8k QPS 下你们先做的扩容还是缓存？为什么？",
    "贡献最多的开源项目里你修过最难的 issue 是什么？",
    "两次跳槽各自的离开原因？"] }
```

**落库**：候选人台账一行完整记录；Notion 招聘库出现"王小明-后端-78分"卡片。
HR 一眼看到 78 分+疑虑，决定进面试。

## 代码示例

### 1. 评分提示词（压住"AI 放水"的关键写法）

```
你是从严的技术招聘官。对照【JD+硬性要求】评估【候选人JSON】：
- 硬性要求逐条核对，任一不满足则 硬性达标=false 并注明缺哪条
- 0-100 匹配分 = 经验年限40% + 技能匹配30% + 项目质量30%
- 打分锚点：完全对标85+；基本胜任70-84；勉强够60-69；不足<60
- 输出：match_score/硬性达标/亮点≤2/疑虑≤2/面试问题×3（中文，针对疑虑出题）
宁低勿高：证据不足的维度按低档计。禁止虚构简历里没有的经历。
```

### 2. 台账行组装（Append 前的 Code 节点）

```javascript
const r = $input.first().json; // HR Expert 输出
const p = $('Applicant Personal Data').first().json;
return [{ json: {
  日期: new Date().toISOString().slice(0, 10),
  姓名: p.name, 应聘岗位: p.position,
  匹配分: r.match_score, 硬性达标: r.硬性达标 ? '✅' : '❌',
  亮点: r.亮点.join('；'), 疑虑: r.疑虑.join('；'),
  面试问题: r.面试问题.map((q, i) => `${i + 1}.${q}`).join(' ') } }];
```

### 3. Gemini API 快速自测（curl，跑不通先验它）

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$GEMINI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"用一句话自我介绍"}]}]}'
```

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个简历筛选工作流：
1. 按匹配分自动分档：≥85 直接约面（发邮件模板A）、70-84 进人工池、
   <60 或硬性不达标发婉拒邮件（模板B），三个分支用 Switch
2. 岗位库改为 Google Sheets：岗位名/JD/硬性要求/加分项 四列，
   新增岗位只改表不改流程
3. 每周五统计：各岗位投递数、通过率，写入"招聘周报"Sheet
输出：完整 workflow.json + 变更对照 + 邮件模板两份 + 验收3步。
```

迭代方向参考：简历去重（同手机号）/ 面试官日历自动约时段 / 语音面试题接飞书。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
