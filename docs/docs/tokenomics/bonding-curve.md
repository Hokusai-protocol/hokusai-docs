# 📈 Bonding Curve

The Hokusai protocol uses a bonding curve for price discovery and token distribution. This document explains the mechanics, mathematics, and examples of our bonding curve system.

## Overview

The bonding curve is a mathematical function that determines token price based on supply. It provides:
- Predictable price discovery
- Continuous liquidity
- Fair token distribution
- Price stability mechanisms

## Mathematical Model

### Basic Formula

The price (P) of a token is determined by the following function:

```
P = P₀ * (1 + r)^S
```

Where:
- P₀ = Initial price (0.01 USDC)
- r = Rate of increase (0.1% or 0.001)
- S = Current supply

### Price Impact

The price impact (ΔP) for a token purchase of size n is:

```
ΔP = P₀ * ((1 + r)^(S + n) - (1 + r)^S)
```

### Example Calculation

For a purchase of 1000 tokens when supply is 1,000,000:

```
P₀ = 0.01 USDC
r = 0.001
S = 1,000,000
n = 1000

P = 0.01 * (1.001)^1,000,000
  ≈ 0.011 USDC per token
```

## Price Bounds

### Minimum Price
- Lower bound: 0.001 USDC
- Prevents token devaluation
- Maintains minimum liquidity

### Maximum Price
- Upper bound: 10 USDC
- Prevents excessive speculation
- Ensures accessibility

## Liquidity Mechanism

### Primary Pool
- USDC/Token pair
- Governed by bonding curve
- Provides base liquidity

### Secondary Pools
- Model-specific pairs
- Additional liquidity sources
- Risk diversification

## Trading Examples

### 1. Small Purchase
```
Amount: 100 tokens
Current Supply: 500,000
Price Impact: 0.05%
Final Price: 0.0105 USDC
```

### 2. Medium Purchase
```
Amount: 1,000 tokens
Current Supply: 500,000
Price Impact: 0.5%
Final Price: 0.0105 USDC
```

### 3. Large Purchase
```
Amount: 10,000 tokens
Current Supply: 500,000
Price Impact: 5%
Final Price: 0.011 USDC
```

## Price Stability Features

### 1. Slippage Protection
- Maximum price impact: 5%
- Large order splitting
- Time-weighted execution

### 2. Arbitrage Incentives
- Price deviation detection
- Automated arbitrage bots
- Market efficiency rewards

### 3. Liquidity Incentives
- LP token rewards
- Trading fee sharing
- Staking bonuses

## Implementation Details

### Smart Contract Integration
```solidity
function calculatePrice(uint256 supply) public pure returns (uint256) {
    return initialPrice * (1 + rate) ** supply;
}

function calculatePurchaseAmount(uint256 usdcAmount, uint256 supply) public pure returns (uint256) {
    uint256 price = calculatePrice(supply);
    return usdcAmount / price;
}
```

### Oracle Integration
- Price feed updates
- Supply verification
- Liquidity monitoring

## Monitoring and Analytics

### Key Metrics
- Current price
- Total supply
- Liquidity depth
- Price impact

### Health Indicators
- Price stability
- Liquidity ratio
- Trading volume
- Arbitrage activity

## Next Steps

- Review [DeltaOne Calculations](/tokenomics/deltaone-calculations)
- Learn about [Token Flow](/smart-contracts/token-flow)
- Understand [Governance](/smart-contracts/governance)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 