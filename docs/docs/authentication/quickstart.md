---
id: quickstart
title: Get a Hokusai API Key
sidebar_label: Get an API Key
sidebar_position: 2
---

# Get a Hokusai API Key

Every Hokusai integration starts with an API key. Create the key in the Hokusai web application, then expose it only to the local process or service that calls Hokusai.

## 1. Sign in or create an account

Open [Hokusai API Keys](https://hokus.ai/login?redirect=%2Fsettings%2Fapi-keys). If you are not signed in, Hokusai will preserve the destination while you sign in or create an account.

You can use email and password, Google, or an Ethereum wallet. After authentication, continue to **Settings → API Keys**.

## 2. Create the key

Select **Create API Key**, optionally give it a descriptive name such as `Local development`, and select **Create Key**.

:::warning
Copy the full key immediately. Hokusai shows it only once. If you lose it, create a new key or rotate the existing key.
:::

## 3. Export the key

Set the key in the same shell that will start your coding agent or application:

```bash
export HOKUSAI_API_KEY=hk_live_your_key_here
```

Do not commit the value to source control. For deployed applications, store it in your platform's secrets manager.

## 4. Continue with your integration

The key is verified as part of the first doctor check or routing request. Continue with one of these paths:

- [Choose an integration](https://hokus.ai/router/integrate)
- [Route your first task with TypeScript](/technical-task-router/quickstart)

## Auth service operators

The admin-token API is intended for operators managing the authentication service, not for ordinary developer signup. See [API Key Management](/authentication/api-keys) for administrative creation, rotation, revocation, scopes, and organization keys.
