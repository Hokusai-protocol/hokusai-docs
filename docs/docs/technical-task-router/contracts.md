---
title: Router Contracts
sidebar_label: Router Contracts
---

# Router Contracts

Hokusai exposes several related data shapes. They are not interchangeable.

| Contract | Who constructs it | Naming | Purpose |
| --- | --- | --- | --- |
| `@hokusai/router` input and result | TypeScript application | camelCase | Simple public SDK façade |
| Model 30 REST request and response | Direct API caller | snake_case | Language-neutral HTTP API |
| Task descriptor | SDK and router internals | snake_case | Normalized comparison features |
| `harness_outcome_row/v1` | SDK or advanced harness | snake_case | Optional contribution record |

## 1. TypeScript SDK contract

The public SDK accepts a task, categorical context, and routing constraints:

```ts
const decision = await route({
  task: 'Refactor billing webhook retry handling.',
  context: {
    language: 'typescript',
    task_type: 'refactor',
  },
  availableModels: ['claude-sonnet-4-6', 'gpt-5'],
  objective: 'reliability',
  maxCostUsd: 1,
  maxLatencySeconds: 60,
});
```

The result contains:

```ts
type RouteResult = {
  model: string;
  reasoning?: string;
  confidence?: number;
  alternatives: Array<{
    model: string;
    reason?: string;
    confidence?: number;
  }>;
  routeId: string;
  correlationId: string;
};
```

`context` accepts categorical string values. Candidate models, cost limits, latency limits, and the routing objective belong at the top level, not inside `context`.

## 2. Direct Model 30 REST contract

Direct callers send the nested public Model 30 payload:

```json
{
  "inputs": {
    "task": {
      "description": "Refactor billing webhook retry handling",
      "task_type": "refactor",
      "language": "typescript",
      "repo_type": "monorepo"
    },
    "routing": {
      "available_models": ["claude-sonnet-4-6", "gpt-5"],
      "max_cost_usd": 1,
      "objective": "highest_reliability"
    }
  }
}
```

Send it to:

```text
POST https://api.hokus.ai/api/v1/models/30/predict
```

The response exposes the model strategy under `predictions.recommended_strategy` and returns `inference_log_id` for attribution. The TypeScript façade converts the relevant recommendation into `decision.model` and exposes the same persisted route identifier as `decision.routeId`.

## 3. Internal task descriptor

The SDK and router derive a normalized descriptor so outcomes can be compared across integrations. Public SDK users normally do not construct this object themselves.

```json
{
  "task_type": "refactor",
  "language": "typescript",
  "domain": "backend",
  "complexity": 6,
  "repo_size_bucket": "medium",
  "files_touched_bucket": "2_5",
  "description_length_bucket": "medium",
  "is_greenfield": false,
  "is_migration": false,
  "requires_tests": true,
  "cross_service": false,
  "ui_heavy": false,
  "risk_level": "medium"
}
```

See [Task Packets](/technical-task-router/task-packets) for the conceptual role of normalization.

## 4. Contribution row

Advanced harnesses may construct the canonical optional contribution row directly:

```json
{
  "schema_version": "harness_outcome_row/v1",
  "task_descriptor": {
    "task_type": "refactor",
    "language": "typescript",
    "complexity": 6,
    "repo_size_bucket": "medium"
  },
  "allowed_models": ["claude-sonnet-4-6", "gpt-5"],
  "selected_models": {
    "coder": "claude-sonnet-4-6",
    "reviewer": "claude-sonnet-4-6"
  },
  "completion_result": "success",
  "budget_usd": 1,
  "actual_cost_usd": 0.42,
  "wall_clock_seconds": 31,
  "inference_log_id": "<route inference_log_id>"
}
```

`task_descriptor`, `allowed_models`, `selected_models`, and `completion_result` are required by the row schema. The server decides whether an accepted row is `training_eligible` or `partial` based on its contents and attribution.

## Identifier mapping

| Surface | Identifier | Meaning |
| --- | --- | --- |
| TypeScript SDK result | `routeId` | Persisted router decision; maps to `inference_log_id` |
| TypeScript SDK result | `correlationId` | Client-side correlation and outcome guard |
| Direct REST response | `inference_log_id` | Persisted router decision used for contribution attribution |
| Contribution row | `inference_log_id` | Must be threaded back unchanged from the route |

## Sources of truth

- [`@hokusai/router` package](https://www.npmjs.com/package/@hokusai/router) for the façade API
- [Hokusai SDK repository](https://github.com/Hokusai-protocol/hokusai-sdk) for SDK types and contribution schemas
- [Model 30 API guide](https://hokus.ai/explore-models/30/technical-task-router?tab=api-integration) for the direct REST contract
