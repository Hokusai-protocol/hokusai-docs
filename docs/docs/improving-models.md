---
id: improving-models
title: Incentivizing Model Improvements
sidebar_label: Getting Started
---

Incentivizing Model Improvements in Hokusai

❓ The Challenge

Hokusai is designed to reward data contributors by minting tokens only when submitted data produces measurable improvements in model performance (i.e., DeltaOne gains). However, in real-world machine learning:

Performance gains come from both new data and model innovation (architecture, training tweaks, etc).

ML engineers and model developers currently have no path to be rewarded through Hokusai.

Over time, as model performance plateaus, new data alone may not yield improvements—stalling token issuance and ecosystem growth.

This section explores strategies to expand or complement Hokusai’s protocol to address this gap.

🎯 Design Goals

Any solution must:

Maintain trustless, auditable measurement of improvements.

Preserve clarity in economic incentives.

Encourage meaningful innovation in both data and model domains.

Avoid introducing attack vectors or reward gaming.

🧭 Option 1: Keep Hokusai Pure (Data-Only)

Approach: Hokusai continues to issue tokens only for dataset-driven DeltaOne improvements.

Extension: A parallel ecosystem emerges for evaluating and adopting model architecture or training updates. These updates:

Must be reproducible (via MLFlow, Git, Docker, etc.)

Can be benchmarked by the community or a neutral validator

Are rewarded via grants, DAO votes, or usage revenue

Pros:

Keeps Hokusai protocol simple and focused

Allows separation of data vs. model incentives

Cons:

Model devs may lack incentives

Harder to build feedback loops between model improvements and data contributions

🔀 Option 2: Broaden DeltaOne to Include Model Improvements

Approach: Allow contributions that improve performance through model modifications to also be eligible for token minting.

Implementation Requirements:

Contributors submit a new model config and training run

Must use fixed, public benchmark datasets for evaluation

Gains must meet the 1pp DeltaOne threshold

System must confirm reproducibility

Safeguards:

Whitelist acceptable changes (e.g., optimizer, learning rate, architecture class)

Use code hashes and training logs

Limit submission frequency or require staking

Pros:

Encourages full-stack innovation

Brings more contributors into the ecosystem

Cons:

Higher verification and attribution complexity

Could introduce risk of protocol gaming if not tightly scoped

⚖️ Option 3: Dual-Pool Token Minting

Approach: Each DeltaOne mints tokens into two pools:

Data Contributor Pool (e.g., 70%)

Model Contributor Pool (e.g., 30%)

Attribution Flow:

Track both the data and model version that produced the gain

Require clear logs and reproducible experiments

Use ablation testing or controlled submissions to assess contribution

Pros:

Mirrors real-world contributions

Shared incentives could accelerate progress

Cons:

Requires more advanced benchmarking infrastructure

Potential for gaming or disputes over attribution

🧠 Option 4: Meta-Model Marketplace

Approach: Treat model implementations as modular, pluggable components. The Hokusai protocol defines:

The benchmark

The token

The data submission flow

But multiple models can compete to serve inference requests. Usage fees (e.g., paid in USDC or token burn) go to the model developer whose model is used.

Benefits:

Natural incentive for model devs

Token issuance stays data-driven

Encourages experimentation and optimization

Challenges:

Requires dynamic model routing

Adds operational complexity to the API layer

🧩 Current Plans

We intend to start with Option 1 to keep Hokusai focused and auditable.

We will design future compatibility with Option 2 or 4 by:

Ensuring all performance improvements are tracked by model version

Requiring reproducible training workflows

Logging model config + data hash for each evaluation

This provides the scaffolding to grow into a richer, more holistic contributor economy without compromising early-phase simplicity.

