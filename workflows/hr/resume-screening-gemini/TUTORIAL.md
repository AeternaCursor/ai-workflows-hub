# 实操教程：AI 简历筛选与行为面试助手

> 全程约 60 分钟（凭据较多）。跑通后：表单上传简历 → Gemini 评分 →
> 结构化数据入 Google Sheets → Notion 候选人库自动建档 → 生成语音面试问题。
> 觉得重？可以只跑到"评分入表"那一段就投入实用，后面两段按需开。
> 前置：n8n 已运行 + Google 账号。

## 你需要准备

- [ ] Google AI Studio 的 **Gemini API Key**（aistudio.google.com → Get API key，免费额度够练手）
- [ ] Notion 账号 + 一个"招聘"页面（Notion → 连接里给 n8n 授权，能选到该页）
- [ ] （可选）ElevenLabs API Key（elevenlabs.io，语音面试题用；不用可跳过末段）
- [ ] 两张 Google Sheet：
  - **岗位库**：`岗位名 | JD全文 | 硬性要求 | 加分项`（先填 1 个岗位练手）
  - **候选人台账**：`日期 | 姓名 | 应聘岗位 | 匹配分(0-100) | 硬性达标 | 亮点 | 疑虑 | 面试问题`

## 第一步：认识流程（4 段式，模板便签已分区）

```
① 投递：On form submission（网页表单：姓名+岗位选择+简历PDF）
② 提取：Extract from File（简历文本）→ Applicant Personal Data /
        Applicant Qualifications（两个信息抽取节点拿结构化字段）
③ 评估：Job Description Summary（JD 摘要）→ Applicant Summary（简历摘要）
        → HR Expert（Chain LLM 节点：对照 JD 打分）→ Merge → Application Data
④ 落库：Append 台账（Sheets）+ Upload CV / Link Audio in Notion（建档）
⑤ 语音段：AI Agent + ElevenLabs 生成面试题音频（独立支线，可后开）
```

## 第二步：配凭据（3 个）

| 用在哪 | 凭据 |
|---|---|
| 所有 chainLlm / informationExtractor / Agent 上方的 Google Gemini Chat Model 节点 | Gemini API Key |
| Append 台账 | Google Sheets OAuth |
| Notion 相关节点 | Notion OAuth（授权时勾选"招聘"页） |

## 第三步：挂表 + 定岗位

1. 岗位库 Sheet 挂到 Job Description Summary 的前置读取（模板用 Drive 读文件，
   改成 Sheets 节点读你的**岗位库**更直接）
2. 投递表单里的"岗位"下拉选项 = 岗位库里的岗位名

## 第四步：定制评分逻辑（关键）

点开 **HR Expert** 节点改 Prompt，把模糊打分变成可执行标准：

```
你是严格的技术招聘官。对照【JD与硬性要求】评估【候选人信息】：
1. 硬性要求逐条核对：满足=通过；任一不满足整体标记"不通过"并说明缺哪条
2. 打 0-100 匹配分：经验年限权重40%、技能匹配30%、项目质量30%
3. 输出：亮点（2条）、疑虑（1-2条）、3 个针对性面试问题（中文）
评分标准保守从严，宁可人工复核，不可漏判硬伤。
```

## 第五步：试跑

1. **Test workflow** → 打开表单链接 → 填姓名选岗位 → 上传一份 PDF 简历（用自己的练手）
2. 全绿后检查三处产出：候选人台账一行完整结构化数据 ✅；
   Notion 招聘页出现该候选人页面（含简历文件）✅
3. 满意后 Save + Active；表单链接挂到招聘页/发HR群即可

## 精简版跑法（10 分钟见效）

只保留 ①②③ + Append 台账：跳过 Notion 和 ElevenLabs 段（删或断开连线），
先把"简历→评分表"跑通，这是 80% 的价值所在。

## 常见报错

| 报错 | 解法 |
|---|---|
| Gemini 429 | 免费额度限速：逐份处理已内置 Loop；量大就绑卡升级 |
| Notion 找不到页面 | 授权时没选到"招聘"页：Credential → 重新授权并勾选 |
| 结构化字段空 | 简历是扫描图：Extract from File 前加 OCR，或要求投递 PDF 文字版 |
| 评分全 90+（放水） | Prompt 加"保守从严"并在 HR Expert 温度调 0.1 |

## 合规提醒

简历是个人信息：仅收集必要字段、留存期限写进隐私声明、内部共享用 Notion 权限控制，
不要把含简历的表单链接公开传播。
