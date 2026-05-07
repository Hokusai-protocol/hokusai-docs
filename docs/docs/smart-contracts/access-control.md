---
sidebar_position: 6
title: Access Control & Roles
description: Role catalog for fee routing, infrastructure payments, governance, and model access.
---

# Access Control & Roles

Hokusai uses a mix of `Ownable` and role-based access control across its fee-routing and infrastructure contracts.

## ModelAccessController

`ModelAccessController` is the access layer for model usage:

- verifies whether a caller can use a model
- supports pay-per-use and subscription-style access flows
- sits in front of API fee collection

In the current fee model, usage fees are collected in USDC and then routed by `UsageFeeRouter`.

## Role catalog

| Contract / surface | Role | Purpose |
| --- | --- | --- |
| `UsageFeeRouter` | `FEE_DEPOSITOR_ROLE` | Allows an address to call `depositFee()` and `batchDepositFees()` |
| `InfrastructureReserve` | `DEPOSITOR_ROLE` | Allows the router to deposit accrued infrastructure amounts |
| `InfrastructureReserve` | `PAYER_ROLE` | Allows authorized operators to pay providers against accrued balances |
| `InfrastructureCostOracle` | `GOV_ROLE` | Queues cost updates and adjusts gross margin |
| `HokusaiParams` | `GOV_ROLE` | Updates per-model parameters such as `infrastructureAccrualBps` |
| `InfrastructureReserve` / `InfrastructureCostOracle` | `DEFAULT_ADMIN_ROLE` | Emergency administration and role management |
| `HokusaiAMM` | `owner` | Updates AMM parameters, pauses trading, withdraws accumulated trade-fee balance |

## AMM ownership

`HokusaiAMM` uses `Ownable`, not `AccessControl`.

The owner can:

- call `setParameters(newCrr, newTradeFee)`
- call `setMaxTradeBps(newMaxTradeBps)`
- call `pause()` and `unpause()`
- call `withdrawTreasury(amount)`

In this context, `treasury` is the AMM's configurable trade-fee recipient address. It is not a protocol-wide treasury for API fees.

## Typical deployment pattern

1. Deploy `UsageFeeRouter`
2. Grant `DEPOSITOR_ROLE` on `InfrastructureReserve` to the router
3. Grant `FEE_DEPOSITOR_ROLE` on `UsageFeeRouter` to the backend fee-collector service
4. Grant `PAYER_ROLE` on `InfrastructureReserve` to the multisig that pays providers
5. Grant `GOV_ROLE` on `InfrastructureCostOracle` and `HokusaiParams` to governance or multisig operators

## Example role grants

```solidity
bytes32 feeDepositorRole = keccak256("FEE_DEPOSITOR_ROLE");
bytes32 depositorRole = keccak256("DEPOSITOR_ROLE");
bytes32 payerRole = keccak256("PAYER_ROLE");
bytes32 govRole = keccak256("GOV_ROLE");
```

The exact `grantRole(...)` calls depend on the deployment environment, but the intended responsibilities above should remain stable.

## Access models

### Pay-per-use

- user makes API calls
- backend aggregates usage fees
- authorized depositor calls `UsageFeeRouter.depositFee(modelId, amount, callCount)`

### Subscription or enterprise access

- access can still be enforced by the model access layer
- billing may occur off-chain
- when revenue is settled on-chain, the same usage-fee routing rules apply

## Related docs

- [Usage Fee Routing & InfrastructureReserve](/smart-contracts/usage-fee-routing)
- [API Fee Flow](/tokenomics/api-fee-flow)
- [HokusaiAMM Contract](/smart-contracts/hokusai-amm)
