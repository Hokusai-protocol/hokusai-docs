---
id: quickstart
title: Authentication Quickstart
sidebar_label: Quickstart
sidebar_position: 2
---

# Authentication Quickstart

Get up and running with Hokusai authentication in 5 minutes. This guide walks you through creating your first API key and validating it.

:::info Prerequisites
- A registered and approved Hokusai account (see [Registration](/authentication/registration))
- An admin token for the Hokusai auth service (provided after approval, or by your platform administrator)
- `curl` or Python 3.8+ installed
:::

:::tip Alternative: Wallet Authentication
If you have an Ethereum wallet, you can authenticate via [Sign-In with Ethereum (SIWE)](/authentication/validation#sign-in-with-ethereum-siwe) to get a JWT token without needing an admin token.
:::


## Step 1: Create an API Key

Use your admin token to create a new API key:

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Key",
    "service_id": "prediction",
    "scopes": ["predict"],
    "environment": "test"
  }'
```

```python
import requests

response = requests.post(
    "https://auth.hokus.ai/api/v1/keys",
    headers={
        "Authorization": "Bearer YOUR_ADMIN_TOKEN",
        "Content-Type": "application/json",
    },
    json={
        "name": "My First Key",
        "service_id": "prediction",
        "scopes": ["predict"],
        "environment": "test",
    },
)

data = response.json()
api_key = data["api_key"]
print(f"Your API key: {api_key}")
```

The response includes the full API key — **save it now**, as it cannot be retrieved again:

```json
{
  "api_key": "hk_test_AbCdEfGhIjKlMnOpQrStUvWxYz123456",
  "key_info": {
    "key_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My First Key",
    "key_prefix": "hk_test_AbC***",
    "service_id": "prediction",
    "scopes": ["predict"],
    "environment": "test",
    "is_active": true,
    "rate_limit_per_hour": 1000,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

:::warning
Store your API key securely. The full key is only shown at creation time. If you lose it, you will need to create a new key or rotate the existing one.
:::

## Step 2: Validate the Key

Confirm your key works by calling the validation endpoint:

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "Authorization: Bearer hk_test_AbCdEfGhIjKlMnOpQrStUvWxYz123456" \
  -H "Content-Type: application/json" \
  -d '{"service_id": "prediction"}'
```

```python
response = requests.post(
    "https://auth.hokus.ai/api/v1/keys/validate",
    headers={
        "Authorization": "Bearer hk_test_AbCdEfGhIjKlMnOpQrStUvWxYz123456",
        "Content-Type": "application/json",
    },
    json={"service_id": "prediction"},
)

result = response.json()
print(f"Valid: {result['is_valid']}")
print(f"Scopes: {result['scopes']}")
```

A successful validation returns:

```json
{
  "is_valid": true,
  "key_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "admin",
  "service_id": "prediction",
  "scopes": ["predict"],
  "rate_limit_per_hour": 1000,
  "billing_plan": "free"
}
```

## Step 3: Use the Key with Hokusai Services

Now use your key to call Hokusai APIs. All services accept the key as a Bearer token:

```bash
curl https://api.hokus.ai/v1/models \
  -H "Authorization: Bearer hk_test_AbCdEfGhIjKlMnOpQrStUvWxYz123456"
```

```python
from hokusai import HokusaiClient

client = HokusaiClient(api_key="hk_test_AbCdEfGhIjKlMnOpQrStUvWxYz123456")
models = client.list_models()
```

## What's Next

Now that you have a working API key:

- **[API Keys](/authentication/api-keys)** — Learn about key rotation, revocation, and advanced options
- **[Validation](/authentication/validation)** — Understand the three ways to send API keys
- **[Usage & Billing](/authentication/usage-billing)** — Track your API usage and costs
- **[Security](/authentication/security)** — Best practices for production deployments
- **[Model API Guide](/model-api-guide)** — Start making predictions
