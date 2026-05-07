
# 📝 Product Requirements Document  
**Project Name:** Hokusai Documentation Project  
**Owner:** Senior Product Manager – Hokusai  
**Contributors:** Technical Writing Team  
**Target Completion Date:** June 1, 2025
**Version:** 1.0  

---

## 📌 Overview

The goal of this project is to produce a complete, structured documentation set for the Hokusai protocol. The documentation should clearly explain how Hokusai tokens work, how contributors and developers can participate, and how the economic model operates. It must be accessible to technical readers who are actively considering how to interact with the Hokusai ecosystem.

This includes three primary user personas:
- **Data Suppliers**: Companies with valuable datasets that may improve model performance and earn tokens.
- **AI Model Developers**: Engineers or researchers who want to integrate models into the Hokusai ecosystem or launch new models.
- **Investors**: Individuals or funds that provide liquidity and seek price appreciation in Hokusai tokens.

---

## 🎯 Goals and Success Criteria

| Objective | Description |
|----------|-------------|
| Clarity | Each persona should be able to understand how to participate technically and economically. |
| Completeness | All core and extended features of the Hokusai protocol must be documented. |
| Modularity | The structure must support reusable sections (e.g., tokenomics, licensing) across multiple model tokens. |
| Up-to-Date | Documentation must reflect the current live protocol, tools, and governance. |
| Ease of Maintenance | Content should be structured using Docusaurus so it's easy to update with new tokens, models, or contributors. |

---

## 🧑‍🎯 Personas & Use Cases

| Persona | Goals | Documentation Needs |
|--------|--------|---------------------|
| **Data Supplier** | Earn tokens by contributing privacy-compliant data that improves model performance | Overview of data contribution workflow, tools to test data quality, token reward calculation |
| **Model Developer** | Launch new models or improve existing ones within Hokusai | Guidelines on registering models, evaluation metrics, performance benchmarks, token setup |
| **Investor** | Assess token value potential, invest or trade tokens | Overview of token mechanics, bonding curve pricing, usage-driven deflation, model access demand |

---

## 🗂️ Documentation Structure

Referencing existing structure at https://docs.hokus.ai/, we propose the following refined structure and content assignments. Each topic must include:
- An introductory paragraph
- Visual diagram (if applicable)
- Links to related sections or technical specs
- Code snippets or example API calls (where relevant)

### Documentation Sidebar Outline

#### 1. **Getting Started**
- `intro.md`: What is Hokusai? Key concepts (DeltaOne, bonding curves, Hokusai tokens)
- `personas.md`: Who uses Hokusai and why? (Data Suppliers, Model Developers, Investors)

#### 2. **Contributing Data**
- `supplying-data.md`: Full data contribution workflow  
- `data-validation-tools.md`: SDK tools for testing format & value
- `privacy-compliance.md`: Anonymization standards and user data rights

#### 3. **Creating & Improving Models**
- `creating-models.md`: How to register a new model  
- `improving-models.md`: How to measure improvements and qualify for token inflation  

#### 4. **Using Models**
- `using-models.md`: Accessing and querying deployed models
- `model-api-guide.md`: API endpoints, auth, rate limits
- `auction-pricing.md`: Continuous auction system for access

#### 5. **Smart Contracts**
- `smart-contracts/overview.md`: ERC20 logic, inflation control, burn mechanisms
- `smart-contracts/token-flow.md`: Minting & burning triggers
- `smart-contracts/security.md`: Audit plans, trust assumptions

#### 6. **Tokenomics**
- `tokenomics/index.md`: Core principles
- `bonding-curve.md`: Price discovery
- `deltaone-calculations.md`: Token supply logic per DeltaOne

#### 7. **Licensing**
- `licensing/overview.md`: Overview
- `licensing/open-source.md`: Open data/model licensing
- `licensing/commercial.md`: Paid access and model revenue
- `licensing/co-op.md`: Multi-party models with shared governance
- `licensing/proprietary.md`: Exclusive licensing formats

#### 8. **Governance**
- `governance.md`: Community control, shared metrics

#### 9. **API Reference**
- `api-reference.md`: REST/GraphQL references

#### 10. **FAQs**
- `faqs.md`: Common questions from each persona

---

## 📋 Task List for Technical Writers

| Task | Description | Assigned To |
|------|-------------|-------------|
| Draft intro, personas, and core concepts | Define “DeltaOne”, Hokusai token logic, overview diagram | [Writer A] |
| Complete “Contributing Data” section | Include SDK usage, formatting standards, data validation tool | [Writer B] |
| Build out “Creating & Improving Models” section | Includes registration flow, smart contract deploy, DeltaVerifier/HEM integration | [Writer C] |
| Document usage and access flows | Write API and auction mechanism explanations | [Writer A] |
| Write all Smart Contracts section | Token minting/burning logic with clear contract flowchart | [Writer D] |
| Finalize tokenomics pages | Focus on bonding curve math, inflation logic, DeltaOne triggers | [Writer B] |
| Licensing pages | Overview and breakdowns by license type | [Writer E] |
| Governance doc | Describe how model creators define and update shared metrics | [Writer C] |
| Build and organize API reference | Pull content from developer SDK repo or API gateway spec | [Writer A] |
| FAQs | Curate questions from internal Notion/Slack or user interviews | [Writer E] |

---

## 🔧 Technical Requirements

- All documentation should be written in Markdown, compatible with Docusaurus
- Use existing sidebar config at `/sidebars.js` to register new pages
- Use diagrams where appropriate
- Embed code snippets, GitHub links, and API calls

---

## 🛠 Tooling & Integration

- GitHub for version control
- Github Pages for deployment and hosting of the docs site. 
- Docusaurus for preview/staging
- Notion for drafts
- Optional: Mermaid.js for diagrams

---

## 🚧 Known Gaps / To Be Defined

- Details on DeltaVerifier + HEM integration
- Token audit standards and verification
- API usage metering at scale
- Submission form UX/UI
