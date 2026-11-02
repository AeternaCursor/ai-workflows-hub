# 实操案例与代码示例：Qwen Image 2.1 Turbo 文生图

## 案例 1：中文招牌图——SDXL 做不到的它一次成

**提示词（正向）**：

```
街角奶茶店门头照片，木质招牌上写着"茶野"两个大字，傍晚暖光，行人虚化背景，
手机摄影质感
```

**负向**：`低清, 文字变形, 错别字`

**产出**：1024×1024 一张，"茶野"二字笔画正确、透视自然——中文文字渲染正是
Qwen-Image 系列的强项，SDXL 同需求基本不可用。两步采样，3 秒出图。

**变体玩法**：同一构图换招牌内容批量出 5 张（改文字即可），给客户做门头方案比稿。

## 代码示例

### 1. API 批量生成（python + ComfyUI API 模式）

```python
import json, urllib.request

WF = json.load(open("qwen_api.json", encoding="utf-8"))   # 界面导出的 API 格式
texts = ["招牌写着'茶野'", "招牌写着'山雾'", "招牌写着'拾光'"]
for t in texts:
    # 对照导出文件找正向 CLIPTextEncode 的真实节点 ID（此处假设 "37"）
    WF["37"]["inputs"]["text"] = f"街角奶茶店门头照片，木质招牌上写着{t}，傍晚暖光"
    urllib.request.urlopen(urllib.request.Request(
        "http://127.0.0.1:8188/prompt",
        data=json.dumps({"prompt": WF}).encode(),
        headers={"Content-Type": "application/json"}))
print("已入队 3 个任务，输出在 ComfyUI/output/")
```

### 2. turbo 参数核心（为什么 steps=2）

```
KSampler: steps 2~4 / cfg 1~2（turbo 蒸馏模型无需高 cfg 引导）
→ 4090 单图 2-3 秒、16GB 显存 int8 版稳定跑
→ 原理：蒸馏把 20+ 步压进 2 步，多给步数反而画过头（糊/过曝）
```

### 3. 找节点 ID 的方法（改 API 脚本必会）

界面 → 右键节点 → Properties/属性面板 → `Node ID` 即 JSON 里的键；
或直接在工作流 JSON 里搜 `CLIPTextEncode` 看上下文人话内容定位。

## 用 AI 迭代这个工作流（专属提示词）

```
你是 ComfyUI 工程师。基于这个 Qwen turbo 工作流改造：
1. 批量化：接一个简单 web 表单（或读 CSV），列：主提示词×N 行，
   循环提交出图，输出按行号命名
2. 加高清放大：出图后接 UpscaleLatent 1.5x + 二次 KSampler（steps 2, denoise 0.35）
3. 输出可导入的 workflow.json + 节点连线说明
```

迭代方向参考：垫图改字（图生图改招牌）/ 产品图换背景 / 电商主图批量套模板。
通用方法见 [prompts/customize-workflow.md](../../../prompts/customize-workflow.md)。
