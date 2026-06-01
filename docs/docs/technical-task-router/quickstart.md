---
title: Router Quickstart
sidebar_label: Quickstart
---

# Router Quickstart

This page shows the minimal integration shape for the Hokusai Technical Task Router.

The router accepts a coding task and optional harness context. It returns a routing decision. Your harness executes the decision and reports the outcome.

## 1. Submit a Task

```ts
import { route } from '@hokusai/router';

const decision = await route({
  task: {
    title: 'Refactor auth middleware to support scoped API keys',
    body: `Keep the middleware entrypoint stable, enforce scope checks
before handlers run, preserve admin flows, and add missing-scope tests.`,
    priority: 'high',
    tags: ['auth', 'backend', 'middleware', 'api-keys'],
  },
  context: {
    harness: 'wavemill',
    repository: 'acme/api',
    availableModels: [
      'claude-opus-4-7',
      'claude-sonnet-4-6',
      'gpt-5.4',
      'gemini-2.5-pro',
      'o4-mini',
    ],
    budget: {
      maxCostUsd: 25,
      maxWallClockMinutes: 20,
    },
  },
});
```

## 2. Execute the Route

The router may return a single model or a staged route. A staged route can independently select a planner, coder, and reviewer.

```ts
const plan = await models[decision.route.planner.model].run(
  buildPlanningPrompt(userTask, decision)
);

const patch = await models[decision.route.coder.model].run(
  buildCodingPrompt(userTask, plan)
);

const review = await models[decision.route.reviewer.model].run(
  buildReviewPrompt(userTask, patch)
);
```

Your harness owns prompts, context selection, tool execution, retries, and acceptance policy.

## 3. Report the Outcome

```ts
await route.reportOutcome({
  decisionId: decision.id,
  result: {
    accepted: true,
    testsPassed: true,
    costUsd: 18.42,
    wallClockSeconds: 412,
    retries: 1,
    scores: {
      planner: 9.2,
      coder: 8.7,
      reviewer: 9.5,
    },
  },
});
```

Outcome reporting is what lets the router improve. Without outcomes, a routing decision is only a recommendation; with outcomes, it becomes training data for future tasks.

## Integration Checklist

- Map your task object to the router request.
- Include available models and budget constraints.
- Decide whether you want single-model or staged planner/coder/reviewer routes.
- Execute the returned route inside your harness.
- Capture cost, latency, test, review, and acceptance signals.
- Report the outcome with the original decision ID.

## Next Steps

- [Inside a Routing Decision](/inside-a-routing-decision)
- [Task Packets](/technical-task-router/task-packets)
- [Outcome Reporting](/technical-task-router/outcome-reporting)
- [Integrating with a Harness](/integration-guides/harness-integration)
