---
sidebar_position: 2
title: Deployments
description: Hokusai protocol contract addresses on Sepolia testnet
---

# Deployments

This page is the canonical source for Hokusai protocol contract addresses. Integrators should fetch deployment addresses from here rather than relying on hard-coded values copied from third-party sources.

## Sepolia (v2 - current)

Deployed on 2026-04-28. All new integrations should target these addresses.

| Contract | Address |
| -- | -- |
| ModelRegistry | [`0x8E891850C0677c2D9581c953bF1Df5446cB4c54f`](https://sepolia.etherscan.io/address/0x8E891850C0677c2D9581c953bF1Df5446cB4c54f) |
| TokenManager | [`0x4ebC3558Ec08c81AbB9F220fd2C98c838b96De68`](https://sepolia.etherscan.io/address/0x4ebC3558Ec08c81AbB9F220fd2C98c838b96De68) |
| DeltaVerifier | [`0x4812263c7A4317E971F461E611ACD2A51679F7af`](https://sepolia.etherscan.io/address/0x4812263c7A4317E971F461E611ACD2A51679F7af) |
| DataContributionRegistry | [`0xD390BAE1361bBc8296EA7b6e5757A86b3438ac4E`](https://sepolia.etherscan.io/address/0xD390BAE1361bBc8296EA7b6e5757A86b3438ac4E) |
| HokusaiAMMFactory | [`0xc6c7f2079fE6222885dC401C58260D9bfFc48447`](https://sepolia.etherscan.io/address/0xc6c7f2079fE6222885dC401C58260D9bfFc48447) |
| InfrastructureReserve | [`0x68A5B3b6519d70D1D08A46B0F2206cF442AF05A1`](https://sepolia.etherscan.io/address/0x68A5B3b6519d70D1D08A46B0F2206cF442AF05A1) |
| InfrastructureCostOracle | [`0x2BF187014a051A54B56FA5552838e3F9005A7AEe`](https://sepolia.etherscan.io/address/0x2BF187014a051A54B56FA5552838e3F9005A7AEe) |
| UsageFeeRouter | [`0x31258B9A4eF51cDfa09fb8d479CE1Cd19f5ab8c5`](https://sepolia.etherscan.io/address/0x31258B9A4eF51cDfa09fb8d479CE1Cd19f5ab8c5) |
| MockUSDC | [`0x4fE61E343D9c7CB5C0D9DeE293F0Dbcf7C2Dd645`](https://sepolia.etherscan.io/address/0x4fE61E343D9c7CB5C0D9DeE293F0Dbcf7C2Dd645) |
| HLEAD token | [`0x9690580864274E57899a79bD97e8d7C6cAe0d7d5`](https://sepolia.etherscan.io/address/0x9690580864274E57899a79bD97e8d7C6cAe0d7d5) |
| HLEAD params | [`0xc7325cB1f179f404Bad7FE62B83B708181FAaD6d`](https://sepolia.etherscan.io/address/0xc7325cB1f179f404Bad7FE62B83B708181FAaD6d) |
| HLEAD pool | [`0x726f46e15cb8F05F291C6337F497da9D5A2738ff`](https://sepolia.etherscan.io/address/0x726f46e15cb8F05F291C6337F497da9D5A2738ff) |

### Verifying addresses

Each address links to Sepolia Etherscan. Verify deployed bytecode and metadata there before integrating.

## Deprecated deployments

An earlier Sepolia v1 deployment from the 2026-01-20 era was superseded by the v2 deployment on 2026-04-28. Do not integrate against any pre-2026-04-28 Sepolia addresses; migrate to the v2 set above instead.

## Reporting issues / requesting mainnet info

For contract architecture context, see the [Smart Contract Overview](/smart-contracts/smart-contracts-overview). For support or mainnet deployment questions, use the channels listed in [Community](/community).
