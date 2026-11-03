# SDXL 文生图（简洁版）

> 来源：[ComfyUI 官方模板 image_sdxl_simple](https://github.com/comfy-org/workflow_templates/blob/main/templates/image_sdxl_simple.json) · MIT · 11 KB
> 🧪 实测状态：workflow 文件为官方原版（导入即用）；教程为文档级（参数依据官方文档编写，未逐机真机验证）

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

最经典的 SDXL 文生图工作流：提示词 → KSampler → VAE 解码 → 保存。
节点少、结构清晰，是学习 ComfyUI 的标准起点。

- **平台**：ComfyUI
- **所需模型**：`sd_xl_base_1.0.safetensors`（SDXL 基础底模）
- **触发方式**：手动（Queue Prompt）
- **输入**：正向/负向提示词
- **输出**：1024×1024 PNG

## 使用步骤

1. ComfyUI 中导入 `workflow.json`（拖入画布即可）
2. 缺少模型时按提示下载，放入 `models/checkpoints/`
3. 修改提示词 → Add Prompt → Queue
