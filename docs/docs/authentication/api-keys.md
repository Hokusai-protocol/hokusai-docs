---
id: api-keys
title: API Key Management
sidebar_label: API Keys
sidebar_position: 3
---

# API Key Management

This page covers the full API key lifecycle: creating, listing, retrieving, rotating, and revoking keys.

:::info
All key management endpoints require an admin token via the `Authorization: Bearer {ADMIN_TOKEN}` header.
:::

## Create a Key

**`POST /api/v1/keys`**

Creates a new API key and returns the full key value. The key is only shown once — store it securely.

### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | — | Human-readable name (1–100 characters) |
| `service_id` | string | Yes | — | Target service: `prediction` or `platform` |
| `scopes` | string[] | No | `[]` | Permission scopes (e.g., `["predict", "read"]`) |
| `environment` | string | No | `production` | `production`, `test`, or `development` |
| `expires_in_days` | integer | No | `null` | Auto-expire after N days (1–365) |
| `rate_limit_per_hour` | integer | No | `1000` | Max requests per hour (10–100,000) |
| `monthly_prediction_limit` | integer | No | `null` | Max predictions per billing month |
| `allowed_ips` | string[] | No | `null` | IP allowlist (empty means all IPs allowed) |
| `billing_plan` | string | No | `free` | Billing plan identifier |

### Examples

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Prediction Key",
    "service_id": "prediction",
    "scopes": ["predict"],
    "environment": "production",
    "rate_limit_per_hour": 5000,
    "expires_in_days": 90,
    "allowed_ips": ["203.0.113.0/24"]
  }'
```

```python
import requests

response = requests.post(
    "https://auth.hokus.ai/api/v1/keys",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
    json={
        "name": "Production Prediction Key",
        "service_id": "prediction",
        "scopes": ["predict"],
        "environment": "production",
        "rate_limit_per_hour": 5000,
        "expires_in_days": 90,
        "allowed_ips": ["203.0.113.0/24"],
    },
)
data = response.json()
print(f"Key: {data['api_key']}")  # Save this immediately
print(f"Key ID: {data['key_info']['key_id']}")
```

```javascript
const response = await fetch("https://auth.hokus.ai/api/v1/keys", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Production Prediction Key",
    service_id: "prediction",
    scopes: ["predict"],
    environment: "production",
    rate_limit_per_hour: 5000,
  }),
});
const data = await response.json();
console.log(`Key: ${data.api_key}`);
```

```go
payload := map[string]interface{}{
    "name":                "Production Prediction Key",
    "service_id":          "prediction",
    "scopes":              []string{"predict"},
    "environment":         "production",
    "rate_limit_per_hour": 5000,
}
body, _ := json.Marshal(payload)

req, _ := http.NewRequest("POST", "https://auth.hokus.ai/api/v1/keys", bytes.NewBuffer(body))
req.Header.Set("Authorization", "Bearer "+adminToken)
req.Header.Set("Content-Type", "application/json")

resp, err := http.DefaultClient.Do(req)
```

### Response

```json
{
  "api_key": "hk_live_AbCdEfGhIjKlMnOpQrStUvWxYz123456",
  "key_info": {
    "key_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Production Prediction Key",
    "key_prefix": "hk_live_AbC***",
    "user_id": "admin",
    "service_id": "prediction",
    "scopes": ["predict"],
    "environment": "production",
    "is_active": true,
    "rate_limit_per_hour": 5000,
    "monthly_prediction_limit": null,
    "billing_plan": "free",
    "created_at": "2025-01-15T10:30:00Z",
    "expires_at": "2025-04-15T10:30:00Z",
    "last_used_at": null
  }
}
```

---

## List Keys

**`GET /api/v1/keys`**

Returns all API keys for the authenticated user.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `service_id` | string | — | Filter by service |
| `active_only` | boolean | `false` | Only return active, non-expired keys |

### Examples

```bash
# List all keys
curl https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# List active prediction keys only
curl "https://auth.hokus.ai/api/v1/keys?service_id=prediction&active_only=true" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

```python
response = requests.get(
    "https://auth.hokus.ai/api/v1/keys",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
    params={"service_id": "prediction", "active_only": True},
)
keys = response.json()
for key in keys:
    print(f"{key['name']}: {key['key_prefix']} (active={key['is_active']})")
```

### Response

Returns an array of `APIKeyInfo` objects (without the full key value):

```json
[
  {
    "key_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Production Prediction Key",
    "key_prefix": "hk_live_AbC***",
    "user_id": "admin",
    "service_id": "prediction",
    "scopes": ["predict"],
    "environment": "production",
    "is_active": true,
    "rate_limit_per_hour": 5000,
    "monthly_prediction_limit": null,
    "billing_plan": "free",
    "created_at": "2025-01-15T10:30:00Z",
    "expires_at": "2025-04-15T10:30:00Z",
    "last_used_at": "2025-01-20T14:22:00Z"
  }
]
```

---

## Get a Key

**`GET /api/v1/keys/{key_id}`**

Retrieve details for a specific API key by its UUID.

```bash
curl https://auth.hokus.ai/api/v1/keys/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

```python
key_id = "550e8400-e29b-41d4-a716-446655440000"
response = requests.get(
    f"https://auth.hokus.ai/api/v1/keys/{key_id}",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
)
key = response.json()
```

Returns a single `APIKeyInfo` object.

---

## Rotate a Key

**`POST /api/v1/keys/{key_id}/rotate`**

Revokes the existing key and creates a new one with the same configuration (service, scopes, rate limits, etc.). The new key gets a fresh value and key ID.

:::tip
Key rotation is a best practice for production systems. Rotate keys regularly and after any suspected compromise. See [Security Best Practices](/authentication/security) for recommended rotation schedules.
:::

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys/550e8400-e29b-41d4-a716-446655440000/rotate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

```python
key_id = "550e8400-e29b-41d4-a716-446655440000"
response = requests.post(
    f"https://auth.hokus.ai/api/v1/keys/{key_id}/rotate",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
)
new_key = response.json()
print(f"New key: {new_key['api_key']}")  # Save immediately
print(f"New key ID: {new_key['key_info']['key_id']}")
```

Returns an `APIKeyResponse` with the new full key value. The old key is immediately deactivated.

---

## Revoke a Key

**`DELETE /api/v1/keys/{key_id}`**

Permanently deactivates an API key. Any subsequent validation attempts with this key will fail.

:::danger
Key revocation is immediate and irreversible. All applications using this key will lose access.
:::

```bash
curl -X DELETE https://auth.hokus.ai/api/v1/keys/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

```python
key_id = "550e8400-e29b-41d4-a716-446655440000"
response = requests.delete(
    f"https://auth.hokus.ai/api/v1/keys/{key_id}",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
)
print(response.json())  # {"message": "API key revoked successfully"}
```

### Response

```json
{
  "message": "API key revoked successfully"
}
```

---

## Error Responses

All key management endpoints return standard error responses:

| Status | Meaning |
|--------|---------|
| `400` | Invalid request body or parameters |
| `401` | Missing or invalid admin token |
| `404` | Key not found |
| `500` | Internal server error |

Error response format:

```json
{
  "detail": "API key not found"
}
```

---

## Organization-Scoped Keys

If you belong to an organization, you can create API keys scoped to that organization. Organization keys are visible to all org members and are managed via RBAC roles.

### Create an Organization Key

**`POST /api/v1/organizations/{org_id}/api-keys`**

Requires JWT authentication and at least the **Developer** role within the organization.

```bash
curl -X POST https://auth.hokus.ai/api/v1/organizations/$ORG_ID/api-keys \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Prediction Key",
    "service_id": "prediction",
    "scopes": ["predict"],
    "environment": "production"
  }'
```

### List Organization Keys

**`GET /api/v1/organizations/{org_id}/api-keys`**

Any organization member can list the org's API keys.

### Revoke an Organization Key

**`DELETE /api/v1/organizations/{org_id}/api-keys/{key_id}`**

Requires at least the **Developer** role.

### RBAC Roles

| Role | Create Keys | List Keys | Revoke Keys |
|------|:-----------:|:---------:|:-----------:|
| Owner | Yes | Yes | Yes |
| Admin | Yes | Yes | Yes |
| Developer | Yes | Yes | Own keys |
| Viewer | No | Yes | No |

## Next Steps

- **[Validation](/authentication/validation)** — How services validate API keys and JWT tokens
- **[Usage & Billing](/authentication/usage-billing)** — Track key usage and costs
- **[Security](/authentication/security)** — Key management best practices
- **[Troubleshooting](/authentication/troubleshooting)** — Common errors and fixes
