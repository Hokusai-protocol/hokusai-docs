---
id: troubleshooting
title: Authentication Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 7
---

# Authentication Troubleshooting

Common authentication errors and how to resolve them.

## Common Errors

### 401 Unauthorized — Invalid API Key

**Symptom**: Validation returns `{"is_valid": false, "error": "Invalid API key"}`

**Possible causes**:
1. **Typo in the key** — Copy the full key exactly as provided at creation. Keys are case-sensitive.
2. **Key was revoked** — Check if the key was revoked or rotated. List your keys to confirm:
   ```bash
   curl https://auth.hokus.ai/api/v1/keys?active_only=true \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```
3. **Wrong environment** — A `hk_test_` key won't work in production and vice versa.
4. **Key not yet propagated** — If you just created the key, wait a few seconds for database replication.

### 401 Unauthorized — Key Expired

**Symptom**: `{"is_valid": false, "error": "API key has expired"}`

**Resolution**: Create a new key or rotate the expired one:

```bash
# Check when the key expires
curl https://auth.hokus.ai/api/v1/keys/$KEY_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Rotate to get a new key with fresh expiration
curl -X POST https://auth.hokus.ai/api/v1/keys/$KEY_ID/rotate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

:::tip
Set calendar reminders before key expiration dates. Use the `expires_at` field from the key info response to track this.
:::

### 401 Unauthorized — Service Mismatch

**Symptom**: `{"is_valid": false, "error": "Key not authorized for this service"}`

**Cause**: The key was created for a different service than the one being accessed. For example, a key created with `"service_id": "platform"` cannot be used to access the prediction API.

**Resolution**: Create a new key for the correct service:

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Prediction Key", "service_id": "prediction"}'
```

### 401 Unauthorized — IP Not Allowed

**Symptom**: `{"is_valid": false, "error": "IP address not in allowlist"}`

**Cause**: The key has IP restrictions and the request is coming from an IP not in the allowlist.

**Resolution**: Check the key's allowed IPs and update if needed. You may need to create a new key with the correct IP allowlist, or remove IP restrictions:

```bash
# Check key details to see current allowed_ips
curl https://auth.hokus.ai/api/v1/keys/$KEY_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 401 Unauthorized — Insufficient Scope

**Symptom**: `{"is_valid": false, "error": "Key does not have required scope"}`

**Cause**: The key lacks the scope required by the endpoint. For example, a key with `scopes: ["read"]` trying to access a `predict` endpoint.

**Resolution**: Create a new key with the necessary scopes:

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Full Access Key", "service_id": "prediction", "scopes": ["predict", "read"]}'
```

### 400 Bad Request — No API Key Provided

**Symptom**: `{"detail": "No API key provided"}`

**Cause**: The validation endpoint was called without an API key in any of the three accepted locations.

**Resolution**: Send the key via one of the accepted methods:

```bash
# Option 1: Authorization header (recommended)
curl -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "Authorization: Bearer YOUR_API_KEY"

# Option 2: X-API-Key header
curl -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "X-API-Key: YOUR_API_KEY"

# Option 3: Request body
curl -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "Content-Type: application/json" \
  -d '{"api_key": "YOUR_API_KEY"}'
```

### 401 Unauthorized — Invalid Admin Token

**Symptom**: `{"detail": "Not authenticated"}` or `{"detail": "Invalid authentication credentials"}`

**Cause**: The admin token is missing or incorrect for a key management endpoint.

**Resolution**: Verify your admin token matches the `ADMIN_TOKEN` environment variable on the auth service:

```bash
# Test admin access
curl https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 404 Not Found — Key Not Found

**Symptom**: `{"detail": "API key not found"}`

**Cause**: The `key_id` UUID does not match any key in the database.

**Resolution**: List your keys to find the correct ID:

```bash
curl https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 503 Service Unavailable

**Symptom**: `{"status": "not ready", "checks": {"database": false}}`

**Cause**: The auth service cannot reach its database or Redis dependency.

**Resolution**: This is a server-side issue. Check:
- Database connectivity and health
- Redis connectivity
- Network configuration between services
- Service deployment status

## Debugging Tips

### Verify Key Format

Valid keys follow the pattern `hk_{env}_{32 random chars}`:

```
hk_live_AbCdEfGhIjKlMnOpQrStUvWxYz123456   ✅ Production
hk_test_AbCdEfGhIjKlMnOpQrStUvWxYz123456   ✅ Test
hk_dev_AbCdEfGhIjKlMnOpQrStUvWxYz123456    ✅ Development
hk_AbCdEfGhIjKlMnOpQrStUvWxYz123456        ❌ Missing environment
AbCdEfGhIjKlMnOpQrStUvWxYz123456           ❌ Missing prefix
```

### Check Service Health

Before debugging key issues, verify the auth service is running:

```bash
# Health check
curl https://auth.hokus.ai/health

# Readiness check (includes database and Redis status)
curl https://auth.hokus.ai/ready
```

### Test Validation Directly

Isolate authentication issues by calling the validation endpoint directly:

```bash
curl -v -X POST https://auth.hokus.ai/api/v1/keys/validate \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"service_id": "prediction"}'
```

The `-v` flag shows response headers, which can help identify whether the issue is in the auth service or your application.

### Check Key Status

Retrieve full key details to check its state:

```bash
curl https://auth.hokus.ai/api/v1/keys/$KEY_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '{
    is_active,
    environment,
    service_id,
    scopes,
    expires_at,
    last_used_at
  }'
```

### Redis Cache Issues

If a key was recently revoked but still validates:
- Wait up to 5 minutes for the cache to expire (default `CACHE_TTL=300`)
- The revocation endpoint should invalidate the cache, but verify Redis connectivity

## Next Steps

- **[Overview](/authentication/overview)** — Architecture and key concepts
- **[API Keys](/authentication/api-keys)** — Key management operations
- **[Validation](/authentication/validation)** — Validation flow details
- **[Security](/authentication/security)** — Prevent common security issues
