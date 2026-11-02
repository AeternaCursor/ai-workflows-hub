// ============================================================
// AI 发展史时间线数据
// 添加新事件：在数组中追加一条即可，页面自动渲染。
// cat 可选值：foundation 基础奠基 / model 模型里程碑 /
//             tools 工具平台 / agent Agent与工作流 /
//             opensource 开源生态 / multimodal 多模态生成
// ============================================================

window.CATEGORIES = {
  foundation:  { name: "基础奠基",    color: "#8b9dc3" },
  model:       { name: "模型里程碑",  color: "#f5a623" },
  tools:       { name: "工具与平台",  color: "#4fc3f7" },
  agent:       { name: "Agent与工作流", color: "#c792ea" },
  opensource:  { name: "开源生态",    color: "#69f0ae" },
  multimodal:  { name: "多模态生成",  color: "#ff8a80" },
};

window.TIMELINE_DATA = [
  // ---------- 基础奠基 ----------
  { year: "1943", date: "1943", title: "人工神经元数学模型", cat: "foundation",
    desc: "McCulloch 与 Pitts 提出神经元的数学模型，首次用逻辑运算描述大脑活动，奠定神经网络的理论起点。" },
  { year: "1950", date: "1950", title: "图灵测试", cat: "foundation",
    desc: "图灵发表《计算机器与智能》，提出\u201c机器能否思考\u201d的判定标准——模仿游戏，即后世所称的图灵测试。" },
  { year: "1956", date: "1956-08", title: "达特茅斯会议：AI 诞生", cat: "foundation",
    desc: "McCarthy、Minsky 等人在达特茅斯学院首次提出 Artificial Intelligence 一词，AI 作为学科正式诞生。" },
  { year: "1958", date: "1958", title: "感知机", cat: "foundation",
    desc: "Rosenblatt 发明感知机（Perceptron），第一个可学习的神经网络模型，引发第一波 AI 热潮。" },
  { year: "1966", date: "1966", title: "ELIZA：最早的聊天机器人", cat: "foundation",
    desc: "Weizenbaum 在 MIT 开发的 ELIZA 用模式匹配模拟心理医生对话，是人类历史上第一个聊天机器人程序。" },
  { year: "1997", date: "1997-05", title: "深蓝击败国际象棋世界冠军", cat: "foundation",
    desc: "IBM 深蓝击败卡斯帕罗夫，机器首次在顶级智力竞技中战胜人类冠军；同年 LSTM 问世。" },
  { year: "2006", date: "2006", title: "深度学习复兴", cat: "foundation",
    desc: "Hinton 提出深度信念网络与逐层预训练方法，\u201c深度学习\u201d一词登上历史舞台。" },

  // ---------- 模型里程碑 ----------
  { year: "2012", date: "2012-09", title: "AlexNet 引爆深度学习", cat: "model",
    desc: "Hinton 团队的 AlexNet 在 ImageNet 竞赛中错误率骤降十个百分点，GPU + 深度卷积网络自此统治计算机视觉。" },
  { year: "2014", date: "2014-06", title: "GAN 生成对抗网络", cat: "model",
    desc: "Goodfellow 提出 Generative Adversarial Networks，让机器学会\u201c无中生有\u201d，开启生成式 AI 时代。" },
  { year: "2016", date: "2016-03", title: "AlphaGo 战胜李世石", cat: "model",
    desc: "DeepMind 的 AlphaGo 以 4:1 击败围棋世界冠军李世石，强化学习走进大众视野。" },
  { year: "2017", date: "2017-06", title: "Transformer 架构", cat: "model",
    desc: "Google 发表《Attention Is All You Need》，Transformer 成为此后所有大模型的基石架构。",
    link: "https://arxiv.org/abs/1706.03762" },
  { year: "2018", date: "2018", title: "GPT-1 与 BERT：预训练时代", cat: "model",
    desc: "OpenAI 提出 GPT 生成式路线，Google 提出 BERT 理解式路线，\u201c预训练 + 微调\u201d范式确立。",
    link: "https://arxiv.org/abs/1810.04805" },
  { year: "2020", date: "2020-05", title: "GPT-3：规模定律显现", cat: "model",
    desc: "1750 亿参数的 GPT-3 展现出少样本学习能力，Scaling Laws 成为行业共识；同年 AlphaFold 2 破解蛋白质折叠。",
    link: "https://arxiv.org/abs/2005.14165" },
  { year: "2023", date: "2023-03", title: "GPT-4 发布", cat: "model",
    desc: "多模态输入 + 专业考试级能力，大模型能力边界再次被推高，全球 AI 竞赛白热化。" },
  { year: "2023", date: "2023-12", title: "Google Gemini 登场", cat: "model",
    desc: "Google 发布原生多模态大模型 Gemini，与 GPT-4 展开正面竞争。" },
  { year: "2024", date: "2024", title: "Claude 3 系列与推理模型竞赛", cat: "model",
    desc: "Anthropic Claude 3 系列多次登顶基准测试；年末 OpenAI o1 引入长思维链推理，\u201c推理模型\u201d成为新赛道。" },
  { year: "2025", date: "2025-08", title: "GPT-5 发布", cat: "model",
    desc: "OpenAI 发布 GPT-5，统一对话、推理与 Agent 能力，模型即产品的趋势进一步明确。" },

  // ---------- 工具与平台 ----------
  { year: "2021", date: "2021-06", title: "GitHub Copilot 技术预览", cat: "tools",
    desc: "基于 Codex 的代码补全助手上线，AI 编程助手第一次大规模进入开发者日常工作流。",
    link: "https://github.com/features/copilot" },
  { year: "2024", date: "2024", title: "AI 编辑器混战：Cursor 等崛起", cat: "tools",
    desc: "Cursor、Windsurf 等 AI 原生编辑器爆发式增长，AI Coding 从补全进化到整任务代理。" },

  // ---------- Agent 与工作流 ----------
  { year: "2023", date: "2023-03", title: "AutoGPT 引爆 Agent 热潮", cat: "agent",
    desc: "AutoGPT 让 LLM 自主拆解任务、调用工具、循环执行，\u201cAI Agent\u201d成为年度关键词。",
    link: "https://github.com/Significant-Gravitas/AutoGPT" },
  { year: "2024", date: "2024-11", title: "MCP 协议发布", cat: "agent",
    desc: "Anthropic 开源 Model Context Protocol，为模型连接外部工具与数据建立统一标准，迅速成为行业事实标准。",
    link: "https://modelcontextprotocol.io" },
  { year: "2025", date: "2025-03", title: "Manus 引发通用 Agent 讨论", cat: "agent",
    desc: "通用型自主 Agent 产品 Manus 刷屏，\u201c给一个目标，交付一个结果\u201d的想象被点燃。",
    link: "https://manus.im" },
  { year: "2026", date: "2026-02", title: "GitHub Agentic Workflows 预览", cat: "agent",
    desc: "GitHub 官方推出 gh-aw：用 Markdown 定义 AI 工作流，直接跑在 Actions 里，AI Agent 进入软件工程主流程。",
    link: "https://github.com/github/gh-aw" },
  { year: "2026", date: "2026-05", title: "Anthropic 开源金融行业 Agent 套件", cat: "agent",
    desc: "anthropics/financial-services 发布：11 个端到端金融 Agent + 8 个垂直插件 + 11 个数据连接器，行业级 Agent 参考实现。",
    link: "https://github.com/anthropics/financial-services" },

  // ---------- 开源生态 ----------
  { year: "2023", date: "2023-02", title: "LLaMA 泄露，开源社区引爆", cat: "opensource",
    desc: "Meta LLaMA 权重外流后，Alpaca、Vicuna 等衍生模型一周内井喷，开源大模型生态就此起飞。" },
  { year: "2023", date: "2023-07", title: "Llama 2 开放商用", cat: "opensource",
    desc: "Meta 正式开放 Llama 2 商用许可，\u201c开放权重\u201d成为大模型竞争的第二条主线。",
    link: "https://ai.meta.com/llama/" },
  { year: "2025", date: "2025-01", title: "DeepSeek-R1 开源", cat: "opensource",
    desc: "DeepSeek-R1 以极低成本复现顶级推理能力并全面开源，震动全球 AI 圈，掀起推理模型开源浪潮。",
    link: "https://github.com/deepseek-ai/DeepSeek-R1" },
  { year: "2025", date: "2025-07", title: "Coze Studio 开源", cat: "opensource",
    desc: "字节跳动开源 Coze（扣子）开发平台，可视化 Agent + 工作流 + 插件体系，开源三天破 13k star。",
    link: "https://github.com/coze-dev/coze-studio" },
  { year: "2026", date: "2026-10", title: "工作流模板生态破万", cat: "opensource",
    desc: "n8n 社区模板合集达万级规模（8,600+~11,700+ 可导入工作流），Dify 上线 Creator Center 模板市场——工作流复用成为常态。" },

  // ---------- 多模态生成 ----------
  { year: "2022", date: "2022-04", title: "DALL·E 2", cat: "multimodal",
    desc: "OpenAI 文生图模型惊艳业界，一句描述生成以假乱真的图像。" },
  { year: "2022", date: "2022-08", title: "Stable Diffusion 开源", cat: "multimodal",
    desc: "Stability AI 开源文生图模型，消费级显卡即可本地出图，AIGC 内容创作民主化的开端。" },
  { year: "2022", date: "2022-11-30", title: "ChatGPT 发布", cat: "multimodal",
    desc: "OpenAI 发布 ChatGPT，两个月破亿用户，史上增长最快的消费级应用，AI 正式走入大众生活。",
    link: "https://openai.com/chatgpt" },
  { year: "2024", date: "2024-02", title: "Sora：文生视频震撼", cat: "multimodal",
    desc: "OpenAI 展示文生视频模型 Sora，60 秒逼真视频引全球哗然，视频生成赛道全面引爆。",
    link: "https://openai.com/sora" },
  { year: "2025", date: "2025-02", title: "Wan2.1 视频模型开源", cat: "multimodal",
    desc: "阿里通义万相 Wan2.1 以 Apache 协议开源，消费级显卡可跑的视频生成，后续 Wan2.2 持续迭代。",
    link: "https://github.com/Wan-Video" },
];
