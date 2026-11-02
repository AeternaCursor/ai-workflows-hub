# 实操教程：邮件摘要 Agent

> 全程约 30 分钟。跑通后每天早上 7 点自动收到昨日邮件 AI 摘要。
> 前置：已装好 n8n（见 [Quickstart 路线一](../../../docs/quickstart.md)）。

## 你需要准备

- [ ] OpenAI API Key（或 DeepSeek Key，platform.deepseek.com）
- [ ] Google 账号（Gmail 收发邮件）
- [ ] n8n 已运行在 http://localhost:5678

## 第一步：导入并认识 4 个核心节点

导入 workflow.json 后，忽略黄色便签，主链路只有 4 个节点：

```
Daily 7AM Trigger → Fetch Emails - Past 24 Hours → Organize Email Data - Morning
→ Summarize Emails with OpenAI - Morning → Send Summary - Morning
```

| 节点 | 作用 | 需要你操作的 |
|---|---|---|
| Daily 7AM Trigger | 每天定时启动 | 可改触发时间（点开 → Hours 选 8 就是 8 点） |
| Fetch Emails - Past 24 Hours | 拉 24 小时内邮件 | 配 Gmail 凭据 |
| Summarize Emails with OpenAI | AI 生成摘要 | 配 OpenAI 凭据 + 改提示词 |
| Send Summary - Morning | 把摘要发给自己 | 配 Gmail 凭据（发件用） |

## 第二步：配置两个凭据

1. **Gmail**（两个 Gmail 节点各点一次）：
   节点 → Credential 下拉 → **Create New credential** → 浏览器跳谷歌授权 → 允许。
   两个 Gmail 节点选同一个凭据即可。
   国内无法直达谷歌时：把两个 Gmail 节点换成 `On app trigger` + IMAP 节点，或走代理。

2. **OpenAI**：
   点开 Summarize 节点 → Credential → Create New → 粘贴 `sk-` 开头的 Key → Save。
   用 DeepSeek：删掉 OpenAI 节点，替换为 "Basic LLM Chain" + DeepSeek 模型节点
   （模型选 deepseek-chat），提示词照抄。

## 第三步：定制你的摘要格式（关键）

点开 **Summarize Emails with OpenAI - Morning** 节点，把 Prompt 改成你的口味，例如：

```
你是我的邮件秘书。以下是过去24小时的邮件列表（发件人/主题/正文摘要）。
按下面格式输出中文摘要：
【必须回复】…（需要我今天行动的，写清谁+什么事+截止）
【只需知晓】…（一句话一条）
【可忽略】…（营销/通知类，一行带过）
```

## 第四步：试运行

1. 点右上角 **Save**
2. 点 **Test workflow**（第一次会要求激活节点，全点确认）
3. 没有报错 → 打开自己的 Gmail 收件箱，应该有一封 AI 摘要邮件
4. 打开右上角开关 **Active** ✅ → 从此每天自动运行

## 怎么算跑通

- Executions（右侧时钟图标）里出现绿色记录
- 收到摘要邮件，格式符合你第三步写的提示词

## 常见报错

| 报错 | 原因与解法 |
|---|---|
| `Oops, there was a problem` 红在 Gmail 节点 | 授权过期：Credential → Refresh，或重新走一遍谷歌授权 |
| OpenAI 节点 401 | Key 错误/未充值；DeepSeek 用户检查是否换成了对应模型节点 |
| 24 小时没邮件可摘要 | 正常，会发"无邮件"邮件；可在提示词里约定空结果不发信 |
| 摘要邮件进了垃圾箱 | 在 Gmail 里把它标为非垃圾 |
