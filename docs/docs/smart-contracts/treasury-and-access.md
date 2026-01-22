# Treasury & Access Mechanics

## HokusaiAMM (Bonding Curve)

The HokusaiAMM contract implements a **Constant Reserve Ratio (CRR)** bonding curve for each model token.

### Core Mechanics
- **Buy tokens**: Deposit USDC, receive tokens at bonding curve price
- **Sell tokens**: Burn tokens, receive USDC (after Day 7)
- **Price formula**: P = R / (w × S) where R=reserve, w=CRR, S=supply
- **Always-available liquidity**: No need for liquidity providers

### Seven-Day Launch Period
- **Days 0-6**: Buy-only period (selling disabled)
- **Day 7+**: Full trading enabled (buy & sell)
- **Purpose**: Fair price discovery and prevent manipulation

### Fee Structure

**AMM Trading Fees** (when buying/selling tokens on the AMM):
- **Trade fee**: 0.25% default (max 10%, governance-controlled)
- **Protocol fee**: 5% of trade fee (max 50%, governance-controlled)
- These fees are deducted from AMM trades

**API Usage Fees** (when using the model API):
- **20% to AMM Reserve**: Increases token backing and price
- **80% to Infrastructure**: Covers operational costs (compute, hosting, bandwidth)
- Routed by `UsageFeeRouter` contract

### Key Features
- **Slippage protection**: minTokens/minUSDC parameters
- **Deadline protection**: Transaction must execute before deadline
- **Emergency pause**: Owner can pause trading if needed
- **Fee deposits**: API revenue increases reserves without minting

[Complete AMM Documentation →](/smart-contracts/hokusai-amm)

## HokusaiAMMFactory

Deploys new AMM contracts for each model token.

### Responsibilities
- Deploy HokusaiAMM instances
- Set initial parameters (CRR, fees, launch period)
- Register AMM with ModelRegistry
- Grant appropriate roles (fee depositor, etc.)

## UsageFeeRouter

Routes API usage fees between two destinations only.

### Two-Way Fee Distribution

The `UsageFeeRouter` performs a simple split of API usage fees:

1. **20% to AMM Reserve**:
   - Increases USDC backing of tokens
   - Raises token price without minting
   - Benefits all token holders proportionally

2. **80% to Infrastructure Fund**:
   - Covers direct operational costs
   - Pays for compute resources (GPU/CPU)
   - Covers hosting and bandwidth
   - Maintains API infrastructure

**Important**: This is the ONLY automated fee routing. There are no additional fee streams for staking, governance rewards, or other purposes from API usage fees.

### Functions
- `distributeFees()`: Splits fees between AMM reserve (20%) and infrastructure (80%)
- `depositToAMM()`: Deposits the 20% portion to specific model's AMM reserve
- Access controlled by `FEE_COLLECTOR_ROLE`

## ModelAccessController

Enforces token burning for model API access.

### Access Mechanisms
- **Direct burn**: Users burn tokens to access model
- **Subscription model**: Monthly burn for unlimited access
- **Pay-per-use**: Burn tokens per API call
- **Enterprise tiers**: Custom burn rates

### Burn Rates
- **Standard**: 1 token per request (example)
- **Batch discount**: Up to 25% off for bulk usage
- **Enterprise**: Custom negotiated rates

## Next Steps

- [HokusaiAMM Contract](/smart-contracts/hokusai-amm) - Complete technical reference
- [Token Flow](/smart-contracts/token-flow) - Mint/burn mechanics
- [API Fee Flow](/tokenomics/api-fee-flow) - How fees increase value
- [AMM Overview](/tokenomics/amm-overview) - High-level bonding curve explanation