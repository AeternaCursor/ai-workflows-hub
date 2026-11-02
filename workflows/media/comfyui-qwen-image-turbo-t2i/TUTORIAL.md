# 实操教程：Qwen Image 2.1 Turbo 文生图

> 全程约 40 分钟（含下载三个模型，共约 25GB）。int8 量化版 16GB 显存即可流畅跑，
> 两步采样出图，中文提示词直出。
> 前置：ComfyUI 已装好（见 [Quickstart 路线二](../../../docs/quickstart.md)）。

## 三个模型各就各位（最容易错的一步）

模板右侧有 MarkdownNote 说明，对照放：

| 模型文件 | 放进目录 |
|---|---|
| `qwen_image_2.1_turbo_int8_convrot.safetensors` | `models/diffusion_models/` |
| `qwen3.5_9b_qwen_image_2.1_pe_t2i.int8_convrot.safetensors` | `models/text_encoders/` |
| `qwen3vl_8b_int8_convrot.safetensors` | `models/text_encoders/` |
| `qwen_image_2.1_vae_bf16.safetensors` | `models/vae/` |

国内下载：HuggingFace 域名换成 `hf-mirror.com` 直连。放完按 R 刷新，
三个 Loader 节点（UNET/CLIP/VAE）下拉能选中即就位。

## 节点说明（模板已调好参数，主要认识即可）

- **ResolutionSelector**：预设分辨率选择（1024 档起步，含竖图/横图）
- **KSampler**：Turbo 特性——steps 只需 **2-4 步**，cfg 固定小值（勿照 SDXL 经验调高）
- **SaveImageAdvanced**：保存进阶版（可自定输出目录/命名）

## 中文提示词写法（Qwen 强项）

直接写自然中文，越具体越好：

```
正面（CLIPTextEncode 上）：一只橘猫坐在窗台看雨，玻璃上的水珠，暖色调逆光，
  摄影感，浅景深
负面（下）：低清，变形，多余的手指，文字
```

写人像/中文招牌文字的正确率明显高于 SDXL——招牌文字提示词可加
`画面中招牌文字写着"茶颜悦色"` 这类指令。

## 出图与调参

1. 选好分辨率 → Queue Prompt → 两步采样很快（4090 约 2-3 秒）
2. 速度慢/显存爆 → ResolutionSelector 降一档；确认下的是 int8 模型
3. 画面太"听话"发僵 → steps 提到 4，或提示词加些随机感描述

## 常见报错

| 报错 | 解法 |
|---|---|
| Loader 下拉没模型 | 放错目录；对照上表；刷新 R |
| `weight dtype` 报错 | ComfyUI 版本旧，更新到新版 |
| 中文全出来乱图 | text_encoders 两个文件只放了一个，缺 visual encoder |
| Turbo 出图慢 | steps 被 you 调到 20+，回 2-4 |
