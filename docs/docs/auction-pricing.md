---
id: auction-pricing
title: Auction Pricing
sidebar_label: Auction Pricing
sidebar_position: 10
---

# Auction Pricing

This guide explains Hokusai's simple pricing model for model access.

## Overview

Hokusai uses a straightforward pricing model that starts with minimal costs and can be adjusted through community governance. This approach ensures accessibility while allowing the community to respond to market conditions.

> **Running Example: Medical Image Analysis Model**
> 
> Throughout this guide, we'll follow the pricing evolution of a medical image analysis model:
> - Initial launch: Minimal price to cover costs
> - Governance adjustments: Community-driven price changes
> - Market response: Usage patterns and feedback

## Pricing Model

### Initial Price Setting

Models start with a minimal base price that covers only essential costs:

```python
# Minimal cost components
compute_cost = 0.001  # Per inference
storage_cost = 0.0005  # Per image
network_cost = 0.0005  # Per request

initial_price = compute_cost + storage_cost + network_cost
# initial_price = 0.002 USDC per request
```

This low initial price ensures:
- Easy access for early adopters
- Minimal barriers to entry
- Market-driven usage patterns

### Price Adjustments

Prices can be adjusted through community governance:

1. **Proposal Process**
   - Any community member can propose a price change
   - Proposals must include:
     - Current price
     - Proposed new price
     - Justification for change
     - Impact analysis

2. **Voting**
   - Community members vote on proposals
   - Majority approval required
   - Minimum voting period: 7 days
   - Minimum participation threshold: 10% of total tokens

3. **Implementation**
   - Approved changes take effect after voting period
   - Changes are implemented gradually over 30 days
   - Users are notified of upcoming changes

> **Example: Price Adjustment Proposal**
> 
> ```python
> # Current price
> current_price = 0.002  # USDC per request
> 
> # Proposed new price
> proposed_price = 0.003  # 50% increase
> 
> # Implementation over 30 days
> daily_increase = (proposed_price - current_price) / 30
> # daily_increase = 0.000033 USDC
> ```

## Usage Tiers

### Basic Usage
- Pay-per-use pricing
- Standard queue priority
- Basic support

### Batch Processing
- Volume-based discounts
- Priority queue access
- Enhanced support

### Enterprise
- Custom pricing agreements
- Guaranteed capacity
- Dedicated support
- SLA guarantees

> **Example: Hospital Batch Processing**
> 
> ```python
> # Batch processing for hospital
> batch_size = 1000  # Daily batch
> current_price = 0.002  # Current price
> volume_discount = 0.25  # 25% volume discount
> 
> batch_price = current_price * batch_size * (1 - volume_discount)
> # batch_price = 0.002 * 1000 * 0.75 = 1.5 USDC
> ```

## Best Practices

1. **Cost Management**
   - Monitor usage patterns
   - Use batch processing when possible
   - Choose appropriate tier

2. **Governance Participation**
   - Stay informed about price proposals
   - Vote on important changes
   - Provide feedback to the community

3. **Budget Planning**
   - Set usage limits
   - Monitor spending
   - Plan for potential price changes

## Troubleshooting

### Common Issues

1. **Price Changes**
   - Check governance proposals
   - Review implementation schedule
   - Plan for adjustments

2. **Usage Optimization**
   - Use batch processing
   - Monitor queue status
   - Review tier options

3. **Budget Management**
   - Set up alerts
   - Monitor usage
   - Review volume discounts

## Next Steps

- Learn about [Using Models](/using-models)
- Review [Model API Guide](/model-api-guide)
- Understand [Tokenomics](/tokenomics/index)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 