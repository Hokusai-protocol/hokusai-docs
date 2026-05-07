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

## Reference deployment

The [HLEAD reference model](/reference-apps/hlead) (Model 25, Pipeline Win Predictor) is the first model deployed under this architecture on Sepolia v2. Use it to test the full token + params + pool triple end-to-end before integrating with future models.