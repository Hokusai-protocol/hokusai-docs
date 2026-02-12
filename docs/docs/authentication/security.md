---
id: security
title: Security Best Practices
sidebar_label: Security
sidebar_position: 6
---

# Security Best Practices

This guide covers security practices for working with the Hokusai authentication service, including key management, access control, and environment separation.

## Key Storage

### Never Hardcode Keys

Store API keys in environment variables or a secrets manager — never in source code, config files checked into version control, or client-side code.

```bash
# .env file (add to .gitignore)
HOKUSAI_API_KEY=hk_live_AbCdEfGhIjKlMnOpQrStUvWxYz123456
HOKUSAI_ADMIN_TOKEN=your_admin_token
```

```python
import os

api_key = os.environ["HOKUSAI_API_KEY"]
```

:::danger
Never commit API keys to version control. If a key is accidentally committed, rotate it immediately using the [rotation endpoint](/authentication/api-keys#rotate-a-key).
:::

### Use a Secrets Manager

For production deployments, use a dedicated secrets manager:

- **AWS Secrets Manager** or **AWS SSM Parameter Store**
- **HashiCorp Vault**
- **Google Secret Manager**
- **Azure Key Vault**

```python
import boto3

def get_api_key():
    client = boto3.client("secretsmanager", region_name="us-east-1")
    response = client.get_secret_value(SecretId="hokusai/api-key")
    return response["SecretString"]
```

## BCrypt Hashing

The auth service hashes all API keys with BCrypt before storage. Key security details:

| Setting | Value | Description |
|---------|-------|-------------|
| Algorithm | BCrypt | Industry-standard password hashing |
| Rounds | 12 (default) | Configurable via `BCRYPT_ROUNDS` env var |
| Storage | Hash only | Full key is never stored — shown once at creation |
| Prefix | Stored as `key_prefix` | Masked version for identification (e.g., `hk_live_AbC***`) |

This means that even if the database is compromised, API keys cannot be recovered from the stored hashes.

## Key Rotation

Regular key rotation limits the impact of a compromised key.

### Recommended Rotation Schedule

| Environment | Rotation Frequency | Rationale |
|-------------|-------------------|-----------|
| Production | Every 90 days | Balance security with operational overhead |
| Test | Every 180 days | Lower risk, less frequent rotation |
| Development | As needed | Rotate when team members change |
| After incident | Immediately | Any suspected compromise |

### Rotation Procedure

1. Create a new key or use the [rotate endpoint](/authentication/api-keys#rotate-a-key)
2. Update all services with the new key
3. Verify all services are using the new key
4. The old key is automatically revoked during rotation

```bash
# Rotate a key (old key is immediately revoked)
curl -X POST https://auth.hokus.ai/api/v1/keys/$KEY_ID/rotate \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

:::warning
Key rotation is atomic but immediate — the old key stops working the moment the rotation endpoint returns. Plan for a brief deployment window to update all consumers.
:::

## IP Allowlisting

Restrict API key usage to specific IP addresses or CIDR ranges:

```bash
curl -X POST https://auth.hokus.ai/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restricted Production Key",
    "service_id": "prediction",
    "environment": "production",
    "allowed_ips": [
      "203.0.113.10",
      "203.0.113.0/24",
      "198.51.100.0/24"
    ]
  }'
```

When `allowed_ips` is set, the validation endpoint checks the requesting IP against the allowlist. Requests from non-allowed IPs are rejected with a `401` status.

:::tip
Use IP allowlisting for server-to-server integrations where the source IPs are known and stable. For dynamic environments (e.g., serverless functions), rely on scopes and rate limits instead.
:::

## Scope Management

Use scopes to implement the principle of least privilege:

```json
{
  "name": "Read-Only Analytics Key",
  "service_id": "platform",
  "scopes": ["read"],
  "environment": "production"
}
```

```json
{
  "name": "Prediction-Only Key",
  "service_id": "prediction",
  "scopes": ["predict"],
  "environment": "production"
}
```

Create separate keys for different operations rather than using a single key with broad access.

## Environment Separation

The auth service enforces environment separation through key prefixes:

| Environment | Prefix | Usage |
|-------------|--------|-------|
| Production | `hk_live_` | Real traffic, real billing, real data |
| Test | `hk_test_` | Staging and integration testing |
| Development | `hk_dev_` | Local development and debugging |

### Best Practices

- **Never use production keys in test/dev environments** — The prefix makes accidental cross-usage visually obvious
- **Use separate admin tokens per environment** — Different `ADMIN_TOKEN` values for prod vs. staging
- **Monitor for prefix mismatches** — Alert if a `hk_test_` key appears in production logs

## Admin Token Security

The admin token controls all key management operations. Protect it carefully:

1. **Restrict access** — Only platform administrators should have the admin token
2. **Rotate regularly** — Change the `ADMIN_TOKEN` environment variable periodically
3. **Use different tokens per environment** — Separate admin tokens for production, staging, and development
4. **Audit usage** — Monitor admin endpoint access in your logs

## Rate Limiting

Configure rate limits appropriate to each key's use case:

| Use Case | Recommended Limit | Rationale |
|----------|-------------------|-----------|
| Interactive web app | 100–1,000/hour | Matches human interaction patterns |
| Batch processing | 5,000–50,000/hour | Higher throughput for automated workflows |
| Internal service | 10,000–100,000/hour | Service-to-service communication |
| Development | 100/hour | Prevents runaway scripts |

```json
{
  "name": "Batch Processing Key",
  "service_id": "prediction",
  "rate_limit_per_hour": 10000,
  "monthly_prediction_limit": 500000
}
```

## Security Headers

The auth service applies security headers to all responses:

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | Restrictive policy | Prevents XSS and injection attacks |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `Strict-Transport-Security` | `max-age=31536000` | Enforces HTTPS |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |

These headers are set automatically — no configuration is needed.

## Registration Protections

The registration system includes multiple layers of protection:

- **reCAPTCHA verification** — Prevents automated bot registrations
- **Rate limiting** — Per-IP, per-domain, and global limits with automatic temporary bans
- **Fraud detection** — Automated screening for disposable emails, suspicious patterns, IP/domain velocity
- **Admin review** — All registrations require manual approval before API access is granted

For details, see [Registration](/authentication/registration).

## Security Checklist

Use this checklist when deploying a Hokusai integration:

- [ ] API keys stored in environment variables or secrets manager
- [ ] No keys in source code or version control
- [ ] Production keys use `hk_live_` prefix
- [ ] IP allowlisting configured for server-to-server keys
- [ ] Scopes set to minimum required permissions
- [ ] Rate limits configured per key
- [ ] Key rotation schedule established
- [ ] Admin token access restricted to administrators
- [ ] Separate admin tokens per environment
- [ ] Monitoring and alerting on auth failures
- [ ] Organization RBAC roles follow least-privilege principle
- [ ] SIWE nonce expiry configured appropriately (default: 5 minutes)

## Next Steps

- **[Troubleshooting](/authentication/troubleshooting)** — Debug authentication issues
- **[API Keys](/authentication/api-keys)** — Key management endpoints
- **[Validation](/authentication/validation)** — How key and token validation works
