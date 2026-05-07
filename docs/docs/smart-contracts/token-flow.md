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

### 2. Initial Allocation (At Deployment)

When a model token is deployed, two allocation caps are recorded on-chain. No tokens are minted at this stage:

```solidity
// Called by the model deployer via TokenManager.deployTokenWithAllocations(...)
// modelSupplierAllocation and investorAllocation are stored as caps; totalSupply starts at 0.
// maxSupply = modelSupplierAllocation + investorAllocation
```

#### Supplier Allocation Distribution
After the model passes verification, the Hokusai backend (not the deployer) calls:

```solidity
function distributeModelSupplierAllocation(
    string calldata modelId
) external onlyOwner {
    // Mints the supplier allocation cap to the modelSupplierRecipient.
    // Emits AllocationDistributed(modelId, modelSupplierRecipient, amount).
}
```

#### Investor Allocation
The investor allocation is a cap on tokens mintable via AMM buys. Tokens are minted lazily as buyers purchase through the AMM, up to this cap. The `AllocationDistributed` event passes `address(0)` as the recipient to signal that no pre-mint occurs.

#### Allocation Rules
- `totalSupply` is `0` immediately after deployment
- `maxSupply = modelSupplierAllocation + investorAllocation` (both in wei, 18 decimals)
- Supplier tokens are minted by the Hokusai backend after verification; the deployer does not trigger this call
- Investor allocation is consumed lazily by AMM buy activity

## Supply Reduction (AMM Selling)

### Selling Tokens on AMM
After launch, token holders can sell tokens back to the AMM for USDC under the active pricing regime. During IBR, quotes reflect the flat launch curve; after handoff, they reflect the CRR curve:

```solidity
function sell(
    uint256 tokenAmount,
    uint256 minUSDC,
    address to,
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
              [UsageFeeRouter: profit residual to reserve]
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
- Infrastructure accrual health

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
