# 缓存优先 RAG 客服应答

> 来源：[n8n 官方模板 #12400](https://n8n.io/workflows/12400) · 38 节点

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)

用 Redis + LangCache 实现「缓存优先」的 RAG 客服：高频问题直接命中缓存回答（零 LLM 成本），
未命中才走 OpenAI 向量检索生成，显著降低规模化客服的 Token 开销。

- **平台**：n8n 1.x
- **所需凭据**：OpenAI API Key、Redis（含 LangCache）
- **触发方式**：Webhook（客服系统回调）
- **输入**：用户问题文本
- **输出**：带来源引用的回答（缓存命中标记）

## 使用步骤

1. 导入 `workflow.json`
2. 配置 OpenAI 凭据与 Redis 连接串
3. 导入客服知识库到 Redis 向量库（embeddingsOpenAi 节点）
4. 将 Webhook 地址接入客服前端

## 为什么值得学

缓存优先（cache-first）RAG 是控制 LLM 成本的标准模式，
适合任何高频重复问答场景（客服、HR FAQ、内部帮助台）。
