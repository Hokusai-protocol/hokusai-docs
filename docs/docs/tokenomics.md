---
id: tokenomics
title: Tokenomics Overview
sidebar_label: Overview
---

:::caution IMPORTANT NOTICE
**This documentation is for educational and informational purposes only.**

- Hokusai Protocol does **NOT endorse** investment in any specific model tokens
- Token trading is **highly risky** - you may lose 100% of invested funds
- **Always verify** contract addresses, team credentials, and claims independently
- Nothing here constitutes financial, investment, or legal advice

See [Investor Guide](/guides/investor-guide) for complete risk disclosures before participating.
:::

Hokusai's tokenomics are designed to align incentives across data suppliers, model developers, and token holders. Each model has dedicated tokens that can be traded on an automated market maker (AMM) using a Constant Reserve Ratio (CRR) bonding curve. API revenue flows into the USDC reserve pool, increasing token backing and price.

## Key Components

### DeltaOne Performance Rewards
- **1 DeltaOne = 1% model improvement** (e.g., accuracy increase from 80% → 81%)
- Tokens minted to reward data suppliers for verified performance gains
- Performance verified through MegaAI benchmarking system
- Creates inflationary pressure when models improve

### CRR Bonding Curve AMM
- **Buy tokens** with USDC at deterministic bonding curve price
- **Sell tokens** for USDC (enabled after 7-day launch period)
- **No liquidity providers needed** - always-available liquidity
- Price formula: `P = R / (w × S)` where R=reserves, S=supply, w=CRR
- [Learn more about the AMM →](/tokenomics/amm-overview)

### Seven-Day Launch Period
- Every new model starts with **buy-only period** (Days 0-6)
- Selling enabled on Day 7
- Prevents manipulation and enables fair price discovery
- [Launch period details →](/tokenomics/launch-period)

### API Fee Flow
- **20% of API fees** → deposited to AMM USDC reserve (increases price)
- **80% of API fees** → infrastructure costs
- Fee deposits increase reserves without minting tokens
- Creates value accrual for token holders from model usage
- [API fee mechanics →](/tokenomics/api-fee-flow)

### Token Burning
- Tokens burned when users access models (pay-per-use, subscriptions)
- Creates deflationary pressure from usage
- Reduces circulating supply over time

## How to Participate

| Role | How to Get Tokens | How to Benefit |
|------|------------------|----------------|
| **Data Supplier** | Earn DeltaOne rewards for improving models | Sell rewards on AMM or hold for appreciation |
| **Investor** | Buy tokens on AMM during or after launch | API fees increase reserve → price increases |
| **Model User** | Buy tokens to access model APIs | Use tokens to access AI model inference |

## Next Steps

- [AMM Overview](/tokenomics/amm-overview) - How the bonding curve works
- [Bonding Curve Formulas](/tokenomics/bonding-curve) - Mathematical details
- [Launch Period Guide](/tokenomics/launch-period) - Seven-day bonding round
- [API Fee Flow](/tokenomics/api-fee-flow) - How revenue increases token value
- [Investor Guide](/guides/investor-guide) - Complete investment playbook