# 实操教程：SDXL 文生图（简洁版）

> 全程约 30 分钟（含下载 6.9GB 模型）。8 个节点跑通 ComfyUI 最经典流程。
> 前置：ComfyUI 已装好并打开（见 [Quickstart 路线二](../../../docs/quickstart.md)）。

## 节点全景（8 个，信号从左到右）

```
CheckpointLoaderSimple（载入底模）
→ CLIPTextEncode ×2（上面正向提示词 / 下面负向提示词）
→ EmptyLatentImage（画布尺寸）
→ KSampler（采样出图）
→ VAEDecode（潜空间→图像）
→ SaveImage（保存）
```

## 第一步：加载模型

**CheckpointLoaderSimple** 节点的下拉框选 `sd_xl_base_1.0.safetensors`。
下拉是空的 = 模型没放对位置：放 `ComfyUI/models/checkpoints/` 后点刷新（R 键）。

## 第二步：写提示词（体验核心）

- **上面那个 CLIPTextEncode**（正向）：想要什么。
  示例：`1girl, silver hair, cyberpunk city background, neon lights, ultra detailed, 8k`
- **下面那个 CLIPTextEncode**（负向）：不想要什么。
  示例：`lowres, bad anatomy, extra fingers, blurry, watermark`

中文提示词 SDXL 理解很差，请写英文（简单词组+逗号，不懂就先抄示例）。

## 第三步：尺寸与采样参数

- **EmptyLatentImage**：width 1024 / height 1024（SDXL 原生尺寸，别小于 768）
- **KSampler** 关键四项：
  - `steps`：20-30（多了慢、少了糙）
  - `cfg`：6-8（数值越高越"听话"，太高画面崩）
  - `sampler_name`：`euler` + `scheduler: normal` 起步；求稳可用 `dpmpp_2m` + `karras`
  - `denoise`：保持 1.0（图生图才动它）

## 第四步：出图

点右侧 **Queue Prompt**（或 Ctrl+Enter）→ 等进度条跑完（4090 约 3 秒，
3060 约 15 秒，CPU 模式数分钟）→ SaveImage 节点上出现缩略图，点击看大图。
图片存在 `ComfyUI/output/` 目录。

## 调参速查（出问题对照改）

| 症状 | 改法 |
|---|---|
| 人脸/手崩坏 | 负向加 `bad hands, bad anatomy`；cfg 降到 6 |
| 画面过曝/过饱和 | cfg 降到 5-6 |
| 速度太慢 | steps 降到 15-20；尺寸降到 832×832 |
| 显存不足报错 | 启动加参数 `--lowvram`；或尺寸 768 |
| 每次同参数图一样 | 正常：同 seed 同图。把 KSampler 的 seed 从 `fixed` 改 `randomize` |

## 下一步去哪

- 中文提示词友好 → 换 [Qwen Image 模板](../comfyui-qwen-image-turbo-t2i/)
- 动起来 → [Wan2.1 文生视频](../comfyui-wan-text-to-video/)
- 更多玩法 → [ComfyUI 官方画廊](https://comfy.org/workflows) 一键复制工作流
