# Smart Contract Overview

Hokusai's smart contract system is modular, designed to support decentralized AI model development and tokenization. Here's a simplified flow:

```
[Data Contributor]
    ↓ submits data
[DeltaOneVerifier] → validates performance improvement
    ↓ confirms DeltaOne
[TokenManager] → mints model tokens
    ↓
[HokusaiAMM] → CRR bonding curve for buy/sell with USDC
    ↓
[API Usage] → UsageFeeRouter → InfrastructureReserve (costs)
                           → AMM reserve (profit) → price increases
    ↓
[ModelAccessController] → enforces API access control
```

## Key Components
- **Model-specific Hokusai tokens**: Earned via performance gains
- **HokusaiParams**: Per-model parameters including infrastructure accrual rate
- **DeltaOneVerifier**: Validates performance improvement off-chain
- **TokenManager**: Issues tokens, handles mint/burn logic, distributes rewards
- **HokusaiAMM**: CRR bonding curve for buying/selling tokens with USDC
- **UsageFeeRouter**: Routes API fees based on per-model infrastructure accrual rate
- **InfrastructureReserve**: Holds accrued infrastructure costs, pays providers
- **ModelAccessController**: Enforces access control and fee collection for model usage

## ERC20 Implementation

### Token Standards
- Implements standard ERC20 interface
- Additional functionality for model-specific features
- Supports metadata for model information

```solidity
interface IModelToken is IERC20 {
    function modelId() external view returns (bytes32);
    function performanceScore() external view returns (uint256);
    function lastImprovement() external view returns (uint256);
    function burnForAccess(uint256 amount) external;
}
```

### Token Properties
- **Name**: Model-specific token name
- **Symbol**: Unique identifier for the model
- **Decimals**: 18 (standard)
- **Total Supply**: Dynamic based on performance improvements
- **Transfer Restrictions**: None (freely transferable)

## Inflation Control

### Minting Rules
1. **Performance-Based Minting**
   - Only occurs when model performance improves
   - Amount based on improvement magnitude
   - Requires verification through DeltaOneVerifier

2. **Rate Limiting**
   - Maximum minting rate per time period
   - Cooldown periods between improvements
   - Cap on total supply increase

```solidity
struct MintingConfig {
    uint256 maxMintPerPeriod;
    uint256 cooldownPeriod;
    uint256 maxSupplyIncrease;
    uint256 currentPeriodMinted;
    uint256 lastMintTimestamp;
}
```

### Supply Management
- Dynamic supply based on model performance
- No fixed maximum supply
- Controlled through governance parameters
- Regular supply audits

## Token Supply Mechanisms

### API Fee Value Accrual
Model usage generates API fees that are split between infrastructure costs and profit:

1. **Fee Collection & Routing**
   - API usage fees collected in USDC
   - Each model has configurable `infrastructureAccrualBps` (50-100%) in HokusaiParams
   - Infrastructure portion → `InfrastructureReserve` contract (for provider payments)
   - Profit portion (residual) → AMM reserve via UsageFeeRouter
   - Reserve increase raises token price (P = R / (w × S))

2. **Price Impact**
   - Profit share deposited without minting tokens
   - Reserve grows, supply stays constant
   - Token holders benefit from genuine profit after infrastructure costs

### Token Burning via AMM
1. **Selling on AMM (After Day 7)**
   - Sell tokens for USDC through bonding curve
   - Price impact based on sell amount
   - Slippage protection
   - Tokens are burned when sold, USDC returned

2. **Supply Reduction**
   - Selling reduces both supply and reserves
   - Price adjusts according to CRR formula
   - Always-available liquidity

## System Interaction

### Component Relationships
```
[Model Registry]
    ↓
[Token Manager] ←→ [DeltaOne Verifier]
    ↓
[Bonding Curve] ←→ [Access Controller]
    ↓
[Governance System]
```

### Key Interactions
1. **Performance Verification**
   - Verifier checks improvement
   - TokenManager mints rewards
   - Registry updates model status. See [Model Lifecycle](../core-workflows/model-lifecycle) for the full state machine (DRAFT, PROPOSAL, REGISTERED, DEPLOYED).

2. **Access Control**
   - AccessController verifies access rights
   - API fees collected and routed
   - AMM provides liquidity

3. **Governance**
   - Parameter updates
   - Emergency controls
   - Protocol upgrades

## Security Considerations

### Access Control
- Role-based permissions
- Multi-signature requirements
- Timelock for sensitive operations

### Emergency Procedures
- Pause functionality
- Emergency withdrawal
- Circuit breaker implementation

## Next Steps

- Learn about [Token Flow](/smart-contracts/token-flow)
- Review [Security Measures](/smart-contracts/security)
- Understand [Governance](/smart-contracts/governance)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 
