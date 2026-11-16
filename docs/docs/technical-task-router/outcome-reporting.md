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

Install `@hokusai/router@0.8.0` and `@hokusai/costs@0.8.0`. If core is a direct
dependency, align it to 0.8.0 as described in the
[harness measurement guide](/integration-guides/harness-integration#measuring-task-cost).
The host supplies `task`, runnable `availableModels` and an event-emitting `harness`.

```ts
import { route } from '@hokusai/router';
import { measureTask } from '@hokusai/costs';

const decision = await route({
  task,
  availableModels,
  maxCostUsd: 1,
});

const executedModel = decision.model;
const { result, cost } = await measureTask({ events: harness }, () =>
  harness.run(task, executedModel),
);
// Inspect cost, coverage, provenance and the redacted payload locally first.
// The following network submission is an explicit contribution opt-in.

const contribution = await route.reportOutcome({
  correlationId: decision.correlationId,
  model: executedModel,
  status: result.ok ? 'succeeded' : 'failed',
  cost, // Preserve the whole report, even when totalUsd is null.
  wallClockSeconds: result.wallClockSeconds,
});

console.log(contribution.fidelityTier);
```

The SDK threads the server's route identifier back as `inference_log_id` in the canonical contribution row. Advanced harnesses that construct rows directly must preserve that identifier unchanged.

See [Router Contracts](/technical-task-router/contracts) for the difference between the SDK outcome helper and a direct contribution submission.

## Recommended Signals

| Signal | Why it matters |
| --- | --- |
| `status` | Whether execution `succeeded` or `failed` |
| `model` | Model actually executed; defaults to the recommendation |
| `cost` | Whole measured report: token facts, coverage, provenance and resolved cost |
| `actualCostUsd` | Legacy optional scalar supported by this release; not a substitute for token evidence |
| `wallClockSeconds` | End-to-end latency |
| `correlationId` | Optional guard identifying the most recent route |
| `notes` | Optional free-text notes, redacted before submission |

## Training eligibility

The server, not the client, determines the returned `fidelityTier`, cost-label
eligibility and rewards. Server repricing and trust checks use token evidence;
the presence of a scalar amount alone does not guarantee eligibility.
Preserve partial token/cost evidence when explicitly contributing, even if
`cost.totalUsd` is null. Never coerce that null to zero.

For normal routed contributions, preserve the candidate pool (at least two
runnable models), route budget, non-empty task descriptors, executed model and
original route attribution. A row can be accepted as partial telemetry without
qualifying for training or rewards. API-equivalent resource measurement applies
equally to subscription-funded, discounted and subsidized usage; estimates are
not ineligible merely because they are not provider bills.

### Advanced hosts and the legacy scalar path

Core 0.8.0 exports `buildTechnicalTaskRouterRowV4` for
`technical_task_router_row/v4`. Follow the
[SDK contribution builder](https://github.com/Hokusai-protocol/hokusai-sdk/blob/main/packages/core/src/contribution/builder.ts)
for per-stage `task_cost`, stage/executed-model evidence, inference-log linkage
and explicit cost overrides. Keep the route's `inference_log_id` unchanged and
record execution deviations. An override is reported evidence, not a way to
bypass server repricing/trust.

`route.reportOutcome({ status, actualCostUsd, ... })` remains supported for hosts
with a known scalar. Omit `actualCostUsd` when unknown; it does not carry token
coverage or pricing provenance. Prefer `cost` for measured runs and preserve
source distinctions: `estimatedUsd` is token-derived, `actualUsd` is provider
charge evidence, and `totalUsd` prefers charges per event when resolving them.

## Reporting Failed Routes

Failed routes are useful. They show where a route exceeded budget, selected the wrong model, missed a policy boundary, or produced code that did not survive evaluation.

Report failures with the same care as successes:

```ts
await route.reportOutcome({
  status: 'failed',
  cost, // Include the partial report if execution failed after consuming tokens.
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
