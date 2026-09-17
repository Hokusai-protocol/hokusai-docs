---
title: Task Packets
sidebar_label: Task Packets
---

# Task Packets

A task packet is the normalized representation the router uses to compare tasks across harnesses, repositories, and model providers.

This is an internal normalized representation, not the request body for either `@hokusai/router` or the direct REST API. Most integrations send their native task plus routing constraints and let the SDK or service derive the descriptor. See [Router Contracts](/technical-task-router/contracts) for the four distinct public and internal shapes.

## Why Task Packets Exist

Raw task text is not enough for reliable routing. The same user request can have different routing requirements depending on language, repository maturity, risk, available models, budget, and evaluation method.

Task packets make those details explicit so the choice layer can compare the current task with historical outcomes.

## Normalized descriptor fields

| Field | Description |
| --- | --- |
| `task_type` | Bug fix, feature, refactor, infra, tests, migration, docs, or unknown |
| `language` | Python, TypeScript, JavaScript, Go, Rust, Java, Bash, multi, or unknown |
| `domain` | Backend, frontend, fullstack, devops, data, ML, mobile, or unknown |
| `complexity` | Numeric implementation difficulty |
| `repo_size_bucket` | Stable repository-size category |
| `files_touched_bucket` | Stable changed-file-count category |
| `description_length_bucket` | Short, medium, or long task description |
| `is_greenfield` | Whether the task starts a new system or component |
| `is_migration` | Whether the task is a migration |
| `requires_tests` | Whether the task requires test work |
| `cross_service` | Whether the task crosses service boundaries |
| `ui_heavy` | Whether UI work dominates the task |
| `risk_level` | Low, medium, or high risk |

## Example

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

Budget, latency, and available-model constraints shape the routing decision but are not fields in this descriptor. They remain separate routing inputs.

## Normalization Rules

Task packet generation should preserve the task's routing-relevant meaning while avoiding harness-specific noise.

- Keep model-agnostic task attributes separate from routing constraints and harness execution details.
- Supply budget and availability constraints through the SDK or REST routing input.
- Prefer stable categories over one-off labels.
- Redact secrets, customer identifiers, and unnecessary repository content.
- Include enough metadata to reproduce the routing decision later.

## Generalizing Across Harnesses

A Wavemill task, an OpenHands task, a Claude Code session, and a custom internal issue can all produce comparable packets if they normalize to the same concepts: what work is being done, where it happens, how risky it is, what models are available, and how success will be measured.

That portability is what lets Hokusai learn routing behavior across many execution environments without requiring every integration to expose the same native task object.
