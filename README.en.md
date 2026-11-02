# AI Workflows Hub 🤖

[中文](README.md) | English

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Catalog](https://img.shields.io/badge/Catalog-searchable-69f0ae)](https://aeternacursor.github.io/ai-workflows-hub/catalog.html)
[![Timeline](https://img.shields.io/badge/AI%20History-timeline-4fc3f7)](https://aeternacursor.github.io/ai-workflows-hub/)

> Curated AI workflows across industries — importable workflows, hands-on tutorials, worked examples, and an interactive AI history timeline.

## What's inside

- 🏭 **13 industries**: finance, marketing, ecommerce, legal, HR, education, media, customer service, software dev, general office, manufacturing, healthcare, logistics
- 🧰 **Platforms**: n8n / Dify / Coze Studio / Langflow / Flowise / ComfyUI / GitHub Agentic Workflows
- 📦 **15 importable workflows**, each as a **four-piece set**: `workflow.json` + README + TUTORIAL (step-by-step) + CASES (worked examples with code)
- 🗓️ **AI history timeline** (bilingual zh/en): [aeternacursor.github.io/ai-workflows-hub](https://aeternacursor.github.io/ai-workflows-hub/)
- 🔍 **Searchable catalog**: [aeternacursor.github.io/ai-workflows-hub/catalog.html](https://aeternacursor.github.io/ai-workflows-hub/catalog.html)

## Industry index (all included workflows)

| Industry | Featured workflow (included, four-piece set) |
|---|---|
| 💼 General office | [Email Summary Agent](../tree/main/workflows/general-office/email-summary) — daily inbox digested into a 3-section brief (must-reply / know / ignore), 42k-view starter template |
| 💰 Finance | [Invoice Processor & Validator](../tree/main/workflows/finance/invoice-processing) — OCR extraction, LLM cross-check against master data, ledger sheet + anomaly flags |
| 👥 HR | [Resume Screening & Interview Prep](../tree/main/workflows/hr/resume-screening-gemini) — Gemini scores candidates against JD, Notion ATS records, voice interview questions |
| 📣 Marketing | [Social Posts Generator](../tree/main/workflows/marketing/social-posts-generator) — one topic → Gemini copy × 4 platforms, AI image, auto-publish via Zernio |
| 💬 Customer service | [Cache-First RAG Support](../tree/main/workflows/customer-service/multichannel-support-rag) — repeated questions answered from semantic cache at zero LLM cost |
| 🛒 Ecommerce | [Shopify Order Fulfillment](../tree/main/workflows/ecommerce/shopify-order) — unfulfilled orders → validate → notify warehouse → mark fulfilled |
| ⚖️ Legal | [Contract Risk Analysis](../tree/main/workflows/legal/contract-risk-analysis) — clause chunking, compliance rule matching, risk scoring + Slack alerts + audit trail |
| 🎓 Education | [PDF Quiz Generator](../tree/main/workflows/education/pdf-quiz-generator) — textbook PDF → AI-generated quiz → Google Forms, with question bank sheet |
| 💻 Software dev | [AI PR Review & Auto-Labeling](../tree/main/workflows/software-dev/pr-review-label) — diff review against team standards, labels, PR comment, Slack digest |
| 🎬 Media (×3, ComfyUI) | [SDXL simple T2I](../tree/main/workflows/media/comfyui-sdxl-simple) · [Qwen-Image 2.1 Turbo T2I](../tree/main/workflows/media/comfyui-qwen-image-turbo-t2i) · [Wan2.1 T2V 1.3B](../tree/main/workflows/media/comfyui-wan-text-to-video) — from first image to 8GB-VRAM video |
| 🏭 Manufacturing | [IoT Fleet Health Report](../tree/main/workflows/manufacturing/iot-fleet-health-report) — Azure telemetry → AI pinpoints failing devices → daily email |
| 🏥 Healthcare | [Medical Triage & Appointments](../tree/main/workflows/healthcare/medical-triage-appointment) — priority-only sorting (no diagnosis), urgent alerts, auto-scheduling |
| 🚚 Logistics | [Multi-Carrier Tracking](../tree/main/workflows/logistics/multi-carrier-tracking) — FedEx/UPS/DHL in parallel, unified status table, exception highlights |

Every entry ships with an importable JSON, a node-by-node TUTORIAL, and CASES containing
worked examples (real input → output), copyable code, and an AI-customization prompt.

## Learning path

```
Quickstart (install & run your first) → TUTORIAL (node-by-node)
→ CASES (real examples & code) → customize with AI prompts → contribute back
```

- [Quickstart](docs/quickstart.md) — three routes (n8n / ComfyUI / Dify) from zero, incl. API key setup
- [Usage guide](USAGE.md) · [Contributing (four-piece standard)](CONTRIBUTING.md)
- [AI customization prompt](prompts/customize-workflow.md) — turn any workflow into your own with any AI assistant

## Maintenance

Weekly AI-driven updates via [prompts/update-hub.md](prompts/update-hub.md), automated link
health checks, CI-enforced contribution standards. See the [CHANGELOG](CHANGELOG.md).

## License

[MIT](LICENSE). Curated third-party templates keep their original licenses (attributed per workflow).
