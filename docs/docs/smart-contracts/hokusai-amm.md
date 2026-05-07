---
sidebar_position: 3
---

# HokusaiAMM Smart Contract

The `HokusaiAMM` contract implements a Constant Reserve Ratio (CRR) bonding curve for each model token, enabling continuous buying and selling with USDC reserves.

## Contract Overview

**Purpose**: Provide always-available liquidity for model tokens through a deterministic bonding curve mechanism.

**Key Features**:
- CRR-based buy/sell formulas
- IBR launch phase with flat pricing at $0.01/token until $25,000 reserves or 7 days
- API fee deposit mechanism
- Slippage and deadline protection
- Emergency pause capability
- Governance-controlled parameters

**Repository**: [hokusai-token](https://github.com/Hokusai-protocol/hokusai-token)

## Architecture

```
HokusaiToken (ERC20)
       ↕
HokusaiAMM ←→ USDC Reserve
       ↑
       |
UsageFeeRouter (deposits API fees)
```

## State Variables

### Core Parameters

```solidity
// Reserve token (USDC)
IERC20 public immutable reserveToken;

// Model token and mint/burn delegate
address public immutable hokusaiToken;
TokenManager public immutable tokenManager;

// Constant Reserve Ratio (ppm; 5% to 100%)
uint256 public crr;

// Trade fee in bps (0% to 10%)
uint256 public tradeFee;

// Fee recipient for AMM trading fees
address public treasury;

// Launch-phase metadata and trade state helpers may expose IBR timing
uint256 public immutable ibrEndTime;

// Tracked reserve balance
uint256 public reserveBalance;
```

### Constants

```solidity
uint256 public constant PRECISION = 1e18;
uint256 public constant MAX_CRR = 1000000; // 100%
uint256 public constant MIN_CRR = 50000;   // 5%
uint256 public constant MAX_TRADE_FEE = 1000; // 10%
uint256 public constant MAX_TRADE_BPS_LIMIT = 5000; // 50%
```

## Core Functions

### buy()

Purchase tokens by depositing USDC.

```solidity
function buy(
    uint256 reserveIn,
    uint256 minTokensOut,
    address to,
    uint256 deadline
) external nonReentrant returns (uint256 tokensOut);
```

**Parameters**:
- `reserveIn`: USDC amount to deposit
- `minTokensOut`: Minimum tokens expected (slippage protection)
- `to`: Recipient of minted tokens
- `deadline`: Transaction deadline timestamp

**Returns**: Number of tokens purchased

**Example**:
```javascript
const usdc = await ethers.getContractAt("IERC20", usdcAddress);
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);

// Approve USDC spending
await usdc.approve(ammAddress, ethers.parseUnits("1000", 6));

// Get quote first
const quote = await amm.getBuyQuote(ethers.parseUnits("1000", 6));
const minTokens = quote * 99n / 100n; // 1% slippage tolerance

// Execute buy
const deadline = Math.floor(Date.now() / 1000) + 300; // 5 min
const tx = await amm.buy(minTokens, deadline, {
    value: ethers.parseUnits("1000", 6)
});

await tx.wait();
console.log(`Bought ${ethers.formatUnits(quote, 18)} tokens`);
```

**Formula**:
```
T = S × ((1 + E/R)^w - 1)

Where:
  T = Tokens minted
  S = Current supply
  R = Current reserve
  E = USDC deposited (after fees)
  w = Reserve ratio
```

**Events Emitted**:
```solidity
event Buy(
    address indexed buyer,
    uint256 reserveIn,
    uint256 tokensOut,
    uint256 fee,
    uint256 spotPrice
);
```

### sell()

Sell tokens back for USDC.

```solidity
function sell(
    uint256 tokensIn,
    uint256 minReserveOut,
    address to,
    uint256 deadline
) external nonReentrant returns (uint256 reserveOut);
```

**Parameters**:
- `tokensIn`: Number of tokens to sell
- `minReserveOut`: Minimum USDC expected (slippage protection)
- `to`: Recipient of USDC
- `deadline`: Transaction deadline timestamp

**Returns**: USDC amount received

**Restrictions**:
- ⚠️ Sell quotes depend on whether the AMM is still in IBR or has handed off to CRR pricing
- Requires token approval first

**Example**:
```javascript
const token = await ethers.getContractAt("HokusaiToken", tokenAddress);
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);

// Approve token spending
const tokenAmount = ethers.parseUnits("1000", 18);
await token.approve(ammAddress, tokenAmount);

// Get quote
const quote = await amm.getSellQuote(tokenAmount);
const minUSDC = quote * 99n / 100n; // 1% slippage

// Execute sell
const deadline = Math.floor(Date.now() / 1000) + 300;
const tx = await amm.sell(tokenAmount, minUSDC, deadline);

await tx.wait();
console.log(`Received ${ethers.formatUnits(quote, 6)} USDC`);
```

### Factory Defaults

| Parameter | Default |
|-----------|---------|
| CRR | 20% (`200,000 ppm`) |
| Trade fee | 0.30% (`30 bps`) |
| Max IBR duration | 7 days |
| Flat-curve threshold | $25,000 USDC |
| Flat-curve price | $0.01 per token |

**Formula**:
```
F = R × (1 - (1 - T/S)^(1/w))

Where:
  F = USDC returned (after fees)
  T = Tokens burned
  S = Current supply
  R = Current reserve
  w = Reserve ratio
```

**Events Emitted**:
```solidity
event Sell(
    address indexed seller,
    uint256 tokensIn,
    uint256 reserveOut,
    uint256 fee,
    uint256 spotPrice
);
```

### depositFees()

Deposit profit share from API usage fees directly to reserves (no token minting).

```solidity
function depositFees(uint256 amount) external nonReentrant;
```

**Parameters**:
- `amount`: USDC amount to deposit (profit share after infrastructure accrual)

**Context**: The contract itself does not enforce `FEE_DEPOSITOR_ROLE`. In practice, the intended caller is the `UsageFeeRouter`, which routes the profit residual from API usage fees.

**Effect**:
- Increases reserve (R ↑)
- Supply unchanged (S same)
- Spot price increases: P = R / (w × S)

**Example**:
```javascript
// Called by UsageFeeRouter contract after splitting fees
// If $10,000 API revenue with 80% infrastructure accrual:
// - $8,000 → InfrastructureReserve.deposit()
// - $2,000 → HokusaiAMM.depositFees() (this function)

const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);
const usdc = await ethers.getContractAt("IERC20", usdcAddress);

// Approve and deposit profit share
const profitAmount = ethers.parseUnits("2000", 6);
await usdc.approve(ammAddress, profitAmount);
await amm.depositFees(profitAmount);

// Price increased without minting tokens
```

**Events Emitted**:
```solidity
event FeesDeposited(
    address indexed depositor,
    uint256 amount,
    uint256 newReserveBalance,
    uint256 newSpotPrice
);
```

## View Functions

### spotPrice()

Get current price per token.

```solidity
function spotPrice() external view returns (uint256);
```

**Returns**: Current price in USDC (scaled by PRECISION)

**Formula**: `P = R / (w × S)`

**Example**:
```javascript
const price = await amm.spotPrice();
console.log(`Current price: ${ethers.formatUnits(price, 18)} USDC per token`);
```

### getBuyQuote()

Calculate tokens received for a given USDC amount.

```solidity
function getBuyQuote(uint256 usdcAmount) external view returns (uint256);
```

**Parameters**:
- `usdcAmount`: USDC to spend

**Returns**: Tokens that would be received (after fees)

**Example**:
```javascript
const usdcAmount = ethers.parseUnits("1000", 6);
const tokensOut = await amm.getBuyQuote(usdcAmount);
console.log(`1000 USDC → ${ethers.formatUnits(tokensOut, 18)} tokens`);
```

### getSellQuote()

Calculate USDC received for a given token amount.

```solidity
function getSellQuote(uint256 tokenAmount) external view returns (uint256);
```

**Parameters**:
- `tokenAmount`: Tokens to sell

**Returns**: USDC that would be received (after fees)

**Example**:
```javascript
const tokenAmount = ethers.parseUnits("1000", 18);
const usdcOut = await amm.getSellQuote(tokenAmount);
console.log(`1000 tokens → ${ethers.formatUnits(usdcOut, 6)} USDC`);
```

### getReserves()

Get current USDC reserve balance.

```solidity
function getReserves() external view returns (uint256 reserve, uint256 supply);
```

**Returns**: Current reserve and token supply

### getPoolState()

Get current token supply.

```solidity
function getPoolState()
    external
    view
    returns (
        uint256 reserve,
        uint256 supply,
        uint256 price,
        uint256 reserveRatio,
        uint256 tradeFeeRate
    );
```

**Returns**: Reserve, supply, spot price, CRR, and trade fee

### Launch-Phase Status

Deployed AMM interfaces should expose enough state to determine whether the market is still in the **IBR flat-price phase** or has already handed off to CRR pricing.

At minimum, an integration should surface:

- Whether the AMM is still in IBR
- When the 7-day IBR cap expires
- Whether the reserve threshold handoff has already occurred

**Integration goal**: show users whether quotes are still on the **$0.01 launch curve** or on the **CRR bonding curve**.

## Governance Functions

### setParameters()

Update CRR and trade fee (owner only).

```solidity
function setParameters(
    uint256 newCrr,
    uint256 newTradeFee
) external onlyOwner;
```

**Parameters**:
- `newCrr`: New CRR in ppm
- `newTradeFee`: New trade fee in bps

**Events Emitted**:
```solidity
event ParametersUpdated(
    uint256 newCrr,
    uint256 newTradeFee
);
```

### setMaxTradeBps()

Update the maximum single-trade size relative to reserve balance.

```solidity
function setMaxTradeBps(uint256 newMaxTradeBps) external onlyOwner;
```

### pause() / unpause()

Emergency pause trading.

```solidity
function pause() external onlyOwner;
function unpause() external onlyOwner;
```

**Effect**: Disables buy/sell when paused, re-enables when unpaused

### withdrawTreasury()

Withdraw accumulated trade-fee balance from the contract.

```solidity
function withdrawTreasury(uint256 amount) external onlyOwner;
```

**Parameters**:
- `amount`: USDC amount to withdraw from the AMM-held trade-fee balance

The `treasury` here is a configurable AMM fee-recipient address. It is not a protocol-wide treasury for API usage fees.

## Access Control

The contract uses `Ownable` plus conventional integration with the router:

**Owner**:
- Update parameters
- Update max trade size
- Pause/unpause
- Withdraw accumulated trade fees

**Usage-fee depositor**:
- Typically the `UsageFeeRouter` contract
- Calls `depositFees()` with the profit residual after cost-plus routing

### Granting Roles

```javascript
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);
const usageFeeRouter = "0x...";

// The router approves USDC and calls depositFees()
await usdc.approve(ammAddress, profitAmount);
await amm.depositFees(profitAmount);
```

## Security Features

### Reentrancy Protection

All state-changing functions use OpenZeppelin's `nonReentrant` modifier:

```solidity
function buy(...) external nonReentrant { ... }
function sell(...) external nonReentrant { ... }
function depositFees(...) external nonReentrant { ... }
```

### Slippage Protection

Both buy and sell require minimum output amounts:

```solidity
require(tokensOut >= minTokens, "Slippage too high");
require(usdcOut >= minUSDC, "Slippage too high");
```

### Deadline Protection

Transactions expire after deadline:

```solidity
require(block.timestamp <= deadline, "Transaction expired");
```

### Parameter Bounds

All parameters have strict bounds enforced:

```solidity
require(newCrr >= MIN_CRR && newCrr <= MAX_CRR, "CRR out of bounds");
```

### Emergency Pause

Owner can pause in emergencies:

```solidity
modifier whenNotPaused() {
    require(!paused, "Contract paused");
    _;
}
```

## Mathematical Implementation

### Power Function

The contract implements `power(base, exponent)` for bonding curve calculations:

```solidity
function power(uint256 base, uint256 exponent) internal pure returns (uint256);
```

Uses fixed-point arithmetic with `PRECISION = 1e18` for accuracy.

### Buy Calculation

```solidity
function calculateBuy(uint256 usdcIn) internal view returns (uint256) {
    uint256 supply = token.totalSupply();
    uint256 reserve = reserveBalance;

    // T = S × ((1 + E/R)^w - 1)
    uint256 ratio = (usdcIn * PRECISION) / reserve;
    uint256 powered = power(PRECISION + ratio, crr);
    uint256 tokensOut = (supply * (powered - PRECISION)) / PRECISION;

    return tokensOut;
}
```

### Sell Calculation

```solidity
function calculateSell(uint256 tokensIn) internal view returns (uint256) {
    uint256 supply = token.totalSupply();
    uint256 reserve = reserveBalance;

    // F = R × (1 - (1 - T/S)^(1/w))
    uint256 ratio = (tokensIn * PRECISION) / supply;
    uint256 invRatio = PRECISION - ratio;
    uint256 powered = power(invRatio, PRECISION / crr);
    uint256 usdcOut = (reserve * (PRECISION - powered)) / PRECISION;

    return usdcOut;
}
```

## Integration Examples

### Frontend Integration

```typescript
import { ethers } from 'ethers';
import HokusaiAMMABI from './abis/HokusaiAMM.json';

class AMMService {
    private amm: ethers.Contract;

    constructor(provider: ethers.Provider, ammAddress: string) {
        this.amm = new ethers.Contract(ammAddress, HokusaiAMMABI, provider);
    }

    async getPrice(): Promise<number> {
        const price = await this.amm.spotPrice();
        return parseFloat(ethers.formatUnits(price, 18));
    }

    async buyTokens(
        signer: ethers.Signer,
        usdcAmount: string,
        slippagePct: number = 1
    ) {
        const amm = this.amm.connect(signer);
        const usdcIn = ethers.parseUnits(usdcAmount, 6);

        // Get quote
        const tokensOut = await amm.getBuyQuote(usdcIn);
        const minTokens = tokensOut * BigInt(100 - slippagePct) / 100n;

        // Set deadline
        const deadline = Math.floor(Date.now() / 1000) + 300;

        // Execute
        const tx = await amm.buy(minTokens, deadline, { value: usdcIn });
        return await tx.wait();
    }

    async sellTokens(
        signer: ethers.Signer,
        tokenAmount: string,
        slippagePct: number = 1
    ) {
        const amm = this.amm.connect(signer);
        const tokensIn = ethers.parseUnits(tokenAmount, 18);

        // Get quote
        const usdcOut = await amm.getSellQuote(tokensIn);
        const minUSDC = usdcOut * BigInt(100 - slippagePct) / 100n;

        // Approve tokens first
        const token = await ethers.getContractAt(
            "IERC20",
            await amm.token()
        );
        await (await token.connect(signer).approve(amm.target, tokensIn)).wait();

        // Set deadline
        const deadline = Math.floor(Date.now() / 1000) + 300;

        // Execute
        const tx = await amm.sell(tokensIn, minUSDC, deadline);
        return await tx.wait();
    }
}
```

### Backend Integration (Fee Deposits)

```typescript
import { ethers } from 'ethers';

class FeeDepositService {
    private router: ethers.Contract;

    async depositAPIFees(
        modelId: string,
        feeAmount: string
    ) {
        const amount = ethers.parseUnits(feeAmount, 6);

        // Get AMM address for this model
        const ammAddress = await this.getAMMForModel(modelId);

        // Approve and deposit
        const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);
        await (await usdc.approve(ammAddress, amount)).wait();

        const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);
        const tx = await amm.depositFees(amount);

        const receipt = await tx.wait();
        console.log(`Deposited ${feeAmount} USDC fees to reserve`);

        return receipt;
    }
}
```

## Common Errors

### "Slippage too high"

**Cause**: Price moved unfavorably between quote and execution

**Solution**: Increase slippage tolerance or split into smaller trades

### "Transaction expired"

**Cause**: Transaction took too long to mine

**Solution**: Increase deadline or use higher gas price

### "Unexpected sell quote or unavailable trade path"

**Cause**: The AMM may still be in the IBR flat-price phase, may have just handed off to CRR pricing, or the frontend may be checking outdated launch-state assumptions.

**Solution**: Re-read the AMM trade-status fields, refresh the quote, and confirm whether the market is still on the flat $0.01 launch curve or already on CRR pricing.

### "Insufficient allowance"

**Cause**: Token not approved for spending

**Solution**: Call `token.approve(ammAddress, amount)` first

### "Contract paused"

**Cause**: Emergency pause activated

**Solution**: Wait for unpause or check announcements

## Testing

Example test suite:

```javascript
describe("HokusaiAMM", function() {
    it("should buy tokens with correct price", async function() {
        const usdcAmount = ethers.parseUnits("1000", 6);
        const quote = await amm.getBuyQuote(usdcAmount);

        await usdc.approve(amm.target, usdcAmount);
        await amm.buy(quote * 99n / 100n, deadline);

        const balance = await token.balanceOf(buyer.address);
        expect(balance).to.be.gte(quote * 99n / 100n);
    });

    it("should reflect launch-phase pricing before CRR handoff", async function() {
        const quote = await amm.getSellQuote(ethers.parseUnits("100", 18));
        expect(quote).to.be.gte(0);
    });

    it("should increase price when fees deposited", async function() {
        const priceBefore = await amm.spotPrice();

        const feeAmount = ethers.parseUnits("10000", 6);
        await usdc.approve(amm.target, feeAmount);
        await amm.depositFees(feeAmount);

        const priceAfter = await amm.spotPrice();
        expect(priceAfter).to.be.gt(priceBefore);
    });
});
```

## Gas Optimization

**Typical Gas Costs** (estimated):
- `buy()`: ~150k gas
- `sell()`: ~170k gas
- `depositFees()`: ~80k gas
- `getBuyQuote()`: ~5k gas (view)
- `getSellQuote()`: ~5k gas (view)

**Optimization Tips**:
- Use view functions to calculate quotes off-chain
- Batch approve and trade in same block
- Set reasonable slippage to avoid failed transactions

## Related Contracts

- [HokusaiToken](/smart-contracts/model-tokens-and-token-manager) - ERC20 token implementation
- [Access Control & Roles](/smart-contracts/access-control) - Roles and operational permissions
- [Usage Fee Routing](/smart-contracts/usage-fee-routing) - Cost-plus fee routing
- [TokenManager](/smart-contracts/model-tokens-and-token-manager) - Token minting

## Next Steps

- [AMM Overview](/tokenomics/amm-overview) - High-level understanding
- [Bonding Curve Math](/tokenomics/bonding-curve) - Detailed formulas
- [Buy Tokens Guide](/guides/buying-tokens) - Step-by-step buying
- [Sell Tokens Guide](/guides/selling-tokens) - Step-by-step selling

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).
