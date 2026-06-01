---
title: Outcome Reporting
sidebar_label: Outcome Reporting
---

# Outcome Reporting

Outcome reporting connects a routing decision to what actually happened during execution.

The router can recommend a route without outcome reporting, but it cannot learn from that decision. Reporting outcomes turns each completed task into evidence for future routing decisions.

## Required Linkage

Every outcome should reference the original routing decision:

```json
{
  "decisionId": "route_01HX...",
  "accepted": true
}
```

The `decisionId` lets Hokusai connect the result to the task packet, selected route, fallback candidates, budget constraints, and historical comparison that produced the recommendation.

## Recommended Signals

| Signal | Why it matters |
| --- | --- |
| `accepted` | Whether the harness or human accepted the final result |
| `testsPassed` | Whether automated tests passed |
| `testSummary` | Count of passed, failed, skipped, or flaky tests |
| `costUsd` | Actual inference and execution cost |
| `wallClockSeconds` | End-to-end latency |
| `retries` | How much recovery was needed |
| `regressionsDetected` | Whether review or post-run checks found regressions |
| `humanReview` | Optional human score, comments, or acceptance reason |
| `stageScores` | Planner, coder, and reviewer quality scores when available |

## Example Outcome

```json
{
  "decisionId": "route_01HX...",
  "accepted": true,
  "testsPassed": true,
  "testSummary": {
    "passed": 128,
    "failed": 0,
    "skipped": 3
  },
  "costUsd": 18.42,
  "wallClockSeconds": 412,
  "retries": 1,
  "regressionsDetected": 0,
  "stageScores": {
    "planner": 9.2,
    "coder": 8.7,
    "reviewer": 9.5
  }
}
```

## Reporting Failed Routes

Failed routes are useful. They show where a route exceeded budget, selected the wrong model, missed a policy boundary, or produced code that did not survive evaluation.

Report failures with the same care as successes:

```json
{
  "decisionId": "route_01HY...",
  "accepted": false,
  "testsPassed": false,
  "failureReason": "reviewer missed auth scope regression",
  "costUsd": 14.06,
  "wallClockSeconds": 611,
  "regressionsDetected": 1
}
```

## Privacy Boundary

Outcome reports should contain routing and evaluation signals, not unnecessary code, secrets, or customer data. If your harness needs to preserve detailed artifacts, store them in your own system and report only references or derived evaluation fields.

## How Outcomes Improve Routing

The choice layer uses reported outcomes to estimate future route quality. Over time it can learn patterns such as:

- A model that plans well but should not be the implementation model for a task family.
- A cheaper model that performs well on low-risk documentation changes.
- A reviewer that catches security regressions better than faster alternatives.
- A route that succeeds often but routinely exceeds the supplied budget.
