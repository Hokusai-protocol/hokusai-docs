---
id: model-launch-guide
title: Complete Guide to Launching a Model on Hokusai
sidebar_label: Model Launch Guide
---

# Complete Guide to Launching a Model on Hokusai

## Introduction

Launching a model on Hokusai enables you to monetize your AI model while contributing to the decentralized AI ecosystem. This guide walks you through the entire process, from initial model creation to deployment on the blockchain.

The protocol implements a unique tokenization mechanism that aligns incentives between model builders and data contributors. When you launch a model, you create a digital asset that can be traded, governed, and improved by the community.

### Key Benefits

- **Monetization**: Earn from model usage and data contributions
- **Decentralized Governance**: Enable community participation in model improvements
- **Performance Tracking**: Automatic reward distribution based on model improvements
- **Global Marketplace**: Access to a worldwide network of AI developers and users

## Process Overview

The model launch process consists of four main phases:

1. **Model Creation** - Define your model's basic information and configuration
2. **License Selection** - Choose how your model will be distributed and governed
3. **Token Configuration** - Set up the economic parameters for your model's token
4. **Registration & Deployment** - Register your model and deploy the token to blockchain

For the canonical view of model state, including the graduation transition that takes a model from **REGISTERED** to **DEPLOYED**, see [Model Lifecycle](../core-workflows/model-lifecycle).

## Step 1: Model Overview

Begin by providing essential information about your AI model. This metadata helps users discover and understand your model's capabilities.

### Model Name
Choose a descriptive name that clearly indicates your model's purpose and domain. Examples:
- "Chest X-Ray Diagnostic v2"
- "Sentiment Analysis BERT"
- "Code Generation GPT"

### Token Ticker
Create a 3-6 character ticker symbol for your model's token. This will be used on exchanges and in the protocol. The ticker should be:
- Memorable and relevant to your model
- 3-6 characters in length
- Automatically converted to uppercase
- Example: "CHEST" for a chest x-ray model

### Description
Write a comprehensive description that covers:
- What problem your model solves
- Key capabilities and features
- Target use cases and applications
- Any unique advantages or innovations

### Category and Tags
Select the appropriate category and relevant tags to help users find your model:
- Categories organize models by domain (Healthcare, Finance, NLP, etc.)
- Tags provide additional context (computer-vision, medical-imaging, etc.)

## Step 2: Performance Metrics

Performance metrics are crucial for tracking model improvements and triggering token rewards. The Hokusai Protocol uses a "DeltaOne" system where each 1 percentage point improvement in performance triggers token minting.

### Selecting a Performance Metric
Choose the metric that best represents your model's performance:
- **Accuracy**: Percentage of correct predictions
- **F1 Score**: Harmonic mean of precision and recall
- **AUC-ROC**: Area under the receiver operating characteristic curve
- **Custom Metrics**: Define your own domain-specific metric

### Metric Direction
Specify whether improvements mean:
- **Maximize**: Higher values are better (accuracy, F1 score)
- **Minimize**: Lower values are better (error rate, loss)

### Current Benchmark Value
Enter your model's current performance baseline. This serves as the starting point for measuring improvements. For example:
- Accuracy: 0.884 (88.4%)
- F1 Score: 0.923
- Mean Squared Error: 0.045

### Understanding DeltaOne
A DeltaOne represents a 1 percentage point improvement in your chosen metric. For example:
- If your accuracy improves from 88.4% to 89.4%, that's 1 DeltaOne
- Each DeltaOne triggers the minting of new tokens according to your configuration
- This creates economic incentives for continuous model improvement

## Step 3: License & Distribution

The license type determines how your model can be accessed and who can contribute to its improvement.

### Decentralized License

With a decentralized license:
- Model is available via API at market-determined prices
- Anyone can contribute data and earn tokens
- Token holders participate in governance decisions
- Automatic reward distribution for improvements

[Learn more about Decentralized Licensing →](../licensing/decentralized)

## Step 4: Token Supply Configuration

For decentralized models, configure the token economics to align with your model's growth trajectory.

### Token Supply Templates

#### Experimental Model
**Use when:** Your model is in early stages with expected rapid improvements
- Initial Supply: 500,000 tokens
- Tokens per DeltaOne: 200,000
- Expected improvements: 8 DeltaOnes over 2 years
- High inflation to incentivize early contributions

#### Growth Model
**Use when:** Your model is proven but has room for significant improvement
- Initial Supply: 1,000,000 tokens
- Tokens per DeltaOne: 100,000
- Expected improvements: 5 DeltaOnes over 2 years
- Balanced approach between stability and growth

#### Mature Model
**Use when:** Your model is well-established with incremental improvements
- Initial Supply: 2,000,000 tokens
- Tokens per DeltaOne: 50,000
- Expected improvements: 3 DeltaOnes over 2 years
- Low inflation for long-term value preservation

### Custom Configuration

You can customize the token parameters:

#### Initial Token Supply
The number of tokens created at launch. These are initially locked and released according to vesting schedules. Consider:
- Model maturity and expected adoption
- Desired market capitalization
- Distribution requirements

#### Tokens Minted per DeltaOne
How many new tokens are created for each 1pp improvement. Higher values:
- Create stronger incentives for improvement
- Result in higher inflation
- May dilute early token holders

#### Expected DeltaOnes
Your projection for model improvements over 2 years. This helps:
- Set realistic inflation expectations
- Plan token distribution
- Communicate growth potential to investors

[Learn more about Token Economics →](../tokenomics)

## Step 5: Review and Create

Before creating your model, review all settings carefully:

1. **Verify Model Information**
   - Name accurately describes the model
   - Token ticker is unique and memorable
   - Description is comprehensive

2. **Confirm Performance Metrics**
   - Metric choice aligns with model purpose
   - Baseline value is accurate
   - Direction (maximize/minimize) is correct

3. **Check License Selection**
   - License type matches your distribution goals
   - You understand the implications

4. **Validate Token Configuration** (if applicable)
   - Supply parameters align with growth expectations
   - Inflation rate is acceptable
   - Distribution plan is feasible

Click "Create Model" to proceed to registration.

## Step 6: Model Registration

After creating your model, you need to register it with the Hokusai ML Platform to enable token functionality.

### Install the Hokusai SDK

```bash
pip install git+https://github.com/Hokusai-protocol/hokusai-data-pipeline.git#subdirectory=hokusai-ml-platform
```

### Configure Your Environment

Set up your Hokusai API key to authenticate with the platform:

```bash
export HOKUSAI_API_KEY="your-hokusai-api-key-here"
```

**Important:** Use your Hokusai API key, not an MLflow token. The Hokusai API key authenticates both the Hokusai registry and MLflow services.

[Get your Hokusai API key →](https://hokus.ai/settings/api)

### Register Your Model

Use the following Python code to register your model:

```python
import os
import mlflow
from hokusai.core import ModelRegistry

# Set up MLflow tracking URI
mlflow.set_tracking_uri("https://registry.hokus.ai/api/mlflow")

# IMPORTANT: Use your Hokusai API key, NOT an MLflow token
# The Hokusai API key authenticates both the registry and MLflow
os.environ["MLFLOW_TRACKING_TOKEN"] = os.getenv("HOKUSAI_API_KEY")

# Initialize registry
registry = ModelRegistry()

# Register your model
with mlflow.start_run() as run:
    # Log your model (replace with your actual model)
    mlflow.sklearn.log_model(
        your_trained_model,
        "model",
        registered_model_name="Your Model Name"
    )

    # Register with Hokusai
    model_uri = f"runs:/{run.info.run_id}/model"
    registered_model = registry.register_tokenized_model(
        model_uri=model_uri,
        model_name="Your Model Name",
        token_id="TOKEN",  # Your token ticker
        metric_name="accuracy",  # Your chosen metric
        baseline_value=0.92,  # Your baseline performance
        additional_tags={"author": "your-name", "version": "1.0"}
    )

    print(f"✅ Model registered successfully: {registered_model.name}")
```

### Registration Parameters

- **model_uri**: Path to your MLflow model
- **model_name**: Name for the registered model
- **token_id**: Your token ticker (automatically normalized to uppercase)
- **metric_name**: Performance metric name
- **baseline_value**: Current performance baseline (numeric)
- **additional_tags**: Optional metadata

[View Complete Registration Guide →](../api-reference)

## Step 7: Deploy Token to Blockchain

The final step is deploying your model's token contract to the blockchain.

### Prerequisites

Before deploying:
1. ✅ Model is registered with Hokusai ML Platform
2. ✅ You have a Web3 wallet (MetaMask, WalletConnect, etc.)
3. ✅ Sufficient ETH for gas fees (approximately 0.1 ETH)

### Deployment Process

1. **Navigate to your model page**
   - Go to your model's overview page
   - Click "Deploy Token to Blockchain"

2. **Connect your wallet**
   - Select your Web3 wallet provider
   - Approve the connection request

3. **Review deployment parameters**
   - Token name and symbol
   - Initial supply configuration
   - Contract permissions

4. **Confirm transaction**
   - Review gas fees
   - Approve the transaction in your wallet
   - Wait for blockchain confirmation

5. **Deployment complete**
   - Token contract is deployed
   - Trading can begin on supported exchanges
   - Governance features are activated

### Post-Deployment

After successful deployment:
- Your token address will be displayed
- Add the token to your wallet
- Share the contract address with your community
- Monitor initial liquidity and trading

[Learn more about Token Deployment →](../smart-contracts/smart-contracts-overview)

## Next Steps

Congratulations! Your model is now live on the Hokusai Protocol. Here's what to do next:

### For Model Builders

1. **Promote Your Model**
   - Share on social media
   - Write technical blog posts
   - Engage with the AI community

2. **Monitor Performance**
   - Track model usage metrics
   - Review improvement submissions
   - Analyze token economics

3. **Continuous Improvement**
   - Submit model updates
   - Engage with data contributors
   - Participate in governance

### For Data Contributors

1. **Understand the Model**
   - Review documentation
   - Test the API
   - Identify improvement opportunities

2. **Contribute Data**
   - Submit high-quality datasets
   - Validate model performance
   - Earn token rewards

3. **Participate in Governance**
   - Vote on improvement proposals
   - Suggest new features
   - Join the community discussions

## Troubleshooting

### Common Issues

**Model creation fails**
- Ensure all required fields are filled
- Check token ticker uniqueness
- Verify performance metric values

**Registration errors**
- Confirm API key is valid
- Check MLflow connection
- Verify model compatibility

**Deployment issues**
- Ensure sufficient ETH for gas
- Check wallet connection
- Verify network selection

### Getting Help

- [Documentation](https://docs.hokus.ai)
- [Community Discord](https://discord.gg/hokusai)
- [Support Email](mailto:support@hokus.ai)
- [GitHub Issues](https://github.com/hokusai-protocol/issues)

## Additional Resources

- [Token Economics Deep Dive →](../tokenomics)
- [Performance Metrics Guide →](../tokenomics/deltaone-calculations)
- [Licensing →](../licensing/decentralized)
- [API Reference →](../api-reference)
- [Smart Contract Documentation →](../smart-contracts/smart-contracts-overview)
- [Community Guidelines →](../community)
