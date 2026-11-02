# 实操案例与代码示例：社媒内容批量生成与发布

## 案例 1：一个主题 → 四平台一天的发布内容

**输入**（Default Settings 节点）：

```json
{ "topic": "跨境电商如何用 AI 客服省一半人力",
  "brand_voice": "专业但轻松，数据说话，中文为主，每条带3个话题标签",
  "platforms": "facebook,instagram,linkedin,tiktok",
  "image_style": "flat illustration, blue tone, minimal text" }
```

**Gemini 输出（节选 LinkedIn 与 TikTok 两条）**：

```json
{ "linkedin": "我们测了 30 家跨境店铺：AI 客服承接 61% 的重复咨询，
  人力集中在退换货纠纷——省下的不是钱，是团队做高价值事的时间。
  三个落地步骤见图👇\n#跨境电商 #AICustomerService #降本增效",
  "tiktok": "开场：'你还在为客服排班头疼？' 15秒讲清：
  AI 接住 6 成傻问题，人只处理 4 成难问题。结尾：'关注看拆解' \n#跨境 #AI客服" }
```

**成品**：Kie.ai 按图风格出 1 张插画 → Zernio 分发四平台（TikTok 走脚本文案）。
一条选题榨出四个平台内容，运营只需最后过目。

## 代码示例

### 1. 选题表驱动（把手动触发换成定时读表的核心 Code 节点）

```javascript
// Google Sheets 选题表：日期 | 主题 | 平台 | 状态(pending/done)
const rows = $input.first().json.values || [];
const today = new Date().toISOString().slice(0, 10);
const pick = rows.find(r => r[0] === today && r[3] === 'pending');
if (!pick) return [];                       // 今天没有待发选题，安静退出
return [{ json: { topic: pick[1], platforms: pick[2], done_row: pick } }];
```

### 2. Gemini 生成文案的请求体（对应 Generate Content 节点，多平台变体写法）

```json
{ "contents": [{ "parts": [{ "text": "为以下平台各写一条社媒内容，输出JSON：{facebook,instagram,linkedin,tiktok}。\n主题：跨境电商AI客服\n语气：专业轻松中文，每条3个#标签\nLinkedIn 300字干货体；TikTok 给15秒口播脚本；FB/IG 80字+emoji" }] }],
  "generationConfig": { "temperature": 0.8 } }
```

### 3. 发布间隔防风控（Zernio 多平台连发时插 Wait 节点的节奏）

```
FB 发布 → Wait 90s → IG 发布 → Wait 120s → LinkedIn → Wait 60s → TikTok
```

（连发同域内容触发平台限流是常见翻车点，间隔写在 workflow 里比记在脑子里可靠。）

## 案例 2（进阶）：爆款复刻流水线——竞品钩子结构 → 我们的品牌版

场景：同行一条笔记 10w+ 赞。不抄内容，**拆它的钩子结构**（前3秒留人逻辑），
再用我们的品牌语气重写，A/B 两版轮发。

**数据流**：

```
输入：竞品链接（表单/Sheets）
→ HTTP 抓正文（小红书/公众号正文页）
→ LLM 结构拆解（钩子类型/节奏/情绪杠杆/证据形态）
→ LLM 品牌化改写 ×2（A/B：钩子相同、正文结构不同）
→ 人工挑一版 → 进入原发布工作流
```

**结构拆解提示词（关键：先分析后生成，两步别合并）**：

```
第一步（拆解）：
分析这条爆文的钩子结构，输出 JSON：
{hook_type: "反常识|痛点直击|悬念|对比|身份认同",
 留人节奏: "前3行做了什么、中段怎么递进、结尾怎么促动",
 情绪杠杆: "焦虑/贪婪/认同/好奇",
 证据形态: "数据/案例/前后对比"}
正文：{{ $json.content }}

第二步（改写，另开节点）：
用以下结构 + 我们的品牌语气（{{brand_voice}}）写一条同主题内容：
钩子类型必须相同，节奏可微调；数据必须换成我们的真实数据（占位符标注）；输出 A/B 两版。
禁止出现竞品任何原句。
```

**产出示例（拆解输出）**：

```json
{ "hook_type": "反常识",
  "留人节奏": "首句'别再XX了'否定常识 → 3个步骤递进 → 结尾免费钩子",
  "情绪杠杆": "好奇+怕吃亏",
  "证据形态": "前后对比截图位" }
```

**A/B 判定**：两版各发一次（间隔 48h 同一时段），以 24h 互动率定胜，胜者结构进"爆款结构库"沉淀复用。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个社媒发布工作流：
1. 手动触发改为每天 10:00 读 Google Sheets 选题表（结构：日期/主题/平台/状态），
   发完把状态改 done
2. 加"爆款复刻"支路：输入一条竞品爆款链接，Gemini 分析钩子结构后
   用我们的品牌语气改写
3. 每次发布结果（成功/失败+平台）追加日志表
输出：完整 workflow.json + 变更对照 + 验收3步（如何用测试号试发不污染主号）。
```

迭代方向参考：小红书/公众号扩展 / 发布后 24h 数据回收对比 / A/B 两版文案轮发。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
