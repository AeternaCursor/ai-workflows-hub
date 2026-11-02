# Wan2.1 文生视频（1.3B 轻量版）

> 来源：[ComfyUI 官方模板 text_to_video_wan](https://github.com/comfy-org/workflow_templates/blob/main/templates/text_to_video_wan.json) · MIT

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)

阿里通义万相 Wan2.1 1.3B 文生视频，消费级显卡（8GB 显存）可跑，
全部使用原生节点，无需安装自定义插件。

- **平台**：ComfyUI
- **所需模型**（按提示放入对应目录）：
  - `diffusion_models/`: `wan2.1_t2v_1.3B_fp16.safetensors`
  - `text_encoders/`: `umt5_xxl_fp8_e4m3fn_scaled.safetensors`
  - `vae/`: `wan_2.1_vae.safetensors`
- **输入**：视频描述提示词
- **输出**：480P 短视频（MP4/WebP）

## 使用步骤

1. 拖入 `workflow.json`
2. 下载三个模型文件放入对应目录
3. 输入提示词 → Queue（1.3B 版生成速度较快）

## 注意

- Apache 协议模型，商用需遵守原协议
- 显存紧张时降低分辨率或帧数
