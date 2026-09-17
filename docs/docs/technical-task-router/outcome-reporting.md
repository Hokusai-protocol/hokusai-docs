---
title: Outcome Reporting
sidebar_label: Outcome Reporting
---

# Outcome Reporting

Outcome reporting is an optional second step that connects a routing decision to what actually happened during execution.

The router can recommend a route without outcome reporting, but it cannot learn from that decision. Reporting outcomes turns each completed task into evidence for future routing decisions.

**Routing completion checkpoint:** obtain a model recommendation before configuring contribution. A contribution failure must not prevent your harness from completing the routed task.

## SDK Linkage

The `@hokusai/router` helper attributes an outcome to the most recent routing call. Report that outcome before starting another route:

```ts
const decision = await route({
  task,
  availableModels,
  maxCostUsd: 1,
});

const result = await runWithModel(decision.model, task);

const contribution = await route.reportOutcome({
  correlationId: decision.correlationId,
  model: decision.model,
  status: result.ok ? 'succeeded' : 'failed',
  actualCostUsd: result.costUsd,
  wallClockSeconds: result.wallClockSeconds,
});

console.log(contribution.fidelityTier);
```

The SDK threads the server's route identifier back as `inference_log_id` in the canonical contribution row. Advanced harnesses that construct rows directly must preserve that identifier unchanged.

See [Router Contracts](/technical-task-router/contracts) for the difference between the SDK outcome helper and a direct `harness_outcome_row/v1` submission.

## Recommended Signals

| Signal | Why it matters |
| --- | --- |
| `status` | Whether execution `succeeded` or `failed` |
| `model` | Model actually executed; defaults to the recommendation |
| `actualCostUsd` | Actual inference cost; required for training eligibility |
| `wallClockSeconds` | End-to-end latency |
| `correlationId` | Optional guard identifying the most recent route |
| `notes` | Optional free-text notes, redacted before submission |

## Training eligibility

The server, not the client, determines the returned `fidelityTier`. For a normal routed contribution to be `training_eligible`, include:

- At least two runnable models in `availableModels`
- `maxCostUsd` in the routing request
- `actualCostUsd` in the outcome
- Non-empty task descriptors derived from the task and context
- The model that actually ran

A row can be accepted as `partial` telemetry when information is missing. Partial rows do not train the router or earn rewards.

## Reporting Failed Routes

Failed routes are useful. They show where a route exceeded budget, selected the wrong model, missed a policy boundary, or produced code that did not survive evaluation.

Report failures with the same care as successes:

```ts
await route.reportOutcome({
  status: 'failed',
  actualCostUsd: 0.31,
  wallClockSeconds: 611,
  notes: 'Selected model did not pass the required checks.',
});
```

## Privacy Boundary

Outcome reports should contain routing and evaluation signals, not unnecessary code, secrets, or customer data. If your harness needs to preserve detailed artifacts, store them in your own system and report only references or derived evaluation fields.

See [Privacy and Consent](/technical-task-router/privacy-and-consent) for opt-in controls, preview commands, and path-specific responsibilities.

The privacy boundary differs slightly by integration:

| Path | What to review |
| --- | --- |
| Coding-agent plugin | Use the plugin's privacy preview before approving submission |
| `@hokusai/router` | Notes are redacted; keep raw execution artifacts in your application |
| Advanced harness | Inspect the redacted dispatch and contribution row before transport |
| Direct REST | Your application owns payload construction and redaction |

## How Outcomes Improve Routing

The choice layer uses reported outcomes to estimate future route quality. Over time it can learn patterns such as:

- A model that plans well but should not be the implementation model for a task family.
- A cheaper model that performs well on low-risk documentation changes.
- A reviewer that catches security regressions better than faster alternatives.
- A route that succeeds often but routinely exceeds the supplied budget.
