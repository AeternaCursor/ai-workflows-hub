# 实操案例与代码示例：Wan 2.2 文生视频

## 案例 1：同一个"2.1 会糊"的场景，2.2 直接能用

**场景**：城市夜景车流延时（多运动主体 + 光轨）。

| 模型 | 同提示词表现 |
|---|---|
| Wan2.1 1.3B（同库已收录） | 车灯拖影粘连，建筑边缘随帧抖动 |
| Wan2.2 5B | 光轨走向稳定，建筑窗灯细节保持，可用率明显提高 |

**结论**：多主体、长时段运动场景是 2.2 的升级红利区；简单单主体场景两者差距不大，
按显存预算选即可。

## 代码示例

### 1. 文生视频 → 图生视频：只加一个节点

5B 是 ti2v 统一模型，同画布接一张首帧图就变图生视频：

```
新增：LoadImage（首帧图，分辨率与画布一致）
改接：LoadImage → Wan22ImageToVideoLatent 的图像输入（画布节点已有该输入）
其余：KSampler/shift/提示词全部不动
```

### 2. API 模式批量出片（python）

```python
import json, urllib.request

WF = json.load(open("wan22_api.json", encoding="utf-8"))
WF["KSampler节点ID"]["inputs"]["seed"] = 7        # 对照导出 ID 改
WF["Wan22ImageToVideoLatent节点ID"]["inputs"]["length"] = 49
urllib.request.urlopen(urllib.request.Request(
    "http://127.0.0.1:8188/prompt",
    data=json.dumps({"prompt": WF}).encode(),
    headers={"Content-Type": "application/json"}))
```

### 3. 成片压缩分发（ffmpeg）

```powershell
ffmpeg -i output.webm -c:v libx264 -crf 23 -pix_fmt yuv420p city.mp4
# webm → mp4 体积约 1/5，方便发群与存档
```

## 案例 2（进阶）：产品首帧图 → 动态展示视频

场景：电商详情页要一段 3 秒产品动态展示，只有一张产品精修图。

**做法**：

1. `LoadImage` 接产品图（建议 832×480 竖版一致比例）
2. 提示词写"镜头围绕产品缓慢环绕，背景微微虚化，柔光扫过瓶身"
3. 帧数 49 起步，seed 固定后微调提示词两三轮

**验收要点**：盯产品 logo 与文字——2.2 对静态元素的保持比 2.1 好，
但环绕角度大时文字仍可能变形；角度写"缓慢/轻微"可控性最高。

**产出**：详情页动图素材，替代外包拍一条 3 秒环绕视频的成本。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 ComfyUI 工程师。基于这个 Wan2.2 5B t2v 工作流改造：
1. 首帧图生视频版：新增 LoadImage 接 Wan22ImageToVideoLatent，其余保持
2. 运镜预设表：环绕/推近/拉远/横移四种提示词模板做成 MarkdownNote 贴画布
3. 输出可导入 workflow.json + 改动说明
```

迭代方向参考：首帧图生视频 / 双提示词 A-B 对比画布 / 升 14B 双模型版提画质。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
