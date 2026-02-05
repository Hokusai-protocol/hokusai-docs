# Smart Contract Overview

Hokusai's smart contract system is modular, designed to support decentralized AI model development and tokenization. Here's a simplified flow:

```
[Data Contributor]
    ↓ submits data
[DeltaOneVerifier] → validates performance improvement
    ↓ confirms DeltaOne
[TokenManager] → mints model tokens
    ↓ distributes rewards
[Token Holders]
    ↓
[HokusaiAMM] ← buy/sell with USDC (CRR bonding curve)
    ↓
[API Usage] → fees deposited to AMM reserve → price increases
    ↓
[ModelAccessController] → enforces access control and fee collection
```

## Key Components

### Core Contracts
- **HokusaiToken (ERC20)**: Model-specific token, earned via performance gains
- **TokenManager**: Issues tokens, handles mint/burn logic, distributes rewards
- **DeltaOneVerifier**: Validates performance improvements off-chain, triggers minting
- **ModelRegistry**: Maps model IDs to token addresses

### AMM & Trading
- **HokusaiAMM**: CRR bonding curve for buying/selling tokens with USDC
- **HokusaiAMMFactory**: Deploys new AMM pools for each model
- **UsageFeeRouter**: Routes API fees to AMM reserves (20%) and infrastructure (80%)

### Access Control
- **ModelAccessController**: Enforces access control and fee collection for model usage
- **Governance**: Token holder voting on parameters

## Key Features

### Seven-Day Launch Period
- Each model token starts with buy-only period (Days 0-6)
- Full trading enabled after Day 7
- Prevents manipulation and enables fair price discovery

### API Fee Integration
- 20% of API fees flow to AMM USDC reserves
- Increases reserve without minting tokens
- Raises spot price: P = R / (w × S)
- Creates value for token holders from model usage