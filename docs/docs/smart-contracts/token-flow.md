# Token Flow

This document details the complete lifecycle of model tokens in the Hokusai ecosystem, from minting to burning.

## Token Lifecycle

```
[Minting Triggers]
    ↓
[Token Distribution]
    ↓
[Token Usage]
    ↓
[Burning Triggers]
```

## Minting Triggers

### 1. Performance Improvement
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

#### Improvement Calculation
- Based on basis points (bps) of improvement
- Minimum threshold: 100 bps (1%)
- Maximum reward per improvement
- Cooldown period between improvements

### 2. Initial Model Registration
```solidity
function mintInitialSupply(
    bytes32 modelId,
    address owner,
    uint256 initialScore
) external onlyRegistry {
    require(initialScore >= MINIMUM_SCORE, "Score too low");
    uint256 initialSupply = calculateInitialSupply(initialScore);
    _mint(owner, initialSupply);
    emit ModelRegistered(modelId, owner, initialSupply);
}
```

#### Initial Supply Rules
- Based on model performance score
- Minimum initial supply
- Maximum initial supply
- Vesting schedule for team tokens

## Burning Triggers

### 1. Model Access
```solidity
function burnForAccess(
    bytes32 modelId,
    uint256 amount
) external {
    require(balanceOf(msg.sender) >= amount, "Insufficient balance");
    _burn(msg.sender, amount);
    emit AccessGranted(modelId, msg.sender, amount);
}
```

#### Access Burn Rates
- Standard rate: 1 token per request
- Batch discount: Up to 25% off
- Enterprise rates: Custom agreements

### 2. Treasury Redemption
```solidity
function burnForUSDC(
    uint256 tokenAmount,
    uint256 minUSDC
) external {
    require(tokenAmount > 0, "Amount must be > 0");
    uint256 usdcAmount = calculateUSDCAmount(tokenAmount);
    require(usdcAmount >= minUSDC, "Slippage too high");
    _burn(msg.sender, tokenAmount);
    usdc.transfer(msg.sender, usdcAmount);
    emit TokensRedeemed(msg.sender, tokenAmount, usdcAmount);
}
```

#### Redemption Rules
- Price impact calculation
- Slippage protection
- Minimum redemption amount
- Cooldown periods

## Token Distribution

### 1. Contributor Distribution
```solidity
struct ContributorReward {
    address contributor;
    uint256 share;
    uint256 vestingPeriod;
    uint256 startTime;
}

function distributeRewards(
    ContributorReward[] calldata rewards
) external onlyManager {
    for (uint i = 0; i < rewards.length; i++) {
        _mintVested(
            rewards[i].contributor,
            rewards[i].share,
            rewards[i].vestingPeriod,
            rewards[i].startTime
        );
    }
}
```

#### Distribution Rules
- Proportional to contribution
- Vesting schedules
- Cliff periods
- Early withdrawal penalties

### 2. Treasury Distribution
```solidity
function distributeTreasuryRewards(
    address[] calldata recipients,
    uint256[] calldata amounts
) external onlyTreasury {
    require(recipients.length == amounts.length, "Length mismatch");
    for (uint i = 0; i < recipients.length; i++) {
        _mint(recipients[i], amounts[i]);
    }
}
```

#### Treasury Rules
- Protocol fee distribution
- Liquidity provider rewards
- Emergency fund allocation

## Token Flow Diagram

```
[Model Performance] → [Verifier] → [Token Manager]
    ↓
[Contributor Rewards] → [Vesting] → [Distribution]
    ↓
[Model Access] → [Burn] → [Treasury]
    ↓
[USDC Redemption] ← [Bonding Curve] ← [Liquidity Pool]
```

## Monitoring and Analytics

### 1. Supply Metrics
- Total supply
- Circulating supply
- Burned tokens
- Minted tokens

### 2. Flow Metrics
- Daily minting volume
- Daily burning volume
- Active users
- Token velocity

### 3. Performance Metrics
- Model improvement rate
- Access frequency
- Treasury health

## Next Steps

- Review [Security Measures](/smart-contracts/security)
- Understand [Governance](/smart-contracts/governance)
- Learn about [Tokenomics](/tokenomics)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 