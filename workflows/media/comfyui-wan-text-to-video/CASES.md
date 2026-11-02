# 实操案例与代码示例：Wan2.1 文生视频

## 案例 1：同主体三种镜头语言，出片率天差地别

**主体**：金毛犬海边奔跑。改的只是镜头描述：

| 提示词镜头部分 | 生成结果（49帧 480P） |
|---|---|
| `固定机位，狗狗奔跑` | 平淡，狗跑出画面 |
| `低角度跟随镜头，慢动作，浪花飞溅` | 电影感，毛发与水珠细节在线 |
| `航拍视角拉远，海岸线全景` | 大场面，主体变小但氛围拉满 |

**结论**：Wan 对运镜词敏感——写"跟随/推近/慢动作"比堆主体形容词更能提质量。

## 代码示例

### 1. 帧数与时长换算（EmptyHunyuanLatentVideo 的 length）

```
length(帧) ÷ fps(24) = 秒数
49帧 ≈ 2.0s … 常用错；Wan 帧率按 16fps 计：49÷16 ≈ 3s、81÷16 ≈ 5s
显存参考（1.3B, 480P）：33帧≈6GB / 49帧≈7GB / 81帧≈11GB
```

### 2. API 模式提交视频生成（python）

```python
import json, urllib.request

WF = json.load(open("wan_api.json", encoding="utf-8"))
WF["6"]["inputs"]["text"] = "低角度跟随镜头，金毛犬海边奔跑，慢动作，浪花飞溅，黄昏"
WF["16"]["inputs"]["length"] = 49        # 对照导出 ID 改：16=EmptyHunyuanLatentVideo
WF["31"]["inputs"]["seed"] = 42          # KSampler
urllib.request.urlopen(urllib.request.Request(
    "http://127.0.0.1:8188/prompt",
    data=json.dumps({"prompt": WF}).encode(),
    headers={"Content-Type": "application/json"}))
# 视频在 ComfyUI/output/，进度看界面队列；4090 约 3 分钟
```

### 3. 出片后处理：一键转 mp4 + 压体积（ffmpeg）

```powershell
ffmpeg -i output.webm -c:v libx264 -crf 23 -pix_fmt yuv420p gold.mp4
# webm 40MB → mp4 8MB，方便发群/存档
```

## 用 AI 迭代这个工作流（专属提示词）

```
你是 ComfyUI 工程师。基于这个 Wan2.1 1.3B 文生视频工作流改造：
1. 图生视频版：新增 LoadImage 节点接 VAE Encode(Image)，替换 EmptyLatent，
   首帧用我给的图，保持其余参数
2. 镜头预设：把三种运镜提示词做成 MarkdownNote 速查表贴进画布
3. 输出可导入的 workflow.json + 连线说明（哪个节点替换了哪个）
```

迭代方向参考：首尾帧控制 / 首帧图+提示词组合出广告短片 / 换 14B 模型提画质。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
