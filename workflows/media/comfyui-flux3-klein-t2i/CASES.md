# 实操案例与代码示例：FLUX.3 Klein 文生图

## 案例 1：同一句需求，普通出图 vs 布局引导出图

**需求**：电商海报，护肤瓶居中、logo 左上、底部一行小字。

| 方式 | 输入 | 结果 |
|---|---|---|
| 普通文生图 | 只写整句提示词 | 构图随机，logo 位置漂移，常和产品重叠 |
| 布局引导 | 提示词 + 三个框（左上=logo、中央=产品、底部=文字区） | 元素各就各位，三次出图两次可直接用 |

**结论**：元素多、位置有要求的海报类需求，布局框从"抽卡"变"摆盘"——
这是 FLUX.3 相对上代最实用的增量能力。

## 代码示例

### 1. 批量出图换 seed（python，API 模式）

```python
import json, urllib.request, random

WF = json.load(open("flux3_api.json", encoding="utf-8"))  # 导出 API 格式后用
for i in range(4):
    WF["KSampler_node_id"]["inputs"]["seed"] = random.randint(0, 2**32)
    # 节点 ID 在导出的 json 顶层 key 里找，逐个对照改
    urllib.request.urlopen(urllib.request.Request(
        "http://127.0.0.1:8188/prompt",
        data=json.dumps({"prompt": WF}).encode(),
        headers={"Content-Type": "application/json"}))
# 4 张在 ComfyUI/output/，挑最好的 seed 固定下来再精修
```

### 2. 出图后统一压缩发审（PowerShell + magick）

```powershell
magick mogrify -path .\review -resize 1600x -quality 88 *.png
# 原图 3-6MB → 审阅用 300-600KB，微信/飞书发图不糊不慢
```

## 案例 2（进阶）：中英双提示词的增强红利

Qwen3.5 提示增强器意味着**中文直写也能出好图**，不必先翻译成英文咒语：

| 提示词写法 | 出图观感 |
|---|---|
| 英文逐标签堆砌（sd3 时代习惯）`product photo, skincare bottle, water drops...` | 稳定但构图平淡 |
| 中文自然句（同需求直写） | 细节描述更具体（"水珠沿瓶身滑落"），质感层次更好 |

**要点**：写"摄影指令"而不是"标签串"——光线方向、材质、镜头距离交代越具体，
增强器发挥空间越大。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 ComfyUI 工程师。基于这个 FLUX.3 Klein t2i 工作流改造：
1. 图生图版：新增 LoadImage，接入子图的参考图输入（如子图未暴露该输入，
   说明如何把子图展开后接 VAEEncode）
2. 海报模板化：把"电商海报"布局固化成 4 个预设框位，输出修改说明 + 新 json
3. 保持 int8 底模与其余参数不变
```

迭代方向参考：图生图改稿 / 批量 seed 筛图 / 分辨率与清晰度档位预设。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
