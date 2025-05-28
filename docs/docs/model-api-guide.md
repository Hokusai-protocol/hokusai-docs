---
id: model-api-guide
title: Model API Guide
sidebar_label: Model API Guide
sidebar_position: 9
---

# Model API Guide

This guide provides detailed documentation for the Hokusai Model API, including endpoints, authentication, and usage examples.

## Overview

The Hokusai Model API provides programmatic access to models in the Hokusai ecosystem. For a high-level overview of using models, see [Using Models](/using-models).

## Authentication

### API Keys

All API requests require authentication using an API key:

```python
from hokusai import HokusaiClient

client = HokusaiClient(api_key='your_api_key')
```

### Wallet Connection

For token-based access, connect your wallet:

```python
# Connect wallet
client.connect_wallet('your_wallet_address')

# Check connection status
status = client.get_wallet_status()
print(f"Connected: {status.connected}")
print(f"Balance: {status.balance}")
```

## API Endpoints

### Models

#### List Models

```python
# Get all models
models = client.list_models()

# Filter models
filtered_models = client.list_models(
    category='Medical',
    model_type='Open Source',
    min_reward=10000
)

# Filter by license type
# For detailed information about license types and their restrictions, see [License Types](/using-models#license-types)
open_source_models = client.list_models(license_type='Open Source')
commercial_models = client.list_models(license_type='Commercial')
coop_models = client.list_models(license_type='Co-Op')
# Note: Proprietary models are not listed as they are not accessible via API
```

#### Get Model Details

```python
# Get model information
model = client.get_model('model_id')

# Available properties
print(f"Name: {model.name}")
print(f"Category: {model.category}")
print(f"Type: {model.type}")
print(f"License Type: {model.license_type}")  # See [License Types](/using-models#license-types) for details
print(f"Current Benchmark: {model.benchmark}")
print(f"DeltaOne Reward: {model.reward}")

# Check access requirements
if model.license_type == 'Co-Op':
    if not client.is_whitelisted('model_id'):
        raise Exception("You must be whitelisted to use this model")
elif model.license_type == 'Proprietary':
    raise Exception("This model is not available via API")
```

### License Management

For a comprehensive overview of license types and their restrictions, see [License Types](/using-models#license-types).

#### Check License Status

```python
# Check license compliance
license_status = client.check_license_status('model_id')

# Available properties
print(f"License Type: {license_status.license_type}")
print(f"Compliance Status: {license_status.compliant}")
print(f"Attribution Required: {license_status.requires_attribution}")
print(f"Whitelist Status: {license_status.whitelisted}")
```

#### Co-Op Management

```python
# Check co-op membership
membership = client.get_coop_membership('model_id')

# Available properties
print(f"Member Status: {membership.status}")
print(f"Join Date: {membership.join_date}")
print(f"Access Level: {membership.access_level}")

# Request whitelist access
if model.license_type == 'Co-Op':
    request = client.request_whitelist_access('model_id')
    print(f"Request Status: {request.status}")
    print(f"Request ID: {request.request_id}")
```

### Predictions

#### Single Prediction

```python
# Basic prediction with license check
try:
    model = client.get_model('model_id')
    
    # Verify access based on license type
    if model.license_type == 'Co-Op' and not client.is_whitelisted('model_id'):
        raise Exception("You must be whitelisted to use this model")
    elif model.license_type == 'Proprietary':
        raise Exception("This model is not available via API")
    
    # Proceed with prediction
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

    # Available properties
    print(f"Prediction: {result.prediction}")
    print(f"Confidence: {result.confidence}")
    print(f"Latency: {result.latency}ms")
    print(f"Tokens Burned: {result.tokens_burned}")
    
    # Handle attribution for open source models
    if model.license_type == 'Open Source':
        print(f"Attribution Required: {result.attribution}")
except HokusaiError as e:
    if e.code == 'LICENSE_VIOLATION':
        print("License violation detected")
    elif e.code == 'WHITELIST_REQUIRED':
        print("Whitelist access required")
    else:
        print(f"Error: {e.message}")
```

#### Batch Prediction

```python
# Batch prediction
results = client.batch_predict(
    model_id='model_id',
    input_data=[
        {'text': 'Input 1'},
        {'text': 'Input 2'}
    ],
    batch_size=10
)

# Process results
for result in results:
    print(f"Input: {result.input}")
    print(f"Prediction: {result.prediction}")
    print(f"Confidence: {result.confidence}")
```

### Usage and Analytics

#### Usage Statistics

```python
# Get usage stats
stats = client.get_usage_stats(
    model_id='model_id',
    timeframe='last_30_days'
)

# Available metrics
print(f"Total Requests: {stats.total_requests}")
print(f"Successful Requests: {stats.successful_requests}")
print(f"Failed Requests: {stats.failed_requests}")
print(f"Average Latency: {stats.avg_latency}ms")
print(f"Total Tokens Burned: {stats.tokens_burned}")
```

#### Cost Estimation

```python
# Estimate costs
estimate = client.estimate_cost(
    model_id='model_id',
    request_count=1000,
    input_size='medium'
)

# Cost details
print(f"Estimated Tokens: {estimate.tokens}")
print(f"Estimated Cost: {estimate.cost}")
print(f"Cost per Request: {estimate.cost_per_request}")
```

## Model-Specific Endpoints

### Medical Models

```python
# Medical imaging model
result = client.predict(
    model_id='chest-xray-diagnostic-v2',
    input_data={
        'image': image_data,
        'parameters': {
            'confidence_threshold': 0.95
        }
    }
)

# Medical text model
result = client.predict(
    model_id='sepsis-prediction-lstm',
    input_data={
        'patient_data': patient_data,
        'parameters': {
            'time_window': '24h'
        }
    }
)
```

### Legal Models

```python
# Contract analysis
result = client.predict(
    model_id='contract-clause-extractor',
    input_data={
        'contract_text': contract_text,
        'parameters': {
            'clause_types': ['liability', 'termination']
        }
    }
)

# Case summarization
result = client.predict(
    model_id='case-law-summarizer',
    input_data={
        'case_text': case_text,
        'parameters': {
            'summary_length': 'medium'
        }
    }
)
```

### Financial Models

```python
# Market prediction
result = client.predict(
    model_id='high-frequency-market-predictor',
    input_data={
        'market_data': market_data,
        'parameters': {
            'timeframe': '1h',
            'confidence_threshold': 0.8
        }
    }
)

# Credit analysis
result = client.predict(
    model_id='credit-default-classifier',
    input_data={
        'applicant_data': applicant_data,
        'parameters': {
            'risk_threshold': 0.7
        }
    }
)
```

## Error Handling

### Common Errors

```python
try:
    result = client.predict(
        model_id='model_id',
        input_data={'text': 'Sample input'}
    )
except HokusaiError as e:
    if e.code == 'INSUFFICIENT_TOKENS':
        print("Insufficient tokens for prediction")
    elif e.code == 'INVALID_INPUT':
        print("Invalid input format")
    elif e.code == 'MODEL_UNAVAILABLE':
        print("Model is currently unavailable")
    elif e.code == 'LICENSE_VIOLATION':
        print("License violation detected")
    elif e.code == 'WHITELIST_REQUIRED':
        print("Whitelist access required")
    elif e.code == 'PROPRIETARY_MODEL':
        print("This model is not available via API")
    else:
        print(f"Unexpected error: {e.message}")
```

### Rate Limiting

```python
# Handle rate limiting
try:
    result = client.predict(...)
except RateLimitError as e:
    print(f"Rate limit exceeded. Retry after {e.retry_after} seconds")
    time.sleep(e.retry_after)
    result = client.predict(...)
```

## Best Practices

1. **Authentication**
   - Store API keys securely
   - Rotate keys regularly
   - Use environment variables

2. **Performance**
   - Use batch processing
   - Implement caching
   - Monitor latency

3. **Error Handling**
   - Implement retry logic
   - Log errors properly
   - Handle rate limits

4. **Cost Management**
   - Monitor token usage
   - Estimate costs
   - Optimize requests

## Next Steps

- Learn about [Using Models](/using-models)
- Understand [Creating Models](/creating-models)
- Review [Improving Models](/improving-models)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).