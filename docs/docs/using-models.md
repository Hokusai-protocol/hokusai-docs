---
id: using-models
title: Using Models
sidebar_label: Using Models
sidebar_position: 8
---

# Using Models

This guide explains how to access and use models in the Hokusai ecosystem, including API integration, model selection, and usage tracking.

## Overview

Hokusai provides access to a variety of AI models through a unified API. Each model has its own performance metrics, usage costs, and access requirements. This guide covers how to find, access, and integrate models into your applications.

## Finding Models

### 1. Explore Models Page

Visit the [Explore Models](https://hokus.ai/explore-models/) page to browse available models:

1. **Filtering Options**
   - Model category (Medical, Legal, Sales, Finance, Agriculture, Industrial)
   - Model type (Decentralized)
   - Performance metrics (varies by model type)
   - DeltaOne reward amount
   - Current benchmark scores

2. **Model Details**
   - Performance benchmarks
   - Input/output specifications
   - Usage examples
   - Pricing information

### 2. Model Selection

Consider these factors when choosing a model:

1. **License and Access**
   - **Decentralized**: Available to all users via API with token-based access and community governance

2. **Performance Requirements**
   - Accuracy thresholds
   - Speed requirements
   - Resource constraints
   - Use case fit

3. **Cost Considerations**
   - Usage-based pricing (USDC fees)
   - Volume discounts
   - Budget constraints

## License Type

### Decentralized Models

All Hokusai models use the decentralized license, making them community-owned and available via API:

1. **Access Requirements**
   - Pay the API usage fee (set by token holders)
   - No whitelist required
   - Must respect rate limits

2. **Usage Rights**
   - Available to all users via API
   - Token holders participate in governance
   - Pricing set transparently by community

[Learn more about Decentralized Licensing →](/licensing/decentralized)

## API Integration

### 1. Authentication

```python
from hokusai import HokusaiClient

# Initialize client with API key
client = HokusaiClient(api_key='your_api_key')

# Connect wallet for token-based access
client.connect_wallet('your_wallet_address')

# Check model access
model = client.get_model('model_id')
```

### 2. Model Access

```python
# Get model information
model = client.get_model('model_id')

# Check access requirements
requirements = model.get_access_requirements()

# Verify token balance
balance = client.get_token_balance('model_id')
```

### 3. Making Predictions

```python
# Basic prediction
result = client.predict(
    model_id='model_id',
    input_data={
        'text': 'Sample input text',
        'parameters': {
            'temperature': 0.7,
            'max_tokens': 100
        }
    }
)

# Batch prediction
results = client.batch_predict(
    model_id='model_id',
    input_data=[
        {'text': 'Input 1'},
        {'text': 'Input 2'}
    ]
)
```

## Usage Tracking

### 1. Monitoring Usage

```python
# Get usage statistics
usage = client.get_usage_stats(
    model_id='model_id',
    timeframe='last_30_days'
)

print(f"Total Requests: {usage.total_requests}")
print(f"Total Fees Paid: {usage.fees_paid} USDC")
print(f"Average Latency: {usage.avg_latency}ms")
```

### 2. Cost Management

```python
# Estimate costs
cost_estimate = client.estimate_cost(
    model_id='model_id',
    request_count=1000,
    input_size='medium'
)

print(f"Estimated Cost: {cost_estimate.cost} USDC")
print(f"Cost Per Request: {cost_estimate.cost_per_request} USDC")
```

## Best Practices

1. **Performance Optimization**
   - Cache responses when appropriate
   - Use batch processing for multiple requests
   - Implement retry logic for failed requests
   - Monitor latency and adjust accordingly

2. **Cost Optimization**
   - Monitor token balance
   - Use appropriate batch sizes
   - Implement rate limiting
   - Cache frequent requests

3. **Error Handling**
   - Implement proper error handling
   - Use exponential backoff
   - Monitor error rates
   - Log issues for debugging

## Troubleshooting

Common issues and solutions:

1. **Authentication Issues**
   - Verify API key
   - Check wallet connection
   - Ensure sufficient token balance
   - Check access permissions

2. **Performance Issues**
   - Check input format
   - Verify model parameters
   - Monitor rate limits
   - Check network latency

3. **Cost Issues**
   - Monitor USDC balance for API payments
   - Verify pricing tiers
   - Review usage patterns

## Next Steps

- Learn about [Creating Models](/creating-models)
- Understand [Improving Models](/improving-models)
- Review [Auction Pricing](/auction-pricing)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).