---
id: tokenomics
title: Tokenomics Overview
sidebar_label: Overview
---

:::caution IMPORTANT NOTICE
**This documentation is for educational and informational purposes only.**

- There is **no endorsement** of investment in any specific model tokens
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
- **Sell tokens** for USDC at flat $0.01/token during the IBR phase, or at bonding curve price after handoff
- **No liquidity providers needed** - always-available liquidity
- Price formula: `P = R / (w × S)` where R=reserves, S=supply, w=CRR
- [Learn more about the AMM →](/tokenomics/amm-overview)

### Initial Bonding Ratio (IBR) Phase
- Every new model starts on a flat launch curve at **$0.01/token**
- IBR ends when reserves reach **$25,000 USDC** or **7 days** elapse
- After handoff, quotes switch to the CRR bonding curve
- [IBR phase details →](/tokenomics/launch-period)

### API Fee Flow
- **Primary path**: cost-plus splitting via `InfrastructureCostOracle`
- **Fallback path**: per-model configurable split via `infrastructureAccrualBps` in `HokusaiParams`
- **Infrastructure accrual** → sent to `InfrastructureReserve`
- **Profit share (residual)** → deposited to the AMM USDC reserve (increases price)
- Profit deposits increase reserves without minting tokens
- Token holders benefit from genuine profit after infrastructure costs
- [API fee mechanics →](/tokenomics/api-fee-flow)

### Token Supply Dynamics
- Tokens can be sold back to the AMM for USDC throughout the AMM lifecycle, with pricing determined by the active launch or CRR regime
- Selling tokens on the AMM burns them and returns USDC from reserves
- Supply adjusts based on minting (rewards) and selling (burns)

## How to Participate

| Role | How to Get Tokens | How to Benefit |
|------|------------------|----------------|
| **Data Supplier** | Earn DeltaOne rewards for improving models | Sell rewards on AMM or hold for appreciation |
| **Investor** | Buy tokens on AMM during IBR or after CRR handoff | API fees increase reserve → price increases |
| **Model User** | Buy tokens to access model APIs | Use tokens to access AI model inference |

## Next Steps

- [AMM Overview](/tokenomics/amm-overview) - How the bonding curve works
- [Bonding Curve Formulas](/tokenomics/bonding-curve) - Mathematical details
- [Launch Phase Guide](/tokenomics/launch-period) - Initial Bonding Ratio (IBR) phase
- [API Fee Flow](/tokenomics/api-fee-flow) - How revenue increases token value
- [Investor Guide](/guides/investor-guide) - Complete investment playbook
