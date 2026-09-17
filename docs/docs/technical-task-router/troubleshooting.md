---
title: Router Troubleshooting
sidebar_label: Troubleshooting
---

# Router Troubleshooting

Use the checkpoint nearest to the failure. Do not enable optional contribution reporting until a normal routing request succeeds.

## API key is missing

**Symptoms:** the plugin doctor reports missing credentials, or an application says `HOKUSAI_API_KEY` is not set.

Export the key in the shell that launches the agent or application:

```bash
export HOKUSAI_API_KEY=hk_live_your_key_here
```

Claude Code and Codex inherit environment variables at startup. Restart the agent after exporting the key.

**Checkpoint:** the doctor no longer reports a missing key, or the application reaches the router API.

## Request returns `401` or `403`

1. Confirm that the key was copied completely.
2. Check that the key has not been revoked.
3. Create a new key from [Hokusai API Keys](https://hokus.ai/login?redirect=%2Fsettings%2Fapi-keys) if necessary.
4. Export the replacement key and restart the calling process.

Never paste a real key into an issue, log excerpt, or support message.

## Coding-agent commands are missing

- Reload the Claude Code plugin after installation.
- Start a new Codex session after installing or refreshing the Codex plugin.
- If Codex displays namespaced skills, use `$hokusai:hokusai-doctor` instead of `$hokusai-doctor`.

**Checkpoint:** the appropriate doctor command returns `Connected · Routing enabled · Ready`.

## Candidate pool cannot be ranked

Normal routing requires at least two distinct models after de-duplication:

```ts
await route({
  task,
  availableModels: ['claude-sonnet-4-6', 'gpt-5'],
});
```

If you intentionally want single-model, non-ranking telemetry, opt in explicitly:

```ts
await route({
  task,
  availableModels: ['claude-sonnet-4-6'],
  routingMode: 'non-ranking',
});
```

## Recommended model cannot run

Only pass models your harness can execute. Advanced harnesses using `mapRecommendation()` should catch `ModelMappingError` codes such as `UNKNOWN_MODEL`, `PROVIDER_NOT_ALLOWED`, and `MODEL_UNAVAILABLE`.

Choose an allowed alternative or record that the recommendation was declined. Do not silently run an unrelated default model; any outcome must identify the model that actually ran.

## `reportOutcome` refers to the wrong route

The default `route` helper remembers its most recent call. Report that outcome before starting the next route, or supply its `correlationId` as a guard:

```ts
await route.reportOutcome({
  correlationId: decision.correlationId,
  status: 'succeeded',
  actualCostUsd: 0.42,
});
```

Use an explicitly constructed router per concurrent flow if your application routes tasks concurrently.

## Contribution is accepted as `partial`

An accepted contribution does not necessarily train the router. For a routed row to be eligible, provide:

- At least two allowed models
- A non-empty task descriptor
- The model that actually ran
- `maxCostUsd` on the route
- `actualCostUsd` on the outcome
- The original route attribution

The server's returned `fidelityTier` is authoritative. See [Outcome Reporting](/technical-task-router/outcome-reporting).

## Privacy preview contains unexpected information

Stop before submitting. Raw prompts, completions, tool arguments, secrets, and customer data should remain local. Coding-agent plugins provide privacy preview and audit commands; custom integrations should inspect the redacted dispatch or contribution object before transport.

## Still blocked?

Include the integration path, package or plugin version, checkpoint reached, and redacted error text when asking for help. Never include API keys or unredacted task content.
