---
id: creating-models
title: Creating Models
sidebar_label: Creating Models
sidebar_position: 6
---

# Creating Models

This guide explains how to create and register models in the Hokusai ecosystem, including the required smart contract interactions.

## Overview

Hokusai allows model developers to register their AI models and earn rewards when the models are improved through data contributions. Each model has its own ERC-20 token that is minted when performance improves and burned for model access. This guide covers both the web-based creation process and programmatic integration using our SDK.

## Prerequisites

Before registering a model, ensure you have:

1. A compatible blockchain wallet with ETH for gas fees
2. Python 3.8+ installed
3. Your model code and artifacts
4. Model documentation and specifications
5. Baseline performance metrics

## Web-Based Model Creation

The easiest way to create a model is through the Hokusai website. This process guides you through all necessary steps without requiring SDK installation.

### Step 1: Access the Model Creation Portal

1. Visit [hokus.ai/create-model](https://hokus.ai/create-model)
2. Connect your wallet
3. Review the model creation requirements

### Step 2: Provide Model Information

Fill out the model registration form with:

1. **Basic Information**
   - Model name
   - Description
   - Version
   - Category/type
   - Use case

2. **Technical Details**
   - Framework (PyTorch, TensorFlow, etc.)
   - Input/output formats
   - Performance metrics
   - Hardware requirements

3. **Performance Data**
   - Baseline metrics
   - Test results
   - Validation data
   - Performance benchmarks

### Step 3: Upload Model Files

Upload your model files through the web interface:

1. **Model Artifacts**
   - Model weights
   - Configuration files
   - Dependencies list
   - Version information

2. **Documentation**
   - Architecture overview
   - Training methodology
   - Usage examples
   - API documentation

### Step 4: Configure Token Economics

Set up your model's token parameters:

1. **Reward Distribution**
   - Contributor rewards (default: 70%)
   - Model owner rewards (default: 30%)
   - Minimum improvement threshold

2. **Access Control**
   - Burn rate for model access
   - Usage restrictions
   - Access tiers

### Step 5: Review and Deploy

1. **Review Process**
   - Automated validation checks
   - Performance verification
   - Smart contract integration
   - Gas fee estimation

2. **Deployment**
   - Smart contract deployment
   - Token creation
   - Model registration
   - Initial setup

### Step 6: Post-Deployment

After deployment, you'll receive:

1. **Access Information**
   - Model ID
   - Token address
   - API endpoints
   - Documentation links

2. **Management Tools**
   - Performance dashboard
   - Token management
   - Access control
   - Analytics

## Programmatic Model Creation

For advanced users or automated workflows, you can use our SDK to programmatically create and register models.

## Step 1: Install the SDK

```bash
pip install hokusai-sdk
```

## Step 2: Prepare Your Model

### Technical Requirements

Your model must meet these requirements:

1. **Model Format**
   - Must be a machine learning model
   - Must be serializable (e.g., PyTorch, TensorFlow, scikit-learn)
   - Must include input/output specifications
   - Must have version control

2. **Performance Requirements**
   - Must have baseline performance metrics
   - Must be reproducible
   - Must handle standard input formats
   - Must provide confidence scores
   - Must be verifiable by the DeltaOneVerifier contract

3. **Documentation Requirements**
   - Model architecture description
   - Training methodology
   - Performance benchmarks
   - Input/output specifications
   - Usage examples

### Model Packaging

Package your model for submission:

```python
from hokusai import ModelPackager

# Initialize packager
packager = ModelPackager()

# Package your model
model_package = packager.package(
    model_path='path/to/model',
    metadata={
        'name': 'Your Model Name',
        'version': '1.0.0',
        'description': 'Model description',
        'architecture': 'Model architecture details',
        'performance_metrics': {
            'accuracy': 0.95,
            'precision': 0.94,
            'recall': 0.93
        }
    }
)
```

## Step 3: Smart Contract Interactions

### Initialize the Client

```python
from hokusai import HokusaiClient

# Initialize the client
client = HokusaiClient(
    api_key='your_api_key',
    wallet_address='your_wallet_address'
)

# Connect your wallet
client.connect_wallet()
```

### Register Model and Create Token

```python
# Register model and create ERC-20 token
registration = client.register_model(
    model_package=model_package,
    settings={
        'reward_rate': 0.1,  # Percentage of improvement to reward
        'min_improvement': 0.01,  # Minimum improvement threshold
        'max_rewards': 1000  # Maximum rewards per improvement
    }
)

# This will:
# 1. Register the model in the ModelRegistry
# 2. Create a new ERC-20 token for the model
# 3. Set up the TokenManager for the model
# 4. Configure the DeltaOneVerifier for performance tracking

print(f"Model ID: {registration.model_id}")
print(f"Token Address: {registration.token_address}")
print(f"Registration Status: {registration.status}")
```

### Configure Smart Contracts

```python
# Configure TokenManager settings
token_settings = client.configure_token_manager(
    model_id=registration.model_id,
    settings={
        'mint_threshold': 0.01,  # Minimum improvement to mint tokens
        'burn_rate': 0.1,  # Tokens burned per model access
        'reward_distribution': {
            'contributors': 0.7,  # 70% to data contributors
            'model_owner': 0.3    # 30% to model owner
        }
    }
)

# Configure DeltaOneVerifier settings
verifier_settings = client.configure_verifier(
    model_id=registration.model_id,
    settings={
        'performance_metrics': ['accuracy', 'precision', 'recall'],
        'verification_method': 'zkProof',  # or 'oracle'
        'improvement_calculation': 'deltaInBps'  # Basis points calculation
    }
)
```

## Step 4: Test Integration

### Run Validation Tests

```python
# Run integration tests
test_results = client.test_model_integration(
    model_id=registration.model_id,
    test_cases=[
        {
            'input': test_input,
            'expected_output': expected_output
        }
    ]
)

print(f"Test Results: {test_results.status}")
print(f"Validation Score: {test_results.score}")
```

### Verify Smart Contract Integration

```python
# Verify smart contract integration
contract_verification = client.verify_contract_integration(
    model_id=registration.model_id,
    checks=[
        'token_creation',
        'verifier_setup',
        'manager_configuration',
        'reward_distribution'
    ]
)

print(f"Contract Verification: {contract_verification.status}")
print(f"Token Manager: {contract_verification.token_manager}")
print(f"DeltaOne Verifier: {contract_verification.verifier}")
```

## Best Practices

1. **Model Development**
   - Use version control
   - Document thoroughly
   - Test extensively
   - Optimize performance
   - Ensure verifiability

2. **Smart Contract Integration**
   - Test contract interactions
   - Verify token economics
   - Monitor gas costs
   - Secure private keys
   - Backup contract addresses

3. **Token Management**
   - Set appropriate thresholds
   - Configure fair rewards
   - Monitor token supply
   - Track burn rates
   - Manage liquidity

## Troubleshooting

Common issues and solutions:

1. **Registration Failures**
   - Check model format
   - Verify documentation
   - Review requirements
   - Test locally
   - Check gas fees

2. **Smart Contract Issues**
   - Verify contract addresses
   - Check transaction status
   - Review error logs
   - Monitor gas costs
   - Verify permissions

3. **Token Problems**
   - Check token creation
   - Verify minting rights
   - Monitor burn events
   - Review distribution
   - Check balances

## Next Steps

- Learn about [Improving Models](/improving-models)
- Understand [Model API Guide](/model-api-guide)
- Review [Auction Pricing](/auction-pricing)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 