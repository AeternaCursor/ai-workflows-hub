# 仓库使用说明

> 面向三类读者：**找现成工作流的人**、**想贡献的人**、**维护者（你）**。

## 一分钟了解

| 你想做什么 | 去哪里 |
|---|---|
| 找可直接导入的 AI 工作流模板 | [resources/template-collections.md](resources/template-collections.md) → 按平台挑 → 导入 |
| 按行业找（金融/营销/电商…） | [workflows/](workflows/) 对应行业目录 |
| 了解 AI 发展史（动画时间线） | [timeline/index.html](timeline/index.html)（浏览器打开） |
| 选工作流平台（n8n/Dify/Coze…） | [resources/platforms.md](resources/platforms.md) |
| 看行业标杆实现 | [resources/industry-references.md](resources/industry-references.md) |
| 让 AI 帮我更新这个仓库 | [prompts/update-hub.md](prompts/update-hub.md) |

## 目录结构

```
ai-workflows-hub/
├── README.md            # 门户：行业×平台双索引
├── USAGE.md             # 本文件
├── CHANGELOG.md         # 更新日志
├── CONTRIBUTING.md      # 贡献格式规范
├── workflows/           # 10 个行业目录（每个含精选参考+待贡献清单）
├── resources/           # 平台对比 / 模板合集 / 行业标杆
├── timeline/            # AI 发展史动画时间线（data.js + index.html）
├── prompts/             # AI 维护提示词
└── .github/workflows/   # 定时任务（每周动态捕捉提醒）
```

## 场景一：我要用现成的工作流

1. 打开 [resources/template-collections.md](resources/template-collections.md)
2. 按你的平台选入口（n8n 官方库 / ComfyUI 画廊 / Dify Marketplace…）
3. 导入模板 → 替换凭据（API Key 等）→ 运行
4. n8n：编辑器 → Workflows → Import from File；ComfyUI：直接拖 JSON 进画布

## 场景二：我要贡献工作流

见 [CONTRIBUTING.md](CONTRIBUTING.md)，核心格式：

```
workflows/<行业>/<工作流名>/
├── README.md        # 平台、凭据、输入输出、使用步骤
├── workflow.json    # 平台导出文件
└── assets/          # 可选截图
```

## 场景三：维护者日常更新（推荐流程）

AI 领域变化快，本仓库设计了**三层维护机制**，保证可持续：

```
每周一 09:00（北京时间）
   GitHub Actions 自动创建周报 Issue（.github/workflows/weekly-digest.yml）
        ↓
   打开 Issue → 复制 prompts/update-hub.md 全文 → 粘贴给 AI 助手
   （Claude Code / Codex / Cursor / Trae 均可，需具备联网搜索权限）
        ↓
   AI 按提示词执行：检索本周动态 → 筛选 → 更新文件 → 生成变更摘要
        ↓
   你审阅改动 → git commit & push（或让 AI 提 PR）
```

- 提示词本体：[prompts/update-hub.md](prompts/update-hub.md)
- 更新日志：每次维护后在 [CHANGELOG.md](CHANGELOG.md) 追加一行
- 注意：GitHub 的纯定时 workflow 在仓库 **60 天无活动后会被自动禁用**，
  收到禁用邮件时点一下 Enable 即可，或任意 commit 都会重置计时

## 时间线的查看与扩展

- **查看**：双击 [timeline/index.html](timeline/index.html)（无需服务器），或访问 GitHub Pages
- **加事件**：编辑 [timeline/data.js](timeline/data.js)，格式见 [timeline/README.md](timeline/README.md)
- 时间线是数据驱动的：加一条 JS 对象即可，页面自动排序、渲染、着色

## 维护原则（保持仓库不腐化）

1. **宁缺毋滥**：只收录可运行、可验证的条目；失效链接及时删除
2. **单一职责**：资源导航（resources/）与工作流本体（workflows/）分开存放
3. **数据驱动**：时间线只改 data.js，不改页面代码
4. **每次变更留痕**：CHANGELOG 一行 + 清晰的 commit message
