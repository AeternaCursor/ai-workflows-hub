# 实操教程：发票识别校验与入账

> 全程约 50 分钟。跑通后：把发票 PDF 放进指定文件夹 → OCR/AI 提取字段 →
> 与 Google Sheets 主数据校验一致性 → 结果写台账、异常标记。
> 前置：n8n 已运行 + Google 账号。

## 你需要准备

- [ ] OpenRouter API Key（openrouter.ai 注册即得，充值 $5；模型选带视觉的
      `google/gemini-flash-1.5` 或 `openai/gpt-4o-mini`，便宜）
- [ ] 两张 Google Sheet：
  - **发票台账**：表头 `唯一键 | 日期 | 供应商 | 税号 | 金额(含税) | 校验结果 | 异常说明`
  - **主数据**：表头 `供应商 | 税号 | 合同号 | 银行账号`（先手填 3-5 家你常打交道的）

## 第一步：认识流程（3 阶段）

```
触发：When clicking 'Test workflow'（手动触发，正式用可换成文件夹监听/邮件附件）
提取：Read/Write Files from Disk（读发票PDF）→ Extract from File（PDF文本）
     → If（有无文字层？无→ Text Extractor(Agent+视觉模型) OCR 兜底）
校验：Fetch Master Data（拉主数据）→ Validation（Code 比对税号/金额）
     → Generate Unique Key → Post-Processing
落账：Send Invoice Data（写台账）→ Update Results（回写校验结论）
```

## 第二步：配两个凭据

1. **OpenRouter**：点 OpenRouter Chat Model 节点 → Create New → 粘 Key；
   Model 栏填 `google/gemini-flash-1.5`。
2. **Google Sheets OAuth**：Fetch Master Data / Send Invoice Data / Update Results
   三个节点共用一个谷歌凭据（需 Cloud 启用 Sheets API）。

## 第三步：挂接两张表

- Fetch Master Data → Document 选**主数据**表
- Send Invoice Data → Document 选**发票台账**表，Mapping 按表头对齐
- Update Results → 同台账表，更新"校验结果/异常说明"两列

## 第四步：准备测试发票

1. 建文件夹 `C:\invoices\`，放 2-3 张 PDF 发票（含一张主数据里有的供应商，
   一张没有的——用来看异常路径）
2. Read/Write Files from Disk 节点：路径改 `C:\invoices\*.pdf`

## 第五步：定制校验规则（关键）

点开 **Validation**（Code 节点），默认逻辑是"发票税号必须能在主数据匹配"。
按你的业务改，常见加码：

```javascript
// 金额与合同阈值比对
if (Number(invoice.amount) > 10000 && !invoice.approved) {
  result.异常说明 = '金额超1万需人工审批';
}
// 连号检查、重复报销检查（查台账唯一键是否已存在）同理可加
```

## 第六步：试跑与上线

1. **Test workflow** → 全绿后打开台账表：两张发票各一行，
   有主数据的显示"通过"，没有的显示异常原因 ✅
2. 正式运行改造（二选一）：
   - 邮件收票：删手动触发，加 **Gmail Trigger + 附件下载** 节点（推荐）
   - 定时扫目录：手动触发换成 Schedule Trigger 每小时跑一次

## 常见报错

| 报错 | 解法 |
|---|---|
| OCR 提取字段为空 | 扫描件质量差：换 gpt-4o 模型；或在提示词里给出字段示例 |
| Sheets 定位列失败 | 表头名与 Mapping 完全一致（别带空格） |
| 重复入账 | Generate Unique Key 用"税号+金额+日期"组合，Send 前加 IF 查重 |
| PDF 加密读不了 | 先用免费工具解密再入目录 |
