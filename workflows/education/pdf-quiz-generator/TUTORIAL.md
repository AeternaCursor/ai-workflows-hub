# 实操教程：PDF 一键生成测验题（Google Forms）

> 全程约 40 分钟。跑通后：网页表单上传课程 PDF → AI 按要求出题 → 自动生成
> Google Forms 测验 + 题库落 Google Sheets。
> 前置：n8n 已运行 + Google 账号。

## 你需要准备

- [ ] OpenAI API Key（模型用 gpt-4o 效果最佳；DeepSeek 也可）
- [ ] Google 账号，且开通过 [Google Forms](https://forms.new)（进一次即可）
- [ ] Google Cloud 建一个项目启用 **Google Forms API + Google Sheets API + Google Drive API**
      （console.cloud.google.com → APIs & Services → Library 搜 Forms 启用；
      OAuth 同意屏选 External + 自己邮箱做测试用户）

## 第一步：认识流程（4 个阶段，看便签分区）

模板自带 Workflow Overview / Input / AI Processing / Form Creation / Output 便签分区：

```
On form submission（n8n 自带网页表单，上传PDF）
→ Extract from File（PDF→文本）
→ Questions Generate（LLM Chain + Structured Output Parser 出题）
→ Set a Google Sheet Structure for all Questions（Code 整理）
→ Append All Questions（题库入 Sheets）
→ Create Form / Enable Quiz Mode / Add Questions / Add Student Details
   （4 个 HTTP 节点调 Google Forms API 生成测验）
```

## 第二步：配三个凭据

1. **OpenAI**：Questions Generate 上方的 OpenAI Chat Model 节点 → Create New → 粘 Key。
2. **Google Sheets OAuth**：Append All Questions 节点 → Create New → 谷歌授权
   （需 Cloud 项目已启用 Sheets API）。
3. **Google Forms（HTTP 节点用）**：Create Form 等 4 个 HTTP 节点 →
   Generic Credential Type → **Google OAuth2 API** → 同一个谷歌账号授权。
   授权失败 = Cloud 没启用 Forms API，回第一步补。

## 第三步：准备两张 Sheets

1. 建一张 Google Sheet（如"题库"），第一行表头：`日期 | 来源PDF | 题目 | 选项A | 选项B | 选项C | 选项D | 答案 | 解析`
2. Append All Questions 节点：Document 选该表，Sheet 选 Sheet1，Mapping 自动对上。
3. Add Student Details 节点会把"姓名/班级"字段写进表单开头，教师收卷时能看到。

## 第四步：定制出题（关键）

点开 **Questions Generate**（LLM Chain）节点，改 Prompt 为你的题型要求：

```
你是命题老师。根据下面的教材内容出 10 道中文单选题：
- 覆盖不同知识点，重点考概念理解而非死记
- 每题 4 个选项，只有 1 个正确
- 干扰项要有迷惑性（常见误解）
- 附一句话解析
教材内容：{{ $json.text }}
```

Structured Output Parser 已定义题目 JSON 结构（question/options/answer/explanation），不必改。

## 第五步：跑一次完整链路

1. **Test workflow** → n8n 弹出表单 URL → 打开 → 上传一份 5 页内的 PDF → Submit
2. 回画布看节点逐个变绿；卡住时点开看输入输出定位
3. 成功标志：
   - 题库 Sheet 追加了 10 行题
   - 浏览器打开生成的 Google Forms 链接（在 Create Form 节点输出里），
     已是**测验模式**（有答案和分值）✅
4. 满意后 Save + Active，把表单链接发给学生/同事即可反复使用

## 常见报错

| 报错 | 解法 |
|---|---|
| Google Forms API 403 | Cloud 未启用 Forms API，或 OAuth 同意屏没把自己加为测试用户 |
| PDF 提取为空 | 扫描版 PDF 无文字层；换文字版 PDF，或前置 OCR |
| 题目 JSON 解析失败 | 模型没按结构输出：确认 Structured Output Parser 连着，模型温度调 0 |
| Add Questions 卡住 | 表单 API 有配额，题量大时等 30s 重跑；或减到 10 题内 |
