# DeltaOne Calculations

This document explains the mathematical foundations and calculations used in the Hokusai protocol's DeltaOne token system.

## Core Concepts

### DeltaOne Definition
A DeltaOne token represents a unit of model improvement, where:
- 1 DeltaOne = 1% improvement in model performance
- Improvements are measured against baseline metrics
- Performance is verified through oracle attestation

### Supply Logic
The total supply of DeltaOne tokens is determined by:
- Base supply from model registration
- Performance improvement rewards
- Burn rate from model access
- Treasury operations

## Mathematical Formulas

### 1. Performance Improvement Calculation

```
Improvement = (New_Score - Baseline_Score) / Baseline_Score * 100
DeltaOnes = Improvement * Model_Weight
```

Where:
- New_Score = Current model performance
- Baseline_Score = Initial model performance
- Model_Weight = Model complexity factor (1.0 - 2.0)

### 2. Reward Distribution

```
Reward = Base_Reward * (1 + Improvement_Bonus) * Time_Factor
```

Where:
- Base_Reward = Standard reward amount
- Improvement_Bonus = Additional reward for significant improvements
- Time_Factor = Time-based multiplier (0.8 - 1.2)

### 3. Burn Rate Calculation

```
Burn_Rate = Base_Rate * (1 + Usage_Intensity) * Model_Complexity
```

Where:
- Base_Rate = Standard burn rate
- Usage_Intensity = Usage frequency multiplier
- Model_Complexity = Model resource factor

## Calculation Examples

### 1. Model Improvement
```
Baseline_Score = 0.85
New_Score = 0.92
Model_Weight = 1.5

Improvement = (0.92 - 0.85) / 0.85 * 100
           = 8.24%

DeltaOnes = 8.24 * 1.5
          = 12.36 DeltaOnes
```

### 2. Reward Distribution
```
Base_Reward = 100 DeltaOnes
Improvement_Bonus = 0.2 (20% bonus)
Time_Factor = 1.1

Reward = 100 * (1 + 0.2) * 1.1
       = 132 DeltaOnes
```

### 3. Burn Calculation
```
Base_Rate = 0.1 DeltaOnes
Usage_Intensity = 1.5
Model_Complexity = 1.2

Burn_Rate = 0.1 * (1 + 1.5) * 1.2
          = 0.3 DeltaOnes per use
```

## Implementation Details

### Smart Contract Integration
```solidity
function calculateImprovement(
    uint256 newScore,
    uint256 baselineScore,
    uint256 modelWeight
) public pure returns (uint256) {
    uint256 improvement = ((newScore - baselineScore) * 100) / baselineScore;
    return (improvement * modelWeight) / 100;
}

function calculateReward(
    uint256 baseReward,
    uint256 improvementBonus,
    uint256 timeFactor
) public pure returns (uint256) {
    return (baseReward * (100 + improvementBonus) * timeFactor) / 100;
}
```

### Oracle Integration
- Performance score verification
- Improvement attestation
- Burn rate monitoring

## Monitoring and Analytics

### Key Metrics
- Total DeltaOne supply
- Improvement distribution
- Burn rate trends
- Reward efficiency

### Health Indicators
- Improvement rate
- Burn velocity
- Reward distribution
- Model performance

## Next Steps

- Review [Bonding Curve](/tokenomics/bonding-curve)
- Learn about [Token Flow](/smart-contracts/token-flow)
- Understand [Governance](/smart-contracts/governance)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 