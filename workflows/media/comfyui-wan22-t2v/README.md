# Wan 2.2 文生视频（5B 轻量版）

> 来源：[ComfyUI 官方示例 text_to_video_wan22_5B](https://github.com/comfyanonymous/ComfyUI_examples/blob/master/wan22/text_to_video_wan22_5B.json) · MIT

> 📖 手把手实操：[TUTORIAL.md](TUTORIAL.md)
> 🧪 实操案例与代码：[CASES.md](CASES.md)

阿里通义万相 Wan2.2 5B 文生视频，是本库已收录
[Wan2.1 1.3B](../comfyui-wan-text-to-video/) 的下一代升级：
5B 单模型同时支持文生视频与图生视频（ti2v 统一架构），画质与运动连贯性显著提升，
仍是全原生节点、无需自定义插件。

- **平台**：ComfyUI
- **所需模型**（HuggingFace: `Comfy-Org/Wan_2.2_ComfyUI_Repackaged`）：
  - `diffusion_models/`: `wan2.2_ti2v_5B_fp16.safetensors`
  - `text_encoders/`: `umt5_xxl_fp8_e4m3fn_scaled.safetensors`（与 Wan2.1 通用）
  - `vae/`: `wan2.2_vae.safetensors`（**新 VAE，与 2.1 的 `wan_2.1_vae` 不通用**）
- **输入**：视频描述提示词
- **输出**：480P 级短视频（WebM/WEBP）

## 使用步骤

1. 拖入 `workflow.json`
2. 下载三个模型放入对应目录（文本编码器若跑过 Wan2.1 可复用）
3. 写提示词 → Queue

## 注意

- 5B 显存需求高于 2.1 1.3B：8GB 卡建议低分辨率短帧起步
- 要更高画质可换官方 14B 双模型版（high/low noise 两个文件），见
  [官方 Wan2.2 文档](https://docs.comfy.org/zh/tutorials/video/wan/wan2_2)
