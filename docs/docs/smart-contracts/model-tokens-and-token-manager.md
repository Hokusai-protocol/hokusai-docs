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