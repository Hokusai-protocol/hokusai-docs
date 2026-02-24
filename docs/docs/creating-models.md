---
id: creating-models
title: Creating Models
sidebar_label: Creating Models
sidebar_position: 6
---

# Creating Models

This guide explains how to create and register models in the Hokusai ecosystem, including the required smart contract interactions.

## Overview

Hokusai allows model developers to register their AI models and earn rewards when the models are improved through data contributions. Each model has its own ERC-20 token that is minted when performance improves and can be traded on a dedicated AMM. API usage fees flow to the token's USDC reserve, increasing its price. This guide covers both the web-based creation process and programmatic integration using our SDK.

## Prerequisites

Before registering a model, ensure you have:

1. A compatible blockchain wallet with ETH for gas fees
2. Python 3.8+ installed
3. Your model code and artifacts
4. Model documentation and specifications
5. Baseline performance metrics

## Web-Based Model Creation

The easiest way to create a model is through the Hokusai website. This process guides you through all necessary steps without requiring SDK installation.

**Comprehensive Guide:** For detailed step-by-step instructions on launching your model, including tokenomics configuration and deployment, see our [Complete Model Launch Guide](guides/model-launch-guide).

### Step 1: Access the Model Creation Portal

1. Visit [hokus.ai/create-model](https://hokus.ai/create-model)
2. Review the model creation requirements

### Step 2: Model Overview

Fill out the basic information about your AI model:

- **Model Name** - A descriptive name indicating your model's purpose and domain
- **Token Ticker** - A 3-6 character uppercase symbol for your model's token (e.g., "CHEST")
- **Description** - Describe your model's capabilities and use cases
- **Category** - Select the domain category (Healthcare, Finance, NLP, etc.)
- **Tags** - Add relevant tags for discoverability

### Step 3: Performance Metrics

Configure how your model's performance is measured. The DeltaOne system ties token rewards to 1 percentage point improvements in your chosen metric.

- **Performance Metric** - Select a metric type (Accuracy, F1 Score, AUC-ROC, or custom)
- **Current Benchmark Value** - Your model's current performance baseline (e.g., 0.884 for 88.4% accuracy)
- **Metric Direction** - Whether higher is better (Maximize) or lower is better (Minimize)

### Step 4: License & Distribution

Choose how your model will be licensed:

- **Decentralized** - Generally available API at a market-determined price. Anyone can contribute data and earn tokens.
- **Proprietary** - Exclusive rights for the model builder. Requires funding a treasury address and whitelisting approved addresses.
- **Open Source** - Free to use, modify, and deploy. Community-driven development.

### Step 5: Token Supply Configuration (Decentralized only)

For decentralized models, configure token economics using a preset template or custom values:

- **Initial Token Supply** - Number of tokens created at launch
- **Tokens Minted per DeltaOne** - New tokens created for each 1pp performance improvement
- **Expected DeltaOnes** - Projected number of improvements over 2 years

Three preset templates are available: Experimental (high inflation), Growth (balanced), and Mature (low inflation).

### Step 6: Review and Create

Review all settings and click "Create Model". After creation, you'll be guided through next steps:

1. **Register Base Model** - Connect your model to the Hokusai ML registry
2. **Deploy Token to Blockchain** - Deploy your model's ERC-20 token contract (requires a Web3 wallet and ETH for gas)

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
        'api_fee_rate': 0.001,  # USDC fee per API call
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
   - Track API fee rates
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
   - Monitor fee deposits to reserve
   - Review distribution
   - Check balances

## Next Steps

- Learn about [Improving Models](/improving-models)
- Understand [Model API Guide](/model-api-guide)
- Review [Auction Pricing](/auction-pricing)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 