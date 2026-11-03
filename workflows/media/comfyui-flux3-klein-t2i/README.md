# FLUX.3 Klein 文生图（int8 量化版）

> 来源：[ComfyUI 官方模板 image_flux3_klein_t2i](https://github.com/comfy-org/workflow_templates/blob/main/templates/image_flux3_klein_t2i.json) · MIT
> 🧪 实测状态：workflow 文件为官方原版（导入即用）；教程为文档级（参数依据官方文档编写，未逐机真机验证）

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

黑森林实验室 FLUX.3 Klein 本地权重文生图，int8 量化底模显存友好。
内置 Qwen3.5 提示增强器（多语言提示词友好）与布局引导（画布上框定区域、
每个区域单独描述），文本渲染与多元素排版是强项。

- **平台**：ComfyUI（需较新版本，见 TUTORIAL）
- **所需模型**（HuggingFace: `black-forest-labs/flux-3-image-klein-comfy`）：
  - `diffusion_models/`: `flux3-image-klein-base-int8-convrot.safetensors`（24GB+ 显存可换 bf16 版提画质）
  - `text_encoders/`: `qwen3.5_9b_flux3_prompt_upsampler_w4a8.safetensors` + `qwen3vl_4b_int8_convrot.safetensors`
  - `vae/`: `flux2-vae.safetensors`
- **输入**：提示词（可选：布局框 + 各区域描述）
- **输出**：1024P 级图像（分辨率由 ResolutionSelector 决定）

## 使用步骤

1. 拖入 `workflow.json`
2. 按 TUTORIAL 下载四个模型文件放入对应目录
3. 写提示词 → Queue；要控布局时用 CreateBoundingBoxes 框区域

## 注意

- 核心管线封装在子图（Subgraph）里，双击可进入查看，无需改动即可运行
- int8 量化版为官方推荐起步配置；显存富余（24GB+）换 bf16 权重画质更佳
