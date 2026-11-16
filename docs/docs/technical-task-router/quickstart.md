---
title: Route Your First Task
sidebar_label: Route Your First Task
---

# Route Your First Task

This TypeScript quickstart sends one task to Hokusai and prints the recommended model. It uses the public `@hokusai/router` API.

:::info Prerequisites
- Node.js 18 or later
- A [Hokusai API key](/authentication/quickstart)
- At least two models your application can execute
:::

## 1. Set your API key

Export the key in the same shell that will run the example:

```bash
export HOKUSAI_API_KEY=hk_live_your_key_here
```

## 2. Install the router package

```bash
npm install @hokusai/router@0.8.0
```

## 3. Send a routing request

Create `route-first-task.mjs`:

```ts
import { route } from '@hokusai/router';

const task = 'Refactor billing webhook retry handling.';
const availableModels = ['claude-sonnet-4-6', 'gpt-5'];

const decision = await route({
  task,
  context: {
    language: 'typescript',
    task_type: 'refactor',
  },
  availableModels,
  objective: 'reliability',
  maxCostUsd: 1,
});

console.log({
  model: decision.model,
  reasoning: decision.reasoning,
  routeId: decision.routeId,
  correlationId: decision.correlationId,
});
```

Run it:

```bash
node route-first-task.mjs
```

The response includes `model`, `reasoning`, `alternatives`, `routeId`, and `correlationId`.

**Completion checkpoint:** `model` is one of the model IDs in `availableModels`. Hokusai recommends the model; your application remains responsible for calling it.

## Optional: report the outcome

Outcome reporting is not required to receive a recommendation. If you opt in, report the result before starting another route when using the default single-flight helper:

Install `@hokusai/costs@0.8.0` for local measurement; align a direct core
dependency to 0.8.0 as described in the
[harness guide](/integration-guides/harness-integration#measuring-task-cost).
Continue in the same file with your own usage-emitting harness:

```ts
import { measureTask } from '@hokusai/costs';

const executedModel = decision.model;
const { result, cost } = await measureTask({ events: harness }, () =>
  harness.run(task, executedModel),
);
console.log(cost.totalUsd, cost.coverage, cost.pricing); // Inspect locally.

// Only run this network submission after explicit contribution consent.
const contribution = await route.reportOutcome({
  correlationId: decision.correlationId,
  model: executedModel,
  status: result.ok ? 'succeeded' : 'failed',
  cost,
});
console.log(contribution.fidelityTier);
```

Pass the whole report, including partial token and coverage evidence. Unknown
totals stay null, never zero. Preserve the route budget and executed model;
server repricing/trust determines cost-label eligibility, training and rewards,
not a scalar amount alone. Measurement is independent of subscription or payment
arrangement. The legacy `actualCostUsd` scalar remains supported when known;
see [Outcome Reporting](/technical-task-router/outcome-reporting).

## Integration Checklist

- Keep `HOKUSAI_API_KEY` in the calling process's environment.
- Pass at least two model IDs your application can actually execute.
- Put `availableModels` and `maxCostUsd` at the top level of the route request.
- Execute `decision.model` in your own application or harness.
- Treat outcome reporting as a separate, optional contribution step.

## Next Steps

- [Choose another integration](https://hokus.ai/router/integrate)
- [Inside a Routing Decision](/inside-a-routing-decision)
- [Task Packets](/technical-task-router/task-packets)
- [Outcome Reporting](/technical-task-router/outcome-reporting)
- [Integrating with a Harness](/integration-guides/harness-integration)
