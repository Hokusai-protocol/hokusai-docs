---
sidebar_position: 3
---

# HokusaiAMM Smart Contract

The `HokusaiAMM` contract implements a Constant Reserve Ratio (CRR) bonding curve for each model token, enabling continuous buying and selling with USDC reserves.

## Contract Overview

**Purpose**: Provide always-available liquidity for model tokens through a deterministic bonding curve mechanism.

**Key Features**:
- CRR-based buy/sell formulas
- Seven-day buy-only bonding round
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
// Token being traded
IERC20 public immutable token;

// Reserve token (USDC)
IERC20 public immutable reserveToken;

// Constant Reserve Ratio (5% to 100%)
uint256 public reserveRatio;

// Trade fee (0% to 10%)
uint256 public tradeFee;

// Protocol fee (0% to 50% of trade fee)
uint256 public protocolFee;

// End of buy-only period (timestamp)
uint256 public immutable buyOnlyUntil;

// Emergency pause flag
bool public paused;
```

### Constants

```solidity
uint256 public constant PRECISION = 1e18;
uint256 public constant MAX_RESERVE_RATIO = 1e18;  // 100%
uint256 public constant MIN_RESERVE_RATIO = 5e16;  // 5%
uint256 public constant MAX_TRADE_FEE = 10e16;     // 10%
uint256 public constant MAX_PROTOCOL_FEE = 50e16;  // 50%
```

## Core Functions

### buy()

Purchase tokens by depositing USDC.

```solidity
function buy(
    uint256 minTokens,
    uint256 deadline
) external payable nonReentrant returns (uint256 tokensBought);
```

**Parameters**:
- `minTokens`: Minimum tokens expected (slippage protection)
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
    uint256 usdcSpent,
    uint256 tokensBought,
    uint256 tradeFee,
    uint256 protocolFee
);
```

### sell()

Sell tokens back for USDC.

```solidity
function sell(
    uint256 tokenAmount,
    uint256 minUSDC,
    uint256 deadline
) external nonReentrant returns (uint256 usdcReceived);
```

**Parameters**:
- `tokenAmount`: Number of tokens to sell
- `minUSDC`: Minimum USDC expected (slippage protection)
- `deadline`: Transaction deadline timestamp

**Returns**: USDC amount received

**Restrictions**:
- ⚠️ **Cannot sell during buy-only period** (first 7 days)
- Requires token approval first

**Example**:
```javascript
const token = await ethers.getContractAt("HokusaiToken", tokenAddress);
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);

// Check if bonding round is over
const buyOnlyUntil = await amm.buyOnlyUntil();
if (Date.now() / 1000 < buyOnlyUntil) {
    throw new Error("Still in bonding round, cannot sell yet");
}

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
    uint256 tokensSold,
    uint256 usdcReceived,
    uint256 tradeFee,
    uint256 protocolFee
);
```

### depositFees()

Deposit profit share from API usage fees directly to reserves (no token minting).

```solidity
function depositFees(uint256 amount) external onlyFeeDepositor nonReentrant;
```

**Parameters**:
- `amount`: USDC amount to deposit (profit share after infrastructure accrual)

**Access**: Only addresses with `FEE_DEPOSITOR_ROLE` (typically `UsageFeeRouter`)

**Context**: The `UsageFeeRouter` calculates the profit share based on each model's `infrastructureAccrualBps` parameter. For example, if a model has 80% infrastructure accrual, only 20% of API revenue reaches this function.

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
    uint256 newReserve
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

### getReserve()

Get current USDC reserve balance.

```solidity
function getReserve() external view returns (uint256);
```

**Returns**: Current reserve in USDC

### getTotalSupply()

Get current token supply.

```solidity
function getTotalSupply() external view returns (uint256);
```

**Returns**: Current circulating supply

### isBuyOnlyPeriod()

Check if still in seven-day bonding round.

```solidity
function isBuyOnlyPeriod() external view returns (bool);
```

**Returns**: `true` if selling is disabled, `false` if full trading enabled

**Example**:
```javascript
const isBuyOnly = await amm.isBuyOnlyPeriod();
if (isBuyOnly) {
    console.log("Still in bonding round - buys only");
} else {
    console.log("Full trading enabled");
}
```

## Governance Functions

### updateParameters()

Update AMM parameters (owner only).

```solidity
function updateParameters(
    uint256 newReserveRatio,
    uint256 newTradeFee,
    uint256 newProtocolFee
) external onlyOwner;
```

**Parameters**:
- `newReserveRatio`: New CRR (5% to 100%)
- `newTradeFee`: New trade fee (0% to 10%)
- `newProtocolFee`: New protocol fee (0% to 50% of trade fee)

**Events Emitted**:
```solidity
event ParametersUpdated(
    uint256 reserveRatio,
    uint256 tradeFee,
    uint256 protocolFee
);
```

### pause() / unpause()

Emergency pause trading.

```solidity
function pause() external onlyOwner;
function unpause() external onlyOwner;
```

**Effect**: Disables buy/sell when paused, re-enables when unpaused

### withdrawTreasury()

Withdraw accumulated protocol fees.

```solidity
function withdrawTreasury(uint256 amount) external onlyOwner;
```

**Parameters**:
- `amount`: USDC amount to withdraw from protocol fee balance

## Access Control

The contract uses role-based access control:

### Roles

```solidity
bytes32 public constant FEE_DEPOSITOR_ROLE = keccak256("FEE_DEPOSITOR_ROLE");
```

**Owner** (`Ownable`):
- Update parameters
- Pause/unpause
- Withdraw treasury
- Grant/revoke roles

**Fee Depositor** (role-based):
- Deposit API fees
- Typically the `UsageFeeRouter` contract

### Granting Roles

```javascript
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);
const usageFeeRouter = "0x...";

// Grant FEE_DEPOSITOR_ROLE to UsageFeeRouter
const role = ethers.keccak256(ethers.toUtf8Bytes("FEE_DEPOSITOR_ROLE"));
await amm.grantRole(role, usageFeeRouter);
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
require(
    newReserveRatio >= MIN_RESERVE_RATIO &&
    newReserveRatio <= MAX_RESERVE_RATIO,
    "Invalid reserve ratio"
);
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
    uint256 reserve = getReserve();

    // T = S × ((1 + E/R)^w - 1)
    uint256 ratio = (usdcIn * PRECISION) / reserve;
    uint256 powered = power(PRECISION + ratio, reserveRatio);
    uint256 tokensOut = (supply * (powered - PRECISION)) / PRECISION;

    return tokensOut;
}
```

### Sell Calculation

```solidity
function calculateSell(uint256 tokensIn) internal view returns (uint256) {
    uint256 supply = token.totalSupply();
    uint256 reserve = getReserve();

    // F = R × (1 - (1 - T/S)^(1/w))
    uint256 ratio = (tokensIn * PRECISION) / supply;
    uint256 invRatio = PRECISION - ratio;
    uint256 powered = power(invRatio, PRECISION / reserveRatio);
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

        // Check if selling is allowed
        const isBuyOnly = await amm.isBuyOnlyPeriod();
        if (isBuyOnly) {
            throw new Error("Selling not allowed during bonding round");
        }

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

### "Cannot sell during bonding round"

**Cause**: Trying to sell before day 7 complete

**Solution**: Wait until `buyOnlyUntil` timestamp passes

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

    it("should prevent selling during bonding round", async function() {
        await expect(
            amm.sell(ethers.parseUnits("100", 18), 0, deadline)
        ).to.be.revertedWith("Selling not allowed during bonding round");
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
- [HokusaiAMMFactory](/smart-contracts/treasury-and-access) - Pool deployment
- [UsageFeeRouter](/smart-contracts/treasury-and-access) - Fee routing
- [TokenManager](/smart-contracts/model-tokens-and-token-manager) - Token minting

## Next Steps

- [AMM Overview](/tokenomics/amm-overview) - High-level understanding
- [Bonding Curve Math](/tokenomics/bonding-curve) - Detailed formulas
- [Buy Tokens Guide](/guides/buying-tokens) - Step-by-step buying
- [Sell Tokens Guide](/guides/selling-tokens) - Step-by-step selling

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).
