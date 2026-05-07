---
id: choosing-crr
title: Choosing the Right CRR for Your Model
sidebar_label: Choosing CRR
description: Understand how Capital Reserve Ratio (CRR) impacts reward sustainability, token price dynamics, and model incentive design. Learn which CRR settings work best for different model stages and funding scenarios.
keywords: [CRR, capital reserve ratio, bonding curve, token economics, model launch, reward sustainability, price stability]
---

# Choosing the Right CRR for Your Model

The **Capital Reserve Ratio (CRR)** is the single most important parameter when launching your model token. It fundamentally determines:

- How long your initial funding lasts
- How aggressively you reward early contributors
- How stable your token price will be
- Whether you attract speculators or long-term data providers

This guide helps you choose the right CRR by showing concrete tradeoffs with real numbers.

## Core Intuition (One Sentence)

**Higher CRR = more stability + longer-lived rewards, but slower token price appreciation per dollar of usage or support.**

Lower CRR does the opposite.

> **Allowed range**: The contract permits CRR settings between **5% and 100%**
> (governance-controlled). Most live models will sit between 10% and 30% - the
> sweet spot for balancing reward sustainability with reasonable price action -
> but very-high CRR (50-100%) is available for ultra-stable enterprise tokens
> where price stability dominates other concerns.

## What CRR Actually Controls

In Hokusai's bonding curve, spot price is determined by:

```
P = R / (S × w)

Where:
  R = USDC reserve in the AMM
  S = Token supply
  w = CRR (Capital Reserve Ratio)
```

For a fixed supply:
- **Higher CRR (w)** → Lower price per unit of reserve → More reserve needed for same price movement
- **Lower CRR (w)** → Higher price sensitivity → Small reserve changes = big price swings

## The Key Tradeoffs

### 1. Price Reflexivity to Usage & Support

How quickly does your token price respond to USDC flowing into the reserve (from buys or API fees)?

#### Low CRR (10%)
- ✅ Small USDC inflows → Large price jumps
- ✅ Token price "feels alive" and responsive
- ✅ Great for signaling momentum early
- ❌ Extremely fragile to sells
- ❌ Reward redemptions can crash the price
- ❌ Volatile and speculative

**Example**: $1,000 deposited into $50k reserve
```
Before: P = $50,000 / (1,000,000 × 0.10) = $0.50
After:  P = $51,000 / (1,000,000 × 0.10) = $0.51
Change: +2% price increase
```

#### High CRR (30%)
- ✅ Much more USDC required for same price move
- ✅ Price grows slowly and smoothly
- ✅ Harder to "pump" via capital alone
- ✅ Much harder to collapse via reward selling
- ❌ Less exciting price action
- ❌ Slower to reward early supporters with appreciation

**Example**: $1,000 deposited into $50k reserve
```
Before: P = $50,000 / (1,000,000 × 0.30) = $0.167
After:  P = $51,000 / (1,000,000 × 0.30) = $0.170
Change: +0.67% price increase
```

### 2. Sustainability of DeltaOne Rewards

**This is the most critical tradeoff for model creators.**

When you mint DeltaOne rewards, you increase supply without adding reserve. This dilutes the price according to:

```
New Price = R / (S_new × w)

Where S_new = S_old + rewards_minted
```

The question: **How many DeltaOnes can your reserve sustain at different CRR levels?**

#### Real Numbers: Sustaining 25 DeltaOnes at ≥$100 Price Floor

Assuming 100k tokens per DeltaOne:

| CRR | Reserve Needed | Interpretation |
|-----|----------------|----------------|
| **10%** | **$5.37M** | Requires massive funding to sustain many improvements |
| **15%** | **$288k** | Moderate funding supports reasonable improvement runway |
| **20%** | **$72.6k** | Modest funding sustains significant improvements |
| **25%** | **$28.1k** | Small funding provides long reward runway |
| **30%** | **$13.5k** | Minimal funding stretches across many contributors |

**Key Insight**: Low CRR aggressively converts reserve into early rewards. High CRR stretches the same reserve across many improvements.

### 3. The "Racing vs Revenue Share" Dynamic

Your CRR choice sends a signal about what kind of participation you want:

#### Low CRR (10-12%)
- **Feels like**: Speculative upside, timing matters
- **Attracts**: Fast movers, speculators, early adopters
- **Risk**: Contributors race to submit improvements early
- **Later contributors**: Get scraps, may feel unfair
- **Best for**: Experimental models where you want fast feedback

#### High CRR (20-30%)
- **Feels like**: Revenue share, quality matters
- **Attracts**: Long-term data providers, enterprises
- **Fairness**: Later improvements still meaningfully compensated
- **Later contributors**: Still have strong incentives to participate
- **Best for**: Enterprise models with ongoing improvement needs

### 4. Volatility and Governance Credibility

#### Higher CRR Benefits
- ✅ Reduces price volatility
- ✅ Makes token harder to manipulate
- ✅ Easier reserve math to reason about
- ✅ Improves credibility as "performance-based" system
- ✅ Better for regulatory perception

#### Lower CRR Benefits
- ✅ Very expressive price discovery
- ❌ Governance legitimacy tied to thin liquidity
- ❌ Can undermine trust if rewards collapse prices
- ❌ Hard to predict economic outcomes

## Practical Scenarios

Let's work through real model creator situations:

### Scenario A: "I have $25,000 to fund my model"

**Your question**: How long will this last? How many DeltaOnes can I reward?

#### With CRR = 10%
```
Initial Reserve: $25,000
Initial Supply: 1,000,000 tokens
Initial Price: $25,000 / (1,000,000 × 0.10) = $0.25

After 10 DeltaOnes (1M tokens minted):
New Supply: 2,000,000 tokens
New Price: $25,000 / (2,000,000 × 0.10) = $0.125
Price decline: -50%

After 25 DeltaOnes (2.5M tokens minted):
New Supply: 3,500,000 tokens
New Price: $25,000 / (3,500,000 × 0.10) = $0.071
Price decline: -71%
```

**Verdict**: Your $25k supports ~10-15 DeltaOnes before price collapses below attractive levels.

#### With CRR = 20%
```
Initial Reserve: $25,000
Initial Supply: 1,000,000 tokens
Initial Price: $25,000 / (1,000,000 × 0.20) = $0.125

After 10 DeltaOnes (1M tokens minted):
New Supply: 2,000,000 tokens
New Price: $25,000 / (2,000,000 × 0.20) = $0.0625
Price decline: -50%

After 25 DeltaOnes (2.5M tokens minted):
New Supply: 3,500,000 tokens
New Price: $25,000 / (3,500,000 × 0.20) = $0.036
Price decline: -71%
```

**Verdict**: Your $25k supports 20-30 DeltaOnes, twice as long as low CRR.

#### With CRR = 30%
```
Initial Reserve: $25,000
Initial Supply: 1,000,000 tokens
Initial Price: $25,000 / (1,000,000 × 0.30) = $0.083

After 10 DeltaOnes (1M tokens minted):
New Supply: 2,000,000 tokens
New Price: $25,000 / (2,000,000 × 0.30) = $0.042
Price decline: -50%

After 25 DeltaOnes (2.5M tokens minted):
New Supply: 3,500,000 tokens
New Price: $25,000 / (3,500,000 × 0.30) = $0.024
Price decline: -71%
```

**Verdict**: Your $25k supports 30-40 DeltaOnes, but starting price is lower.

**Key Takeaway**: Higher CRR means your funding lasts longer across more improvements, but you start with lower absolute prices.

### Scenario B: "My model is 65% accurate, needs to reach 85%"

**Your question**: That's 20 percentage points (20 DeltaOnes). How should I structure rewards?

Let's assume 100k tokens per DeltaOne and $50k initial funding.

#### Option 1: CRR = 10% (Front-loaded rewards)
```
Initial State:
  Reserve: $50,000
  Supply: 1,000,000 tokens
  Price: $0.50/token

Early contributors (first 5 DeltaOnes):
  Supply becomes: 1,500,000 tokens
  Price: $50,000 / (1,500,000 × 0.10) = $0.33
  Each DeltaOne worth: 100k × avg($0.50, $0.33) = ~$41,500

Later contributors (DeltaOnes 15-20):
  Supply becomes: 3,000,000 tokens
  Price: $50,000 / (3,000,000 × 0.10) = $0.167
  Each DeltaOne worth: 100k × ~$0.20 = ~$20,000
```

**Pattern**: Early contributors earn 2x what later ones do. Creates racing dynamics.

#### Option 2: CRR = 25% (Balanced rewards)
```
Initial State:
  Reserve: $50,000
  Supply: 1,000,000 tokens
  Price: $0.20/token

Early contributors (first 5 DeltaOnes):
  Supply becomes: 1,500,000 tokens
  Price: $50,000 / (1,500,000 × 0.25) = $0.133
  Each DeltaOne worth: 100k × avg($0.20, $0.133) = ~$16,650

Later contributors (DeltaOnes 15-20):
  Supply becomes: 3,000,000 tokens
  Price: $50,000 / (3,000,000 × 0.25) = $0.067
  Each DeltaOne worth: 100k × ~$0.08 = ~$8,000
```

**Pattern**: Early contributors earn ~2x, but absolute difference is smaller. More sustainable.

**Which to choose?**
- **CRR = 10%**: If you need to attract elite contributors immediately and can handle fewer total improvements
- **CRR = 25%**: If you need sustained participation across all 20 DeltaOnes

### Scenario C: "My model is already 95% accurate, just needs 3pp to reach state-of-the-art"

**Your situation**: Near-perfect model, just needs elite data to cross the finish line to 98% (3 DeltaOnes total).

**Requirements**:
- Attract the absolute best data providers
- Maximum incentive for these critical final improvements
- Fast feedback and immediate price signal
- Don't need reward sustainability (only 3 rewards), but DO need post-improvement value capture

**Recommendation: CRR = 10-12%**

```
Example with CRR = 10%, $30k initial reserve:

Initial Price: $30k / (1M × 0.10) = $0.30/token

After 1st DeltaOne (100k tokens minted):
  Supply: 1,100,000 tokens
  Price: $30k / (1.1M × 0.10) = $0.273/token
  DeltaOne value: 100k × avg($0.30, $0.273) ≈ $28,650

After 2nd DeltaOne:
  Supply: 1,200,000 tokens
  Price: $30k / (1.2M × 0.10) = $0.25/token
  DeltaOne value: 100k × avg($0.273, $0.25) ≈ $26,150

After 3rd DeltaOne (final):
  Supply: 1,300,000 tokens
  Price: $30k / (1.3M × 0.10) = $0.231/token
  DeltaOne value: 100k × avg($0.25, $0.231) ≈ $24,050

Total rewards paid: ~$78,850 in token value
Reserve remaining: $30k

Now at state-of-the-art with locked supply:
  No more minting (performance ceiling reached)
  API fees accumulate directly to reserve
  Price = R / (1.3M × 0.10)

After $100k in API fees over next 2 years:
  Reserve: $130k
  Supply: 1.3M (unchanged - no more rewards)
  Price: $130k / (1.3M × 0.10) = $1.00/token
  Price increase: +333% from API revenue alone
```

**Analysis**:
- Each contributor gets $24k-29k in immediate token value
- Very attractive for elite data providers
- High price sensitivity means early adopters see gains
- Only 3 rewards means dilution stops quickly
- **Critical**: After reaching state-of-the-art, API fees flow into reserve with NO further dilution
- Low CRR means API fees create dramatic price appreciation (every $10k in fees = +7.7 cents/token)

**Why low CRR works here:**
1. **Finite improvement horizon**: You know exactly when you're "done" improving
2. **Elite targeting**: You need the best 2-3 data sources, not dozens
3. **Speed matters**: First to state-of-the-art captures market share
4. **Post-improvement compounding**: After 3 DeltaOnes, supply is locked and API usage drives exponential price growth
5. **Usage-based sustainability**: Long-term value comes from being best-in-class and generating revenue, not from more rewards

**Comparison with high CRR for same scenario:**

With CRR = 25%, same $30k reserve:
```
Initial Price: $30k / (1M × 0.25) = $0.12/token

After 3 DeltaOnes:
  Supply: 1,300,000 tokens
  Price: $30k / (1.3M × 0.25) = $0.092/token
  Average DeltaOne value: ~$10k-12k each
  Total rewards: ~$33k

After $100k API fees:
  Reserve: $130k
  Price: $130k / (1.3M × 0.25) = $0.40/token
  Price increase: +335% (similar multiple, lower absolute price)
```

**Verdict**: For a "sprint to the finish" scenario with few DeltaOnes needed, low CRR gives you **2-3x more powerful incentives** per reward, which is exactly what you need to attract elite contributors for those critical final percentage points. The long-term sustainability comes from usage revenue, not more minting.

### Scenario D: "I want to reward 50+ DeltaOnes over 5 years"

**Your situation**: Long-lived model with continuous incremental improvements (e.g., medical imaging model with ongoing medical data streams).

**Requirements**:
- Sustainable incentives for years
- Fair compensation for late-stage contributors
- Stable enough for enterprise adoption
- Room for price appreciation from API fees

**Recommendation: CRR = 25-30%**

```
Example with CRR = 30%, $100k initial reserve:

Initial Price: $100k / (1M × 0.30) = $0.10/token

After 50 DeltaOnes (5M tokens minted):
  Supply: 6,000,000 tokens
  Price: $100k / (6M × 0.30) = $0.056/token

With API fees adding $50k over time:
  Reserve: $150k
  Price: $150k / (6M × 0.30) = $0.083/token
```

**Analysis**:
- High CRR prevents early reward death spiral
- API fees can offset dilution over time
- Later contributors still earn meaningful amounts
- Price stays in reasonable range for valuation

## Decision Framework

### Choose CRR = 10-12% if:
- ✅ Model is experimental, rapid iteration expected
- ✅ You want maximum price signal sensitivity
- ✅ You need to attract top-tier contributors immediately
- ✅ You expect fewer than 10 DeltaOnes total ("sprint to finish")
- ✅ You can tolerate high volatility
- ✅ Model is already near state-of-the-art, needs final push
- ✅ Post-improvement, you expect strong usage revenue that benefits from high sensitivity
- ⚠️ You understand rewards will exhaust reserves quickly

### Choose CRR = 15-20% if:
- ✅ Model has proven utility but needs improvement
- ✅ You want balanced growth and stability
- ✅ You expect 15-30 DeltaOnes over 2-3 years
- ✅ You want reasonable price appreciation from usage
- ✅ You care about sustainable incentives
- ✅ You want to balance early and late contributor incentives

### Choose CRR = 25-30% if:
- ✅ Model is production-grade, ongoing improvements
- ✅ You prioritize long-term sustainability
- ✅ You target enterprise data providers
- ✅ You expect 40+ DeltaOnes over many years
- ✅ Fairness to late contributors is important
- ✅ You want price stability for partnerships
- ✅ You expect significant API revenue accumulation

## Advanced Consideration: API Fee Accumulation

One crucial factor: **API fees increase reserves without minting tokens**, which means CRR becomes especially important once you stop minting rewards.

### Example: Model with Growing Usage

```
Scenario: Medical imaging model
CRR: 25%
Initial: $50k reserve, 1M supply
Expected: 30 DeltaOnes over 3 years, $200k API fees

Without API fees:
  Final supply: 4M tokens (3M rewards minted)
  Reserve: $50k
  Price: $50k / (4M × 0.25) = $0.05/token

With $200k API fees:
  Final supply: 4M tokens
  Reserve: $250k (5x higher)
  Price: $250k / (4M × 0.25) = $0.25/token (5x higher)
```

**Key Insight**: If you expect strong usage revenue, your CRR choice affects how dramatically API fees impact price:
- **Low CRR**: API fees create larger % price movements (high reflexivity)
- **High CRR**: API fees create smaller % price movements (high stability)

For models that reach performance ceiling quickly (Scenario C), low CRR maximizes the price impact of your usage success.

## Common Mistakes to Avoid

### ❌ Mistake 1: Choosing low CRR to "make token price higher"
**Reality**: Lower CRR means lower price for same reserve. The formula is `P = R / (S × w)`, so lower w = lower P.

### ❌ Mistake 2: Not calculating reward runway
**Reality**: Run the numbers. How many DeltaOnes can your reserve actually support? Don't guess.

### ❌ Mistake 3: Ignoring API fee projections
**Reality**: If you expect strong usage, CRR determines how dramatically fees move price.

### ❌ Mistake 4: Copying another model's CRR
**Reality**: Your model's stage, improvement potential, and funding are unique. One size doesn't fit all.

### ❌ Mistake 5: Using high CRR for "sprint to finish" scenarios
**Reality**: If you only need 3-5 DeltaOnes to reach state-of-the-art, low CRR provides 2-3x stronger incentives per reward AND higher price sensitivity to usage revenue.

### ❌ Mistake 6: Confusing "sustainability" with "more rewards"
**Reality**: For near-perfect models, sustainability comes from usage revenue, not from supporting dozens more DeltaOnes.

## Quick Reference Table

| Your Situation | Recommended CRR | Tokens per ΔOne | Expected ΔOnes | Initial Reserve |
|----------------|-----------------|-----------------|----------------|-----------------|
| Sprint to finish (95%→98%) | 10-12% | 100k-150k | 3-8 | $20-40k |
| Experimental, under $20k funding | 10-12% | 150k-200k | 10-15 | $15-25k |
| Proven, moderate funding | 15-20% | 100k-150k | 20-30 | $40-80k |
| Production, enterprise | 20-25% | 75k-125k | 30-50 | $60-150k |
| Long-lived, ongoing improvements | 25-30% | 50k-100k | 50+ | $100k+ |
| Ultra-stable enterprise / regulated | 50-100% | 25k-75k | 50+ | $200k+ |

## Calculator: Will My Reserve Last?

Use this formula to check sustainability:

```
Price after N DeltaOnes = R / ((S₀ + N × T) × w)

Where:
  R = Your initial reserve
  S₀ = Initial supply
  N = Number of DeltaOnes to reward
  T = Tokens per DeltaOne
  w = CRR

Minimum acceptable price = Your threshold (e.g., $0.05)
```

**Example**:
```
R = $50,000
S₀ = 1,000,000
T = 100,000 tokens/DeltaOne
w = 0.20
Target: Sustain 25 DeltaOnes above $0.08/token

Final supply = 1M + (25 × 100k) = 3.5M
Final price = $50k / (3.5M × 0.20) = $0.071/token

Result: Falls below $0.08, need more reserve or higher CRR
```

## Summary

**The core tradeoff is time preference**:
- **Low CRR**: "Front-load rewards and price discovery, maximize API fee reflexivity"
- **High CRR**: "Smooth rewards and let value accrue slowly and stably"

**The right choice depends on**:
1. How many improvements you expect
2. How much funding you have
3. Whether you want racing or revenue-sharing dynamics
4. How much API revenue you project
5. Whether you need enterprise credibility
6. Whether you're in a "sprint to finish" scenario
7. Whether long-term value comes from more rewards or from usage revenue

**Most important**: Run the numbers for your specific model. Don't guess. Calculate how many DeltaOnes your reserve can sustain at different CRR levels, and choose the CRR that aligns with your improvement roadmap.

**Key insight**: Low CRR isn't always "worse" — for models that only need a few more improvements to reach state-of-the-art, low CRR provides:
1. Strongest possible incentives to attract elite contributors
2. Highest price sensitivity to usage revenue after supply locks
3. Best long-term sustainability through usage-based value accrual

## Next Steps

- [Review Bonding Curve Math](/tokenomics/bonding-curve)
- [Understand API Fee Flow](/tokenomics/api-fee-flow)
- [Launch Your Model](/guides/model-launch-guide)
- [Read AMM Overview](/tokenomics/amm-overview)

For questions about CRR selection for your specific model, reach out to our [Support Team](https://hokus.ai/contact-us) or discuss in the [Community Forum](https://community.hokus.ai).
