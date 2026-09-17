---
title: AI Coding Agents
sidebar_label: AI Coding Agents
---

# AI Coding Agents

Use a coding-agent plugin when you want to route tasks without changing application code. Claude Code and Codex are supported today.

| Agent | Maturity | Integration shape | Verification |
| --- | --- | --- | --- |
| Claude Code | Supported plugin | Marketplace plugin and slash commands | `/hokusai:doctor` |
| Codex | Supported plugin | Codex plugin with skills and an MCP server | `$hokusai-doctor` |

The [interactive integration guide](https://hokus.ai/router/integrate) contains the current installation commands for both agents.

## Common setup

1. [Create a Hokusai API key](/authentication/quickstart).
2. Export `HOKUSAI_API_KEY` before starting the coding agent.
3. Install the Hokusai plugin for that agent.
4. Start a new session or reload plugins.
5. Run the plugin doctor.
6. Route one real task.

The coding agent only sees environment variables available when it starts. If the doctor reports a missing key, exit the agent, export the key in that shell, and start it again.

## Completion checkpoints

The plugin doctor should report:

```text
Connected · Routing enabled · Ready
```

Then route one task:

```text
# Claude Code
/hokusai:route Find the performance bottleneck in this function.

# Codex
$hokusai-route Find the performance bottleneck in this function.
```

You are integrated when the command returns a model recommendation. The coding agent remains responsible for reviewing and executing that recommendation.

## Optional outcome contribution

Outcome reporting is off the critical path. Route a task successfully before changing contribution settings.

When you opt in, the plugin previews the redacted contribution payload before submission. Raw prompts, tool arguments, completion text, secrets, and repository contents should not be included in an outcome row.

See [Outcome Reporting](/technical-task-router/outcome-reporting) for the contribution flow and fidelity tiers.

## Troubleshooting

See [Router Troubleshooting](/technical-task-router/troubleshooting) for missing credentials, plugin registration, candidate-model, and contribution-tier errors.
