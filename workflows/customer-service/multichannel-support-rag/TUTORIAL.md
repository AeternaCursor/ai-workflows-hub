# 实操教程：缓存优先 RAG 客服应答

> 全程约 60 分钟（含 Redis）。跑通后：聊天窗口提问 → 高频问题秒回（零 LLM 成本）→
> 未命中才走 RAG 检索生成 → 答案自动回写缓存。
> 前置：n8n 已运行 + Docker（复用 Quickstart 装的即可）。

## 你需要准备

- [ ] OpenAI API Key（Chat + Embeddings 两类调用）
- [ ] Redis（带 RediSearch）：一条 Docker 命令起，见下
- [ ] LangCache：模板用它做语义缓存服务（langcache.com 有云服务；
      只想体验主流程可先把 Search/Save to LangCache 两节点断开，走纯 RAG）

## 第一步：起 Redis（1 分钟）

```powershell
docker run -d --name redis -p 6379:6379 redis/redis-stack-server:latest
```

## 第二步：认识流程（这条模板的精髓是"三段式缓存优先"）

```
入口：When chat message received（n8n 聊天窗）+ Schedule Trigger（离线灌库）
一   decompose_query（Agent 拆解用户问题）
二   Search LangCache（HTTP 查语义缓存）
     → Is Cache Hit? 命中：直接返回缓存答案（0 Token）
三   未命中：search_node1（Agent+Redis 向量检索知识库）
     → synthesize_response_node（Agent 合成带引用回答）
     → evaluate_quality（OpenAI 节点给答案打分，低分重试，最多 N 轮：low quality? / increase iteration）
     → Save to LangCache（把高分答案写回缓存）
```

## 第三步：配凭据

1. **OpenAI**：三个 OpenAI Chat Model 节点（decompose / synthesize / search 用）
   + 两处 Embeddings OpenAI 节点，全部挂同一个 OpenAI 凭据。
2. **Redis Vector Store**（两个节点，一个建库一个查询）：
   Credential → Create New Redis 凭据 → Host `127.0.0.1:6379`。
3. **LangCache 两个 HTTP 节点**：Header Auth 填 LangCache 的 API Key
   （暂不接入就先断开这两处连线，流程照样跑）。

## 第四步：灌你的知识库（关键）

模板里的 example Data + Default Data Loader 是示例数据。替换成你的客服 FAQ：

1. 删掉 example Data 里的示例
2. 换成 **Read PDF / Google Sheets** 节点读你的 FAQ（建议格式：`问题 | 标准答案`）
3. 接进 Default Data Loader → Redis Vector Store（建库那个），
   手动执行一次 Schedule Trigger 支线完成灌库

## 第五步：试跑

1. 点 **Test workflow** → 底部弹出聊天窗口
2. 问一个 FAQ 里有的问题 → 走 RAG 生成（第一次慢，几秒）
3. **再问一遍同样的问题（换个说法）** → 观察 Search LangCache 节点命中、
   总耗时降到 1 秒内、OpenAI 无调用 ✅ 这就是缓存优先的价值
4. Executions 里对照两次执行的节点路径，理解"命中/未命中"两条分支

## 第六步：接进真实客服

- 聊天窗只适合测试；正式入口把 chatTrigger 换成 **Webhook**，
  接你的网站组件 / Telegram / 飞书机器人（n8n 都有现成节点）

## 常见报错

| 报错 | 解法 |
|---|---|
| Redis connection refused | redis-stack 容器没起：`docker ps` 看一眼，没起就 `docker start redis` |
| Embeddings 401/额度 | OpenAI 账号没绑卡时 embeddings 限速明显，绑卡或换 Azure OpenAI |
| 缓存永不命中 | LangCache 未接或阈值太严：命中判定的相似度阈值放宽到 0.9 以下 |
| 答案低分死循环 | evaluate_quality 重试上限在 increase iteration 节点控制，默认 2-3 次即可 |
