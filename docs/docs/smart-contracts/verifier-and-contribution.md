# 📈 DeltaOne Verifier & Contribution Registry

## DeltaOneVerifier
- Verifies fractional DeltaOne improvements
- Accepts benchmark performance data
- Can integrate zkProof or oracle attestation

### Example:
```solidity
uint256 deltaInBps = (new - baseline) * 100;
reward = deltaInBps * rewardPerDeltaOne / 100;
```

## DataContributionRegistry
- Tracks data submissions using hashed identifiers
- Stores contributor weights
- Enables reward claims for valid contributions