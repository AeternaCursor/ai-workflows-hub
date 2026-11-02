# Qwen Image 2.1 Turbo 文生图

> 来源：[ComfyUI 官方模板 image_qwen_image_2_1_turbo_t2i](https://github.com/comfy-org/workflow_templates/blob/main/templates/image_qwen_image_2_1_turbo_t2i.json) · MIT

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

阿里 Qwen-Image 2.1 Turbo 两步出图：中文提示词理解强、显存占用低（int8 量化），
适合批量生成电商图与营销素材。

- **平台**：ComfyUI
- **所需模型**（按提示放入对应目录）：
  - `diffusion_models/`: `qwen_image_2.1_turbo_int8_convrot.safetensors`
  - `text_encoders/`: `qwen3.5_9b_qwen_image_2.1_pe_t2i.int8_convrot.safetensors`、`qwen3vl_8b_int8_convrot.safetensors`
  - `vae/`: `qwen_image_2.1_vae_bf16.safetensors`
- **输入**：中文/英文提示词
- **输出**：高清生成图

## 使用步骤

1. 拖入 `workflow.json`
2. Model Manager 中按缺省提示下载三个模型
3. 输入提示词 → Queue

## 提示

Turbo 版 2 步采样即出图；如需极致画质可换用非 turbo 官方模板（多步采样）。
