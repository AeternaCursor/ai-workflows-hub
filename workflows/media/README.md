# 内容创作 AI 工作流 🎬

图像、视频、语音生成 —— ComfyUI 的主场。

## 精选参考

| 工作流 | 平台 | 说明 |
|---|---|---|
| 📦 [SDXL 文生图（简洁版）](comfyui-sdxl-simple/)（已收录） | ComfyUI | 经典入门：一个底模跑通文生图 |
| 📦 [Qwen Image 2.1 Turbo 文生图](comfyui-qwen-image-turbo-t2i/)（已收录） | ComfyUI | 中文提示词友好，两步出图，int8 省显存 |
| 📦 [FLUX.3 Klein 文生图](comfyui-flux3-klein-t2i/)（已收录） | ComfyUI | 最新旗舰本地权重，布局引导 + 文本渲染强 |
| 📦 [Wan2.1 文生视频 1.3B](comfyui-wan-text-to-video/)（已收录） | ComfyUI | 8GB 显存可跑的全原生节点视频生成 |
| 📦 [Wan2.2 文生视频 5B](comfyui-wan22-t2v/)（已收录） | ComfyUI | 2.1 下一代：ti2v 统一模型，多主体运动更稳 |
| [Z-Image Turbo](https://github.com/comfyanonymous/ComfyUI_examples/tree/master/z_image) | ComfyUI | 通义蒸馏极速模型（qwen3_4b 编码），官方示例含模型清单 |
| [官方模板库](https://github.com/comfy-org/workflow_templates) | ComfyUI | 官方完整工作流 + 可复用子图（blueprints） |
| [官方工作流画廊](https://comfy.org/workflows) | ComfyUI | 按文生图 / 图生视频 / 数字人分类，一键复制 |
| [Wan2.2 视频工作流](https://docs.comfy.org/zh/tutorials/video/wan/wan2_2) | ComfyUI | 文生视频、图生视频、首尾帧（原生节点，无需自定义插件） |
| 说话人视频 | ComfyUI | Qwen3 TTS + LTX + Talkvid ID-LoRA，口型与语音一致 |

## 典型场景

- 文生图 / 图生图（海报、插画、电商图）
- 图生视频、首尾帧控制
- 数字人口播视频
- 图像超分、抠图、背景替换

## 学习路径

1. 安装 [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
2. 从 [官方画廊](https://comfy.org/workflows) 复制一个工作流
3. 工作流以 JSON 形式存储，可直接收录进本目录

## 待贡献

- [ ] 电商主图生成工作流（含商品保真）
- [ ] 口播视频全自动流水线（文案 → 语音 → 数字人）
- [ ] 批量老照片修复
