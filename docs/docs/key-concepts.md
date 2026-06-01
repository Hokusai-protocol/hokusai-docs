---
id: key-concepts
title: Key Concepts
sidebar_label: Key Concepts
sidebar_position: 2
---

# Key Concepts

Hokusai coordinates a shared routing layer for AI systems. The first router focuses on coding tasks, but the same protocol can support other decision layers where outcome data improves future choices.

## Router Concepts

### Task

The user request or work item submitted by an integrating harness. Examples include bug fixes, refactors, feature work, documentation updates, test repair, and code review.

### Task Packet

A normalized task representation used for routing. It captures fields such as language, domain, task type, complexity, risk, budget, available models, and harness metadata.

### Choice Layer

The routing model that compares the current task packet with historical tasks and outcomes. It selects based on observed success, cost, latency, and reliability, not static provider rankings.

### Route

The recommended model or workflow. A route can be a single model or a staged selection such as planner, coder, and reviewer.

### Evaluation

The measured result of execution. Useful signals include task success, tests, human acceptance, review score, regressions, cost, latency, and retry count.

### Feedback

Outcome data returned by the harness. Feedback turns completed tasks into training examples for future routing decisions.

## Protocol Concepts

### Contributor Rewards

Contributors can earn rewards when their data, evaluations, or improvements create measurable performance lift in the router. Rewards are tied to verified improvement, not to speculative claims.

### Fee Stream

Routing calls can pay per-decision fees. Those fees support the protocol economics behind the router and connect usage to contributor ownership.

### DeltaOne

DeltaOne is Hokusai's unit for verified performance improvement. In router contexts, the relevant improvement is better routing behavior: higher task success, lower cost for equal quality, faster accepted results, or improved reliability under evaluation.

### Smart Contracts

Hokusai uses smart contracts for token issuance, fee routing, access control, and governance around protocol parameters. Most integrators do not need to start here, but the contract documentation is available for implementation and audit work.

## Next Steps

- [Inside a Routing Decision](/inside-a-routing-decision)
- [Router Quickstart](/technical-task-router/quickstart)
- [Task Packets](/technical-task-router/task-packets)
- [Outcome Reporting](/technical-task-router/outcome-reporting)
- [Contributor Rewards](/contributor-rewards/routing-rewards)
