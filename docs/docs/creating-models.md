---
id: creating-models
title: Creating Models
sidebar_label: Creating Models
sidebar_position: 6
---

# Creating Models

This guide explains how to create and register models in the Hokusai ecosystem, including the required smart contract interactions.

## Overview

Hokusai allows model developers to register their AI models and earn rewards when the models are improved through data contributions. Each model has its own ERC-20 token that is minted when performance improves and can be traded on a dedicated AMM. API usage fees flow to the token's USDC reserve, increasing its price. This guide covers both the web-based creation process and the equivalent programmatic workflow.

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

For advanced users, CI pipelines, or custom launch flows, the on-chain portion of model creation is a direct smart contract call. The workflow has two parts:

1. Deploy the model token on-chain with `TokenManager.deployTokenWithParams(...)`
2. Register the model artifact off-chain with the MLflow-based `hokusai-ml-platform` SDK

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
6. Model metadata, license text, and token economics from the model creation flow

## Step 2: Compute the license hash

`deployTokenWithParams()` stores a `licenseHash` on-chain and a `licenseURI` that points to the full license text. Hash the exact bytes you publish at `licenseURI` before deployment:

```typescript
import { keccak256, toUtf8Bytes } from "ethers";

const licenseText = `# Commercial Model License

Replace this text with the exact license you will publish off-chain.
`;

const licenseHash = keccak256(toUtf8Bytes(licenseText));
console.log("License hash:", licenseHash);
```

## Step 3: Deploy the model token

The TokenManager contract accepts the model metadata plus an `InitialParams` struct. The example below uses the actual contract interface.

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
  "function deployTokenWithParams(string modelId, string name, string symbol, uint256 totalSupply, (uint256 tokensPerDeltaOne, uint16 infrastructureAccrualBps, uint256 initialOraclePricePerThousandUsd, bytes32 licenseHash, string licenseURI, address governor) initialParams) payable returns (address)",
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

  const tx = await tokenManager.deployTokenWithParams(
    "sentiment-v2",
    "Sentiment Model",
    "SENT",
    parseUnits("1000000", 18),
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

### Parameter reference

| Parameter | Meaning |
| --- | --- |
| `modelId` | Unique model identifier. Reusing a prior `modelId` will revert. |
| `name` | ERC-20 token name shown to users. |
| `symbol` | ERC-20 token ticker. |
| `totalSupply` | Initial token supply, typically expressed with 18 decimals via `parseUnits`. |
| `tokensPerDeltaOne` | Tokens minted per DeltaOne improvement. See [DeltaOne Calculations](tokenomics/deltaone-calculations). |
| `infrastructureAccrualBps` | Infrastructure share in basis points. Valid range is `1000` to `10000`. See [Treasury & Access](smart-contracts/treasury-and-access) and [Choosing CRR](guides/choosing-crr). |
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
2. **Choose `tokensPerDeltaOne` to match your dilution model** - Calibrate rewards against expected improvement cadence using the guidance in [DeltaOne Calculations](tokenomics/deltaone-calculations).
3. **Set `infrastructureAccrualBps` from a real cost model** - This value must stay within `1000` to `10000`. Use [Choosing CRR](guides/choosing-crr) and [Treasury & Access](smart-contracts/treasury-and-access) when deciding the split.
4. **Use a multisig for `governor`** - Production deployments should not hand governance to a single EOA.
5. **Test with a non-production TokenManager first** - A testnet deployment is the fastest way to catch role issues, gas estimation problems, and `licenseHash` mismatches.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Token already deployed for this model` | The `modelId` already has an associated token. | Pick a new `modelId`, or inspect the previously deployed token before retrying. |
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
