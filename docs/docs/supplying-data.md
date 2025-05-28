---
id: supplying-data
title: Contributing Data to Hokusai
sidebar_label: Contributing Data
sidebar_position: 3
---

# Supplying Data to Hokusai

This guide explains how to supply data to Hokusai models and earn DeltaOne rewards.

## Overview

Hokusai allows data suppliers to contribute their data to improve AI models. When your data helps improve a model's performance, you earn DeltaOne tokens through our unique reward system.

## Hokusai Support Program

For qualified data suppliers, Hokusai offers comprehensive support services to ensure successful data contribution:

- **Data Preparation**: Assistance with data formatting, cleaning, and optimization
- **Privacy Compliance**: Verification of data anonymization and privacy standards
- **Performance Assessment**: Evaluation of data quality and potential impact
- **Technical Integration**: Support with SDK implementation and testing
- **Wallet Setup**: Help with blockchain wallet configuration
- **Reward Optimization**: Guidance on maximizing DeltaOne earnings

### Qualification Criteria
- Significant datasets that meet our privacy and quality standards
- Data that can demonstrably improve model performance
- Commitment to ongoing data contribution

[Contact our team](https://hokus.ai/contact-us/) to discuss your dataset and learn more about our support program.

## Prerequisites

Before you begin, ensure you have:

1. A compatible blockchain wallet
2. Data that meets our privacy and quality standards
3. Python 3.8+ installed

## Step 1: Install the SDK

```bash
pip install hokusai-sdk
```

## Step 2: Prepare Your Data

### Format Requirements

Each model has specific data format requirements. To find the exact requirements:

1. Select your target model
2. Navigate to the "Submit Data" tab
3. Review the specific data format requirements and instructions
4. Note any model-specific validation rules
5. Check required metadata fields

Here's a basic example of the expected JSON format:

```python
{
    "metadata": {
        "source": "your_data_source",
        "timestamp": "2024-03-20T10:00:00Z",
        "version": "1.0"
    },
    "data": [
        {
            "id": "unique_id_1",
            "content": "your_data_content",
            "metadata": {
                "additional_field": "value"
            }
        }
    ]
}
```

Note: Some models may require additional fields or have different validation rules. Always check the model's specific requirements.

### Data Preparation Steps

1. **Review Model Requirements**
   - Check the model's data format specifications
   - Understand required fields and validation rules
   - Note any special formatting requirements

2. **Clean Your Data**
   - Remove duplicates
   - Fix formatting issues
   - Handle missing values
   - Normalize data structure

3. **Validate Your Data**
   - Use the SDK's validation tools
   - Check for privacy compliance
   - Verify data quality
   - Test with sample submissions

## Step 3: Initialize the SDK

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

## Step 4: Submit Your Data

```python
# Prepare your dataset
dataset = {
    "metadata": {
        "source": "your_data_source",
        "timestamp": "2024-03-20T10:00:00Z",
        "version": "1.0"
    },
    "data": [
        # Your data entries here
    ]
}

# Submit to a specific model
result = client.submit_data(
    model_id='target_model_id',
    dataset=dataset
)

print(f"Submission ID: {result.submission_id}")
print(f"Status: {result.status}")
```

## Step 5: Monitor Performance

```python
# Check submission status
status = client.get_submission_status(result.submission_id)
print(f"Current status: {status.status}")
print(f"Validation results: {status.validation_results}")

# Monitor model improvement
improvement = client.get_model_improvement(
    model_id='target_model_id',
    submission_id=result.submission_id
)
print(f"Performance improvement: {improvement.percentage}%")
print(f"DeltaOne tokens earned: {improvement.delta_ones}")
```

## Step 6: Receive Rewards

When your data contributes to model improvement, you'll automatically receive DeltaOne tokens. The reward amount is calculated based on:

1. The degree of improvement
2. The quality of your data
3. The model's current performance
4. Market conditions

You can track your rewards in your Hokusai dashboard or through the SDK:

```python
# Check your rewards
rewards = client.get_rewards()
print(f"Total DeltaOnes earned: {rewards.total}")
print(f"Recent rewards: {rewards.recent}")
```

## Best Practices

1. **Data Quality**
   - Ensure high-quality, accurate data
   - Follow model-specific requirements
   - Validate before submission
   - Monitor performance impact

2. **Privacy Compliance**
   - Remove all PII
   - Follow data protection guidelines
   - Use proper anonymization
   - Document privacy measures

3. **Regular Updates**
   - Submit data regularly
   - Monitor model performance
   - Update as needed
   - Track reward patterns

## Troubleshooting

Common issues and solutions:

1. **Validation Failures**
   - Check data format
   - Verify required fields
   - Review error messages
   - Use validation tools

2. **Submission Errors**
   - Check API key
   - Verify wallet connection
   - Review error logs
   - Contact support

3. **Performance Issues**
   - Analyze data quality
   - Check model requirements
   - Review validation results
   - Optimize data structure

## Next Steps

- Learn about [Data Validation Tools](/data-validation-tools)
- Understand [Privacy Compliance](/privacy-compliance)
- Review [Reward Mechanisms](/tokenomics/rewards)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).