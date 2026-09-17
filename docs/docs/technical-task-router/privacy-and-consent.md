---
title: Privacy and Consent
sidebar_label: Privacy and Consent
---

# Privacy and Consent

Routing and outcome contribution are separate actions. A developer can route tasks without opting in to contribution reporting.

## Routing payload

Hokusai needs routing-relevant task metadata and the candidate model pool to make a recommendation. Integrations should redact secrets, customer identifiers, credentials, and unnecessary repository content before transport.

Coding-agent plugins and `@hokusai/core` provide redaction and preview helpers. Direct REST callers own payload construction and must enforce their own redaction boundary.

## Optional contribution payload

An outcome contribution should contain derived routing and evaluation signals, such as:

- Normalized task descriptors
- Allowed and selected model IDs
- Success or failure
- Budget and actual cost
- Wall-clock duration
- The original route identifier

Do not include raw prompts, completion text, code, diffs, tool arguments, secrets, customer data, or private diagnostics. Keep detailed execution artifacts in your own system.

## Coding-agent consent controls

Enable reporting only after a route succeeds:

```text
/hokusai:privacy reporting on
```

Before submission, the plugin previews the anonymized payload and sends it only after approval. Use the local privacy commands to inspect stored routing records and prior attempts:

```text
/hokusai:privacy list
/hokusai:privacy preview <correlation-id>
/hokusai:privacy audit
```

## Harness and application controls

Custom integrations should:

1. Make contribution consent explicit and independently configurable.
2. Preview the redacted dispatch and outcome objects before transport.
3. Keep provider credentials and raw execution content local.
4. Treat contribution failures as non-blocking for the host task.
5. Record enough local attribution to audit what was submitted.

## Continue

- [Outcome Reporting](/technical-task-router/outcome-reporting)
- [Router Contracts](/technical-task-router/contracts)
- [Router Troubleshooting](/technical-task-router/troubleshooting)
