# 🎁 Reward Mechanisms

This document details how rewards are distributed in the Hokusai ecosystem for contributions and participation.

## Reward Types

### 1. Performance Rewards
Rewards for improving model performance:

```mermaid
graph TD
    A[Model Improvement] -->|Verified| B[DeltaOne Calculation]
    B -->|Reward Formula| C[Token Distribution]
    C -->|100%| D[Data Contributors]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#f9f,stroke:#333,stroke-width:2px
```

#### Reward Calculation
```
Reward = DeltaOnes * Tokens_Per_DeltaOne
```

Where:
- DeltaOnes = Number of percentage points of improvement (1 DeltaOne = 1% improvement)
- Tokens_Per_DeltaOne = Fixed number of tokens awarded per DeltaOne

Example:
```
Baseline Performance: 75% accuracy
New Performance: 82% accuracy
Performance Improvement: 7%
Tokens per DeltaOne: 100 tokens

Reward = 7 DeltaOnes * 100 tokens = 700 tokens
```

### 2. Liquidity Rewards
Incentives for providing liquidity:

#### Pool Rewards
- Trading fee sharing
- Protocol fee distribution
- Staking bonuses

#### Reward Rates
- Base rate: 0.3% of trading volume
- Special rates for enterprise pools

## Distribution Mechanisms

### 1. Performance Distribution
The TokenManager contract handles performance-based rewards:

```solidity
function mintForImprovement(
    bytes32 modelId,
    uint256 improvementBps,
    address contributor
) external onlyVerifier {
    require(improvementBps > 0, "No improvement");
    uint256 reward = calculateReward(improvementBps);
    _mint(contributor, reward);
    emit ImprovementRewarded(modelId, contributor, reward);
}
```

Key components:
- `DeltaOneVerifier`: Validates performance improvements
- `TokenManager`: Mints and distributes rewards
- `ModelRegistry`: Tracks model performance and token addresses

### 2. Liquidity Distribution
The BondingCurveTreasury contract manages liquidity rewards:

```solidity
function distributeLiquidityRewards(
    address provider,
    uint256 amount,
    uint256 duration
) external {
    uint256 baseReward = calculateBaseReward(amount);
    uint256 timeBonus = calculateTimeBonus(duration);
    uint256 totalReward = baseReward + timeBonus;
    
    _mint(provider, totalReward);
}
```

## Vesting Schedules

### 1. Performance Rewards
- 3-month cliff period
- Early withdrawal penalty

### 2. Liquidity Rewards
- Immediate distribution
- Bonus for longer commitments

## Reward Parameters

### 1. Performance Parameters
- Minimum improvement threshold: 10 bps (0.1%)
- Maximum reward per improvement
- Cooldown period between improvements

### 2. Liquidity Parameters
- Base reward rate
- Bonus multipliers
- Lock-up periods

## Monitoring and Analytics

### 1. Reward Metrics
- Total rewards distributed
- Reward distribution by type
- Vesting status

### 2. Participation Metrics
- Active contributors
- Liquidity providers

### 3. Impact Metrics
- Model improvements
- Protocol growth
- Community engagement

## Next Steps

- Review [Token Value Mechanics](/tokenomics/token-value)
- Understand [DeltaOne Calculations](/tokenomics/deltaone-calculations)
- Learn about [Smart Contracts](/smart-contracts/overview)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 