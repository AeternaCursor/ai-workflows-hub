# 实操案例与代码示例：SDXL 文生图

## 案例 1：同一提示词，三组参数三种风格

**基准提示词**：

```
正向：a samurai standing in the rain, neon city background, cinematic lighting, ultra detailed
负向：lowres, bad anatomy, blurry, watermark
```

| 组 | KSampler 参数 | 出图效果 | 用途 |
|---|---|---|---|
| A | steps 25 / cfg 7 / euler+normal | 写实电影感，细节稳 | 最终出图 |
| B | steps 15 / cfg 4 / dpmpp_2m+karras | 速度快 40%，画风偏柔和 | 批量初筛构图 |
| C | steps 30 / cfg 10 / euler_ancestral | 色彩浓烈但手部易崩 | 抽卡赌风格 |

**实操结论**：先 B 低成本抽 8 张选构图 → 记下 seed → 换 A 精修同一 seed。
这是老玩家的标准两段式出图法。

## 代码示例

### 1. 批量出图脚本（ComfyUI API 模式，python 提交本工作流）

```python
import json, urllib.request

# 先在界面里：Settings→Enable Dev mode→Export (API)，存为 workflow_api.json
WF = json.load(open("workflow_api.json", encoding="utf-8"))

prompts = ["a cat astronaut in space", "a fox in a library, reading"]
for p in prompts:
    WF["6"]["inputs"]["text"] = p              # "6"=正向CLIPTextEncode 的节点ID，对照你的导出文件改
    WF["3"]["inputs"]["seed"] = 20261102       # KSampler 的 seed
    req = urllib.request.Request("http://127.0.0.1:8188/prompt",
        data=json.dumps({"prompt": WF}).encode(),
        headers={"Content-Type": "application/json"})
    print(urllib.request.urlopen(req).read().decode()[:80])  # 返回 prompt_id 即入队成功
```

### 2. 定格随机灵感：seed 从"固定"改"随机化"的界面操作

KSampler 节点 → `seed` 右侧 `control_after_generate` 下拉 → 选 **randomize**。
每次 Queue 自动换 seed，适合抽卡；选中某张后把它的 seed 抄回来固定精修。

### 3. 显存不够的启动参数（改 run_nvidia_gpu.bat 末行）

```bat
python -s ComfyUI\main.py --lowvram
:: 8GB 以下再加 --force-fp16；爆 OOM 优先降尺寸到 832x832
```

## 案例 2（进阶）：ControlNet 姿态控制——构图不再靠抽卡

场景：要"人物单膝跪地、仰视镜头"的构图——纯提示词抽 50 张也未必中。
用 OpenPose 骨架图**钉死姿势**，SDXL 只负责画风。

**改造**（在本工作流上加 4 个节点）：

```
新增：LoadImage（骨架图）→ ControlNetLoader（模型：control_v11p_sd15_openpose
      或 SDXL 专用 controlnet-union-sdxl）
     → ControlNetApplyAdvanced（strength 0.8）
接线：ControlNetApply 的 IMAGE 出 → 原 EmptyLatentImage 位置
     （EmptyLatent 可删；conditioning 双向都过 ControlNet）
```

**骨架图怎么来**：
- 方法 A：网上搜 "openpose 骨架素材"（现成姿势图库很多，跪姿/奔跑/双人构图都有）
- 方法 B：自己的照片跑一次 openpose 提取（ComfyUI 有 OpenPosePreprocessor，装 comfyui_controlnet_aux 即可）

**提示词变化**（姿势交给图，提示词只写画风与服装）：

```
正向：1girl, silver armor, kneeling pose (由骨架控制), neon city, cinematic lighting
负向：不加姿势词，避免与骨架打架
```

**参数要点**：

| 参数 | 建议值 | 说明 |
|---|---|---|
| ControlNet strength | 0.7-0.9 | 太低姿势漂，太高画风僵 |
| KSampler cfg | 5-6 | 有 ControlNet 引导后可降 |
| 采样器 | dpmpp_2m + karras, steps 25 | 控制图会让收敛更稳 |

**产出对比**：同提示词无 ControlNet 抽 20 张命中 1 张跪姿；加骨架 20 张命中 18 张——
构图确定性从抽卡变成**点菜**。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 ComfyUI 工程师。基于这个 SDXL 简洁工作流帮我改造：
1. 加 LoRA 支持：新增 LoraLoader 节点（lora 文件名占位），权重 0.8，
   接在 Checkpoint 之后、CLIP 编码之前，并说明 wiring
2. 加放大二次精修链：UpscaleLatent(1.5x) → 第二个 KSampler(denoise 0.4)
3. 输出可直接导入的 workflow.json + 连线说明图（文字版）
```

迭代方向参考：图生图垫图 / ControlNet 姿态控制 / 区域重绘 inpainting。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
