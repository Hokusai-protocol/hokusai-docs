---
title: Custom Applications
sidebar_label: Custom Applications
---

# Custom Applications

Use an application integration when your own backend or service creates tasks, owns the candidate model pool, executes the selected model, and stores task outcomes.

| Path | Maturity | Best for |
| --- | --- | --- |
| TypeScript | Published `@hokusai/router` SDK | The shortest application integration |
| REST API | Supported direct API | Any runtime or custom client |
| Python | REST example | Existing Python services |
| Go | REST example | Services using the standard HTTP client |
| Java | REST example | Services using Java's built-in HTTP client |

Use the [interactive integration guide](https://hokus.ai/router/integrate) for current installation and request examples.

## Recommended TypeScript path

The `@hokusai/router` façade reads `HOKUSAI_API_KEY`, constructs and redacts the dispatch payload, calls the router, and returns a single recommended model.

Follow [Route Your First Task](/technical-task-router/quickstart) for the runnable example.

## Direct API path

Call Model 30 directly when you do not want a JavaScript dependency:

```text
POST https://api.hokus.ai/api/v1/models/30/predict
Authorization: Bearer $HOKUSAI_API_KEY
```

The direct REST request and response are not shaped like the TypeScript façade. In particular, REST uses snake_case fields under `inputs`, while `@hokusai/router` exposes camelCase options and a simplified result.

See [Router Contracts](/technical-task-router/contracts) before implementing a custom client.

## What your application owns

- The list of models it can actually execute
- Provider credentials and model calls
- Prompt construction and context selection
- Tool permissions and retries
- Cost and wall-clock measurement
- Tests, review, and final acceptance

Hokusai ranks within the candidate pool you provide. It does not proxy the selected model call.

## Completion checkpoint

Your first request should return a recommendation and a route identifier. Persist the identifier with the task if you may submit an optional outcome later.

## Optional outcome contribution

Routing works without outcome submission. If you opt in, send only routing and evaluation metadata. Keep raw prompts, completions, tool arguments, secrets, and customer data in your own system.

See [Outcome Reporting](/technical-task-router/outcome-reporting) for SDK and direct-row requirements.
