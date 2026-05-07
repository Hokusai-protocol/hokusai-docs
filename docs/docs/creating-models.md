---
id: creating-models
title: Creating Models
sidebar_label: Creating Models
sidebar_position: 6
---

# Creating Models

This guide explains how to create and register models in the Hokusai ecosystem, including the required smart contract interactions.

## Overview

Hokusai allows model developers to register their AI models and earn rewards when the models are improved through data contributions. Each model has its own ERC-20 token. At deployment, two allocation caps are set: a supplier allocation (tokens distributed to model contributors after verification) and an investor allocation (tokens that can be minted lazily to AMM buyers up to the cap). Additional tokens are minted as performance improves via DeltaOne rewards. All tokens can be traded on a dedicated AMM, and API usage fees flow to the token's USDC reserve, increasing its price. This guide covers both the web-based creation process and the equivalent programmatic workflow.

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

### Step 5: Token Supply Configuration (Decentralized only)

For decentralized models, configure token economics using a preset template or custom values:

- **Model Supplier Allocation** - Maximum tokens reserved for model contributors. These are not minted at launch; the Hokusai platform distributes them after the model passes verification.
- **Investor Allocation** - Maximum tokens that can be minted to AMM buyers. This is a cap, not a pre-minted supply; tokens are minted lazily as the AMM is used.
- **Tokens Minted per DeltaOne** - New tokens created for each 1pp performance improvement
- **Expected DeltaOnes** - Projected number of improvements over 2 years

The on-chain max supply equals `modelSupplierAllocation + investorAllocation`; there is no separately chosen `totalSupply`. Three preset templates are available — Experimental (high inflation), Growth (balanced), and Mature (low inflation) — as allocation presets. For concrete numeric guidance, see the [Complete Model Launch Guide](guides/model-launch-guide).

### Step 6: Review and Create

Review all settings and click "Create Model". After creation, you'll be guided through next steps:

1. **Register Base Model** - Connect your model to the Hokusai ML registry
2. **Deploy Token to Blockchain** - Deploy your model's ERC-20 token contract (requires a Web3 wallet and ETH for gas). Once registration completes, Hokusai's backend creates the AMM pool for you through a server signer — you do not sign that transaction.

> Your model enters **DRAFT** when created and moves to **PROPOSAL** when published. See [Model Lifecycle](core-workflows/model-lifecycle) for the full path through **REGISTERED** and **DEPLOYED**, including how graduation deploys the AMM pool.

## Programmatic Model Creation

For advanced users, CI pipelines, or custom launch flows, the on-chain portion of model creation is a direct smart contract call. The workflow has three parts:

1. Deploy the model token on-chain with `TokenManager.deployTokenWithAllocations(...)`. Your wallet signs this transaction.
2. After model verification, Hokusai's backend calls `TokenManager.distributeModelSupplierAllocation(modelId)` to mint the supplier allocation to your designated recipient. You do not sign this transaction.
3. After registration completes, Hokusai's backend creates the AMM pool via a server signer calling `HokusaiAMMFactory.createPoolWithParams(...)`. You do not sign this transaction either.
4. Register the model artifact off-chain with the MLflow-based `hokusai-ml-platform` SDK.

Use the web flow or the first five steps of the [Complete Model Launch Guide](guides/model-launch-guide) to define your model metadata and token economics, then script the deployment step below.

## Step 1: Install ethers

```bash
npm install ethers
```

### Prerequisites

Before broadcasting a deployment transaction, make sure you have:

1. Node.js 18+ and `ethers` v6
2. An RPC endpoint in `RPC_URL`
3. A funded deployer private key in `PRIVATE_KEY`
4. The deployed TokenManager contract address in `TOKEN_MANAGER_ADDRESS`
5. A non-zero governor address in `GOVERNOR_ADDRESS`
6. The address that will receive the supplier allocation after verification in `MODEL_SUPPLIER_RECIPIENT`
7. Model metadata, license text, and token economics from the model creation flow

## Step 2: Compute the license hash

`deployTokenWithAllocations()` stores a `licenseHash` on-chain and a `licenseURI` that points to the full license text. Hash the exact bytes you publish at `licenseURI` before deployment:

```typescript
import { keccak256, toUtf8Bytes } from "ethers";

const licenseText = `# Commercial Model License

Replace this text with the exact license you will publish off-chain.
`;

const licenseHash = keccak256(toUtf8Bytes(licenseText));
console.log("License hash:", licenseHash);
```

## Step 3: Deploy the model token

The TokenManager contract accepts the model metadata, allocation caps, and an `InitialParams` struct. The example below uses the actual contract interface.

```typescript
import {
  Contract,
  JsonRpcProvider,
  Wallet,
  keccak256,
  parseUnits,
  toUtf8Bytes,
} from "ethers";

const TOKEN_MANAGER_ABI = [
  "function deployTokenWithAllocations(string modelId, string name, string symbol, uint256 modelSupplierAllocation, address modelSupplierRecipient, uint256 investorAllocation, (uint256 tokensPerDeltaOne, uint16 infrastructureAccrualBps, uint256 initialOraclePricePerThousandUsd, bytes32 licenseHash, string licenseURI, address governor) initialParams) payable returns (address)",
];

async function main() {
  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
  const tokenManager = new Contract(
    process.env.TOKEN_MANAGER_ADDRESS!,
    TOKEN_MANAGER_ABI,
    wallet,
  );

  const licenseText = `# Commercial Model License

Replace this text with the exact license you will publish off-chain.
`;

  const initialParams = {
    tokensPerDeltaOne: parseUnits("100000", 18),
    infrastructureAccrualBps: 5000,
    initialOraclePricePerThousandUsd: 0n,
    licenseHash: keccak256(toUtf8Bytes(licenseText)),
    licenseURI: "ipfs://Qm.../license.md",
    governor: process.env.GOVERNOR_ADDRESS!,
  };

  const tx = await tokenManager.deployTokenWithAllocations(
    "sentiment-v2",
    "Sentiment Model",
    "SENT",
    parseUnits("400000", 18),   // modelSupplierAllocation
    process.env.MODEL_SUPPLIER_RECIPIENT!,
    parseUnits("600000", 18),   // investorAllocation
    initialParams,
  );

  console.log("Submitted transaction:", tx.hash);
  const receipt = await tx.wait();
  console.log("Mined in block:", receipt?.blockNumber);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

After the token is deployed, your involvement in the on-chain setup is complete. The Hokusai backend handles the remaining two steps automatically:

- **Supplier distribution**: once the model passes verification, the backend calls `TokenManager.distributeModelSupplierAllocation(modelId)` to mint the supplier allocation to `modelSupplierRecipient`. You do not sign this call.
- **AMM pool creation**: after registration completes, the backend creates the AMM pool through a server signer calling `HokusaiAMMFactory.createPoolWithParams(...)`. You do not sign this call either.

The `initialOraclePricePerThousandUsd` field in `initialParams` sets the initial USD price per 1000 API calls for oracle-based pricing. Set it to `0` if you want to leave it unset at deployment time; it can be updated later (see [Usage Fee Routing](smart-contracts/usage-fee-routing)).

### Parameter reference

| Parameter | Meaning |
| --- | --- |
| `modelId` | Unique model identifier. Reusing a prior `modelId` will revert. |
| `name` | ERC-20 token name shown to users. |
| `symbol` | ERC-20 token ticker. |
| `modelSupplierAllocation` | Cap on tokens reserved for model contributors, in wei (`parseUnits("...", 18)`). Not minted at deployment; distributed by the Hokusai backend after model verification. Must be non-zero. |
| `modelSupplierRecipient` | Address that receives the supplier allocation after verification. Must be a non-zero address. |
| `investorAllocation` | Cap on tokens mintable to AMM buyers, in wei (`parseUnits("...", 18)`). Tokens are minted lazily on AMM buys up to this cap. Must be non-zero. |
| `tokensPerDeltaOne` | Tokens minted per DeltaOne improvement. See [DeltaOne Calculations](tokenomics/deltaone-calculations). |
| `infrastructureAccrualBps` | Infrastructure share in basis points. Valid range is `1000` to `10000`. See [Usage Fee Routing](smart-contracts/usage-fee-routing) and [Choosing CRR](guides/choosing-crr). |
| `initialOraclePricePerThousandUsd` | Initial USD price per 1000 calls for oracle-based pricing. Set to `0` if you are leaving it unset at deployment time. |
| `licenseHash` | `keccak256` hash of the exact license bytes published at `licenseURI`. |
| `licenseURI` | Off-chain location of the full license text, typically IPFS or HTTPS. |
| `governor` | Address that receives governance control for the model. Use a multisig in production. |

## Step 4: Register the model with the ML platform

After the token is deployed, register the model artifact with the MLflow-based SDK documented in the launch guide. That guide is the source of truth for the Python registration flow and API key setup.

```text
See guides/model-launch-guide#step-6-model-registration for:
- pip install git+https://github.com/Hokusai-protocol/hokusai-data-pipeline.git#subdirectory=hokusai-ml-platform
- export HOKUSAI_API_KEY=...
- ModelRegistry.register_tokenized_model(...)
```

## Best Practices

1. **Pin license off-chain and hash it on-chain** - Publish the final license text at `licenseURI`, then verify `keccak256(toUtf8Bytes(licenseText))` matches `licenseHash` before you broadcast.
2. **Calibrate the allocation split carefully** - The ratio of `modelSupplierAllocation` to `investorAllocation` controls how much of the token's total potential supply goes to contributors versus AMM liquidity. A higher supplier allocation rewards contributors more but leaves less room for investor-side growth; a higher investor allocation deepens AMM liquidity but dilutes contributor share. See the [Complete Model Launch Guide](guides/model-launch-guide) for guidance on choosing this split.
3. **Choose `tokensPerDeltaOne` to match your dilution model** - Calibrate rewards against expected improvement cadence using the guidance in [DeltaOne Calculations](tokenomics/deltaone-calculations).
4. **Set `infrastructureAccrualBps` from a real cost model** - This value must stay within `1000` to `10000`. Use [Choosing CRR](guides/choosing-crr) and [Usage Fee Routing](smart-contracts/usage-fee-routing) when deciding the split.
5. **Use a multisig for `governor`** - Production deployments should not hand governance to a single EOA.
6. **Test with a non-production TokenManager first** - A testnet deployment is the fastest way to catch role issues, gas estimation problems, and `licenseHash` mismatches.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Token already deployed for this model` | The `modelId` already has an associated token. | Pick a new `modelId`, or inspect the previously deployed token before retrying. |
| `InvalidAmount` revert on deployment | `modelSupplierAllocation` or `investorAllocation` is zero. Both allocations must be non-zero. | Pass positive wei values for both allocation parameters. |
| `ZeroAddress` revert on deployment | `modelSupplierRecipient` is the zero address. | Pass a valid non-zero recipient address in `MODEL_SUPPLIER_RECIPIENT`. |
| Revert during parameter validation | `tokensPerDeltaOne` or `infrastructureAccrualBps` is outside the contract's accepted range. | Keep `tokensPerDeltaOne` within the documented contract bounds and `infrastructureAccrualBps` within `1000` to `10000`. |
| Revert caused by governor configuration | `governor` is the zero address or otherwise invalid for your flow. | Pass a valid non-zero address. A multisig is recommended for production. |
| `AccessControl: account is missing role` | The caller does not hold the role required to deploy through TokenManager. | Use an authorized deployer wallet or coordinate with the team that manages contract roles. |
| MLflow `401` or `403` during registration | `HOKUSAI_API_KEY` is missing, expired, or invalid. | Re-issue the key and follow the auth setup in the [Complete Model Launch Guide](guides/model-launch-guide#step-6-model-registration). |
| License mismatch during later verification | The bytes hashed into `licenseHash` do not match the content served at `licenseURI`. | Recompute the hash from the exact published bytes. If the on-chain hash is wrong, redeploy with corrected values. |

## Next Steps

- Learn about [Improving Models](/improving-models)
- Understand [Model API Guide](/model-api-guide)
- Review [Auction Pricing](/auction-pricing)

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai). 
