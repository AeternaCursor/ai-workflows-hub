# 实操教程：社媒内容批量生成与发布

> 全程约 50 分钟。跑通后：填一个主题 → Gemini 写文案 → Kie.ai 生成配图 →
> 经 Zernio 自动发布到你勾选的 Facebook/Instagram/LinkedIn/TikTok。
> 前置：n8n 已运行。

## 你需要准备

- [ ] Google AI Studio 的 **Gemini API Key**（免费额度可用）
- [ ] **Kie.ai** API Key（kie.ai 注册；用 Midjourney/Flux 画图按张计费，先充最低档）
- [ ] **Zernio** 账号 + API Key（zernio.com，社媒统一发布服务；试用期内免费）
      三个都不想注册？看文末"极简版"

## 第一步：认识流程

```
入口：When clicking 'Execute workflow'（手动）→ Default Settings（Set 节点）
AI：  Gemini - Generate Content（写多平台文案）→ Parse & Filter Platforms
      → Kie.ai - Generate Image（提交画图任务）→ Wait 30s
      → Kie.ai - Obtain Image（取图）
发布：Combine Content with Media → 分支 IF Facebook / Instagram / LinkedIn / TikTok
      → 各自 Zernio Create Post ...（>4MB 走上传子流程）
收尾：Success Notification & Logging → Respond to Webhook
```

## 第二步：配三处 Key（都在 HTTP 节点里）

1. **Gemini - Generate Content**：Header Auth 或 URL 参数 `?key=` 填 Gemini Key
2. **两个 Kie.ai 节点**：Header Auth 填 Kie Key
3. **所有 Zernio 节点**：Header Auth 填 Zernio Key

## 第三步：在 Default Settings 里定参数（关键）

点开 **Default Settings**（Set 节点），改这些字段：

```
topic:        你的内容主题，如"AI 如何帮跨境电商做客服"
brand_voice:  品牌语气，如"专业但轻松，偶尔玩梗，中文为主"
platforms:    facebook,instagram,linkedin   ← 想发哪几个写哪几个
image_style:  配图风格，如"flat illustration, brand blue tone"
```

并在 **Parse & Filter Platforms** 的 Code 节点里保持与勾选分支一致。

## 第四步：连好 Zernio 的社媒账号

Zernio 后台 → 连接你的 Facebook 主页 / Instagram 商业账号 / LinkedIn /
TikTok（各平台要求不同，FB/IG 需绑定公共主页）。连不上的平台就从
`platforms` 字段里去掉，对应 IF 分支不会走。

## 第五步：试跑

1. **Execute workflow** → 盯着 Gemini 节点输出：一次生成四个平台的文案变体
2. Kie.ai 出图约 30-60 秒（内置 Wait 30s + Obtain 轮询）
3. 各平台分支执行后，去 Zernio 后台看发布记录，再到各社媒 App 确认帖子上线 ✅
4. 频率建议：每天 1-2 次手动跑；稳定后把手动触发换成 Schedule Trigger
   + Google Sheets 选题表（每天自动读一行主题）

## 极简版（一个 Key 都不用）

只保留 Gemini 节点 + Success Notification：让 AI 生成**四平台文案包**，
人工复制粘贴发布。虽不自动，但 5 分钟就能用起来，先跑内容再谈自动化。

## 常见报错

| 报错 | 解法 |
|---|---|
| Kie.ai 一直 Obtain 不到图 | 生成失败/额度不足：看该节点返回的 status 字段，换个 prompt 重试 |
| Zernio 发布 403 | 对应平台授权过期：Zernio 后台重连该平台 |
| 图 > 4MB 上传失败 | 模板已有大文件子流程（Init Upload→GET→PUT），确认走的是该分支 |
| 文案不带话题标签 | brand_voice 里明确"每条带 3 个 # 标签" |
