---
id: validation
title: Key Validation
sidebar_label: Validation
sidebar_position: 4
---

# Key Validation

The validation endpoint is how Hokusai services verify incoming API keys. It checks that a key is active, not expired, authorized for the requested service, and optionally validates scopes and IP restrictions.

**`POST /api/v1/keys/validate`**

:::info
The validation endpoint is **public** — it does not require an admin token. This allows any Hokusai microservice to validate keys independently.
:::

## Sending API Keys

There are three ways to send an API key for validation, listed in priority order:

### Method 1: Authorization Header (Recommended)

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "Authorization: Bearer hk_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"service_id": "prediction"}'
```

### Method 2: X-API-Key Header

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "X-API-Key: hk_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"service_id": "prediction"}'
```

### Method 3: Request Body

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "hk_live_YOUR_API_KEY",
    "service_id": "prediction"
  }'
```

:::tip
Use the **Authorization header** for production integrations. It follows the OAuth 2.0 Bearer Token standard and keeps keys out of request bodies and server logs.
:::

## Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `service_id` | string | No | Verify the key is authorized for this service |
| `required_scope` | string | No | Verify the key has this specific scope |
| `client_ip` | string | No | Check IP against the key's allowlist (auto-detected if omitted) |
| `api_key` | string | No | API key (only needed if not sent via header) |

## Validation Flow

```mermaid
flowchart TD
    A[Incoming Request] --> B{API Key Present?}
    B -->|No| C[400: No API key provided]
    B -->|Yes| D{Check Redis Cache}
    D -->|Cache Hit| E{Key Valid?}
    D -->|Cache Miss| F[Query Database]
    F --> G{Key Found?}
    G -->|No| H[401: Invalid key]
    G -->|Yes| I{Key Active & Not Expired?}
    I -->|No| J[401: Key inactive/expired]
    I -->|Yes| K{Service Match?}
    K -->|No| L[401: Service mismatch]
    K -->|Yes| M{Scope Check}
    M -->|Fail| N[401: Insufficient scope]
    M -->|Pass| O{IP Check}
    O -->|Fail| P[401: IP not allowed]
    O -->|Pass| Q[200: Valid - Cache Result]
    E -->|No| H
    E -->|Yes| Q
```

## Response

### Successful Validation

```json
{
  "is_valid": true,
  "key_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "admin",
  "service_id": "prediction",
  "scopes": ["predict", "read"],
  "rate_limit_per_hour": 5000,
  "billing_plan": "free",
  "monthly_prediction_limit": null
}
```

### Failed Validation

```json
{
  "is_valid": false,
  "key_id": null,
  "user_id": null,
  "service_id": null,
  "scopes": null,
  "rate_limit_per_hour": null,
  "billing_plan": null,
  "monthly_prediction_limit": null,
  "error": "API key is inactive or has been revoked"
}
```

## Caching Behavior

Validation results are cached in Redis for **5 minutes** (configurable via `CACHE_TTL`). This means:

- **First validation** of a key queries the database and caches the result
- **Subsequent validations** within 5 minutes are served from cache (under 5ms response time)
- **Key revocation** invalidates the cache immediately
- **Key rotation** invalidates the old key's cache entry
- If Redis is unavailable, every validation falls back to a database query

:::warning
After revoking a key, there may be up to a 5-minute window where cached validation results still return `is_valid: true` from other service instances. For immediate revocation, consider reducing the `CACHE_TTL` or triggering a cache flush.
:::

## Integration Examples

### Python Service Integration

```python
import requests
from functools import wraps
from flask import request, jsonify

AUTH_SERVICE_URL = "https://auth.hokus.ai"

def require_api_key(service_id: str, required_scope: str = None):
    """Decorator to validate API keys on incoming requests."""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            api_key = request.headers.get("Authorization", "").replace("Bearer ", "")
            if not api_key:
                api_key = request.headers.get("X-API-Key", "")

            if not api_key:
                return jsonify({"error": "API key required"}), 401

            validation = requests.post(
                f"{AUTH_SERVICE_URL}/api/v1/keys/validate",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "service_id": service_id,
                    "required_scope": required_scope,
                    "client_ip": request.remote_addr,
                },
            ).json()

            if not validation.get("is_valid"):
                return jsonify({"error": validation.get("error", "Invalid API key")}), 401

            request.key_info = validation
            return f(*args, **kwargs)
        return wrapper
    return decorator

@app.route("/predict")
@require_api_key(service_id="prediction", required_scope="predict")
def predict():
    # request.key_info contains validation result
    rate_limit = request.key_info["rate_limit_per_hour"]
    # ... handle prediction
```

### JavaScript / Node.js Integration

```javascript
const AUTH_SERVICE_URL = "https://auth.hokus.ai";

async function validateApiKey(req) {
  const apiKey =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.headers["x-api-key"];

  if (!apiKey) {
    throw new Error("API key required");
  }

  const response = await fetch(`${AUTH_SERVICE_URL}/api/v1/keys/validate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: "prediction",
      client_ip: req.ip,
    }),
  });

  const result = await response.json();
  if (!result.is_valid) {
    throw new Error(result.error || "Invalid API key");
  }

  return result;
}
```

## Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Key is valid |
| `400` | No API key provided in request |
| `401` | Key is invalid, expired, revoked, or fails scope/IP checks |
| `500` | Internal server error |

---

## JWT Token Validation

**`POST /api/v1/tokens/validate`**

Downstream services (e.g., the Contract Deployer API) use this endpoint to verify JWT tokens issued by the auth service via SIWE authentication.

:::info
This endpoint is **public** — it does not require an admin token.
:::

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | The JWT token to validate |
| `service` | string | No | Verify the token grants access to this service |

### Example

```bash
curl -X POST https://auth.hokus.ai/api/v1/tokens/validate \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJhbGciOiJIUzI1NiIs...", "service": "prediction"}'
```

### Response

```json
{
  "valid": true,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "permissions": ["predict", "read"]
}
```

A failed validation returns `401` with:

```json
{
  "valid": false,
  "error": "Token expired"
}
```

---

## Sign-In with Ethereum (SIWE)

SIWE allows users to authenticate using an Ethereum wallet. The flow issues a JWT token that can be used with protected endpoints including organization management.

### Step 1: Request a Challenge

**`POST /auth/siwe/challenge`**

```bash
curl -X POST https://auth.hokus.ai/auth/siwe/challenge \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"}'
```

Returns a message to sign and a nonce:

```json
{
  "message": "auth.hokus.ai wants you to sign in with your Ethereum account:\n0x742d35Cc...\n\nSign in to Hokusai\n\nNonce: abc123...",
  "nonce": "abc123..."
}
```

### Step 2: Sign and Verify

Sign the message with your wallet, then submit the signature:

**`POST /auth/siwe/verify`**

```bash
curl -X POST https://auth.hokus.ai/auth/siwe/verify \
  -H "Content-Type: application/json" \
  -d '{
    "message": "auth.hokus.ai wants you to sign in with...",
    "signature": "0x..."
  }'
```

Returns a JWT access token:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "is_new_user": false
}
```

:::tip
If the wallet address is not yet registered, a new user account is created automatically. Set `is_new_user` in the response to detect first-time logins.
:::

### SIWE Flow Diagram

```mermaid
sequenceDiagram
    participant W as Wallet/dApp
    participant A as Auth Service
    participant R as Redis

    W->>A: POST /auth/siwe/challenge
    A->>R: Store nonce (5 min TTL)
    A-->>W: Challenge message + nonce
    W->>W: User signs message
    W->>A: POST /auth/siwe/verify
    A->>R: Verify & consume nonce
    A->>A: Recover address from signature
    A->>A: Create/lookup user
    A-->>W: JWT access token
```

## Next Steps

- **[Usage & Billing](/authentication/usage-billing)** — Track API usage per key
- **[Security](/authentication/security)** — IP allowlisting, security headers, and scope management
- **[Troubleshooting](/authentication/troubleshooting)** — Debug validation failures
