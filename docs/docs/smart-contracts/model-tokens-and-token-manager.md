# 🪙 Model Tokens & TokenManager

## HokusaiToken (ERC-20)
Each model has its own token:
- Minted only when performance improves
- Burned to access the model
- Controller is the `TokenManager`

## TokenManager
- Mints tokens after verification of performance gain
- Distributes rewards to contributors
- Uses `ModelRegistry` to resolve correct token per model