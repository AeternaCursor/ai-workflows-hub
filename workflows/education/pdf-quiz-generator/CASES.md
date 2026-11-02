# 实操案例与代码示例：PDF 生成测验题

## 案例 1：《光合作用》教材 3 页 → 10 道单选题

**输入**：高中生物教材《光合作用》章节 PDF（约 1200 字）。

**Questions Generate 节点的 Structured Output（节选前 2 题）**：

```json
{ "questions": [
  { "question": "光合作用的光反应阶段发生在细胞的哪个结构？",
    "options": ["线粒体基质", "类囊体薄膜", "叶绿体基质", "细胞质基质"],
    "answer": 1,
    "explanation": "光反应在类囊体薄膜上进行，暗反应在叶绿体基质中进行。" },
  { "question": "下列哪项不是光反应的产物？",
    "options": ["氧气", "ATP", "NADPH", "葡萄糖"],
    "answer": 3,
    "explanation": "葡萄糖是暗反应（卡尔文循环）的产物。" } ] }
```

**产出**：Google Forms 测验链接打开即是 10 题选择题，已带答案与分值（Quiz 模式）；
题库 Sheet 追加 10 行。教师只需复核 2 分钟即可发班。

## 代码示例

### 1. 出题提示词（抄进 LLM Chain，注意题型约束）

```
你是命题教师。根据【教材内容】出 {{题目数=10}} 道中文单选题，要求：
1. 覆盖材料中 70% 以上知识点，重点考"为什么/会怎样"而非背诵
2. 每题恰好 4 个选项、恰好 1 个正确（answer 填正确项的下标 0-3）
3. 干扰项用学习者常见误解设计
4. 每题附 25 字内解析
按 Structured Output Parser 定义的 schema 输出，不要输出其他内容。
教材内容：{{ $json.text }}
```

### 2. Sheets 结构整理（模板内置 Code 节点的核心逻辑，改题量用它）

```javascript
// 把 AI 的 questions 数组拍平成 Sheets 行
const qs = $input.first().json.questions || [];
return qs.map((q, i) => ({ json: {
  日期: new Date().toISOString().slice(0, 10),
  题号: i + 1,
  题目: q.question,
  选项A: q.options[0], 选项B: q.options[1], 选项C: q.options[2], 选项D: q.options[3],
  答案: "ABCD"[q.answer],
  解析: q.explanation } }));
```

### 3. Forms API 创建测验卷（对应 Create Form + Enable Quiz 节点）

```bash
curl -X POST https://forms.googleapis.com/v1/forms \
  -H "Authorization: Bearer $GOOGLE_OAUTH_TOKEN" -H "Content-Type: application/json" \
  -d '{ "info": { "title": "光合作用随堂测" },
        "settings": { "quizSettings": { "isQuiz": true } } }'
```

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个出题工作流：
1. 表单增加"难度"下拉（简单/中等/困难），映射到提示词的出题深度
2. 题型扩展：5 单选 + 3 判断 + 2 简答（简答不带 answer，标注人工批改）
3. 出完题往教师邮箱发一封预览邮件，附 Forms 链接与全部题目文本
输出：完整 workflow.json + 变更对照 + 验收3步。
```

迭代方向参考：按学生错题自动生成变式题 / 双语卷 / 知识点覆盖矩阵落表。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
