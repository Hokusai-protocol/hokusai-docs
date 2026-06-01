---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started

Start with the Technical Task Router if you are evaluating Hokusai for an engineering agent or coding harness.

The router accepts a task, normalizes it into a task packet, chooses a route from historical outcomes, and returns a recommendation. Your harness executes that recommendation and reports the result.

## Choose Your Path

### Integrate the Router

Use this path if you operate a coding harness, internal agent, benchmark runner, or autonomous engineering workflow.

1. Read [Inside a Routing Decision](/inside-a-routing-decision).
2. Follow the [Router Quickstart](/technical-task-router/quickstart).
3. Map your task format to a [Task Packet](/technical-task-router/task-packets).
4. Execute the selected route inside your harness.
5. Report the result through [Outcome Reporting](/technical-task-router/outcome-reporting).

### Evaluate Routing Quality

Use this path if you want to understand whether routing improves cost, reliability, or task acceptance.

1. Define the tasks you want to route.
2. Decide which models and workflow stages are available.
3. Pick evaluation signals: tests, review score, human acceptance, cost, latency, and regressions.
4. Compare Hokusai-selected routes against your current baseline.
5. Inspect how feedback changes future routing decisions.

See [Evaluations and Feedback](/technical-task-router/evaluations-and-feedback).

### Understand Rewards

Use this path if you want to understand why contributors receive tokens and where value comes from.

1. Routing calls pay per-decision fees.
2. Fees back the router's token economics.
3. Outcome data improves future route quality.
4. Verified routing improvements can mint contributor rewards.

See [Contributor Rewards](/contributor-rewards/routing-rewards) and [Rewards and Fee Flow](/tokenomics).

## Minimal Integration Shape

```ts
import { route } from '@hokusai/router';

const decision = await route({
  task: userTask,
  context: harnessContext,
});

const result = await runInHarness(decision);

await route.reportOutcome({
  decisionId: decision.id,
  result,
});
```

## What the Harness Owns

Hokusai recommends the route. Your harness still owns:

- Prompt construction
- Context selection
- Tool permissions
- Model execution
- Retry policy
- Test execution
- Human review workflow
- Final acceptance decision

## Legacy and Protocol Docs

The repository also contains detailed documentation for the broader protocol: model lifecycle, BenchmarkSpec, data contribution, AMM mechanics, smart contracts, and deployments. Those pages remain available under Protocol Internals and Reference, but they are no longer the primary first-run path for router integrators.
