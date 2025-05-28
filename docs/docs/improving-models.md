---
id: improving-models
title: Improving Models
sidebar_label: Improving Models
sidebar_position: 7
---

# Improving Models

This guide explains how model improvements are measured, verified, and rewarded in the Hokusai ecosystem.

## Overview

When data contributors improve a model's performance, they earn rewards based on the DeltaOnes calculated. The improvement process involves performance measurement, verification, and reward distribution through smart contracts.

## Improvement Measurement

### Performance Metrics

Models are evaluated on specific metrics that vary by model type:

1. **Classification Models**
   - Accuracy
   - Precision
   - Recall
   - F1 Score
   - ROC-AUC

2. **Regression Models**
   - Mean Squared Error (MSE)
   - Root Mean Squared Error (RMSE)
   - R-squared
   - Mean Absolute Error (MAE)

3. **Language Models**
   - Perplexity
   - BLEU Score
   - ROUGE Score
   - Human Evaluation Scores

### DeltaOne Calculation

Improvements are measured in basis points (bps) and converted to DeltaOnes:

```python
# Example calculation
baseline_performance = 0.85  # 85% accuracy
new_performance = 0.8725    # 87.25% accuracy
improvement_bps = (new_performance - baseline_performance) * 10000  # 210 bps (2.1%)
require(improvement_bps >= 10, "Improvement below minimum threshold")  # Minimum 10 bps (0.1%)
delta_ones = improvement_bps / 100  # 2.1 DeltaOnes
```

## Verification Process

### 1. Automated Verification

The DeltaOneVerifier smart contract handles automated verification and reward calculation:

```solidity
// Simplified verification and reward calculation logic
contract DeltaOneVerifier {
    uint256 public constant MIN_IMPROVEMENT_BPS = 10; // 0.1 basis points
    uint256 public constant REWARD_RATE = 10; // 0.1% per basis point
    
    struct Improvement {
        uint256 baseline;
        uint256 newPerformance;
        uint256 timestamp;
        bool verified;
    }
    
    mapping(address => Improvement[]) public improvements;
    
    function verifyAndCalculateReward(
        address contributor,
        uint256 baseline,
        uint256 newPerformance
    ) public returns (uint256) {
        require(newPerformance > baseline, "No improvement detected");
        
        uint256 improvementBps = ((newPerformance - baseline) * 10000) / baseline;
        require(improvementBps >= MIN_IMPROVEMENT_BPS, "Improvement below threshold");
        
        // Record the improvement
        improvements[contributor].push(Improvement({
            baseline: baseline,
            newPerformance: newPerformance,
            timestamp: block.timestamp,
            verified: true
        }));
        
        // Calculate reward based on improvement
        uint256 deltaOnes = (improvementBps * REWARD_RATE) / 100;
        return deltaOnes;
    }
    
    function distributeReward(
        address contributor,
        uint256 deltaOnes
    ) public {
        uint256 contributorReward = (deltaOnes * 70) / 100; // 70% to contributor
        uint256 ownerReward = (deltaOnes * 30) / 100;      // 30% to model owner
        
        // Distribute rewards
        _transferReward(contributor, contributorReward);
        _transferReward(modelOwner, ownerReward);
        
        emit RewardDistributed(contributor, contributorReward, ownerReward);
    }
}
```

### 2. Verification Methods

Choose from multiple verification methods:

1. **Zero-Knowledge Proofs (zkProof)**
   - Privacy-preserving verification of improvements
   - Computationally intensive but secure
   - Suitable for sensitive data and private models
   - Requires proof generation and verification

2. **Oracle Attestation**
   - Faster verification through trusted validators
   - Good for public data and models
   - Requires validator consensus
   - Lower computational overhead

3. **Hybrid Approach**
   - Combines both methods for optimal balance
   - Uses zkProof for sensitive data
   - Uses oracle for public data
   - Flexible verification based on data type

## Token Inflation Qualification

### 1. Improvement Thresholds

To qualify for rewards:

1. **Minimum Improvement**
   - Must exceed baseline by threshold
   - Typically 1-5 basis points
   - Varies by model type

2. **Statistical Significance**
   - Must be statistically significant
   - Requires sufficient test data
   - Prevents random fluctuations

3. **Consistency Requirements**
   - Must maintain improvement
   - Multiple validation runs
   - Cross-validation checks

### 2. Reward Distribution

When improvement is verified:

1. **Reward Calculation**
   ```solidity
   // Example reward calculation flow
   function processImprovement(
       address contributor,
       uint256 baseline,
       uint256 newPerformance
   ) public {
       // Verify improvement and calculate DeltaOnes
       uint256 deltaOnes = verifier.verifyAndCalculateReward(
           contributor,
           baseline,
           newPerformance
       );
       
       // Distribute rewards
       verifier.distributeReward(contributor, deltaOnes);
       
       // Record the improvement
       emit ImprovementRecorded(
           contributor,
           baseline,
           newPerformance,
           deltaOnes
       );
   }
   ```

2. **Distribution Rules**
   - 70% of DeltaOnes to data contributors
   - 30% of DeltaOnes to model owner
   - Proportional to contribution impact
   - Automatic distribution through smart contracts

## Performance Tracking

### 1. Real-time Monitoring

Track model performance through:

1. **Performance Dashboard**
   - Current metrics
   - Historical trends
   - Improvement tracking
   - Reward distribution

2. **Analytics Tools**
   - Contribution impact
   - Reward calculations
   - Performance comparisons
   - ROI analysis

### 2. Reporting

Generate comprehensive reports:

```python
from hokusai import PerformanceTracker

# Initialize tracker
tracker = PerformanceTracker(model_id='your_model_id')

# Get performance report
report = tracker.generate_report(
    timeframe='last_30_days',
    metrics=['accuracy', 'precision', 'recall'],
    include_contributions=True
)

print(f"Performance Summary: {report.summary}")
print(f"Total Improvements: {report.improvements}")
print(f"DeltaOnes Earned: {report.delta_ones}")
```

## Best Practices

1. **Data Quality**
   - Ensure high-quality data
   - Validate before submission
   - Monitor data drift
   - Regular updates

2. **Performance Optimization**
   - Target specific metrics
   - Focus on significant improvements
   - Consider model limitations
   - Balance trade-offs

3. **Reward Management**
   - Monitor reward rates
   - Track distribution
   - Optimize earnings
   - Maintain liquidity

## Troubleshooting

Common issues and solutions:

1. **Verification Failures**
   - Check data quality
   - Verify metrics
   - Review thresholds
   - Check significance

2. **Reward Distribution**
   - Verify smart contracts
   - Check wallet addresses
   - Monitor gas fees
   - Review distribution rules

3. **Performance Issues**
   - Analyze metrics
   - Check data quality
   - Review model updates
   - Monitor drift

## Next Steps

- Learn about [Creating Models](/creating-models)
- Understand [Model API Guide](/model-api-guide)
- Review [Auction Pricing](/auction-pricing)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).

