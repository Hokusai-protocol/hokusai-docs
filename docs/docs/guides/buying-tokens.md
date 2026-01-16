---
sidebar_position: 2
---

# Buying Tokens Guide

This guide provides step-by-step instructions for buying Hokusai model tokens using the bonding curve AMM. Whether you're participating in a launch period or buying existing tokens, this guide covers everything you need to know.

## Prerequisites

Before you can buy tokens, you'll need:

### 1. Crypto Wallet
- **MetaMask** (recommended for beginners)
- **Rabby**, **Rainbow**, or other Web3 wallets
- Wallet must support the network where model is deployed

### 2. USDC
- Sufficient USDC balance for your purchase
- Plus extra for gas fees (network transaction costs)
- USDC must be on the same network as the model token

### 3. Native Token for Gas
- **Ethereum**: ETH for gas
- **Polygon**: MATIC for gas
- **Arbitrum**: ETH for gas
- Amount needed: $5-50 depending on network congestion

### 4. Model Information
- Model's AMM contract address
- Current token price (check before buying)
- Whether in launch period (Day 0-6) or post-launch

## Overview of Buying Process

```
1. Connect Wallet → 2. Approve USDC → 3. Get Quote → 4. Set Slippage → 5. Execute Buy
```

**Time Required**: 5-10 minutes
**Complexity**: Beginner-friendly
**Gas Cost**: $2-20 depending on network

## Step-by-Step Guide

### Step 1: Connect Your Wallet

**Via Web Interface** (if available):
```
1. Navigate to model's page on Hokusai platform
2. Click "Connect Wallet" button
3. Select your wallet (MetaMask, etc.)
4. Approve connection request in wallet
5. Verify correct network selected
```

**Via Etherscan/Block Explorer**:
```
1. Navigate to model's AMM contract address
2. Click "Contract" tab → "Write Contract"
3. Click "Connect to Web3"
4. Approve wallet connection
```

### Step 2: Check Current Price

Before buying, check the current spot price:

**Via Web Interface**:
```
- Price displayed on model page
- Shows price per token in USDC
```

**Via Contract** (Read functions):
```javascript
// Call spotPrice() view function
const price = await amm.spotPrice();
console.log(`Current price: ${ethers.formatUnits(price, 18)} USDC per token`);
```

**Via Block Explorer**:
```
1. Go to AMM contract
2. Click "Read Contract"
3. Find "spotPrice" function
4. Click "Query" → See result in wei (divide by 1e18)
```

### Step 3: Get a Quote

Calculate how many tokens you'll receive:

**Via Web Interface**:
```
1. Enter USDC amount to spend
2. System shows: "You will receive ~X tokens"
3. Price impact percentage displayed
```

**Via Contract**:
```javascript
const usdcAmount = ethers.parseUnits("1000", 6); // $1000 USDC
const tokensOut = await amm.getBuyQuote(usdcAmount);
console.log(`Quote: ${ethers.formatUnits(tokensOut, 18)} tokens`);

// Calculate average price
const avgPrice = usdcAmount / tokensOut;
console.log(`Average price: ${ethers.formatUnits(avgPrice, 6)} USDC/token`);
```

**Important**: Quote is an estimate. Actual amount may vary slightly due to:
- Other transactions executing before yours
- Network congestion
- Slippage

### Step 4: Approve USDC Spending

The AMM contract needs permission to spend your USDC:

**Via Web Interface**:
```
1. Click "Approve USDC" button
2. Review approval amount in wallet popup
3. Confirm transaction
4. Wait for confirmation (~15 seconds)
```

**Via Etherscan**:
```
1. Go to USDC contract address
2. Click "Write Contract" → "Connect Wallet"
3. Find "approve" function
4. Enter:
   - spender: [AMM contract address]
   - amount: [USDC amount in 6 decimals]
5. Click "Write" → Confirm in wallet
```

**Example** (1000 USDC approval):
```
spender: 0x1234...abcd (AMM address)
amount: 1000000000 (1000 * 10^6)
```

**Pro Tip**: Approve exact amount you'll spend, or approve a large amount for multiple purchases.

### Step 5: Set Slippage Tolerance

Slippage protects you from price changes during transaction:

**Recommended Slippage**:
- **Normal conditions**: 1-2%
- **High volatility**: 3-5%
- **Launch period**: 2-5%
- **Large orders**: 5-10%

**How Slippage Works**:
```
Quote: 1000 tokens
Slippage: 2%
Minimum tokens: 1000 × 0.98 = 980 tokens

If you receive < 980 tokens → transaction reverts
If you receive ≥ 980 tokens → transaction succeeds
```

**Calculate minTokens**:
```javascript
const quote = await amm.getBuyQuote(usdcAmount);
const slippagePct = 2; // 2%
const minTokens = quote * BigInt(100 - slippagePct) / 100n;
```

### Step 6: Set Deadline

Deadline prevents transactions from executing at stale prices:

**Recommended Deadline**:
- **Normal**: 5 minutes (300 seconds)
- **Patient**: 10 minutes (600 seconds)
- **Urgent**: 2 minutes (120 seconds)

**Calculate Deadline**:
```javascript
const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now
```

**Why Deadlines Matter**:
```
Scenario without deadline:
- You submit buy at price $0.50
- Transaction pending for 30 minutes
- Price increases to $0.80
- Transaction executes at much worse price
- You overpay significantly

Scenario with deadline:
- You submit buy at price $0.50
- Set 5-minute deadline
- If not executed in 5 minutes → reverts
- You can resubmit at current price
```

### Step 7: Execute Buy

**Via Web Interface**:
```
1. Review purchase details:
   - USDC amount spending
   - Estimated tokens receiving
   - Price impact
   - Slippage tolerance
2. Click "Buy Tokens"
3. Review transaction in wallet
4. Check gas fee is reasonable
5. Confirm transaction
6. Wait for confirmation
```

**Via Contract (Etherscan)**:
```
1. Go to AMM contract "Write Contract"
2. Find "buy" function
3. Enter parameters:
   - minTokens: [calculated with slippage]
   - deadline: [timestamp]
   - payableAmount: [USDC amount in wei]
4. Click "Write"
5. Confirm in wallet
```

**Via JavaScript/ethers.js**:
```javascript
// Complete example
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);
const usdc = await ethers.getContractAt("IERC20", usdcAddress);

// 1. Approve USDC
const usdcAmount = ethers.parseUnits("1000", 6);
await (await usdc.approve(ammAddress, usdcAmount)).wait();
console.log("USDC approved");

// 2. Get quote
const quote = await amm.getBuyQuote(usdcAmount);
console.log(`Quote: ${ethers.formatUnits(quote, 18)} tokens`);

// 3. Calculate minTokens (2% slippage)
const minTokens = quote * 98n / 100n;

// 4. Set deadline (5 minutes)
const deadline = Math.floor(Date.now() / 1000) + 300;

// 5. Execute buy
const tx = await amm.buy(minTokens, deadline);
console.log(`Transaction submitted: ${tx.hash}`);

// 6. Wait for confirmation
const receipt = await tx.wait();
console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

// 7. Check balance
const balance = await token.balanceOf(wallet.address);
console.log(`New token balance: ${ethers.formatUnits(balance, 18)}`);
```

### Step 8: Verify Transaction

**Check Transaction Success**:
```
1. Transaction hash displayed after confirmation
2. View on block explorer (Etherscan, etc.)
3. Verify:
   - Status: Success ✓
   - USDC spent
   - Tokens received
   - Gas cost
```

**Check Token Balance**:
```javascript
const balance = await token.balanceOf(yourAddress);
console.log(`Token balance: ${ethers.formatUnits(balance, 18)}`);
```

## Common Issues & Solutions

### Issue 1: "Insufficient Allowance"

**Cause**: USDC not approved or approval too low

**Solution**:
```
1. Check current allowance:
   usdc.allowance(yourAddress, ammAddress)
2. Approve sufficient amount:
   usdc.approve(ammAddress, amount)
3. Wait for approval confirmation
4. Retry buy transaction
```

### Issue 2: "Slippage Too High"

**Cause**: Price moved unfavorably, received fewer tokens than minTokens

**Solutions**:
- Increase slippage tolerance (3-5%)
- Reduce purchase amount (smaller orders have less impact)
- Wait for lower volatility period
- Split order into multiple smaller buys

### Issue 3: "Transaction Expired"

**Cause**: Transaction didn't execute before deadline

**Solutions**:
- Increase deadline (10-15 minutes)
- Use higher gas price for faster confirmation
- Check network congestion
- Resubmit with new deadline

### Issue 4: "Insufficient USDC Balance"

**Cause**: Not enough USDC in wallet

**Solution**:
```
1. Check USDC balance
2. Transfer more USDC to wallet
3. Ensure USDC is on correct network
4. Retry after USDC arrives
```

### Issue 5: "Out of Gas"

**Cause**: Estimated gas too low for transaction

**Solutions**:
- Manually increase gas limit (try +50%)
- Ensure sufficient native token (ETH, MATIC, etc.) for gas
- Wait for lower network congestion
- Try again with higher gas price

### Issue 6: Transaction Pending Too Long

**Cause**: Gas price too low, transaction stuck in mempool

**Solutions**:
- Speed up transaction (replace with higher gas)
- Cancel transaction (replace with 0-value tx)
- Wait for network congestion to decrease
- Use gas price estimator (ethgasstation.info)

## Best Practices

### Timing Your Purchase

**Good Times to Buy**:
- ✅ After major fee deposits (reserve increased)
- ✅ During low network activity (cheaper gas)
- ✅ After token minting events (supply dilution = lower price)
- ✅ Early in launch period (Day 0-2)

**Times to Avoid**:
- ❌ During extreme volatility
- ❌ Right after your own large order (price impact)
- ❌ Network congestion (high gas fees)
- ❌ Without checking recent price action

### Order Sizing

**Small Orders** (< 1% of reserve):
- Minimal price impact
- Low slippage needed (1-2%)
- Fast execution
- Good for testing

**Medium Orders** (1-5% of reserve):
- Moderate price impact
- Medium slippage needed (2-5%)
- Normal execution
- Good for regular purchases

**Large Orders** (> 5% of reserve):
- Significant price impact
- High slippage needed (5-10%)
- May benefit from splitting
- Consider TWA buying

**Very Large Orders** (> 10% of reserve):
- ⚠️ Very high price impact
- Consider splitting across hours/days
- Coordinate with team if institutional
- Use time-weighted averaging (TWAP)

### Gas Optimization

**Save on Gas Fees**:
```
1. Buy during low network activity:
   - Early morning UTC
   - Weekends
   - Avoid Monday mornings

2. Use gas price trackers:
   - ethgasstation.info
   - gasnow.org
   - Built-in wallet estimators

3. Batch operations:
   - Approve large amount once
   - Buy multiple times without re-approving

4. Use Layer 2 networks:
   - Polygon (low fees)
   - Arbitrum (medium fees)
   - Check which network model uses
```

### Security Tips

**Protect Yourself**:
```
☐ Verify AMM contract address (check official sources)
☐ Start with small test purchase
☐ Never share private keys or seed phrases
☐ Double-check transaction details before confirming
☐ Use hardware wallet for large amounts
☐ Verify token contract address matches
☐ Be cautious of phishing websites
☐ Check for smart contract audits
```

## Launch Period Buying

### Special Considerations (Days 0-6)

**During Launch**:
- ✅ Selling is disabled (buy-only period)
- ✅ Can buy anytime during 7 days
- ⚠️ Cannot exit until Day 7+
- ⚠️ Price only goes up (no sells)

**Strategies**:

**Early Entry** (Day 0-1):
```
Pros:
- Lowest prices
- First-mover advantage
- Maximum appreciation potential

Cons:
- High risk if launch fails
- Locked for full 7 days
- Unknown demand
```

**Dollar-Cost Averaging** (Days 0-6):
```
Day 0: 25% of allocation
Day 2: 25% of allocation
Day 4: 25% of allocation
Day 6: 25% of allocation

Pros:
- Reduced timing risk
- Average price
- Lower regret

Cons:
- Miss some early gains
- More transactions = more gas
```

**Late Launch** (Days 5-6):
```
Pros:
- See actual demand
- More information
- Lower lockup time

Cons:
- Higher prices
- Less appreciation potential
- FOMO risk
```

## After Your Purchase

### Monitor Your Investment

**Track These Metrics**:
```
☐ Current token price
☐ Your average purchase price
☐ Unrealized profit/loss percentage
☐ Reserve balance growth
☐ API usage and fee deposits
☐ Token minting events
☐ Community activity
```

**Tools**:
```javascript
// Create monitoring function
async function monitorPosition(ammAddress, yourAddress) {
    const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);
    const token = await ethers.getContractAt("IERC20", await amm.token());

    // Get your balance
    const balance = await token.balanceOf(yourAddress);

    // Get current price
    const price = await amm.spotPrice();

    // Calculate position value
    const value = balance * price / BigInt(1e18);

    console.log(`Balance: ${ethers.formatUnits(balance, 18)} tokens`);
    console.log(`Price: ${ethers.formatUnits(price, 18)} USDC`);
    console.log(`Value: ${ethers.formatUnits(value, 6)} USDC`);
}
```

### Set Up Alerts

**Price Alerts**:
- Set target sell price
- Alert when price increases X%
- Alert when price decreases Y%

**Event Alerts**:
- Monitor FeesDeposited events
- Track large buy/sell transactions
- Watch minting events

## Next Steps After Buying

1. **Record Transaction**
   - Save transaction hash
   - Note purchase price
   - Track for tax purposes

2. **Join Community**
   - Follow model updates
   - Monitor announcements
   - Engage with developers

3. **Plan Exit Strategy**
   - Set price targets
   - Define holding period
   - Determine stop-loss

4. **Consider Selling** (Post-Launch Only)
   - Review [Selling Guide](/guides/selling-tokens)
   - Plan profit-taking strategy
   - Understand tax implications

## Related Resources

- [Investor Guide](/guides/investor-guide) - Complete investment playbook
- [AMM Overview](/tokenomics/amm-overview) - How bonding curve works
- [Launch Period](/tokenomics/launch-period) - Seven-day bonding round
- [Bonding Curve Math](/tokenomics/bonding-curve) - Price formulas
- [HokusaiAMM Contract](/smart-contracts/hokusai-amm) - Technical reference

## Need Help?

- [Community Forum](https://community.hokus.ai) - Ask questions
- [Discord](https://discord.gg/hokusai) - Real-time support
- [Support Team](https://hokus.ai/contact-us/) - Direct assistance

**Good luck with your purchase!**
