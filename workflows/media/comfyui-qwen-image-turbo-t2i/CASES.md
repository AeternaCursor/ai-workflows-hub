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

## 案例 2（进阶）：电商产品图换场景——白底图一键变"生活场景大片"

场景：商家只有白底商品图，主图想要"产品放在原木桌面+晨光"的场景感。
用 Qwen-Image 的**图生图编辑**能力：保留商品本体，重绘环境。

**改造**（原 t2i 工作流改三处）：

```
1. 新增 LoadImage 接 VAE Encode(Image)——商品白底图作为输入
2. 正向提示词改"编辑指令"式写法（Qwen-Image 擅长听懂改图指令）
3. 分辨率跟随输入图（ResolutionSelector 保持与原图同比例）
```

**编辑指令式提示词（核心技巧）**：

```
保持商品（保温杯）的形状、颜色、logo 完全不变，将白色背景替换为：
原木桌面，清晨侧逆光，旁边虚化的绿植与摊开的书，浅景深，电商场景摄影
```

```
负向：改变商品形状, 变色, logo变形, 文字, 额外物体遮挡商品
```

**批量套场景**（API 模式，同商品 × 5 场景）：

```python
SCENES = ["原木桌面晨光", "户外野餐垫草地", "极简水泥台面冷光",
          "节日红色氛围彩带", "办公室键盘旁午后光"]
for s in SCENES:
    WF["37"]["inputs"]["text"] = f"保持商品完全不变，将背景替换为：{s}，电商场景摄影"
    WF["37"]["inputs"]["image"] = "upload/bo88oottle.png"   # 输入图按你的导出 ID 调整
    submit(WF)  # 提交函数见上文代码示例1
```

**质检要点**（上架前必查）：logo 是否被重绘、杯口椭圆透视、把手与高光一致性——
任何一项不对就把该场景的商品保真提示词加权（如 `(保持商品完全不变:1.3)`）。

**产出**：一张白底图 → 5 张不同场景主图，够一个 Linking 干跑一周——美工成本约为实拍的零头。

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
