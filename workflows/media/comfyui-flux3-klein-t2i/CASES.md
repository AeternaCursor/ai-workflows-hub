# 实操案例与代码示例：FLUX.3 Klein 文生图

> 说明：案例 1/2 为演示性构造（输入输出格式真实合理）；「代码示例」三节与
> 文件顶部 README 的实测数据均来自 2026-11-03 真机运行（RTX 5060 Ti 16GB）。

## 案例 1：同一句需求，普通出图 vs 布局引导出图

**需求**：电商海报，护肤瓶居中、logo 左上、底部一行小字。

| 方式 | 输入 | 结果 |
|---|---|---|
| 普通文生图 | 只写整句提示词 | 构图随机，logo 位置漂移，常和产品重叠 |
| 布局引导 | 提示词 + 三个框（左上=logo、中央=产品、底部=文字区） | 元素各就各位，三次出图两次可直接用 |

**结论**：元素多、位置有要求的海报类需求，布局框从"抽卡"变"摆盘"——
这是 FLUX.3 相对上代最实用的增量能力。

## 代码示例（以下方法均经真机实测，RTX 5060 Ti 16GB）

### 1. 官方只给了 UI 格式？从 /history 导出 API 格式（实测可用）

官方模板是 UI 格式（含子图），`/prompt` 接口只认 API 格式。实测解法：
**界面里先跑成功一次**，然后从历史接口把服务器端展开好的 API workflow 拿回来：

```powershell
# 1) 列出执行历史，取一条 success 的 prompt_id
curl http://127.0.0.1:8188/history?max_items=5
# 2) 取该次执行的第 [2] 个元素（prompt[2] 即展开后的 API workflow，子图节点形如 "18:7"）
curl http://127.0.0.1:8188/history/<prompt_id> -o hist.json
```

### 2. 换 seed 批量出图（node，实测 36s/张）

```javascript
const fs = require('fs'), http = require('http');
const wf = JSON.parse(fs.readFileSync('flux3_api.json', 'utf8')); // 上一步导出的
wf['18:7'].inputs.seed = Math.floor(Math.random() * 2 ** 48);     // 18:7 = 子图内 KSampler
const body = JSON.stringify({ prompt: wf, client_id: 'runner' });
const req = http.request({ hostname: '127.0.0.1', port: 8188, path: '/prompt',
  method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
  let d = ''; res.on('data', c => d += c);
  res.on('end', () => console.log('queued', JSON.parse(d).prompt_id));
});
req.write(body); req.end();
// 注意：同 seed 同提示词不会生成新文件（资源系统复用文件名），批量务必换 seed
```

### 3. 出图后统一压缩发审（PowerShell + magick）

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
