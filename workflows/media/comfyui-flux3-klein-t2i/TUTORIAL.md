# 实操教程：FLUX.3 Klein 文生图

## 真机实测记录（2026-11-03）

| 项目 | 实测值 |
|---|---|
| 硬件 / 系统 | RTX 5060 Ti **16GB** · RAM 24GB · Windows |
| 软件 | ComfyUI 0.43.0 便携版 · torch 2.14.1+cu130 |
| 模型 | int8 量化四件套共 **16.5GB**（底模 5.41 + 扩写器 6.26 + 编码器 4.52 + VAE 0.31） |
| 冷启动出图 | **60 秒**（含全部模型从磁盘加载，59.1s 为纯执行） |
| 热出图（换 seed） | **36 秒**（含 Qwen3.5 提示扩写全程） |
| 峰值显存 | **15573 MiB**（nvidia-smi 实测值；卡总显存 16311 MiB——打满未 OOM，async weight offloading 生效） |
| 出图 | 1024×1024 PNG（约 1.9MB） |

**实测踩坑（真实遇到，照做能省事）**：

1. **官方权重是 HuggingFace 受限仓库（Gated）**——匿名下载报 403 `GatedRepo`。
   解法：用 BFL 官方合作组织镜像
   [`ml-resources/flux-3-image-klein-comfy`](https://huggingface.co/ml-resources/flux-3-image-klein-comfy)（文件名、体积与官方完全一致），国内再把域名换成 `hf-mirror.com`。
2. **hf-mirror 下大文件会中途断**（curl 退出码 56）：用 `curl -C -` 断点续传循环补齐，直到字节数与仓库清单精确一致（16GB 级文件实测断 2 次）。
3. **同 seed 同提示词二次 Queue 不出新文件**：新版 ComfyUI 资源系统识别相同结果复用同一文件名——想出新图先换 seed。
4. 16GB 显存跑 int8 版**够用但接近上限**（峰值 15573/16311 MiB）：别同时开其他占显存程序；爆了就关掉浏览器再试。

---

> 全程约 30-60 分钟（大头是下载四模型共 16.5GB，见上方实测记录）。int8 量化版显存友好，
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
| 模型下载 403 GatedRepo | 官方库受限：改用 [ml-resources 镜像](https://huggingface.co/ml-resources/flux-3-image-klein-comfy)，国内换 `hf-mirror.com` 域名 |
| 下载中途断（curl 退出码 56） | `curl -C - -o 文件 URL` 断点续传，循环到字节数与清单一致 |
| 未知节点 / Unknown node | ComfyUI 太旧：菜单 → 更新 ComfyUI 后重启（0.43.0 实测可用） |
| 模型加载失败 | 文件名与上表不一致；放错目录；按 R 刷新 |
| 显存 OOM | 确认用的是 int8 版底模；关闭其他占显存程序；分辨率降一档 |
| 二次 Queue 没新文件 | 同 seed 同结果被资源系统复用文件名——换 seed 再跑 |
| 布局框不生效 | 布局描述要与框一一对应；主提示词里也提到该元素 |
