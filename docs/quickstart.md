# 从零实践指南（Quickstart）

> 仓库里收的是"武器"，本文教你**从零开第一枪**。
> 三条路线选一条即可，互不依赖。Windows 电脑优先适配，Mac/Linux 同理。
>
> 路线跑通后，回到 [workflows/](../workflows/) 挑具体业务工作流——每个工作流三件套：
> **TUTORIAL.md**（手把手实操）+ **CASES.md**（实操案例与代码示例）+
> **README.md**（凭据与步骤速览）。改造成自己的业务，用 [AI 定制提示词](../prompts/customize-workflow.md)。

## 怎么选路线

| 我想… | 走 | 大约耗时 | 花费 |
|---|---|---|---|
| 让 AI 自动处理邮件/表格/消息（最通用） | **路线一 n8n** | 30-60 分钟 | 免费（自托管）+ 按 AI 用量付费的 Key |
| 生成 AI 图片/视频 | **路线二 ComfyUI** | 30 分钟起 | 完全免费（本地跑） |
| 搭一个知识库问答机器人 | **路线三 Dify** | 45 分钟 | 免费（自托管）+ Key |

---

## 路线一：n8n —— 跑通第一个 AI 工作流（邮件摘要）

目标：新邮件到达 → AI 自动摘要分级。用仓库已收录的
[Email Summary Agent](../workflows/general-office/email-summary/)。

### 1. 安装 n8n（三选一）

**方式 A：Docker（最推荐，干净可复用）**

先装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)（安装后重启一次），然后管理员打开 PowerShell：

```powershell
docker volume create n8n_data
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

**方式 B：npm（电脑已装 Node.js 时最快）**

```powershell
npx n8n
```

**方式 C：n8n Cloud（零安装）**：注册 [n8n.io](https://n8n.io) 试用账号，在线版直接用。

**方式 D：Self-hosted AI Starter Kit（本地全家桶）**：n8n 官方维护的
[self-hosted-ai-starter-kit](https://github.com/n8n-io/self-hosted-ai-starter-kit)（15k+ star），
一条 docker compose 同时起 n8n + Ollama + Qwen 本地模型 + 数据库——
**连 AI Key 都不用申请**，适合想把整个 AI 环境装进本地的玩法。

### 2. 进入编辑器

浏览器打开 http://localhost:5678 → 首次会让你注册一个**本地管理员账号**（数据只存在你电脑上）。

### 3. 导入本仓库的工作流

1. 下载 [workflows/general-office/email-summary/workflow.json](../workflows/general-office/email-summary/workflow.json)（仓库页面点 Raw → 右键另存）
2. n8n 编辑器右上角 **⋮ → Import from File** → 选刚下载的 JSON
3. 画布上会出现 9 个节点的完整流程

### 4. 申请并配置 OpenAI Key

1. 打开 [platform.openai.com](https://platform.openai.com) 注册 → API Keys → Create new secret key → 复制保存（**只显示一次**）
2. 充值 $5 够玩很久；国内可用替代：[DeepSeek 平台](https://platform.deepseek.com)（更便宜，Key 配置方式相同，节点里把模型换成 deepseek-chat 即可）
3. n8n 里：画布任意 OpenAI 节点 → Credential → Create New → 粘贴 Key → Save

### 5. 连接 Gmail

1. 画布上 Gmail 触发节点 → Credential → Sign in with Google → 浏览器完成谷歌授权
   （国内网络环境若无法直达谷歌，可将 Gmail 节点换成 IMAP 或 QQ 邮箱节点，逻辑不变）
2. 右下角 **Active** 开关打开 ✅

### 6. 验证

给自己的邮箱发一封测试邮件 → 1-2 分钟后回来看执行记录（Executions 标签），
AI 摘要已生成。**跑通后，把画布上其他模板的工作流如法炮制即可。**

常见报错：
- `Credentials not found` → 第 4/5 步没配完，点红色感叹号节点看缺什么
- `401 Unauthorized` → Key 复制错了或没充值
- 端口占用 → `docker run` 的 5678:5678 改成 5679:5678，访问 localhost:5679

---

## 路线二：ComfyUI —— 生成第一张 AI 图

目标：文生图。用仓库已收录的 [SDXL 简洁版模板](../workflows/media/comfyui-sdxl-simple/)。

### 1. 安装 ComfyUI 桌面版

到 [ComfyUI Releases](https://github.com/comfyanonymous/ComfyUI/releases) 下载最新的
`ComfyUI_windows_portable_xxx.zip` → 解压到任意盘（路径别带中文）→ 双击
`run_nvidia_gpu.bat`（N 卡）或 `run_cpu.bat`（无独显，会慢）。
浏览器自动打开 http://127.0.0.1:8188。

> 显存参考：SDXL 建议 ≥8GB；4GB 也能跑（开 --lowvram）。

### 2. 下载模型（约 6.9GB）

SDXL 基础底模 `sd_xl_base_1.0.safetensors`：
- 国际源：[HuggingFace - stabilityai/sdxl-base-1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- 国内镜像：把链接域名 `huggingface.co` 换成 `hf-mirror.com` 即可直连

下载后放入 `ComfyUI/models/checkpoints/` 目录。

### 3. 导入模板出图

1. 下载本仓库 [workflows/media/comfyui-sdxl-simple/workflow.json](../workflows/media/comfyui-sdxl-simple/workflow.json)
2. 直接把该文件**拖进 ComfyUI 网页画布**
3. 在正向提示词框输入：`a cute cat astronaut, floating in space, cinematic lighting`
4. 点右侧 **Queue Prompt** → 等待 → 第一张 AI 图生成 🎉

跑通后进阶：换用仓库里的 [Qwen Image 模板](../workflows/media/comfyui-qwen-image-turbo-t2i/)（中文提示词更友好）、
[FLUX.3 Klein 文生图](../workflows/media/comfyui-flux3-klein-t2i/)（新一代旗舰，布局引导）或
[Wan2.1](../workflows/media/comfyui-wan-text-to-video/) / [Wan2.2](../workflows/media/comfyui-wan22-t2v/) 文生视频（8GB 显存可跑起步），模型清单在各自 README。

---

## 路线三：Dify —— 搭第一个知识库问答机器人

目标：上传公司制度 PDF → 得到一个能回答"年假怎么请"的机器人。

### 1. 安装 Dify（Docker）

前提：已装 Docker Desktop（路线一装过则复用）。

```powershell
git clone https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
docker compose up -d
```

浏览器打开 http://localhost/install → 设置管理员账号密码。

### 2. 创建知识库

1. 左侧 **知识库 → 创建知识库** → 上传你的 PDF/Word/网页
2. 一路默认下一步（分段、索引用默认即可）→ 保存并处理

### 3. 创建机器人并挂接知识库

1. **工作室 → 创建空白应用 → 聊天助手**
2. 编排页：左侧提示词写"你是公司制度助手，只根据知识库回答"，
   **上下文**处添加刚建的知识库
3. 右上角发布 → 得到网页链接，可分享给同事

进阶：导入本仓库已收录的 [Dify 智能出卷](../workflows/education/dify-question-generator/)
（9 节点完整 DSL，含两段 LLM 出题+审校），或去
[Dify Marketplace](https://marketplace.dify.ai/templates) 挑官方模板一键导入研究。

---

## 附录：API Key 申请速查

| 平台 | 地址 | 用途 | 价格参考 |
|---|---|---|---|
| DeepSeek | platform.deepseek.com | 通用 LLM（推荐起步） | 极低 |
| 智谱 GLM | open.bigmodel.cn | 国产全功能 | 有免费额度 |
| OpenAI | platform.openai.com | GPT 系列 | $5 起充 |
| Google AI Studio | aistudio.google.com | Gemini | 有免费额度 |

**安全三条**：Key 只填在平台凭据框里，绝不写进 workflow.json 再上传；不用的 Key 及时删；泄露立刻在平台吊销。

## 遇到问题

1. 先看各路线的"常见报错"
2. n8n/ComfyUI/Dify 官方文档与社区（Discord/论坛）很活跃
3. 把报错截图 + 本仓库地址发给任意 AI 助手，让它按报错定位
