# Token Flow

This document details the complete lifecycle of model tokens in the Hokusai ecosystem, from minting through trading on the AMM.

## Token Lifecycle

```
[Minting Triggers]
    ↓
[Token Distribution]
    ↓
[Token Usage: Hold / Trade / API Revenue]
    ↓
[AMM Trading or Fee Revenue]
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

## Supply Reduction (AMM Selling)

### Selling Tokens on AMM
After launch, token holders can sell tokens back to the AMM for USDC under the active pricing regime. During IBR, quotes reflect the flat launch curve; after handoff, they reflect the CRR curve:

```solidity
function sell(
    uint256 tokenAmount,
    uint256 minUSDC,
    uint256 deadline
) external nonReentrant returns (uint256 usdcAmount) {
    require(tokenAmount > 0, "Amount must be > 0");

    usdcAmount = getSellQuote(tokenAmount);
    require(usdcAmount >= minUSDC, "Slippage too high");
    require(block.timestamp <= deadline, "Transaction expired");

    _burn(msg.sender, tokenAmount);
    reserve -= usdcAmount;
    usdc.transfer(msg.sender, usdcAmount);

    emit TokensSold(msg.sender, tokenAmount, usdcAmount);
}
```

#### Selling Mechanics
- Tokens are burned when sold
- USDC returned from reserve
- Price determined by CRR bonding curve
- Slippage and deadline protection

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

### Complete Token Lifecycle

```
[Performance Improvement] → [DeltaOneVerifier] → [TokenManager]
           ↓
    [Mint Tokens] → [Contributor Rewards]
           ↓
    [Token Holders]
      ↙    ↓    ↘
  [Hold] [Trade] [Benefit from API Revenue]
     ↓      ↓              ↓
   [AMM Buy/Sell]    [Model Usage]
         ↓                 ↓
     [USDC]          [API Fees Collected]
                           ↓
              [UsageFeeRouter: 20% to Reserve]
                           ↓
              [Reserve ↑] → [Price ↑]
```

### Minting Flow

```
[Data Contribution] → [Model Improvement] → [Benchmark Testing]
                              ↓
                    [DeltaOne Verification]
                              ↓
                    [Token Minting (TokenManager)]
                              ↓
                    [Distribution to Contributors]
                              ↓
                    [Supply Increases]
```

### Supply Reduction Flow

```
AMM Selling:
[Holder] → [sell() on AMM] → [Tokens Burned] → [Receive USDC]
                                    ↓
                [Reserve ↓, Supply ↓, Price Adjusts]
```

### Fee Deposit Flow (No Minting)

```
[Model API Usage] → [Revenue Collection] → [Convert to USDC]
                              ↓
                    [UsageFeeRouter]
                              ↓
                    [depositFees() on AMM]
                              ↓
                    [Reserve Increases, Supply Unchanged]
                              ↓
                    [Spot Price = R/(w×S) Increases]
```

### AMM Trading Flow

```
Buying:
[User] → [Deposit USDC] → [buy() on AMM] → [Mint Tokens] → [Receive Tokens]
                                 ↓
                    [Reserve ↑, Supply ↑, Price ↑]

Selling:
[Holder] → [Approve Tokens] → [sell() on AMM] → [Tokens Burned] → [Receive USDC]
                                    ↓
                    [Reserve ↓, Supply ↓, Price Adjusts]
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

### 4. AMM Metrics
- Reserve balance (USDC)
- Token supply (circulating)
- Spot price
- Daily buy/sell volume
- Fee deposits (API revenue)
- Reserve growth rate

### 5. Supply Dynamics
- Minting events (performance rewards)
- Burning events (AMM sells)
- Net supply change (minting - burning)
- Dilution rate vs reserve growth

## Next Steps

- **AMM Details**: [HokusaiAMM Contract](/smart-contracts/hokusai-amm)
- **API Fee Flow**: [How Fees Increase Value](/tokenomics/api-fee-flow)
- **AMM Overview**: [Bonding Curve Trading](/tokenomics/amm-overview)
- **Security Measures**: [Contract Security](/smart-contracts/security)
- **Governance**: [Token Holder Governance](/smart-contracts/governance)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 
