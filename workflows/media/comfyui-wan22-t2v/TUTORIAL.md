# 实操教程：Wan 2.2 文生视频（5B 轻量版）

> 全程约 40 分钟（含下载约 16GB 模型）。跑过 Wan2.1 的话文本编码器直接复用，
> 只需新下两个文件。前置：ComfyUI 已装好（[Quickstart 路线二](../../../docs/quickstart.md)）。

## 三个模型各就各位

统一来自 HuggingFace [`Comfy-Org/Wan_2.2_ComfyUI_Repackaged`](https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/tree/main/split_files)：

| 模型文件 | 放进目录 | 备注 |
|---|---|---|
| `wan2.2_ti2v_5B_fp16.safetensors` | `models/diffusion_models/` | 5B 统一模型（t2v+i2v） |
| `umt5_xxl_fp8_e4m3fn_scaled.safetensors` | `models/text_encoders/` | 与 Wan2.1 通用 |
| `wan2.2_vae.safetensors` | `models/vae/` | **新 VAE，别再用 2.1 的** |

按 R 刷新，CLIPLoader / UNETLoader / VAELoader 分别选中对应文件。

## 节点说明（12 个全原生节点）

```
CLIPLoader(umt5) ─→ CLIPTextEncode ×2（正/负提示）
UNETLoader(5B) ──→ ModelSamplingSD3（shift 适配）→ KSampler
VAELoader(2.2) ─────────────────────────────────→ VAEDecode → SaveWEBM / SaveAnimatedWEBP
Wan22ImageToVideoLatent（视频画布：分辨率/帧数）
```

- **Wan22ImageToVideoLatent**：2.2 专用画布节点（t2v 不接图即为纯文生视频；
  接 LoadImage 即变图生视频——5B 统一架构的好处）
- **ModelSamplingSD3**：shift 参考 2.1 经验设 5.0 上下微调
- **KSampler**：steps 20-30、cfg 3-5、seed 随机，与 2.1 用法一致
- 两个保存节点二选一即可：WebM 体积小，WEBP 兼容好

## 写视频提示词

与 Wan2.1 同路数：**镜头语言 > 主体形容词**。

```
城市夜景延时摄影，车流光轨流动，镜头缓慢推进，霓虹反光在湿漉漉的路面，
电影感，写实风格
```

2.2 对多主体运动的一致性比 2.1 明显更好，可以放心写"人群穿行""多辆车交汇"
这类 2.1 容易糊的场景。

## 生成与查看

1. 先用短帧（如 33 帧）低分辨率跑通，确认模型全部加载正常
2. 满意提示词后再升分辨率/帧数出正片
3. 输出在 `ComfyUI/output/`，webm 用浏览器或 VLC 播放

## 常见报错

| 报错 | 解法 |
|---|---|
| 显存 OOM | 降分辨率、减帧数；启动加 `--lowvram` |
| 画面色彩异常/灰蒙蒙 | VAE 用错：确认 `wan2.2_vae`，不是 2.1 的 |
| 未知节点 Wan22ImageToVideoLatent | 更新 ComfyUI 到较新版本 |
| 运动幅度小/呆滞 | 提示词加运镜词；shift 微调；提高 cfg 上限试探 |
