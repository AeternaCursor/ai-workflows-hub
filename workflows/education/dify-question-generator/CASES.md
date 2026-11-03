# 实操案例与代码示例：Dify 智能出卷

## 案例 1：一节课的随堂小卷，10 分钟出稿

**输入**：刚讲完"光合作用"，把维基页 URL 填进 reference，
grade=初二、subject=生物、types=单选题、填空题、count=6、difficulty=中等。

**输出**（节选，答案标记内嵌）：

```markdown
# 光合作用随堂测验
---
1. 光合作用主要发生在细胞的哪种结构中？
    - ( ) 线粒体
    - (x) 叶绿体
    - ( ) 细胞核
    - ( ) 液泡

2. 光合作用吸收的气体是____，释放的气体是____。
    - R:=二氧化碳；氧气
```

**用时**：填表 + 生成 ≈ 2 分钟，人工通读微调 ≈ 5 分钟。
对比手写：约 40 分钟。两段 LLM 的价值在第二段"审卷"——实测能把
第一段偶尔出现的答案标错行、题干自相矛盾拦下来。

## 代码示例

### 1. 答案标记 → 自动阅卷（python，离线批改单选题）

```python
import re

paper = open("quiz.md", encoding="utf-8").read()
# 单选题：标记在哪个选项上，哪项就是答案
for num, *opts in re.findall(r"(\d+)\.(.*?)\n(?=\d+\.|$)", paper, re.S):
    ans = [o.strip(" -.[]x()") for o in opts if "(x)" in o or "[x]" in o]
    print(num, ans)
# 学生卷同样语法解析，比对即可自动判分
```

### 2. 调用 Dify API 批量出卷（curl）

```bash
curl -X POST "http://localhost/v1/workflows/run" \
  -H "Authorization: Bearer $DIFY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs":{"grade":"初三","subject":"化学","types":"单选题",
       "count":10,"difficulty":"偏难","reference":"<粘贴课文>"},
       "response_mode":"blocking","user":"teacher-01"}'
# 应用于：期中复习按章节批量出 N 套卷
```

## 案例 2（进阶）：语文作文题 + 评分细则一条龙

把 `types` 填"作文题"、`count`=1，`comments` 写
"附评分细则（内容/结构/语言三维，各占分）"。

**输出变化**：LLM 出题段给出材料作文题干，审卷段补全三维评分细则表。
要点：`comments` 是模板预留的自由指令口——出双语卷、出应用题带解题步骤、
控制知识点范围，都从这一项注入，不用改画布。

**产出**：一个覆盖"出题 → 审校 → 评分标准"的备课小助手。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 Dify 工作流工程师。基于这个出卷 DSL 改造：
1. 增加"错题回炉"输入：接收上次测验错题文本，出同知识点变式题
2. 结束节点前加 Template Transform，把试卷渲染为可打印 HTML（A4 排版）
3. 输出新 workflow.yml + 节点改动说明（YAML 用 Dify DSL 0.1.3 语法）
```

迭代方向参考：错题变式出卷 / 多题型模板化 / 对接 n8n 定时周测自动发班级群。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
