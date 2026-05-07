# Treasury & Access Mechanics

## HokusaiAMM (Bonding Curve)

The HokusaiAMM contract implements a **Constant Reserve Ratio (CRR)** bonding curve for each model token.

### Core Mechanics
- **Buy tokens**: Deposit USDC, receive tokens at bonding curve price
- **Sell tokens**: Burn tokens, receive USDC under the AMM's active pricing regime
- **Price formula**: P = R / (w × S) where R=reserve, w=CRR, S=supply
- **Always-available liquidity**: No need for liquidity providers

### Initial Bonding Ratio (IBR) Phase
- **Launch price**: $0.01 per token
- **Handoff threshold**: $25,000 USDC reserve
- **Max duration**: 7 days
- **Purpose**: Bootstrap reserve depth before CRR pricing

### Fee Structure

**AMM Trading Fees** (when buying/selling tokens on the AMM):
- **Trade fee**: 0.30% default (max 10%, governance-controlled)
- **Protocol fee**: 5% of trade fee (max 50%, governance-controlled)
- These fees are deducted from AMM trades

**API Usage Fees** (when using the model API):
- **Per-model configurable split** via `infrastructureAccrualBps` in HokusaiParams
- **Infrastructure accrual**: 50-100% to `InfrastructureReserve` (covers compute costs)
- **Profit share**: Residual to AMM Reserve (increases token backing and price)
- Routed by `UsageFeeRouter` contract based on per-model parameters

### Key Features
- **Slippage protection**: minTokens/minUSDC parameters
- **Deadline protection**: Transaction must execute before deadline
- **Emergency pause**: Owner can pause trading if needed
- **Fee deposits**: Profit share increases reserves without minting

[Complete AMM Documentation →](/smart-contracts/hokusai-amm)

## HokusaiAMMFactory

Deploys new AMM contracts for each model token.

### Responsibilities
- Deploy HokusaiAMM instances
- Set initial parameters (CRR, fees, IBR phase)
- Register AMM with ModelRegistry
- Grant appropriate roles (fee depositor, etc.)

## UsageFeeRouter

Routes API usage fees between infrastructure accrual and profit share based on per-model parameters.

### Per-Model Fee Distribution

The `UsageFeeRouter` reads each model's `infrastructureAccrualBps` from `HokusaiParams` and routes fees accordingly:

1. **Infrastructure Accrual (50-100%)**:
   - Sent to `InfrastructureReserve` contract
   - Per-model accounting tracks accrued amounts
   - Covers compute, hosting, bandwidth costs
   - Paid out manually with invoice tracking

2. **Profit Share (0-50%, residual)**:
   - Deposited to AMM Reserve via `depositFees()`
   - Increases USDC backing of tokens
   - Raises token price without minting
   - Benefits all token holders proportionally

**Important**: This is the ONLY automated fee routing. There are no additional fee streams for staking, governance rewards, or other purposes from API usage fees.

### Functions
- `depositFee(modelId, amount)`: Routes fees based on model's infrastructure accrual rate
- `batchDepositFees(modelIds, amounts)`: Batch routing for gas efficiency
- `calculateFeeSplit(modelId, amount)`: View function to preview split
- Access controlled by `FEE_DEPOSITOR_ROLE`

### Example Split
```solidity
// Model with 80% infrastructure accrual
infrastructureAccrualBps = 8000; // from HokusaiParams

// On $1000 revenue:
infrastructureAmount = 1000 * 8000 / 10000 = $800 → InfrastructureReserve
profitAmount = 1000 - 800 = $200 → AMM.depositFees()
```

## InfrastructureReserve

Isolated contract for accruing infrastructure costs and making payments to providers.

### Purpose
- Track per-model infrastructure cost accrual
- Hold USDC until provider payments are needed
- Enable transparent on-chain payment tracking with invoice references
- Provide accrual health metrics (runway days)

### Per-Model Accounting

```solidity
mapping(string => uint256) public accrued;   // Total accrued for infrastructure
mapping(string => uint256) public paid;      // Total paid to providers
mapping(string => address) public provider;  // Current provider per model
```

### Functions

**Deposits** (called by UsageFeeRouter):
- `deposit(modelId, amount)`: Record infrastructure accrual for a model
- `batchDeposit(modelIds, amounts)`: Batch deposits for gas efficiency

**Payments** (admin-controlled, manual):
- `payInfrastructureCost(modelId, payee, amount, invoiceHash, memo)`: Pay a provider with full audit trail
- `batchPayInfrastructureCosts(payments)`: Batch payments for multiple invoices

**Views**:
- `getAccrualRunway(modelId, dailyBurnRate)`: Days of runway at current burn rate
- `getNetAccrual(modelId)`: Current accrued balance
- `getModelAccounting(modelId)`: Full accounting summary

### Access Control
- **DEPOSITOR_ROLE**: Can deposit (granted to UsageFeeRouter)
- **PAYER_ROLE**: Can pay infrastructure costs (granted to multisig/treasury)
- **DEFAULT_ADMIN_ROLE**: Emergency functions

### Payment Transparency

Every payment records:
- Model ID
- Payee address
- Amount
- Invoice hash (keccak256 of invoice document)
- Memo (human-readable description)
- Payer address (who authorized)

```solidity
event InfrastructureCostPaid(
    string indexed modelId,
    address indexed payee,
    uint256 amount,
    bytes32 indexed invoiceHash,
    string memo,
    address payer
);
```

## ModelAccessController

Controls model API access and fee collection.

### Access Mechanisms
- **Pay-per-use**: USDC fees per API call (routed via UsageFeeRouter)
- **Subscription model**: Monthly USDC fee for unlimited access
- **Enterprise tiers**: Custom pricing agreements
- **Token holder perks**: Potential fee discounts for token holders (model-specific)

### Fee Routing
- All API usage fees are collected in USDC
- Fees routed through UsageFeeRouter based on per-model `infrastructureAccrualBps`
- Infrastructure portion accrues in InfrastructureReserve
- Profit portion deposited to AMM reserve
- No direct token burning required for API access

## Next Steps

- [HokusaiAMM Contract](/smart-contracts/hokusai-amm) - Complete technical reference
- [Token Flow](/smart-contracts/token-flow) - Mint and trade mechanics
- [API Fee Flow](/tokenomics/api-fee-flow) - How fees increase value
- [AMM Overview](/tokenomics/amm-overview) - High-level bonding curve explanation
