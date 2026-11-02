# 实操教程：AI 代码审查与 PR 自动打标

> 全程约 45 分钟。跑通后：仓库来新 PR → Webhook 触发 → AI 审 diff →
> 自动打标签 + PR 评论 + Slack 通知 + 记录到 Sheets。
> 前置：n8n 已运行 + 一个你有管理员权限的 GitHub 仓库（建议先拿测试仓库练手）。

## 你需要准备

- [ ] GitHub Personal Access Token（Fine-grained：目标仓库 + Contents/Read、
      Pull requests/Read+Write、Issues/Read+Write、Labels 无需单独权限）
- [ ] OpenAI API Key（gpt-4o-mini 便宜且够用）
- [ ] Slack Bot Token（api.slack.com/apps → New App → Bot → 加 `chat:write` 权限 →
      装进频道）。不需要 Slack 可跳过，删掉 Notify 节点即可
- [ ] 一张 Google Sheet 做审查日志（表头：时间/仓库/PR/AI结论/标签）

## 第一步：认识流程（5 个便签分区）

```
Intake：GitHub PR Webhook → Filter PR Events（只处理 opened/synchronize）
Data：  Extract PR Data → Get PR Files（GitHub节点）→ Fetch PR Diff（HTTP）
        → Merge PR Info → Analyze File Changes（统计变更规模）
AI：    AI Code Reviewer（Agent节点+OpenAI Chat Model）→ Parse AI Review
Action：Add PR Labels（GitHub节点）→ Post Review Comment（GitHub节点）
        → Notify Slack
Report：Aggregate Results → Log to Sheets → Respond to Webhook
```

## 第二步：配 4 个凭据

| 节点 | 凭据类型 | 填什么 |
|---|---|---|
| Get PR Files / Add PR Labels / Post Review Comment | GitHub OAuth2 或 PAT | PAT 走 Header Auth：`Authorization: Bearer ghp_xxx` |
| Fetch PR Diff | 同上（HTTP） | 同一个 GitHub Header Auth |
| OpenAI Chat Model | OpenAI API | Key |
| Notify Slack | Slack OAuth2 | Bot Token |
| Log to Sheets | Google Sheets OAuth | 谷歌授权 |

## 第三步：注册 Webhook（GitHub → n8n）

1. 先点 **Test workflow**，让 webhook 节点处于等待状态，复制它显示的
   **Production URL**（形如 `https://xxx.hook.n8n.cloud/webhook/...`；
   本地自托管需用 n8n 的公网地址或内网穿透）
2. GitHub 仓库 → Settings → Webhooks → Add webhook：
   - URL：粘贴上面的地址
   - Content type：`application/json`
   - 触发事件：Let me select → **Pull requests**
3. 保存后 GitHub 会发 ping 测试，n8n 的 Filter 会自动忽略非 PR 事件。

## 第四步：写你的团队规范（关键）

点开 **AI Code Reviewer**（Agent）节点的 Prompt，把"审查标准"换成你团队的，例如：

```
你是资深工程师，审查这个 PR。按团队规范检查：
1. 命名是否达意；函数是否单一职责
2. 是否有明显 bug（空指针/越界/并发）
3. 是否缺关键测试
4. 危险操作（删库/改配置/新增依赖）必须点名
输出 JSON：{verdict: approve|comment|request_changes, labels: [从 bug/risk/naming/test/doc 里选], summary: 中文三句话内}
```

**Add PR Labels** 节点要先把对应 label 在仓库 Issues → Labels 里建好（bug、risk 等），否则打标会 404。

## 第五步：端到端试跑

1. 测试仓库开一个分支 → 随便改两个文件 → 提 PR
2. 观察 n8n Executions 出现新记录并全绿
3. 回 PR 页面检查：出现 AI 评论 ✅ + 标签 ✅；Slack 频道收到通知 ✅；Sheet 多一行 ✅
4. 都正常后 Save + Active，正式仓库同样配一遍 Webhook

## 常见报错

| 报错 | 解法 |
|---|---|
| Webhook 一直不来 | 用 Production URL 而非 Test URL；本地 n8n 没有公网地址收不到，需内网穿透（ngrok/cpolar） |
| Add PR Labels 404 | 仓库里不存在该 label，先去 GitHub 建 |
| PR diff 超长 AI 截断 | Analyze File Changes 里限制只审 .py/.ts 等代码文件，跳过 lock 文件与二进制 |
| Slack not_in_channel | 把 Bot 用 /invite @机器人 拉进频道 |
