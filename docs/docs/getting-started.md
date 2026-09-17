---
id: getting-started
title: Choose Your Integration
sidebar_label: Choose Your Integration
---

# Choose Your Integration

Start with the environment where you already work. The [interactive integration guide](https://hokus.ai/router/integrate) provides the current installation commands for each available path.

## Which path should I use?

### AI Coding Agent

Choose this path to route directly from **Claude Code** or **Codex**. Both use supported plugins. See [AI Coding Agents](/integration-guides/coding-agents).

### Multi-Agent Harness

Choose this path if **OpenHands**, **Aider**, **LiteLLM**, **Wavemill**, or your own orchestration loop owns model execution. Maturity varies from a published adapter to examples and prototypes; see [Harness Integration](/integration-guides/harness-integration).

### Custom Application

Choose this path when your backend or application will call Hokusai. Use the published TypeScript SDK or call the REST API from Python, Go, Java, or another runtime. See [Custom Applications](/integration-guides/custom-applications).

### Quickstart

Choose curl or the browser-based API guide when you want to confirm access before selecting a permanent integration.

## Common first-run sequence

Every path follows the same basic sequence:

1. [Create an API key](/authentication/quickstart).
2. Make `HOKUSAI_API_KEY` available to the process that will call Hokusai.
3. Install the relevant plugin, adapter, or SDK.
4. Run the path's doctor command or known-good request.
5. Route one real task from a candidate pool your system can execute.

**Completion checkpoint:** the request returns a recommended model from the candidate pool you supplied.

If a checkpoint fails, use [Router Troubleshooting](/technical-task-router/troubleshooting) before continuing.

## Optional after routing: contribute outcomes

Outcome reporting is not required to receive a routing recommendation. After the first route works, you can opt in to sharing redacted outcome data so future routing can improve. See [Outcome Reporting](/technical-task-router/outcome-reporting).

## What your system owns

Hokusai recommends a model. Your coding agent, harness, or application still owns:

- Prompt construction
- Context selection
- Tool permissions
- Model execution
- Retry policy
- Test execution
- Human review workflow
- Final acceptance decision

## Continue

- [Open the interactive integration guide](https://hokus.ai/router/integrate)
- [Route Your First Task with TypeScript](/technical-task-router/quickstart)
- [Integrate a Custom Harness](/integration-guides/harness-integration)
- [Understand a Routing Decision](/inside-a-routing-decision)
