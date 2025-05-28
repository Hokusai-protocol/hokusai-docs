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
   - Model type (Open Source, Commercial, Co-Op, Proprietary)
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

1. **License Types and Access**
   - **Open Source**: Available to all users with proper attribution
   - **Commercial**: Available to all users with token-based access
   - **Co-Op**: Only available to whitelisted members of the cooperative
   - **Proprietary**: Only available to the model owner, not accessible via API

2. **Performance Requirements**
   - Accuracy thresholds
   - Speed requirements
   - Resource constraints
   - Use case fit

3. **Cost Considerations**
   - Usage-based pricing
   - Token burn rates
   - Volume discounts
   - Budget constraints

## License Types

### Open Source Models

Open source models are freely available to all users:

1. **Access Requirements**
   - No whitelist required
   - Standard token-based access
   - Must provide attribution
   - Must comply with open source license

2. **Usage Rights**
   - Can be used commercially
   - Can be modified and redistributed
   - Must maintain license compliance
   - Must credit original authors

### Commercial Models

Commercial models are available to all users with token-based access:

1. **Access Requirements**
   - No whitelist required
   - Must have sufficient token balance
   - Must comply with usage terms
   - Must respect rate limits

2. **Usage Rights**
   - Can be used commercially
   - Cannot be modified or redistributed
   - Must comply with API terms
   - Must respect usage restrictions

### Co-Op Models

Co-op models are only available to whitelisted members:

1. **Access Requirements**
   - Must be whitelisted
   - Must be a co-op member
   - Must have sufficient token balance
   - Must comply with co-op rules

2. **Usage Rights**
   - Usage limited to co-op members
   - Cannot be redistributed
   - Must comply with co-op terms
   - May have additional restrictions

### Proprietary Models

Proprietary models are only available to their owners:

1. **Access Restrictions**
   - Not available via API
   - Only accessible to model owner
   - Cannot be used by other parties
   - No public access

2. **Owner Rights**
   - Full control over model usage
   - Can be used internally only
   - No public distribution
   - No API access

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
if model.type == 'Co-Op':
    if not client.is_whitelisted('model_id'):
        raise Exception("You must be whitelisted to use this model")
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
print(f"Token Burned: {usage.tokens_burned}")
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

print(f"Estimated Token Burn: {cost_estimate.tokens}")
print(f"Estimated Cost: {cost_estimate.cost}")
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
   - Monitor token balance
   - Check burn rates
   - Verify pricing
   - Review usage patterns

## Next Steps

- Learn about [Creating Models](/creating-models)
- Understand [Improving Models](/improving-models)
- Review [Auction Pricing](/auction-pricing)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).