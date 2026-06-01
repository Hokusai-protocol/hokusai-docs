---
title: Task Packets
sidebar_label: Task Packets
---

# Task Packets

A task packet is the normalized representation the router uses to compare tasks across harnesses, repositories, and model providers.

Harnesses do not need to expose identical internal task formats. They need to supply enough information for Hokusai to infer the kind of work being requested and the constraints that should shape routing.

## Why Task Packets Exist

Raw task text is not enough for reliable routing. The same user request can have different routing requirements depending on language, repository maturity, risk, available models, budget, and evaluation method.

Task packets make those details explicit so the choice layer can compare the current task with historical outcomes.

## Common Fields

| Field | Description |
| --- | --- |
| `title` | Short task summary |
| `body` | Full task request or issue description |
| `language` | Primary implementation language or mixed-language profile |
| `domain` | Backend, frontend, infra, tests, docs, security, data, or mixed |
| `taskType` | Bug fix, refactor, feature, migration, review, docs, or test repair |
| `complexity` | Estimated implementation difficulty |
| `risk` | Expected blast radius or security/policy sensitivity |
| `budget` | Cost, token, or wall-clock constraints |
| `availableModels` | Models the harness can run |
| `harnessMetadata` | Tooling, retry policy, eval mode, or execution environment |

## Example

```json
{
  "title": "Refactor auth middleware to support scoped API keys",
  "body": "Keep the middleware entrypoint stable, enforce scope checks before request handlers run, preserve existing admin flows, add missing-scope tests.",
  "language": "typescript",
  "domain": "backend",
  "taskType": "refactor",
  "complexity": 6,
  "risk": "medium",
  "budget": {
    "maxCostUsd": 25,
    "maxWallClockMinutes": 20
  },
  "availableModels": [
    "claude-opus-4-7",
    "claude-sonnet-4-6",
    "gpt-5.4",
    "gemini-2.5-pro",
    "o4-mini"
  ],
  "harnessMetadata": {
    "harness": "wavemill",
    "tools": ["shell", "patch", "tests"],
    "evaluation": ["unit_tests", "review_score", "human_acceptance"]
  }
}
```

## Normalization Rules

Task packet generation should preserve the task's routing-relevant meaning while avoiding harness-specific noise.

- Keep model-agnostic task attributes separate from harness execution details.
- Include budget and availability constraints explicitly.
- Prefer stable categories over one-off labels.
- Redact secrets, customer identifiers, and unnecessary repository content.
- Include enough metadata to reproduce the routing decision later.

## Generalizing Across Harnesses

A Wavemill task, an OpenHands task, a Claude Code session, and a custom internal issue can all produce comparable packets if they normalize to the same concepts: what work is being done, where it happens, how risky it is, what models are available, and how success will be measured.

That portability is what lets Hokusai learn routing behavior across many execution environments.
