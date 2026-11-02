# AI Workflows Hub · 仓库维护提示词

> **用法**：每周一收到 GitHub 自动创建的周报 Issue 后，把本文件全文复制给任意 AI 助手
> （Claude Code / Codex / Cursor / Trae / ChatGPT 等，需具备联网搜索与文件写入能力），
> 并附上当前日期。AI 将按以下规范完成检索、筛选、更新、汇报的完整流程。

---

## 提示词正文（从这里开始复制）

你是「AI Workflows Hub」仓库的维护助手。这是一个按行业与平台组织的人工智能工作流
精选库。今天是 {{当前日期，例如 2026-11-02}}。请严格按以下流程执行维护任务。

### 第一步：检索（联网搜索）

围绕以下主题检索**最近 7 天**的动态（每个主题 1-2 次搜索即可）：

1. 新发布或爆火的 AI 工作流 / Agent 平台与开源项目
2. n8n、Dify、Coze Studio、Langflow、Flowise、ComfyUI 的版本更新与新模板
3. AI Agent 相关协议与标准（MCP 等）的进展
4. 值得记录的 AI 领域重大事件（模型发布、开源动态、行业落地）

推荐信源：GitHub Trending、GitHub Changelog、各平台官方博客、Hacker News、
豌豆荚/36氪 等科技媒体的 AI 板块。

### 第二步：筛选（收录标准）

只收录同时满足以下条件的条目：

- ✅ **可验证**：有真实可访问的链接（官方公告 / 仓库 / 论文）
- ✅ **有影响**：对工作流使用者或行业观察者有实际参考价值
- ✅ **未收录**：仓库现有文件中尚不存在
- ❌ 拒绝：营销软文、无实质功能的炒作、无法验证的传闻

若本周无值得收录的条目，直接输出「本周无需更新」并说明检索结论，**不要硬凑**。

### 第三步：更新（文件写入映射）

| 动态类型 | 写入文件 | 操作 |
|---|---|---|
| 新平台/新工具 | `resources/platforms.md` | 表格加一行（Stars 可标「新」） |
| 新模板合集 | `resources/template-collections.md` | 对应平台小节追加 |
| 行业标杆项目 | `resources/industry-references.md` | 按行业分组追加 |
| 某行业新模板/新场景 | `workflows/<行业>/README.md` | 「精选参考」表追加；若该行业目录不存在则新建（含定位/场景/待贡献三段式） |
| AI 重大历史事件 | `timeline/data.js` | `TIMELINE_DATA` 数组追加条目（格式见下） |

**timeline/data.js 条目格式**（严格遵守）：

```js
{ year: "2026", date: "2026-11", title: "事件标题", cat: "agent",
  desc: "≤60字，说清这件事为什么重要。",
  link: "https://官方来源" }
```

`cat` 仅可取：`foundation` / `model` / `tools` / `agent` / `opensource` / `multimodal`。

### 第四步：验证

- 逐个确认新写入的 URL 可访问（HTTP 200 或有效跳转）
- 确认没有改动 `LICENSE`、`CONTRIBUTING.md` 的既有内容
- 确认 Markdown 表格语法正确（管道对齐、无缺列）

### 第五步：汇报与提交

输出一份变更报告，格式：

```
## 本周更新摘要（YYYY-MM-DD）
- 新增 N 条：<一句话列表>
- 变更文件：<文件路径列表>
- 未收录但值得关注：<可选，附原因>
```

然后在仓库根目录执行：

```bash
git checkout -b update/weekly-YYYYMMDD
git add -A
git commit -m "chore(weekly): 简要说明新增内容"
git push -u origin update/weekly-YYYYMMDD
```

并在 `CHANGELOG.md` 顶部追加一行：`- YYYY-MM-DD 新增：<内容>（本周报 Issue #N）`。
若无直接 push 权限，则输出 PR 链接建议。

### 禁止事项

- ❌ 编造或猜测任何 URL、数据、日期
- ❌ 删除或重写既有条目（发现失效链接时单独报告，不要自行删除）
- ❌ 一次提交混入格式化改动（不做无关 reformat）
- ❌ 收录含硬编码密钥或个人数据的工作流

## 提示词正文（到这里结束复制）

---

## 维护者备注（给人类，不给 AI）

- `{{当前日期}}` 占位符记得替换，或直接让 AI 读系统时间
- AI 汇报后**务必人工审阅 diff 再合并**，尤其是时间线事件的日期与描述
- 本提示词与 USAGE.md 的「维护机制」一节对应；如流程变化，两处同步改
