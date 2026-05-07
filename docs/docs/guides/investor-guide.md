---
sidebar_position: 4
description: Complete investment playbook for Hokusai model tokens. Due diligence, risk management, trading strategies, and case studies for investors.
keywords: [investor guide, investment strategy, token investment, due diligence, risk management, trading, portfolio]
---

# Investor Guide

:::danger INVESTMENT DISCLAIMER

**This documentation is for informational purposes only and does not constitute investment advice, financial advice, trading advice, or any other sort of advice.**

- **No Endorsement**: There is no endorsement of investment in any specific model tokens. Each token represents an independent project with unique risks.
- **High Risk**: Token investments are **highly speculative and risky**. You can lose **100% of your invested funds**. Never invest more than you can afford to lose.
- **Do Your Own Research**: Nothing in this documentation should be taken for granted. **You must independently verify all claims, contract addresses, team credentials, and technical details** before investing.
- **No Guarantees**: Past performance does not guarantee future results. API revenue, model performance, and token prices can change dramatically.
- **Regulatory Risk**: Token regulations vary by jurisdiction. Ensure compliance with your local laws before participating.

**BY PROCEEDING, YOU ACKNOWLEDGE THAT YOU UNDERSTAND THESE RISKS AND ACCEPT FULL RESPONSIBILITY FOR YOUR INVESTMENT DECISIONS.**

:::

This guide helps investors understand how to evaluate Hokusai model tokens and the associated risks. Whether you're researching your first token or evaluating multiple projects, this guide covers due diligence, risk assessment, and informed decision-making.

## Who is This Guide For?

**This guide is for investors who want to**:
- Participate in model token launches
- Support promising AI models
- Gain exposure to AI model performance
- Trade tokens on the bonding curve AMM
- Understand risk/reward dynamics

**You should read this if you are**:
- New to Hokusai protocol
- Considering investing in a model token
- Planning to participate in a seven-day launch
- Looking to trade existing model tokens

## Investment Thesis

### Why Invest in Model Tokens?

Hokusai model tokens represent a new asset class backed by AI model performance and usage:

**Value Drivers**:
1. **Performance Improvements** → More tokens minted → Rewards distributed
2. **API Usage** → Revenue generated → Fees deposited to reserves → Price increases
3. **Supply Dynamics** → Controlled minting balanced by AMM mechanics
4. **Network Effects** → More usage → More fees → Higher token value

**Comparison to Traditional Assets**:

| Feature | Hokusai Model Token | Startup Equity | Public Stock | Cryptocurrency |
|---------|---------------------|----------------|--------------|----------------|
| **Backing** | USDC reserves + API profit share | Company assets | Company assets | Protocol value |
| **Cash Flow** | Profit share (0-50%) → reserves | Variable | Dividends | Variable |
| **Liquidity** | Always (AMM) | Illiquid | Market hours | 24/7 |
| **Exit Strategy** | Sell anytime (after Day 7) | Acquisition/IPO | Sell anytime | Sell anytime |
| **Price Discovery** | CRR formula | Valuation rounds | Market price | Market price |
| **Governance** | Token votes (incl. infra rate) | Shareholder votes | Shareholder votes | Variable |
| **Volatility** | High | Very High | Medium | Very High |
| **Minimum Investment** | Any amount | $10k-100k+ | Any amount | Any amount |

### Risk-Return Profile

```
Expected Return
     ↑
High |     🚀 Successful Model
     |        /
Med  |      /    📊 Average Model
     |    /
Low  |  /___________❌ Failed Model
     |________________→
        Low   Med   High   Risk
```

**High Return Potential**:
- Early successful models: 10-100x returns
- Strong API usage: 2-5x sustained growth
- Network effects: Long-term value accrual

**High Risk Reality**:
- Model underperformance: -50-90% losses
- Post-launch selling: -30-50% volatility
- Smart contract risks: Total loss possible
- Low liquidity: Hard to exit large positions

## Investment Process

### Step 1: Research Models

Before investing, thoroughly evaluate the model:

**Performance Metrics**:
```
☐ Current accuracy/performance score
☐ Historical improvement trajectory
☐ Benchmark comparisons (vs competitors)
☐ DeltaOne generation rate
☐ Contribution activity and frequency
```

**Team Assessment**:
```
☐ Developer reputation and track record
☐ Model documentation quality
☐ Community engagement level
☐ Transparency and communication
☐ Technical expertise demonstrated
```

**Tokenomics Analysis**:
```
☐ Initial supply and distribution
☐ Reserve Ratio (CRR) setting
☐ Trade and protocol fees
☐ Projected API usage and revenue
☐ Token minting schedule
```

**Market Opportunity**:
```
☐ Problem being solved
☐ Target market size
☐ Competitive landscape
☐ Adoption potential
☐ Revenue model clarity
```

### Step 2: Analyze Launch Parameters

Every model launches with specific AMM parameters:

**Check Initial Conditions**:
```javascript
// Connect to AMM contract
const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);

// Get key parameters
const reserveRatio = await amm.reserveRatio(); // CRR (w)
const tradeFee = await amm.tradeFee(); // e.g., 0.30%
const protocolFee = await amm.protocolFee(); // e.g., 5%
const buyOnlyUntil = await amm.buyOnlyUntil(); // Launch end time

// Get initial state
const reserve = await amm.getReserve();
const supply = await amm.getTotalSupply();
const price = await amm.spotPrice();

console.log(`Initial Price: ${ethers.formatUnits(price, 18)} USDC`);
console.log(`Reserve Ratio: ${reserveRatio / 1e16}%`);
console.log(`Initial Reserve: ${ethers.formatUnits(reserve, 6)} USDC`);
```

**Evaluate Launch Setup**:

| Parameter | Conservative | Moderate | Aggressive |
|-----------|-------------|----------|------------|
| **CRR (w)** | 50-100% | 20-50% | 5-20% |
| **Initial Reserve** | $50k+ | $10-50k | $1-10k |
| **Initial Supply** | 500k-1M | 1-5M | 5-10M+ |
| **Initial Price** | $0.10+ | $0.01-0.10 | $0.001-0.01 |

**Red Flags**:
- ❌ CRR < 10% (too volatile)
- ❌ Initial reserve < $1,000 (too thin)
- ❌ No initial supply (nothing to buy)
- ❌ Fees > 5% (too extractive)

### Step 3: Plan Your Investment

**Determine Position Size**:

```
Portfolio Allocation Guidelines:

High Risk Tolerance (Crypto-native):
- Single model: 2-10% of portfolio
- Multiple models: 15-30% total
- Position per model: $1k-50k

Medium Risk Tolerance (Diversified):
- Single model: 0.5-2% of portfolio
- Multiple models: 5-15% total
- Position per model: $500-10k

Low Risk Tolerance (Conservative):
- Single model: 0.1-0.5% of portfolio
- Multiple models: 1-5% total
- Position per model: $100-1k
```

**Choose Investment Strategy**:

**Strategy A: Early Momentum**
```
Allocation: Front-load 70% on Days 0-1
Rationale: Capture lowest prices
Risk: High if launch fails
Best for: High conviction + risk tolerance
```

**Strategy B: Dollar-Cost Average**
```
Allocation: Equal amounts Days 0, 2, 4, 6
Rationale: Average in, reduce timing risk
Risk: Medium, miss some early gains
Best for: Moderate conviction
```

**Strategy C: Wait and See**
```
Allocation: 30% Days 0-3, 70% Days 4-6
Rationale: Observe momentum first
Risk: Lower, but higher avg price
Best for: Lower conviction, cautious
```

**Strategy D: Post-Launch Entry**
```
Allocation: 0% during launch, buy Day 8+
Rationale: Avoid launch volatility
Risk: Lower, but miss launch gains
Best for: Very cautious, patient
```

### Step 4: Execute Trades

**Setup Requirements**:
```
1. Crypto wallet (MetaMask, Rabby, etc.)
2. USDC on same chain as model
3. Native token for gas (ETH, etc.)
4. Access to model's AMM contract
```

**Buying During Launch**:

```javascript
// 1. Approve USDC spending
const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);
const approvalAmount = ethers.parseUnits("10000", 6); // 10k USDC
await usdc.approve(ammAddress, approvalAmount);

// 2. Get buy quote
const usdcAmount = ethers.parseUnits("1000", 6); // $1000
const tokensOut = await amm.getBuyQuote(usdcAmount);
console.log(`Quote: ${ethers.formatUnits(tokensOut, 18)} tokens for $1000`);

// 3. Set slippage tolerance (e.g., 2%)
const minTokens = tokensOut * 98n / 100n;

// 4. Set deadline (5 minutes)
const deadline = Math.floor(Date.now() / 1000) + 300;

// 5. Execute buy
const tx = await amm.buy(minTokens, deadline, { value: usdcAmount });
await tx.wait();
console.log("Purchase complete!");
```

**Pro Tips**:
- ✅ Buy during low activity (late night UTC)
- ✅ Monitor gas prices, buy when low
- ✅ Split large orders (< 5% of reserve)
- ✅ Keep records for tax purposes
- ⚠️ Never invest more than you can afford to lose

### Step 5: Monitor Your Investment

**Daily Monitoring** (Days 0-7):
```
☐ Check reserve growth
☐ Monitor buy activity
☐ Track price changes
☐ Read team updates
☐ Assess community sentiment
```

**Weekly Monitoring** (Post-launch):
```
☐ Review API usage metrics
☐ Check fee deposits to reserves
☐ Monitor token minting events
☐ Track trading volume
☐ Re-evaluate thesis
```

**Tools and Resources**:
```javascript
// Create monitoring dashboard
async function getModelMetrics(ammAddress) {
    const amm = await ethers.getContractAt("HokusaiAMM", ammAddress);

    const reserve = await amm.getReserve();
    const supply = await amm.getTotalSupply();
    const price = await amm.spotPrice();
    const reserveRatio = await amm.reserveRatio();

    const marketCap = (price * supply) / BigInt(1e18);
    const tvl = reserve;

    return {
        price: ethers.formatUnits(price, 18),
        reserve: ethers.formatUnits(reserve, 6),
        supply: ethers.formatUnits(supply, 18),
        marketCap: ethers.formatUnits(marketCap, 6),
        tvl: ethers.formatUnits(tvl, 6),
        reserveRatio: Number(reserveRatio) / 1e16
    };
}
```

## Exit Strategies

### When to Sell

**Profit-Taking Scenarios**:

**Take Profits at +100%** (Conservative):
```
Entry: $1,000 → Now worth $2,000
Action: Sell $1,000 (50%), hold rest
Result: Original capital back + house money
```

**Take Profits at +200-500%** (Moderate):
```
Entry: $1,000 → Now worth $3,000-6,000
Action: Sell 50-70%, hold rest
Result: Significant profit secured
```

**Hold for Moon** (Aggressive):
```
Entry: $1,000 → Now worth $5,000+
Action: Hold until +1000% or failure
Result: Max gains or max pain
```

**Stop-Loss Scenarios**:

**Protect Capital at -30%**:
```
Entry: $1,000 → Now worth $700
Action: Sell all, cut losses
Rationale: Model not performing
```

**Reassess at -50%**:
```
Entry: $1,000 → Now worth $500
Question: Has thesis changed?
- If yes: Sell remaining
- If no: Hold or average down
```

### How to Sell

**Post-Launch Only** (Day 7+):

```javascript
// 1. Verify bonding round ended
const isBuyOnly = await amm.isBuyOnlyPeriod();
if (isBuyOnly) {
    throw new Error("Cannot sell during bonding round");
}

// 2. Get sell quote
const tokenAmount = ethers.parseUnits("1000", 18);
const usdcOut = await amm.getSellQuote(tokenAmount);
console.log(`Quote: ${ethers.formatUnits(usdcOut, 6)} USDC for 1000 tokens`);

// 3. Approve tokens
const token = await ethers.getContractAt("IERC20", TOKEN_ADDRESS);
await token.approve(ammAddress, tokenAmount);

// 4. Set slippage (e.g., 3% for volatile periods)
const minUSDC = usdcOut * 97n / 100n;

// 5. Set deadline
const deadline = Math.floor(Date.now() / 1000) + 300;

// 6. Execute sell
const tx = await amm.sell(tokenAmount, minUSDC, deadline);
await tx.wait();
console.log("Sale complete!");
```

**Timing Considerations**:
- ⏰ **Best time**: After fee deposits (higher price)
- ⏰ **Avoid**: Right after Day 7 (high volatility)
- ⏰ **Consider**: Tax implications (short vs long term)
- ⏰ **Plan**: Stagger sells if large position

## Risk Management

### Diversification

**Don't Put All Eggs in One Basket**:

```
Example $10k Portfolio:

High Risk (Crypto-Native):
- 3-5 model tokens: $2k each
- Keep 20% stablecoins for opportunities

Medium Risk (Balanced):
- 5-8 model tokens: $1-1.5k each
- Keep 30% stablecoins

Low Risk (Conservative):
- 8-10 model tokens: $500-1k each
- Keep 50% stablecoins
```

**Diversification Criteria**:
```
☐ Different model types (NLP, vision, etc.)
☐ Different stages (launch vs mature)
☐ Different CRR levels (volatile vs stable)
☐ Different teams/developers
☐ Different market verticals
```

### Position Sizing Rules

**Never Exceed**:
- 10% of net worth in any single model
- 30% of net worth in Hokusai tokens total
- Amount you can't afford to lose completely

**Scale positions**:
```
High Conviction: 5-10% of crypto portfolio
Medium Conviction: 2-5% of crypto portfolio
Low Conviction: 0.5-2% of crypto portfolio
Speculative: < 0.5% of crypto portfolio
```

### Emotional Discipline

**Avoid Common Mistakes**:

**FOMO (Fear of Missing Out)**:
```
❌ Seeing model 5x, buying at top
✅ Stick to your research and plan
```

**Panic Selling**:
```
❌ Selling at -30% due to fear
✅ Follow your stop-loss strategy
```

**Overtrading**:
```
❌ Buying/selling daily on emotions
✅ Make deliberate, planned trades
```

**Revenge Trading**:
```
❌ Doubling down after losses
✅ Take breaks, reassess strategy
```

## Advanced Strategies

### How Token Holders Benefit

**Current Revenue Mechanism:**
- API fee deposits increase AMM reserve → token price rises
- Hold tokens and benefit from reserve growth (passive appreciation)
- Sell tokens on AMM after launch period (Day 7+)
- No active participation or staking required

**What Does NOT Exist:**
- No staking mechanisms
- No yield farming
- No liquidity mining
- No dividend distributions
- No governance token rewards

**External Opportunities:**
If tokens get listed on external DEXs, you could provide liquidity there, but this would be entirely separate from the Hokusai protocol and comes with impermanent loss risk.

### Arbitrage

If tokens trade on multiple venues:

```
Opportunity: Price discrepancy
AMM Price: $1.00
DEX Price: $1.05

Strategy:
1. Buy on AMM for $1.00
2. Sell on DEX for $1.05
3. Profit: $0.05 per token (minus fees/gas)

Risk:
- Price moves before execution
- High gas fees eat profits
- Limited opportunities
```

### Launch Flipping

Short-term strategy for experienced traders:

```
Buy Days 0-1 at low prices
Sell Day 7-8 during initial hype
Target: +50-200% in 7-10 days

Risk:
- Launch fails, trapped for weeks
- Post-launch dump exceeds gains
- High stress, requires monitoring
```

## Tax Considerations

**Disclaimer**: Not tax advice. Consult a tax professional.

### Tax Events

**Buying tokens**: Not taxable (purchase)
**Selling tokens**: Taxable capital gain/loss
**Receiving rewards**: Taxable as income (in some jurisdictions)
**Transfers**: Generally not taxable

### Record Keeping

```
Essential Records:
☐ Date and time of each trade
☐ Amount of USDC spent / received
☐ Amount of tokens bought / sold
☐ Transaction hashes
☐ Fee amounts paid
☐ Purpose (investment, trade, etc.)
```

### Tax Optimization

**Hold >1 year**: Long-term capital gains (lower rate in US)
**Tax-loss harvesting**: Sell losers to offset winners
**Timing**: Consider tax year when taking profits

## Due Diligence Checklist

Before investing in any model token:

### Technical Due Diligence
```
☐ Smart contracts are verified
☐ No major audit findings
☐ Code is open source
☐ Contract is not upgradeable (or has timelock)
☐ No admin keys or minimal permissions
```

### Model Due Diligence
```
☐ Model performance data is public
☐ Benchmarks are from reputable sources
☐ Improvement trajectory is positive
☐ Use case is clear and valuable
☐ Competition is assessed
```

### Team Due Diligence
```
☐ Team is doxxed or has reputation
☐ Active communication channels
☐ Responsive to community
☐ Clear roadmap and milestones
☐ No history of scams or rug pulls
```

### Economic Due Diligence
```
☐ Tokenomics make sense
☐ Initial distribution is fair
☐ No excessive team allocation
☐ Fee structure is reasonable
☐ Revenue model is sustainable
```

### Community Due Diligence
```
☐ Active community exists
☐ Organic engagement (not bot)
☐ Positive sentiment overall
☐ Early supporters are credible
☐ No signs of coordinated shilling
```

## Red Flags

**Avoid models with**:
- ❌ Anonymous team with no track record
- ❌ Unverified or closed-source contracts
- ❌ Unrealistic performance claims
- ❌ No API usage or revenue
- ❌ Greater than 20% team token allocation
- ❌ Upgradeable contracts without timelock
- ❌ Suspicious community activity
- ❌ Copied or plagiarized code
- ❌ No documentation
- ❌ Extremely low CRR (less than 5%)

## Case Studies

### Successful Investment Example

**Model X: NLP Translation Model**

**Research Phase**:
- Performance: 85% accuracy, improving
- Team: Experienced AI researchers, doxxed
- Community: 500+ engaged members
- Tokenomics: 20% CRR, $25k initial reserve

**Investment**:
- Bought Day 1: $2,000 at $0.10/token = 20,000 tokens
- Bought Day 4: $1,000 at $0.15/token = 6,667 tokens
- Total: $3,000 for 26,667 tokens, avg $0.1125

**Performance**:
- Day 7: Price $0.25 (+122%)
- Day 30: Price $0.40 (+256%) due to API fees
- Day 90: Price $0.60 (+433%)

**Exit**:
- Sold 50% at Day 30: 13,333 × $0.40 = $5,333 (+78% on total capital)
- Holding rest: 13,333 × $0.60 = $8,000
- Total value: $13,333 (+344%)

**Key Success Factors**:
- Strong fundamentals
- DCA strategy reduced risk
- Partial profit-taking secured gains
- API usage drove long-term value

### Failed Investment Example

**Model Y: Experimental Vision Model**

**Research Phase**:
- Performance: 70% accuracy, untested
- Team: Anonymous, new to space
- Community: Small, mostly speculators
- Tokenomics: 10% CRR, $5k initial reserve

**Investment**:
- Bought Day 0: $1,000 at $0.05/token = 20,000 tokens
- FOMO'd Day 2: $1,000 at $0.08/token = 12,500 tokens
- Total: $2,000 for 32,500 tokens, avg $0.0615

**Performance**:
- Day 7: Price $0.10 (+63%)
- Day 8: Sell pressure, price crashes to $0.04 (-35%)
- Day 30: Price $0.02 (-67%) due to no API usage

**Exit**:
- Sold all Day 30: 32,500 × $0.02 = $650
- Total loss: -$1,350 (-67.5%)

**Key Failure Factors**:
- Weak fundamentals ignored
- Anonymous team risk
- No API usage/revenue
- Low CRR = high volatility
- FOMO'd instead of following plan

## Resources

### Essential Links
- [AMM Overview](/tokenomics/amm-overview) - Understand the mechanics
- [Launch Period](/tokenomics/launch-period) - Seven-day bonding round
- [Bonding Curve Math](/tokenomics/bonding-curve) - Formula deep dive
- [HokusaiAMM Contract](/smart-contracts/hokusai-amm) - Technical reference
- [Buying Guide](/guides/buying-tokens) - Step-by-step buying
- [Selling Guide](/guides/selling-tokens) - Step-by-step selling

### Community
- [Discord](https://discord.gg/hokusai) - Join discussions
- [Forum](https://community.hokus.ai) - Long-form discussions
- [Twitter](https://twitter.com/hokusai_ai) - News and updates
- [GitHub](https://github.com/Hokusai-protocol) - Source code

### Tools (Coming Soon)
- Portfolio tracker
- Model analytics dashboard
- Price alerts
- API usage metrics
- Historical performance charts

## Final Thoughts

Investing in Hokusai model tokens is **high risk, high reward**. Success requires:

1. **Thorough research** - Don't invest blindly
2. **Risk management** - Never overallocate
3. **Patience** - Hold through volatility
4. **Discipline** - Follow your strategy
5. **Continuous learning** - Stay informed

**Remember**: Past performance doesn't guarantee future results. Always invest responsibly and never more than you can afford to lose.

Good luck, and welcome to the future of AI-backed assets!

---

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).
