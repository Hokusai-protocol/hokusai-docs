---
sidebar_position: 3
---

# Selling Tokens Guide

:::caution RISK WARNING

**Token sales may result in significant losses. Market conditions can change rapidly.**

Before selling:
- ✅ Verify current market price and liquidity
- ✅ Understand slippage and price impact
- ✅ Check for any selling restrictions or lock-up periods
- ✅ Be aware of tax implications in your jurisdiction

**This is a technical guide only, not financial advice. Consult professionals for tax and legal guidance.**

:::

This guide provides step-by-step instructions for selling Hokusai model tokens on the bonding curve AMM. Learn how to check if selling is enabled, get quotes, set slippage protection, and execute sales.

## Important Prerequisites

### ⚠️ Selling Restrictions

**You CANNOT sell during the seven-day bonding round (Days 0-6)**

```
Day 0-6:  ❌ Selling DISABLED (buy-only period)
Day 7+:   ✅ Selling ENABLED (full trading)
```

Before attempting to sell, verify the bonding round has ended.

### What You Need

1. **Token Balance**: Tokens in your wallet
2. **Crypto Wallet**: MetaMask, Rabby, or Web3 wallet
3. **Gas Token**: ETH, MATIC, etc. for transaction fees
4. **AMM Address**: Model's AMM contract address
5. **Post-Launch**: Must be Day 7+ after model launch

## Check If Selling is Enabled

### Method 1: Via Contract

```javascript
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);

// Check if still in bonding round
const isBuyOnly = await amm.isBuyOnlyPeriod();

if (isBuyOnly) {
    console.log("❌ Selling disabled - still in bonding round");
    const buyOnlyUntil = await amm.buyOnlyUntil();
    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = buyOnlyUntil - now;
    const hoursRemaining = secondsRemaining / 3600;
    console.log(`⏰ Selling enabled in ${hoursRemaining.toFixed(1)} hours`);
} else {
    console.log("✅ Selling is enabled!");
}
```

### Method 2: Via Block Explorer

```
1. Go to AMM contract on Etherscan
2. Click "Read Contract"
3. Find "isBuyOnlyPeriod" function
4. Click "Query"
5. Result:
   - "true" = Selling disabled
   - "false" = Selling enabled
```

### Method 3: Check Timestamp

```javascript
const buyOnlyUntil = await amm.buyOnlyUntil();
const now = Math.floor(Date.now() / 1000);

if (now > buyOnlyUntil) {
    console.log("✅ Selling enabled");
} else {
    console.log("❌ Selling still disabled");
}
```

## Overview of Selling Process

```
1. Verify Selling Enabled → 2. Approve Tokens → 3. Get Quote → 4. Set Slippage → 5. Execute Sell
```

**Time Required**: 5-10 minutes
**Complexity**: Beginner-friendly
**Gas Cost**: $2-20 depending on network

## Step-by-Step Guide

### Step 1: Check Your Token Balance

**Via Wallet**:
- Most wallets display token balances
- Make sure you're viewing the correct token

**Via Contract**:
```javascript
const token = await ethers.getContractAt("IERC20", tokenAddress);
const balance = await token.balanceOf(yourAddress);
console.log(`Balance: ${ethers.formatUnits(balance, 18)} tokens`);
```

**Via Block Explorer**:
```
1. Go to token contract address
2. Click "Read Contract"
3. Find "balanceOf" function
4. Enter your wallet address
5. Click "Query"
```

### Step 2: Check Current Price

See what price you'll receive:

**Via Contract**:
```javascript
const price = await amm.spotPrice();
console.log(`Current spot price: ${ethers.formatUnits(price, 18)} USDC/token`);
```

**Important**: Spot price is BEFORE your sell. Your actual price will be slightly lower due to:
- Price impact (your sell pushes price down)
- Trading fees (0.30% default)
- Slippage

### Step 3: Get a Sell Quote

Calculate how much USDC you'll receive:

**Via Web Interface**:
```
1. Enter token amount to sell
2. System shows: "You will receive ~X USDC"
3. Price impact percentage displayed
```

**Via Contract**:
```javascript
const tokenAmount = ethers.parseUnits("1000", 18); // 1000 tokens
const usdcOut = await amm.getSellQuote(tokenAmount);
console.log(`Quote: ${ethers.formatUnits(usdcOut, 6)} USDC`);

// Calculate effective price
const effectivePrice = usdcOut / tokenAmount * BigInt(1e12);
console.log(`Effective price: ${ethers.formatUnits(effectivePrice, 18)} USDC/token`);

// Calculate price impact
const spotPrice = await amm.spotPrice();
const priceImpact = (spotPrice - effectivePrice) * 100n / spotPrice;
console.log(`Price impact: ${priceImpact}%`);
```

**Example Output**:
```
Selling: 1000 tokens
Quote: 495.50 USDC
Effective price: 0.4955 USDC/token
Spot price: 0.50 USDC/token
Price impact: 0.9%
```

### Step 4: Approve Token Spending

The AMM needs permission to burn your tokens:

**Via Web Interface**:
```
1. Click "Approve Tokens" button
2. Review approval amount in wallet
3. Confirm transaction
4. Wait for confirmation
```

**Via Block Explorer**:
```
1. Go to token contract
2. Click "Write Contract" → "Connect Wallet"
3. Find "approve" function
4. Enter:
   - spender: [AMM contract address]
   - amount: [token amount in wei, 18 decimals]
5. Click "Write" → Confirm in wallet
```

**Via JavaScript**:
```javascript
const token = await ethers.getContractAt("IERC20", tokenAddress);
const tokenAmount = ethers.parseUnits("1000", 18);

// Approve AMM to spend tokens
const approveTx = await token.approve(ammAddress, tokenAmount);
await approveTx.wait();
console.log("Tokens approved for selling");
```

**Example** (1000 tokens):
```
spender: 0x1234...abcd (AMM address)
amount: 1000000000000000000000 (1000 * 10^18)
```

### Step 5: Set Slippage Tolerance

Protect yourself from unfavorable price movements:

**Recommended Slippage**:
- **Normal conditions**: 1-2%
- **High volatility**: 3-5%
- **Large sells**: 5-10%
- **Just after Day 7**: 3-5% (higher volatility)

**Calculate minUSDC**:
```javascript
const quote = await amm.getSellQuote(tokenAmount);
const slippagePct = 2; // 2%
const minUSDC = quote * BigInt(100 - slippagePct) / 100n;

console.log(`Minimum USDC: ${ethers.formatUnits(minUSDC, 6)}`);
```

**How It Works**:
```
Quote: 500 USDC
Slippage: 2%
Minimum USDC: 500 × 0.98 = 490 USDC

If you receive < 490 USDC → transaction reverts
If you receive ≥ 490 USDC → transaction succeeds
```

### Step 6: Set Deadline

Prevent execution at stale prices:

**Recommended Deadline**:
- **Normal**: 5 minutes (300 seconds)
- **Patient**: 10 minutes (600 seconds)
- **Urgent**: 2 minutes (120 seconds)

```javascript
const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes
```

### Step 7: Execute Sell

**Via Web Interface**:
```
1. Review sell details:
   - Tokens selling
   - USDC receiving
   - Price impact
   - Slippage tolerance
2. Click "Sell Tokens"
3. Review transaction in wallet
4. Confirm transaction
5. Wait for confirmation
```

**Via Contract (Etherscan)**:
```
1. Go to AMM contract "Write Contract"
2. Find "sell" function
3. Enter parameters:
   - tokenAmount: [amount in wei]
   - minUSDC: [minimum USDC in 6 decimals]
   - deadline: [timestamp]
4. Click "Write"
5. Confirm in wallet
```

**Via JavaScript (Complete Example)**:
```javascript
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);
const token = await ethers.getContractAt("IERC20", tokenAddress);

// 1. Check if selling enabled
const isBuyOnly = await amm.isBuyOnlyPeriod();
if (isBuyOnly) {
    throw new Error("Selling not enabled yet - still in bonding round");
}

// 2. Define amount to sell
const tokenAmount = ethers.parseUnits("1000", 18);

// 3. Check balance
const balance = await token.balanceOf(wallet.address);
if (balance < tokenAmount) {
    throw new Error("Insufficient token balance");
}

// 4. Get quote
const usdcOut = await amm.getSellQuote(tokenAmount);
console.log(`Quote: ${ethers.formatUnits(usdcOut, 6)} USDC`);

// 5. Calculate minUSDC (2% slippage)
const minUSDC = usdcOut * 98n / 100n;

// 6. Approve tokens
const approveTx = await token.approve(ammAddress, tokenAmount);
await approveTx.wait();
console.log("Tokens approved");

// 7. Set deadline
const deadline = Math.floor(Date.now() / 1000) + 300;

// 8. Execute sell
const sellTx = await amm.sell(tokenAmount, minUSDC, deadline);
console.log(`Transaction submitted: ${sellTx.hash}`);

// 9. Wait for confirmation
const receipt = await sellTx.wait();
console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

// 10. Check USDC balance
const usdc = await ethers.getContractAt("IERC20", usdcAddress);
const usdcBalance = await usdc.balanceOf(wallet.address);
console.log(`USDC balance: ${ethers.formatUnits(usdcBalance, 6)}`);
```

### Step 8: Verify Transaction

**Check Transaction Success**:
```
1. View transaction on block explorer
2. Verify:
   - Status: Success ✓
   - Tokens burned
   - USDC received
   - Gas cost
```

**Check Updated Balances**:
```javascript
// Token balance (should decrease)
const tokenBalance = await token.balanceOf(yourAddress);

// USDC balance (should increase)
const usdcBalance = await usdc.balanceOf(yourAddress);

console.log(`Tokens: ${ethers.formatUnits(tokenBalance, 18)}`);
console.log(`USDC: ${ethers.formatUnits(usdcBalance, 6)}`);
```

## Common Issues & Solutions

### Issue 1: "Selling Not Allowed During Bonding Round"

**Cause**: Trying to sell before Day 7

**Solution**:
```
1. Check buyOnlyUntil timestamp
2. Calculate time remaining
3. Wait until bonding round ends
4. Retry after Day 7
```

**Check Time Remaining**:
```javascript
const buyOnlyUntil = await amm.buyOnlyUntil();
const now = Math.floor(Date.now() / 1000);
const hoursRemaining = (buyOnlyUntil - now) / 3600;
console.log(`Wait ${hoursRemaining.toFixed(1)} more hours`);
```

### Issue 2: "Insufficient Allowance"

**Cause**: Tokens not approved or approval too low

**Solution**:
```
1. Check current allowance:
   token.allowance(yourAddress, ammAddress)
2. Approve sufficient amount:
   token.approve(ammAddress, tokenAmount)
3. Wait for confirmation
4. Retry sell
```

### Issue 3: "Slippage Too High"

**Cause**: Price moved unfavorably, receiving less USDC than minUSDC

**Solutions**:
- Increase slippage tolerance (3-5%)
- Reduce sell amount (smaller orders)
- Wait for better market conditions
- Split order into multiple smaller sells

### Issue 4: "Insufficient Token Balance"

**Cause**: Trying to sell more tokens than you own

**Solution**:
```
1. Check actual balance in your wallet
2. Reduce sell amount to match available balance
3. Ensure tokens are not pending in another transaction
```

### Issue 5: Transaction Pending Too Long

**Cause**: Gas price too low

**Solutions**:
- Speed up transaction (increase gas)
- Cancel and retry with higher gas
- Wait for network congestion to decrease

## Best Practices

### Timing Your Sale

**Good Times to Sell**:
- ✅ After significant price increase
- ✅ Before large token minting events (dilution)
- ✅ When hitting your price target
- ✅ During low network activity (cheaper gas)

**Times to Avoid**:
- ❌ Right at Day 7 start (high volatility)
- ❌ During panic selling
- ❌ Network congestion (high gas)
- ❌ Without checking price trends

### Order Sizing

**Small Sells** (< 1% of supply):
- Minimal price impact
- Low slippage needed
- Quick execution

**Medium Sells** (1-5% of supply):
- Moderate price impact
- Medium slippage needed
- Consider splitting

**Large Sells** (> 5% of supply):
- ⚠️ Significant price impact
- High slippage needed
- Should split across time (TWAP)

**Example Price Impact**:
```
Reserve: $100,000
Supply: 1,000,000 tokens
Spot Price: $0.50

Sell 10,000 tokens (1%):
- Impact: ~0.5%
- Receive: ~$4,975 (avg $0.4975/token)

Sell 100,000 tokens (10%):
- Impact: ~5%
- Receive: ~$47,500 (avg $0.475/token)

Sell 500,000 tokens (50%):
- Impact: ~40%
- Receive: ~$150,000 (avg $0.30/token)
```

### Profit-Taking Strategies

**Strategy 1: All at Once**
```
When: Hit specific price target
Amount: Sell 100% of holdings
Pros: Simple, clean exit
Cons: No upside if price continues up
```

**Strategy 2: Tiered Exits**
```
$0.50: Sell 25% (recover initial investment)
$0.75: Sell 25% (take profit)
$1.00: Sell 25% (more profit)
$1.50: Sell 25% (final exit)

Pros: Capture more upside
Cons: More transactions, more gas
```

**Strategy 3: Trailing Stop**
```
Set: Sell if price drops X% from peak
Example: Sell if drops 20% from ATH

Price hits $1.00 → Set stop at $0.80
Price hits $1.20 → Raise stop to $0.96
Price drops to $0.96 → Sell triggered

Pros: Ride trends, protect profits
Cons: May sell during temp dips
```

### Tax Optimization

**Consider Tax Implications**:
```
Short-term (< 1 year): Higher tax rate
Long-term (> 1 year): Lower tax rate

Strategy: Hold >1 year if possible for tax savings
```

**Tax-Loss Harvesting**:
```
If token is down:
- Sell to realize loss
- Offset against gains
- Can rebuy after 30 days (wash sale rule)
```

### Security Tips

**Protect Yourself**:
```
☐ Verify AMM contract address
☐ Check token balance before selling
☐ Start with small test sell
☐ Double-check transaction details
☐ Verify USDC address is correct
☐ Be cautious during high volatility
☐ Never share private keys
```

## Post-Sell Analysis

### Track Performance

**Calculate Returns**:
```javascript
// Example
const invested = 10000; // $10,000 USDC spent buying
const received = 12500; // $12,500 USDC from selling
const profit = received - invested; // $2,500
const returnPct = (profit / invested) * 100; // 25%
const holdingDays = 45; // Held for 45 days
const annualizedReturn = (returnPct / holdingDays) * 365; // ~203% APY

console.log(`Profit: $${profit}`);
console.log(`Return: ${returnPct}%`);
console.log(`Annualized: ${annualizedReturn}%`);
```

### Record for Taxes

**Save This Information**:
```
☐ Sell date and time
☐ Token amount sold
☐ USDC received
☐ Gas fees paid
☐ Average cost basis
☐ Holding period
☐ Transaction hash
```

### Lessons Learned

**Reflect on Trade**:
```
☐ Was timing right?
☐ Should have sold more/less?
☐ Was slippage optimal?
☐ Did strategy work?
☐ What to improve next time?
```

## After Selling

### Options Post-Sale

1. **Hold USDC**
   - Safe, stable value
   - Ready for next opportunity
   - Earning potential in DeFi

2. **Reinvest in Same Token**
   - Buy again if price drops
   - DCA (dollar-cost average) back in
   - Increase position size

3. **Invest in Other Models**
   - Diversify across models
   - Find better opportunities
   - Manage risk

4. **Exit Crypto**
   - Convert to fiat
   - Cash out profits
   - Reduce exposure

## Related Resources

- [Buying Guide](/guides/buying-tokens) - How to buy tokens
- [Investor Guide](/guides/investor-guide) - Investment strategies
- [AMM Overview](/tokenomics/amm-overview) - Bonding curve mechanics
- [Bonding Curve Math](/tokenomics/bonding-curve) - Price formulas
- [HokusaiAMM Contract](/smart-contracts/hokusai-amm) - Technical reference

## Need Help?

- [Community Forum](https://community.hokus.ai) - Ask questions
- [Discord](https://discord.gg/hokusai) - Real-time support
- [Support Team](https://hokus.ai/contact-us/) - Direct assistance

**Good luck with your sale!**
