# 实操教程：FLUX.3 Klein 文生图

> 全程约 30-60 分钟（大头是下载约 20GB 模型）。int8 量化版显存友好，
> 16GB 级显卡即可起步；24GB+ 建议换 bf16 权重。
> 前置：ComfyUI 已装好并**更新到较新版本**（见 [Quickstart 路线二](../../../docs/quickstart.md)）——
> FLUX.3 节点较新，旧版 ComfyUI 会报"未知节点"。

## 四个模型各就各位

统一来自 HuggingFace 仓库 [`black-forest-labs/flux-3-image-klein-comfy`](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy)：

| 模型文件 | 放进目录 |
|---|---|
| `diffusion_models/flux3-image-klein-base-int8-convrot.safetensors` | `models/diffusion_models/` |
| `text_encoders/qwen3.5_9b_flux3_prompt_upsampler_w4a8.safetensors` | `models/text_encoders/` |
| `text_encoders/qwen3vl_4b_int8_convrot.safetensors` | `models/text_encoders/` |
| `vae/flux2-vae.safetensors` | `models/vae/` |

按 R 刷新，三个加载器节点分别选中对应文件。
显存 24GB+：把底模换成 `flux3-image-klein-base-bf16.safetensors`（同仓库 `diffusion_models/`）。

## 节点说明

```
提示词 ─→ Flux3LayoutPrompt（提示组装，可接布局框）
                                        │
CreateBoundingBoxes（可选：画布上框区域）─┤
                                        ↓
                              [子图 Subgraph：核心生成管线]
                              （Qwen3.5 提示增强 → 编码 → 采样 → 解码）
                                        ↓
ResolutionSelector（选分辨率）    PreviewAny（预览中间结果）
                                        ↓
                                   SaveImage
```

- **子图（Subgraph）**：官方把"增强→编码→采样→解码"整条管线封装成一个可复用模块，
  双击进入可看内部节点；日常使用不用动它。概念见
  [官方 Subgraph 文档](https://docs.comfy.org/interface/features/subgraph)
- **Flux3LayoutPrompt**：把主提示词与各布局区域的描述组装成模型输入
- **CreateBoundingBoxes**：在画布上拖框，让指定元素出现在指定位置（不框则普通文生图）
- **ResolutionSelector**：下拉切换输出分辨率

## 写提示词

FLUX.3 系提示词写**自然语言整句**效果最好（Qwen3.5 增强器对中英文都友好）：

```
一张电商海报：深绿色背景，中央是磨砂玻璃质感的护肤瓶，水珠沿瓶身滑落，
左上角留白放logo，柔和棚拍光，产品摄影质感，超清晰
```

用布局框时，每个框写该区域的元素描述（"左上角：品牌 logo"），主提示词写整体风格。

## 生成与查看

1. Queue Prompt → 出图在 `ComfyUI/output/`
2. 对比不同 seed：固定提示词只换 seed，挑构图最好的一张再精修
3. 文字类需求（海报/封面）优先用 FLUX.3——文本渲染是这一代的主打能力

## 常见报错

| 报错 | 解法 |
|---|---|
| 未知节点 / Unknown node | ComfyUI 太旧：菜单 → 更新 ComfyUI 后重启 |
| 模型加载失败 | 文件名与上表不一致；放错目录；按 R 刷新 |
| 显存 OOM | 确认用的是 int8 版底模；分辨率降一档 |
| 布局框不生效 | 布局描述要与框一一对应；主提示词里也提到该元素 |
