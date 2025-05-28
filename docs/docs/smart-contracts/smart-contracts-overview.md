# Smart Contract Overview

Hokusai's smart contract system is modular, designed to support decentralized AI model development and tokenization. Here's a simplified flow:

```
[Data Contributor]
    ↓ submits data
[Verifier] → checks model performance
    ↓ confirms DeltaOne
[TokenManager] → mints model tokens
    ↓
[BondingCurveTreasury] → enables buy/sell
    ↓
[ModelAccessAuction] → enforces burn for usage
```

## Key Roles
- **Model-specific Hokusai tokens**: Earned via performance gains
- **DeltaOneVerifier**: Validates performance improvement
- **TokenManager**: Issues tokens, handles mint/burn logic
- **Bonding Curve Treasury**: Enables trading between tokens and USDC
- **DAO + HOK Token**: Coordinates protocol-wide incentives and funding