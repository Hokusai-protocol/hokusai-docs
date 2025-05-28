---
id: intro
title: Introduction to Hokusai
sidebar_label: Introduction
sidebar_position: 1
---

## What is Hokusai Protocol?

Hokusai is a decentralized protocol that incentivizes the contribution of high-quality data to improve AI models. Contributors are rewarded with tokens when their data leads to measurable performance enhancements.

This guide will help you understand how Hokusai tokens work, how you can contribute data to a specific model and potentially earn token rewards, and how to use Hokusai models in a production app. 

## Key Features

- **Fair Incentives**: Data suppliers are rewarded based on the actual performance improvement their data provides
- **Transparent Metrics**: Clear and verifiable performance metrics for all models
- **Privacy-Focused**: Data is handled with privacy in mind, ensuring sensitive information is protected
- **Decentralized**: No central authority controls the protocol, ensuring fairness and transparency

## Core Concepts

### DeltaOne Rewards

DeltaOne is Hokusai's performance-based reward measurement. It works as follows:

1. **Performance Measurement**
   - Each model has a baseline performance metric
   - Improvements are measured as percentage increases over the baseline
   - Each DeltaOne represents a 1% improvement in model performance
   - Tokens are awarded based on the total number of DeltaOnes achieved

2. **Token Calculation**
   ```
   Tokens Awarded = Performance Improvement (%) × Tokens per DeltaOne
   ```
   - Performance Improvement: Measured as percentage increase over baseline
   - Tokens per DeltaOne: Fixed number of tokens awarded per 1% improvement

   **Example:**
   ```
   Baseline Performance: 75% accuracy
   New Performance: 82% accuracy
   Performance Improvement: 7%
   Tokens per DeltaOne: 100 tokens
   Token Value: $250 per token
   
   Tokens Awarded = 7 × 100 = 700 tokens
   Dollar Value = 700 tokens × $250 = $175,000
   ```
   In this example, a 7% improvement in model accuracy results in 7 DeltaOnes, awarding 700 tokens worth $175,000 to the data supplier.

3. **Verification Process**
   - All improvements are verified through the MegaAI benchmarking system
   - Results are recorded on-chain for transparency
   - Smart contracts automatically handle token distribution

### Hokusai Tokens

Hokusai tokens serve multiple purposes in the ecosystem:

1. **Access Rights**
   - Required for model access
   - Usage-based consumption
   - Tiered access levels

2. **Reward Mechanism**
   - Distributed to data contributors
   - Issued for model improvements
   - Community governance participation

3. **Economic Model**
   - Deflationary design
   - Usage-driven value
   - Liquidity provision incentives

## Getting Started

- [Understanding User Personas](/personas)
- [Getting Started as a Data Supplier](/supplying-data)
- [Getting Started as a AI Developer](/using-models)
- [Understanding Tokenomics](/tokenomics)
- [Understanding Reward Mechanisms](/tokenomics/rewards)
- [Understanding Token Value](/tokenomics/token-value)
- [Understanding Model Licenses](/licensing/overview)
- [Smart Contract Architecture](/smart-contracts/overview)

For further assistance, refer to the FAQs or join our community discussions.