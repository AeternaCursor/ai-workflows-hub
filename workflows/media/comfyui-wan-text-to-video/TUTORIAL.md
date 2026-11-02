# 实操教程：Wan2.1 文生视频（1.3B 轻量版）

> 全程约 45 分钟（含下载三个模型，共约 13GB）。8GB 显存可跑 480P，
> 全原生节点，无需装任何自定义插件。
> 前置：ComfyUI 已装好（见 [Quickstart 路线二](../../../docs/quickstart.md)）。

## 三个模型各就各位

| 模型文件 | 放进目录 |
|---|---|
| `wan2.1_t2v_1.3B_fp16.safetensors` | `models/diffusion_models/` |
| `umt5_xxl_fp8_e4m3fn_scaled.safetensors` | `models/text_encoders/` |
| `wan_2.1_vae.safetensors` | `models/vae/` |

按 R 刷新，CLIPLoader / UNETLoader / VAELoader 三个节点分别选中对应文件。

## 节点说明

```
CLIPLoader(umt5) ─┐
UNETLoader(1.3B) → ModelSamplingSD3（视频采样适配）→ KSampler
VAELoader ─────────────────────────────────────────→ VAEDecode → CreateVideo → SaveVideo
EmptyHunyuanLatentVideo（视频画布：分辨率/帧数/帧率）
```

- **EmptyHunyuanLatentVideo**：width 480 / height 832（竖屏）/ length **49 帧**
  （约 5 秒 @24fps。显存紧张降到 33 帧 ≈ 3 秒）
- **ModelSamplingSD3**：shift 建议 5.0（1.3B 模型官方推荐）
- **KSampler**：steps 20-30、cfg 3-5、sampler `uni_cc` 或 `euler`，seed 随机

## 写视频提示词

Wan 对**镜头语言**敏感，描述里带上运镜出片率高很多：

```
一只金毛犬在海边奔跑，镜头低角度跟随，慢动作，浪花飞溅，
黄昏金色阳光，电影感，写实风格
```

常用镜头词：`推近`、`拉远`、`平移`、`跟随镜头`、`慢动作`、`航拍视角`。

## 生成与查看

1. Queue Prompt → 4090 约 2-4 分钟，3060 约 10-20 分钟（49 帧 480P）
2. SaveVideo 输出在 `ComfyUI/output/`，webm/mp4 直接双击播放
3. 首次满意前别追长帧数——先用 33 帧快速迭代提示词，定了再出 49+ 帧

## 常见报错

| 报错 | 解法 |
|---|---|
| 显存 OOM | 帧数降 33、分辨率降 416×720；启动加 `--lowvram` |
| 视频糊成色块 | KSampler cfg 过高，降到 3-5；shift 未设 5 |
| 生成中断在 90% | 显存临界：减小 length 后重跑 |
| 播放器打不开 | 输出 webm，用 VLC/浏览器打开 |
