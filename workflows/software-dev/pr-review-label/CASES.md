# 实操案例与代码示例：AI 代码审查与 PR 自动打标

## 案例 1：一个含边界 bug 的 PR 被当场抓住

**输入**：测试仓库 PR #7（新增 `retry.js`，改动 +42/-3），Webhook payload 触发。

**AI Code Reviewer 收到的上下文（节选）**：

```json
{ "pr": { "number": 7, "title": "feat: add retry helper",
    "files": [{ "filename": "src/retry.js", "additions": 42 }] },
  "diff": "+export async function retry(fn, times = 3) {\n+  for (let i = 0; i <= times; i++) {\n+    try { return await fn() } catch (e) { if (i === times) throw e }\n+  }\n+}" }
```

**Agent 输出（Parse AI Review 之后）**：

```json
{ "verdict": "comment",
  "labels": ["bug", "test"],
  "summary": "循环条件 i <= times 导致最后一次 catch 后 i===times 已越界判定，实际会多试 1 次；且无单测。建议改为 i < times 并补 3 个用例。" }
```

**落地效果**：PR #7 自动打上 `bug` `test` 标签 + AI 评论一条 + Slack #dev 收到卡片，维护者 10 秒决定要不要细看。

## 代码示例

### 1. Filter PR Events 的条件（只审"打开/更新"，忽略关闭）

```javascript
// Code 节点：Extract PR Data 的首行过滤逻辑
const a = $json.action, pr = $json.pull_request;
if (!['opened', 'synchronize', 'reopened'].includes(a)) return [];
return [{ json: { number: pr.number, title: pr.title,
  user: pr.user.login, branch: pr.head.ref, files_url: pr.url } }];
```

### 2. 审查提示词（决定质量上限的部分，抄走改）

```
你是资深工程师，审查 PR diff。团队规范：
1. 命名达意、单一职责；2. 空指针/越界/并发/资源泄漏四类重点查；
3. 新逻辑必须有测试；4. 删配置/加依赖/改公共接口必须点名 risk。
仅审查 diff 中出现的代码。输出 JSON：
{verdict:"approve|comment|request_changes",
 labels:[从 bug,risk,naming,test,doc 选],
 summary:"中文三句话内，指出具体行"}
不确定的写"建议人工确认"，禁止编造 diff 里没有的问题。
```

### 3. curl 模拟 Webhook（不真开 PR 也能调试整条链）

```bash
curl -X POST http://localhost:5678/webhook/pr-review \
  -H "Content-Type: application/json" \
  -d '{"action":"opened","pull_request":{"number":7,"title":"test",
       "url":"https://api.github.com/repos/OWNER/REPO/pulls/7","user":{"login":"tester"},
       "head":{"ref":"feat/x"}}}'
```

## 案例 2（进阶）：依赖升级 PR 专项审查——只盯 package.json/lock 的高危变更

场景：`dependabot` 每周开十几个依赖升级 PR，人工看不过来。给本工作流加"依赖专项通道"：
凡 diff 只含 `package.json` / `*.lock` 的 PR 走另一套审查逻辑。

**路由 Code 节点（Extract PR Data 之后）**：

```javascript
const files = $json.files || [];
const onlyDeps = files.length > 0 && files.every(f =>
  /(^|\/)(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|requirements\.txt|go\.(mod|sum))$/.test(f.filename));
return [{ json: { ...$json, route: onlyDeps ? 'deps' : 'code' } }];
```

**依赖审查提示词（deps 分支专用，与代码审查分支并列）**：

```
你是依赖治理专家。审查依赖变更 diff：
1. 主版本号升级(major) = 大概率 breaking → verdict 至少 comment，列调用面排查清单
2. patch 升级且是安全修复 → 直接 approve，说明 CVE 编号（如有）
3. 新增依赖 → 检查周下载量<1k 或 6 个月未更新 → 标 risk
4. 输出同 schema：labels 可用 risk/approve-fast
diff：{{ $json.diff }}
```

**落地效果示例**：dependabot 17 个 PR → 12 个 patch 自动 approve-fast 打绿 ✅、
4 个 major 打 `risk` 标+排查清单、1 个新增低质依赖被拦——人工只看 5 个。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 n8n 工程师。改造这个 PR 审查工作流：
1. verdict=request_changes 时自动申请人工复审：
   在 PR 上加 "needs-human-review" 标签并 @ 指定 reviewer（GitHub 节点）
2. 审查规则改为从 Google Sheets 读取（表头：规则编号/类别/描述），
   支持不改流程只改表
3. Log to Sheets 增加 diff 规模列（新增/删除行数）
输出：完整 workflow.json + 变更对照 + 验收3步（用 curl 模拟 webhook 验证）。
```

迭代方向参考：只审特定目录 / commit message 合规检查 / 与 CI 结果联动。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
