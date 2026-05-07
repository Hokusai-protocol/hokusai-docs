---
sidebar_position: 1
title: Reference Apps
description: Live deployed models on Sepolia testnet that integrators can use for end-to-end protocol testing
---

# Reference Apps

A reference app is a real, live model deployed on the Sepolia testnet that integrators, contributors, and investors can use to test the full Hokusai protocol end-to-end — token trading, data contribution, inference, and fee flow — without waiting for mainnet.

## What each reference app provides

Every reference app is a fully deployed model token triple:

| Component | What it is |
|-----------|-----------|
| **Model token (ERC20)** | A `HokusaiToken` you can buy, sell, and earn through data contributions |
| **Params contract** | A `HokusaiParams` instance holding pricing and fee configuration for that model |
| **AMM pool** | A `HokusaiAMM` pool you can trade against using testnet USDC |
| **Live inference endpoint** | An API endpoint accepting real inference requests against the deployed model |
| **Data contribution target** | A registered model accepting training data contributions via the standard pipeline |

## Why reference apps exist

- **Integration testing**: exercise token buy/sell, data submission, and inference API calls against a real contract deployment before building against mainnet.
- **End-to-end protocol verification**: confirm that `TokenDeploymentFactory`, `HokusaiAMM` two-phase pricing, `InfrastructureCostOracle`, and `UsageFeeRouter` all work together on Sepolia before mainnet graduation.
- **Documentation examples**: reference apps back concrete addresses and parameter values used in code snippets and guides across the docs.
- **Frontend integration tests**: the Hokusai site uses reference app constants as live, real-data test fixtures.

## What reference apps are not

Reference apps are not protocol-level infrastructure. Each is an individual model token — same architecture and lifecycle as any future community-deployed model. The protocol contracts that underpin every model token (TokenManager, HokusaiAMMFactory, ModelRegistry, etc.) are documented in [Smart Contracts](/smart-contracts/smart-contracts-overview).

## Currently deployed

| Ticker | Model | Network | Status |
|--------|-------|---------|--------|
| [HLEAD](/reference-apps/hlead) | Pipeline Win Predictor (Model 25) | Sepolia | Live |

More models will be added here as additional models graduate to Sepolia under the v2 stack.

## Related pages

- [Deployments](/smart-contracts/deployments) — canonical address inventory for all contracts, including reference app addresses
- [Model Tokens & TokenManager](/smart-contracts/model-tokens-and-token-manager) — architecture that each reference app instantiates
- [HokusaiAMM](/smart-contracts/hokusai-amm) — AMM pool mechanics
- [Launch Period](/tokenomics/launch-period) — seven-day buy-only bonding round that each reference app starts with
