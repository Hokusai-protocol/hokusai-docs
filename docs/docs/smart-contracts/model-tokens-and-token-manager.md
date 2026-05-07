# Model Tokens & TokenManager

## HokusaiToken (ERC-20)
Each model has its own token:
- Minted only when performance improves
- Tradeable on the CRR bonding curve AMM
- API usage fees flow to the token's USDC reserve
- Controller is the `TokenManager`

## TokenManager
- Mints tokens after verification of performance gain
- Distributes rewards to contributors
- Uses `ModelRegistry` to resolve correct token per model

### Token Deployment

The canonical entry point for deploying a new model token is `TokenManager.deployTokenWithAllocations(modelId, name, symbol, modelSupplierAllocation, modelSupplierRecipient, investorAllocation, initialParams)`. A legacy single-supply path (`deployTokenWithParams`) remains in the contract but is not used for new deployments.

At deployment, `totalSupply` is `0`; `maxSupply` equals the sum of the two allocation caps. Supplier tokens are not minted up front — after the model passes verification, the Hokusai backend calls `distributeModelSupplierAllocation(modelId)` to mint them to the designated recipient. The AMM pool is created by the Hokusai backend through a server signer after registration completes; the deployer does not sign the pool creation transaction.

## Reference deployment

The [HLEAD reference model](/reference-apps/hlead) (Model 25, Pipeline Win Predictor) is the first model deployed under this architecture on Sepolia v2. Use it to test the full token + params + pool triple end-to-end before integrating with future models.
