---
sidebar_position: 2
---

# Decentralized License

## Overview

The Decentralized License represents Hokusai's core offering: truly community-owned AI models governed by token holders and available to anyone willing to pay the API fee. Unlike traditional commercial AI offerings where vendors maintain complete control, decentralized models ensure permanent availability, transparent governance, and alignment between users and owners.

## Key Principles

### Guaranteed Availability

Decentralized models are **always available** to any user willing to pay the API fee. There is no vendor lock-in, no arbitrary price increases, and no risk of the model being discontinued. The model exists on-chain and is governed by its token holders, ensuring it serves the community rather than a single corporate interest.

### Token Holder Ownership

Model tokens represent true ownership stakes in the underlying AI model. Token holders receive **100% of API profits** after infrastructure costs are covered. This stands in stark contrast to traditional vendors who extract maximum value while giving nothing back to the community that makes their models valuable.

### Community Governance

Token holders collectively govern the model through on-chain voting. They make decisions about:

- **Pricing strategy** - Setting API fees that balance accessibility and sustainability
- **Infrastructure provisioning** - Determining compute resources and scaling parameters
- **Feature development** - Prioritizing improvements and new capabilities
- **Revenue allocation** - Managing infrastructure spending, pricing, and reinvestment strategies

## Contrasting with Commercial Vendors

### The Problem with Traditional AI Vendors

Commercial AI vendors have repeatedly demonstrated problematic patterns:

1. **Lock-in by Design** - Once you build on their platform, switching costs become prohibitive
2. **Arbitrary Pricing Power** - Prices increase dramatically once they achieve market dominance
3. **Data Exploitation** - User data and feedback are used to improve models, with no compensation
4. **Opaque Decision Making** - No visibility into how models are trained, improved, or governed
5. **Service Discontinuation Risk** - Models can be deprecated or shut down at any time
6. **Misaligned Incentives** - Vendor profits come from extracting maximum value from users

### The Decentralized Alternative

Hokusai's decentralized model eliminates these problems:

- **Permanent Availability** - Models cannot be shut down or restricted by a single entity
- **Transparent Pricing** - Token holders set prices through governance, not corporate strategy
- **Fair Value Distribution** - Contributors receive tokens, users pay fair fees, everyone benefits
- **Open Governance** - All decisions are made transparently through token holder voting
- **Community Alignment** - Success benefits all stakeholders proportionally
- **No Platform Risk** - The model exists independent of any single company or service

## How It Works

### API Access

Anyone can access a decentralized model by:

1. Connecting to the Hokusai API
2. Paying the usage fee (set by token holders)
3. Making inference requests

No permission, whitelist, or vendor relationship is required. The model is always available at the publicly set price.

### Revenue Flow

```
API Fee Payment → Infrastructure Costs → Remaining Profit → AMM Reserve → Token Holders benefit via price appreciation
```

- **100% of profits** (fees minus infrastructure) flow to the AMM reserve for token holders
- Infrastructure costs are transparently tracked on-chain
- Token holders vote on cost allocation and optimization

### Token Economics

- **DeltaOne Rewards** - Data suppliers receive tokens for measurable improvements
- **Market Liquidity** - Tokens trade on an AMM with USDC reserve backing
- **Buy Pressure** - API fees purchase tokens from the market, creating sustained demand
- **Ownership Rights** - Tokens represent proportional ownership and governance power

## Governance Process

Token holders govern through on-chain proposals and voting:

### Pricing Decisions

- Set base API rates per token/request
- Adjust pricing for different model sizes or capabilities
- Create volume discounts or usage tiers
- Respond to market conditions

### Infrastructure Management

- Allocate compute resources across regions
- Scale infrastructure based on demand
- Optimize for cost vs. performance
- Select infrastructure providers

### Development Roadmap

- Prioritize model improvements
- Fund research initiatives
- Determine training schedules
- Approve major upgrades

### Treasury Management

- Reinvest profits into development
- Build reserve funds for stability
- Fund ecosystem initiatives
- Distribute dividends to token holders

## Benefits for Stakeholders

### For Users

- **Predictable Access** - Model always available at published rates
- **Fair Pricing** - No vendor markup or arbitrary increases
- **Participation Opportunity** - Can become token holders and share in success
- **Transparency** - Full visibility into governance and operations

### For Data Suppliers

- **Direct Ownership** - Receive tokens for contributions, not one-time payments
- **Ongoing Value** - Benefit from model's long-term success
- **Governance Rights** - Vote on how the model evolves
- **Market Liquidity** - Can sell tokens or hold for appreciation

### For Token Holders

- **Profit Rights** - Receive 100% of profits after infrastructure costs
- **Governance Power** - Direct control over model strategy
- **Aligned Incentives** - Success increases token value
- **No Middleman** - Direct relationship with model economics

### For Developers

- **No Platform Risk** - Build with confidence the API won't disappear
- **Stable Interface** - Community governance prevents breaking changes
- **Fair Pricing** - Costs are transparent and predictable
- **Influence** - Can acquire tokens and participate in governance

## Launch and Lifecycle

### Initial Launch Period

During the Initial Bonding Ratio (IBR) phase:

- Early investors can provide initial liquidity
- Data suppliers begin receiving DeltaOne rewards
- Token price follows bonding curve dynamics
- Community governance structure is established

### Ongoing Operations

After launch, the model operates under full community control:

- API serves inference requests continuously
- Token holders govern pricing and infrastructure
- Data suppliers continue improving the model
- Profit residuals increase AMM reserve backing

## Why Decentralized Matters

The decentralized model is not just a technical architecture - it's a fundamental shift in how AI value is created and distributed. Instead of concentrating power and profits in the hands of a few large companies, Hokusai ensures that everyone who contributes to a model's success shares in its benefits.

This creates:

- **Better Models** - Contributors are incentivized to provide high-quality data
- **Fairer Economics** - Value flows to creators, not just intermediaries
- **Sustainable Governance** - Decisions align with long-term community interests
- **Resilient Infrastructure** - No single point of failure or control

## Getting Started

### As a User

1. Sign up for Hokusai API access
2. Review available decentralized models
3. Pay usage fees in USDC
4. Make inference requests via REST API

### As a Token Holder

1. Purchase tokens from the AMM
2. Review governance proposals
3. Vote on model decisions
4. Receive proportional profits

### As a Data Supplier

1. Submit data contributions
2. Have improvements verified through benchmarks
3. Receive DeltaOne token rewards
4. Participate in governance

## Technical Implementation

Decentralized licenses are enforced through smart contracts:

- **HokusaiAMM** - Manages token trading and liquidity
- **ModelToken** - ERC-20 token representing ownership
- **TokenManager** - Handles minting and distribution
- **AccessControl** - Validates API access and fee payments
- **UsageFeeRouter / InfrastructureReserve** - Route usage fees and track infrastructure obligations
- **Governance** - Executes token holder votes

All contracts are audited, open-source, and deployed on Base (Ethereum L2).

## Frequently Asked Questions

### What happens if infrastructure costs exceed API revenue?

Token holders must vote to either increase API pricing, optimize infrastructure costs, or temporarily subsidize operations from available reserves. This is a normal part of governance.

### Can token holders vote to make the model private?

No. The decentralized license is immutable - the model must always be available to anyone willing to pay the API fee. Token holders can adjust pricing but cannot restrict access.

### How are disputes resolved?

Governance follows on-chain voting rules defined in the smart contracts. Token holders vote proportionally to their holdings. There is no central authority to override community decisions.

### What prevents a majority token holder from abusing control?

The economic incentives align with fair governance - abusive pricing or poor decisions reduce model usage, harming all token holders. Additionally, the transparent nature of on-chain governance allows the community to fork if necessary.

### Can I contribute data without receiving tokens?

Data suppliers can choose to receive USDC instead of tokens, though this means forfeiting ownership and governance rights. Most suppliers prefer tokens for long-term value.

## Learn More

- [Token Economics](../tokenomics/token-value) - Understand how token value accrues
- [AMM Overview](../tokenomics/amm-overview) - Learn about the bonding curve mechanism
- [DeltaOne Calculations](../tokenomics/deltaone-calculations) - See how rewards are calculated
- [Smart Contracts](../smart-contracts/smart-contracts-overview) - Explore the technical implementation
- [Governance](../governance) - Details on the voting and proposal process
