---
sidebar_position: 2
title: HLEAD
description: HLEAD is the model token for Model 25 (Pipeline Win Predictor), the first reference model deployed on the Hokusai Sepolia v2 stack
---

# HLEAD

HLEAD is the ticker symbol of the model token for **Model 25 ("Pipeline Win Predictor")**, Hokusai's first reference model deployment on the Sepolia v2 stack. It is not a protocol-level token — it is a standard model token that happens to be the first one deployed under the v2 infrastructure.

## What "the HLEAD stack" means

Every Hokusai model token is deployed as a triple of three contracts. For HLEAD, these are:

| Constant | Contract type | Purpose |
|----------|--------------|---------|
| `HLEAD_TOKEN` | `HokusaiToken` (ERC20) | The tradeable token. Minted as DeltaOne rewards, bought/sold on the AMM. Controlled by the `TokenManager`. |
| `HLEAD_PARAMS` | `HokusaiParams` | Per-model configuration: infrastructure fee split, oracle price, and other parameters used by `UsageFeeRouter` and `InfrastructureCostOracle`. |
| `HLEAD_POOL` | `HokusaiAMM` | The bonding-curve AMM pool. Holds the USDC reserve. Routes buy and sell orders. |

This triple pattern is the **standard for every model token** on Hokusai. Future models will each get their own ticker, token contract, params contract, and AMM pool — the same structure, different addresses. See [Model Tokens & TokenManager](/smart-contracts/model-tokens-and-token-manager) for the architecture.

## Sepolia addresses

All HLEAD contracts are deployed on **Sepolia testnet** (chainId 11155111) only. No mainnet deployment exists.

| Contract | Address |
|----------|---------|
| HLEAD token (`HLEAD_TOKEN`) | [`0x9690580864274E57899a79bD97e8d7C6cAe0d7d5`](https://sepolia.etherscan.io/address/0x9690580864274E57899a79bD97e8d7C6cAe0d7d5) |
| HLEAD params (`HLEAD_PARAMS`) | [`0xc7325cB1f179f404Bad7FE62B83B708181FAaD6d`](https://sepolia.etherscan.io/address/0xc7325cB1f179f404Bad7FE62B83B708181FAaD6d) |
| HLEAD pool (`HLEAD_POOL`) | [`0x726f46e15cb8F05F291C6337F497da9D5A2738ff`](https://sepolia.etherscan.io/address/0x726f46e15cb8F05F291C6337F497da9D5A2738ff) |
| Model 25 in `ModelRegistry` | Model ID `25` — verified via [`ModelRegistry`](https://sepolia.etherscan.io/address/0x8E891850C0677c2D9581c953bF1Df5446cB4c54f) |

The canonical source of truth for these addresses is `hokusai-token/deployments/sepolia-v2-latest.json`. The [Deployments](/smart-contracts/deployments) page is the docs mirror.

## The underlying model: Pipeline Win Predictor

Model 25 predicts whether a B2B sales pipeline opportunity will close as a won deal.

| Field | Description |
|-------|-------------|
| **Domain** | B2B sales — binary classification on pipeline opportunities |
| **Ground-truth field** | `won` (boolean) |
| **Optional enrichment fields** | `actual_deal_value`, `close_date_actual` |
| **Model ID** | 25 |

Data contributors submit labeled pipeline records. The model is re-evaluated after each accepted contribution batch, and DeltaOne rewards are distributed when verified performance improves.

See [Supplying Data](/supplying-data) for how to contribute training data to Model 25.

## Deployment parameters

Deployed on **2026-04-28** via `TokenDeploymentFactory`. All values are sourced from `sepolia-v2-latest.json`.

### Token parameters

| Parameter | Value |
|-----------|-------|
| Initial supply | 1,000 HLEAD |
| `infrastructureAccrualBps` | 8,000 (80% of API fees to `InfrastructureReserve`) |
| `initialOraclePricePerThousandUsd` | $3.00 per 1,000 API calls |

### AMM pool parameters

| Parameter | Value |
|-----------|-------|
| CRR | 10% (`crr = 100,000` ppm) |
| Trade fee | 30 bps (0.30%) |
| IBR duration | 7 days (604,800 seconds) — [Launch Period](/tokenomics/launch-period) |
| Flat-curve phase threshold | $25,000 USDC reserves |
| Flat-curve price | $0.01 per HLEAD |
| Initial reserve | $100 USDC |
| Network | Sepolia (chainId 11155111) |

During the flat-curve phase (while reserves are below $25,000), buys are priced at $0.01/token. Once reserves cross the threshold, the pool switches to CRR bonding-curve pricing (`P = R / (CRR × S)`).

## Why HLEAD exists

**1. Validates the v2 stack end-to-end.** HLEAD was the first deployment to exercise `DeployableTokenManager`, `TokenDeploymentFactory`, two-phase AMM pricing (flat-curve → CRR), `InfrastructureCostOracle`, `UsageFeeRouter`, and `InfrastructureReserve` working together on a live network.

**2. Live integration target.** Builders integrating against Hokusai can read on-chain state, simulate buys/sells, contribute training data, and call the inference API against a real model on Sepolia — before mainnet.

**3. Frontend reference.** The Hokusai site uses `HLEAD_TOKEN`, `HLEAD_PARAMS`, and `HLEAD_POOL` as hardcoded constants for the homepage model card, token-deployment UI examples, and integration tests. These constants are Sepolia-only; mainnet-deployed models are discovered dynamically through `ModelRegistry` rather than hardcoded.

## How HLEAD relates to other model tokens

HLEAD is structurally **identical** to every other Hokusai model token. Nothing about HLEAD is protocol-special or privileged.

- HLEAD is **not** a governance token
- HLEAD is **not** a protocol fee or utility token
- HLEAD is **not** a network or gas token
- HLEAD is **not** a stablecoin

When future models graduate, each gets its own ticker, token contract, params contract, and AMM pool — the same triple pattern, different addresses. HLEAD just happens to be the first deployed under v2. See [Model Lifecycle](/core-workflows/model-lifecycle) for how models progress from training to token graduation.

## How to use the HLEAD reference app

### Buy or sell HLEAD

Use the `HLEAD_POOL` AMM address (`0x726f46e15cb8F05F291C6337F497da9D5A2738ff`) and testnet USDC (`0x4fE61E343D9c7CB5C0D9DeE293F0Dbcf7C2Dd645`).

- [Buying Tokens guide](/guides/buying-tokens)
- [Selling Tokens guide](/guides/selling-tokens)

### Contribute training data

Submit labeled pipeline opportunity records to Model 25. See [Supplying Data](/supplying-data) for the data format, submission flow, and how DeltaOne rewards are calculated and minted.

### Read on-chain state

```javascript
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");

const HLEAD_TOKEN = "0x9690580864274E57899a79bD97e8d7C6cAe0d7d5";
const HLEAD_POOL  = "0x726f46e15cb8F05F291C6337F497da9D5A2738ff";

const erc20Abi    = ["function totalSupply() view returns (uint256)"];
const ammAbi      = ["function getReserves() view returns (uint256 reserve, uint256 supply)"];

const token = new ethers.Contract(HLEAD_TOKEN, erc20Abi, provider);
const pool  = new ethers.Contract(HLEAD_POOL,  ammAbi,   provider);

const [supply, { reserve }] = await Promise.all([
  token.totalSupply(),
  pool.getReserves(),
]);

console.log("HLEAD supply:", ethers.formatUnits(supply, 18), "HLEAD");
console.log("Pool reserve:", ethers.formatUnits(reserve, 6),  "USDC");
```

### Call the inference API

Use Model 25 via the standard [Using Models](/using-models) workflow. The inference endpoint accepts pipeline opportunity records and returns a `won` probability score.

## Where these addresses come from

Addresses are set at deploy time by `TokenDeploymentFactory` and recorded in `hokusai-token/deployments/sepolia-v2-latest.json` (canonical source). The [Deployments](/smart-contracts/deployments) page is the docs mirror. The Hokusai frontend hardcodes them as `HLEAD_TOKEN`, `HLEAD_PARAMS`, and `HLEAD_POOL` because HLEAD is a Sepolia testnet reference deployment; mainnet-deployed models are discovered dynamically through `ModelRegistry`.

## Next steps

- [Deployments](/smart-contracts/deployments) — full address inventory including all protocol contracts
- [Model Tokens & TokenManager](/smart-contracts/model-tokens-and-token-manager) — architecture instantiated by every model token, including HLEAD
- [HokusaiAMM](/smart-contracts/hokusai-amm) — AMM pool mechanics and pricing formulas
- [Launch Period](/tokenomics/launch-period) — seven-day buy-only bonding round
- [Supplying Data](/supplying-data) — contribute training data to Model 25
- [Using Models](/using-models) — call the Pipeline Win Predictor inference API
