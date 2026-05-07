---
sidebar_position: 3
---

# Bonding Curve Mathematics

The Hokusai protocol uses a **Constant Reserve Ratio (CRR)** bonding curve for price discovery and continuous liquidity. This document explains the mathematical model, formulas, and calculations behind the HokusaiAMM.

## Overview

The CRR bonding curve is a mathematical function that determines token price based on the relationship between USDC reserves and token supply. It provides:

- **Predictable price discovery** through deterministic formulas
- **Continuous liquidity** without liquidity providers
- **Fair token distribution** based on reserve backing
- **Price stability** through reserve management
- **API fee integration** that increases token value

## CRR Model Fundamentals

### The Invariant

The core principle of a Constant Reserve Ratio (CRR) bonding curve is maintaining a constant ratio between the reserve and the market cap:

```
k = R^w × S

Where:
  k = Invariant constant
  R = USDC reserve balance
  S = Token supply
  w = Constant Reserve Ratio (CRR)
```

This invariant `k` remains constant during trades, similar to how `x * y = k` works in Uniswap.

### Reserve Ratio (w)

The reserve ratio (w) determines how sensitive the price is to supply changes:

- **Low w (e.g., 10%)**: More volatile price, higher returns, higher risk
- **High w (e.g., 40%)**: More stable price, lower returns, lower risk
- **Hokusai Range**: 5% to 100% (governance-controlled)

**Example Reserve Ratios**:
```
w = 10% → Every 10% supply increase → ~10% price increase
w = 30% → Every 10% supply increase → ~30% price increase
w = 50% → Every 10% supply increase → ~50% price increase
```

## Core Formulas

### Spot Price Formula

The current market price per token at any moment:

```
P = R / (w × S)

Where:
  P = Spot price (USDC per token)
  R = Current USDC reserve
  S = Current token supply
  w = Reserve ratio (CRR)
```

**Example Calculation**:
```
R = 100,000 USDC
S = 1,000,000 tokens
w = 0.2 (20%)

P = 100,000 / (0.2 × 1,000,000)
P = 100,000 / 200,000
P = 0.5 USDC per token
```

### Buy Formula

When buying tokens, you deposit USDC (E) and receive tokens (T):

```
T = S × ((1 + E/R)^w - 1)

Where:
  T = Tokens minted and received
  S = Current supply before purchase
  R = Current reserve before purchase
  E = USDC deposited (after fees)
  w = Reserve ratio
```

**Derivation** (from the invariant):
```
Before: k = R^w × S
After:  k = (R + E)^w × (S + T)

Since k is constant:
R^w × S = (R + E)^w × (S + T)

Solving for T:
S / (S + T) = (R + E)^w / R^w
S / (S + T) = ((R + E) / R)^w
S / (S + T) = (1 + E/R)^w
S = (S + T) × (1 + E/R)^w
S / (1 + E/R)^w = S + T
T = S / (1 + E/R)^w - S
T = S × (1 / (1 + E/R)^w - 1)
T = S × ((1 + E/R)^w - 1)  [after algebraic manipulation]
```

**Example Calculation**:
```
Buying with 1,000 USDC
R = 100,000 USDC
S = 1,000,000 tokens
w = 0.2
E = 1,000 USDC

T = 1,000,000 × ((1 + 1,000/100,000)^0.2 - 1)
T = 1,000,000 × ((1.01)^0.2 - 1)
T = 1,000,000 × (1.00199 - 1)
T = 1,000,000 × 0.00199
T ≈ 1,990 tokens

New State:
R = 101,000 USDC
S = 1,001,990 tokens
New Price = 101,000 / (0.2 × 1,001,990) ≈ 0.504 USDC/token
```

### Sell Formula

When selling tokens, you burn tokens (T) and receive USDC (F):

```
F = R × (1 - (1 - T/S)^(1/w))

Where:
  F = USDC returned (after fees)
  T = Tokens burned
  S = Current supply before sale
  R = Current reserve before sale
  w = Reserve ratio
```

**Derivation** (from the invariant):
```
Before: k = R^w × S
After:  k = (R - F)^w × (S - T)

Since k is constant:
R^w × S = (R - F)^w × (S - T)

Solving for F:
S / (S - T) = R^w / (R - F)^w
(S / (S - T))^(1/w) = R / (R - F)
(R - F) = R / (S / (S - T))^(1/w)
F = R - R / (S / (S - T))^(1/w)
F = R × (1 - (S - T) / S)^(1/w))
F = R × (1 - (1 - T/S)^(1/w))
```

**Example Calculation**:
```
Selling 1,990 tokens
R = 101,000 USDC
S = 1,001,990 tokens
w = 0.2
T = 1,990 tokens

F = 101,000 × (1 - (1 - 1,990/1,001,990)^(1/0.2))
F = 101,000 × (1 - (0.998013)^5)
F = 101,000 × (1 - 0.99010)
F = 101,000 × 0.00990
F ≈ 999.9 USDC

New State:
R = 100,000.1 USDC (approximately back to original)
S = 1,000,000 tokens
Price ≈ 0.5 USDC/token (back to original)
```

## Price Impact Analysis

### Buy Price Impact

The average price paid when buying is always higher than the spot price before the trade:

```
Average Price = E / T = E / (S × ((1 + E/R)^w - 1))
```

**Price Impact Percentage**:
```
Impact% = (Average Price - Spot Price) / Spot Price × 100
```

**Example**:
```
Before Buy:
  Spot Price = 0.5 USDC/token

Buying 1,990 tokens for 1,000 USDC:
  Average Price = 1,000 / 1,990 ≈ 0.5025 USDC/token
  Price Impact = (0.5025 - 0.5) / 0.5 × 100 = 0.5%
```

### Sell Price Impact

The average price received when selling is always lower than the spot price before the trade:

```
Average Price = F / T = (R × (1 - (1 - T/S)^(1/w))) / T
```

**Example**:
```
Before Sell:
  Spot Price = 0.504 USDC/token

Selling 1,990 tokens for 999.9 USDC:
  Average Price = 999.9 / 1,990 ≈ 0.5025 USDC/token
  Price Impact = (0.504 - 0.5025) / 0.504 × 100 ≈ 0.3%
```

### Impact of Trade Size

Larger trades have proportionally larger price impact:

| Trade Size | % of Supply | Price Impact (w=0.2) |
|------------|-------------|----------------------|
| 1,000 tokens | 0.1% | ~0.05% |
| 10,000 tokens | 1% | ~0.5% |
| 100,000 tokens | 10% | ~5% |
| 500,000 tokens | 50% | ~40% |

**Takeaway**: Keep trades small relative to supply for minimal slippage.

## Reserve Dynamics

### Impact of Fee Deposits

When API fees are deposited via `depositFees()`:

```
Reserve increases: R → R + Fees
Supply unchanged: S → S
Price increases: P = R / (w × S)
```

**Example**:
```
Before Fee Deposit:
  R = 100,000 USDC
  S = 1,000,000 tokens
  P = 100,000 / (0.2 × 1,000,000) = 0.5 USDC/token

After Depositing 10,000 USDC:
  R = 110,000 USDC
  S = 1,000,000 tokens (unchanged)
  P = 110,000 / (0.2 × 1,000,000) = 0.55 USDC/token

Price increase = 10% (same as reserve increase)
```

**Key Insight**: Fee deposits increase price without diluting supply.

### Impact of Token Minting

When new tokens are minted as performance rewards:

```
Supply increases: S → S + Minted
Reserve unchanged: R → R (no USDC added)
Price decreases: P = R / (w × S)
```

**Example**:
```
Before Minting:
  R = 100,000 USDC
  S = 1,000,000 tokens
  P = 0.5 USDC/token

After Minting 100,000 tokens (10% increase):
  R = 100,000 USDC (unchanged)
  S = 1,100,000 tokens
  P = 100,000 / (0.2 × 1,100,000) ≈ 0.454 USDC/token

Price decrease ≈ 9% (dilution effect)
```

**Key Insight**: Token minting dilutes existing holders unless offset by fee deposits.

## Quick Reference: Trading Scenarios

| Scenario | USDC Amount | Tokens | Avg Price | Price Impact | Final Spot Price |
|----------|-------------|--------|-----------|--------------|------------------|
| **Small Buy** | 100 | ~199.8 | $0.5005 | 0.1% | $0.5005 |
| **Medium Buy** | 5,000 | ~9,765 | $0.512 | 2.4% | $0.539 |
| **Large Buy** | 20,000 | ~35,055 | $0.571 | 14.2% | $0.654 |
| **Fee Deposit** | +20,000 | 0 (no mint) | N/A | 0% slippage | +20% price |
| **Medium Sell** | ~5,880 | 10,000 | $0.588 | ~2% | $0.582 |

*Based on initial state: R=50k USDC, S=500k tokens, w=0.2, spot=$0.50*

**Key Observations:**
- Small trades (less than 1% of reserves): Minimal price impact (less than 0.5%)
- Medium trades (5-10% of reserves): Moderate impact (2-5%)
- Large trades (greater than 20% of reserves): Significant impact (10-20%+)
- Fee deposits: No slippage, proportional price increase

## Trading Examples

### Example 1: Small Buy (100 USDC)

**Initial State**:
```
R = 50,000 USDC
S = 500,000 tokens
w = 0.2
Spot Price = 50,000 / (0.2 × 500,000) = 0.5 USDC/token
```

**Buying**:
```
E = 100 USDC
T = 500,000 × ((1 + 100/50,000)^0.2 - 1)
T = 500,000 × ((1.002)^0.2 - 1)
T = 500,000 × (1.0003996 - 1)
T ≈ 199.8 tokens

Average Price = 100 / 199.8 ≈ 0.5005 USDC/token
Price Impact ≈ 0.1%
```

**Final State**:
```
R = 50,100 USDC
S = 500,199.8 tokens
New Spot Price ≈ 0.5005 USDC/token
```

### Example 2: Medium Buy (5,000 USDC)

**Initial State**:
```
R = 50,000 USDC
S = 500,000 tokens
w = 0.2
Spot Price = 0.5 USDC/token
```

**Buying**:
```
E = 5,000 USDC
T = 500,000 × ((1 + 5,000/50,000)^0.2 - 1)
T = 500,000 × ((1.1)^0.2 - 1)
T = 500,000 × (1.01953 - 1)
T ≈ 9,765 tokens

Average Price = 5,000 / 9,765 ≈ 0.512 USDC/token
Price Impact ≈ 2.4%
```

**Final State**:
```
R = 55,000 USDC
S = 509,765 tokens
New Spot Price ≈ 0.539 USDC/token
```

### Example 3: Large Buy (20,000 USDC)

**Initial State**:
```
R = 50,000 USDC
S = 500,000 tokens
w = 0.2
Spot Price = 0.5 USDC/token
```

**Buying**:
```
E = 20,000 USDC
T = 500,000 × ((1 + 20,000/50,000)^0.2 - 1)
T = 500,000 × ((1.4)^0.2 - 1)
T = 500,000 × (1.0701 - 1)
T ≈ 35,055 tokens

Average Price = 20,000 / 35,055 ≈ 0.571 USDC/token
Price Impact ≈ 14.2%
```

**Final State**:
```
R = 70,000 USDC
S = 535,055 tokens
New Spot Price ≈ 0.654 USDC/token
```

**Takeaway**: Large trades have significant price impact. Consider splitting.

### Example 4: Sell After Fee Deposit

**Initial State**:
```
R = 100,000 USDC
S = 1,000,000 tokens
Spot Price = 0.5 USDC/token
```

**Fee Deposit (+20,000 USDC)**:
```
R = 120,000 USDC
S = 1,000,000 tokens (unchanged)
New Spot Price = 120,000 / (0.2 × 1,000,000) = 0.6 USDC/token
```

**Selling 10,000 tokens**:
```
T = 10,000 tokens
F = 120,000 × (1 - (1 - 10,000/1,000,000)^(1/0.2))
F = 120,000 × (1 - (0.99)^5)
F = 120,000 × (1 - 0.9510)
F ≈ 5,880 USDC

Average Price = 5,880 / 10,000 = 0.588 USDC/token
```

**Observation**: Fee deposits allow sellers to exit at higher prices.

## Fee Calculations

### Trade Fees

Both buy and sell operations incur a trade fee:

```
Trade Fee % = 0.30% (default, max 10%)
Protocol Fee % = 5% of trade fee (default, max 50%)
```

**Buy Transaction**:
```
User deposits: 1,000 USDC
Trade fee (0.30%): 3.00 USDC
Protocol fee (5% of 3.00): 0.15 USDC
To reserve: 997.00 USDC
To protocol treasury: 0.15 USDC
To AMM operations: 2.85 USDC

Tokens calculated from: 997.00 USDC
```

**Sell Transaction**:
```
Tokens burned: 1,990
USDC from formula: 999.9 USDC
Trade fee (0.30%): 3.00 USDC
Protocol fee (5% of 3.00): 0.15 USDC
User receives: 996.90 USDC
```

### Fee Impact on Price

Fees create a **bid-ask spread**:

```
Buy Price ≈ Spot Price × (1 + Trade Fee %)
Sell Price ≈ Spot Price × (1 - Trade Fee %)

With 0.30% fee:
Spot = 0.5 USDC
Buy ≈ 0.5015 USDC
Sell ≈ 0.4985 USDC
Spread = 0.30 basis points
```

## Price Stability Features

### 1. Slippage Protection

The HokusaiAMM contract requires setting minimum outputs:

```solidity
function buy(uint256 minTokens, uint256 deadline) external;
function sell(uint256 tokenAmount, uint256 minUSDC, uint256 deadline) external;
```

**Example Usage**:
```javascript
// Get quote
const quote = await amm.getBuyQuote(ethers.parseUnits("1000", 6));

// Set 1% slippage tolerance
const minTokens = quote * 99n / 100n;

// Execute with protection
await amm.buy(minTokens, deadline);
```

### 2. Deadline Protection

Transactions must execute before a deadline:

```javascript
const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes
await amm.buy(minTokens, deadline);
```

Prevents transactions from executing at stale prices.

### 3. Parameter Bounds

Governance cannot set extreme parameters:

```
Reserve Ratio (w): 5% to 100%
Trade Fee: 0% to 10%
Protocol Fee: 0% to 50% of trade fee
```

Prevents manipulation through parameter changes.

## Advanced Topics

### Market Cap Calculation

```
Market Cap = Spot Price × Total Supply
Market Cap = (R / (w × S)) × S
Market Cap = R / w

Example:
R = 100,000 USDC
w = 0.2
Market Cap = 100,000 / 0.2 = 500,000 USDC
```

**Key Insight**: Market cap is always reserve divided by reserve ratio.

### Reserve Backing Percentage

```
Reserve Backing % = (Reserve / Market Cap) × 100
Reserve Backing % = (R / (R/w)) × 100
Reserve Backing % = w × 100

Example:
w = 0.2
Reserve Backing = 20%
```

**Key Insight**: The reserve ratio IS the reserve backing percentage.

### Total Value Locked (TVL)

```
TVL = Reserve Balance = R

Example:
R = 100,000 USDC
TVL = 100,000 USDC
```

### Fully Diluted Valuation (FDV)

If there's a maximum supply cap:

```
FDV = Spot Price × Max Supply
FDV = (R / (w × S_current)) × S_max
```

## Comparison with Other Models

### CRR vs Constant Product (Uniswap)

| Feature | CRR (Hokusai) | Constant Product |
|---------|---------------|------------------|
| Formula | R^w × S = k | x × y = k |
| Assets | Single (USDC) | Pair (Token/USDC) |
| Liquidity | Built-in | Needs LPs |
| Price | R / (w × S) | y / x |
| Slippage | Moderate | Moderate |
| IL Risk | None | Yes |

### CRR vs Linear Bonding Curve

| Feature | CRR | Linear |
|---------|-----|--------|
| Formula | R^w × S = k | P = m × S + b |
| Price Growth | Exponential | Linear |
| Reserve Growth | Exponential | Linear |
| Flexibility | High (adjust w) | Low |

## Practical Recommendations

### For Buyers

1. **Check spot price** before trading: `amm.spotPrice()`
2. **Get quote** for exact amounts: `amm.getBuyQuote(usdcAmount)`
3. **Set reasonable slippage** (1-3% for normal conditions)
4. **Split large orders** to reduce price impact
5. **Monitor reserve** to understand token backing

### For Sellers

1. **Verify bonding round ended**: `amm.isBuyOnlyPeriod() == false`
2. **Check sell quote**: `amm.getSellQuote(tokenAmount)`
3. **Set slippage protection**: `minUSDC` parameter
4. **Consider profit share deposits**: Has reserve grown from API profit share?
5. **Time exits strategically**: After profit deposits = higher prices

### For Model Developers

1. **Choose appropriate CRR** (w):
   - Low w (10-20%): High growth potential, volatile
   - Medium w (20-35%): Balanced growth and stability
   - High w (35-100%): Stable, conservative
2. **Monitor profit share deposits**: Ensure profit portion flows to reserves
3. **Set appropriate infrastructure accrual**: Balance cost coverage with profit share
3. **Communicate minting events**: Transparency prevents surprises
4. **Set reasonable trade fees**: 0.30% is the default

## Tools and Resources

### Quote Calculators

```javascript
// JavaScript example
function calculateBuy(usdcIn, reserve, supply, reserveRatio) {
    const ratio = usdcIn / reserve;
    const powered = Math.pow(1 + ratio, reserveRatio);
    return supply * (powered - 1);
}

function calculateSell(tokensIn, reserve, supply, reserveRatio) {
    const ratio = tokensIn / supply;
    const powered = Math.pow(1 - ratio, 1 / reserveRatio);
    return reserve * (1 - powered);
}
```

### Python Implementation

```python
def calculate_buy(usdc_in: float, reserve: float, supply: float, w: float) -> float:
    """Calculate tokens received for USDC deposited."""
    ratio = usdc_in / reserve
    powered = (1 + ratio) ** w
    return supply * (powered - 1)

def calculate_sell(tokens_in: float, reserve: float, supply: float, w: float) -> float:
    """Calculate USDC received for tokens burned."""
    ratio = tokens_in / supply
    powered = (1 - ratio) ** (1 / w)
    return reserve * (1 - powered)

def spot_price(reserve: float, supply: float, w: float) -> float:
    """Calculate current spot price."""
    return reserve / (w * supply)
```

## Next Steps

- **High-Level Overview**: [AMM Overview](/tokenomics/amm-overview)
- **Contract Reference**: [HokusaiAMM Smart Contract](/smart-contracts/hokusai-amm)
- **Trading Guides**: [Buy Tokens](/guides/buying-tokens) | [Sell Tokens](/guides/selling-tokens)
- **API Integration**: [API Fee Flow](/tokenomics/api-fee-flow)
- **Launch Period**: [Seven-Day Bonding Round](/tokenomics/launch-period)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).
