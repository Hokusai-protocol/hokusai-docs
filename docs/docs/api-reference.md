---
id: api-reference
title: API Reference
sidebar_label: API Reference
sidebar_position: 1
---

# API Reference

This page lists all API endpoints across the Hokusai platform. For detailed request/response schemas and code examples, follow the links to the dedicated documentation pages.

## Authentication Service

Base URL: `https://auth.hokus.ai`

The authentication service manages registration, authentication, API keys, organizations, and usage tracking for the entire Hokusai platform.

### Registration

| Method | Endpoint | Auth Required | Description | Docs |
|--------|----------|---------------|-------------|------|
| `GET` | `/register` | No | Registration web form | [Registration](/authentication/registration) |
| `POST` | `/register` | No | Submit a registration request | [Registration](/authentication/registration#submit-a-registration) |
| `POST` | `/registration/status` | No | Check registration status by email | [Registration](/authentication/registration#check-registration-status) |
| `GET` | `/register/rate-limit-status` | No | Check rate limit before submitting | [Registration](/authentication/registration#rate-limiting) |

### Sign-In with Ethereum (SIWE)

| Method | Endpoint | Auth Required | Description | Docs |
|--------|----------|---------------|-------------|------|
| `POST` | `/auth/siwe/challenge` | No | Generate a wallet authentication challenge | [SIWE](/authentication/validation#sign-in-with-ethereum-siwe) |
| `POST` | `/auth/siwe/verify` | No | Verify a signed message and get JWT | [SIWE](/authentication/validation#sign-in-with-ethereum-siwe) |

### Key Management

All key management endpoints require admin authentication via `Authorization: Bearer {ADMIN_TOKEN}`.

| Method | Endpoint | Description | Docs |
|--------|----------|-------------|------|
| `POST` | `/api/v1/keys` | Create a new API key | [API Keys](/authentication/api-keys#create-a-key) |
| `GET` | `/api/v1/keys` | List all API keys | [API Keys](/authentication/api-keys#list-keys) |
| `GET` | `/api/v1/keys/{key_id}` | Get details for a specific key | [API Keys](/authentication/api-keys#get-a-key) |
| `POST` | `/api/v1/keys/{key_id}/rotate` | Rotate a key (revoke old, create new) | [API Keys](/authentication/api-keys#rotate-a-key) |
| `DELETE` | `/api/v1/keys/{key_id}` | Revoke an API key | [API Keys](/authentication/api-keys#revoke-a-key) |

### Validation

| Method | Endpoint | Auth Required | Description | Docs |
|--------|----------|---------------|-------------|------|
| `POST` | `/api/v1/keys/validate` | No (public) | Validate an API key | [Validation](/authentication/validation) |
| `POST` | `/api/v1/tokens/validate` | No (public) | Validate a JWT token | [Validation](/authentication/validation#jwt-token-validation) |

### Organizations

Organization endpoints require JWT authentication. Required roles are noted per endpoint.

| Method | Endpoint | Min Role | Description | Docs |
|--------|----------|----------|-------------|------|
| `POST` | `/api/v1/organizations` | Authenticated | Create an organization | [API Keys](/authentication/api-keys#organization-scoped-keys) |
| `GET` | `/api/v1/organizations/{org_id}` | Viewer | Get organization details | — |
| `PATCH` | `/api/v1/organizations/{org_id}` | Admin | Update organization | — |
| `DELETE` | `/api/v1/organizations/{org_id}` | Owner | Delete organization | — |
| `GET` | `/api/v1/organizations/{org_id}/members` | Viewer | List members | — |
| `PATCH` | `/api/v1/organizations/{org_id}/members/{user_id}` | Admin | Update member role | — |
| `DELETE` | `/api/v1/organizations/{org_id}/members/{user_id}` | Admin | Remove member | — |
| `POST` | `/api/v1/organizations/{org_id}/invitations` | Admin | Send invitation | — |
| `GET` | `/api/v1/organizations/{org_id}/invitations` | Admin | List pending invitations | — |
| `DELETE` | `/api/v1/organizations/{org_id}/invitations/{id}` | Admin | Revoke invitation | — |
| `POST` | `/api/v1/invitations/accept` | Authenticated | Accept an invitation | — |
| `POST` | `/api/v1/organizations/{org_id}/api-keys` | Developer | Create org API key | [API Keys](/authentication/api-keys#organization-scoped-keys) |
| `GET` | `/api/v1/organizations/{org_id}/api-keys` | Viewer | List org API keys | [API Keys](/authentication/api-keys#organization-scoped-keys) |
| `DELETE` | `/api/v1/organizations/{org_id}/api-keys/{key_id}` | Developer | Revoke org API key | [API Keys](/authentication/api-keys#organization-scoped-keys) |
| `GET` | `/api/v1/organizations/{org_id}/audit-logs` | Admin | List audit logs | — |

### Usage & Billing

| Method | Endpoint | Auth Required | Description | Docs |
|--------|----------|---------------|-------------|------|
| `POST` | `/api/v1/usage/{key_id}` | No (internal) | Record API usage | [Usage & Billing](/authentication/usage-billing#record-usage) |
| `GET` | `/api/v1/usage/{key_id}/stats` | Admin | Get usage statistics | [Usage & Billing](/authentication/usage-billing#get-usage-statistics) |
| `GET` | `/api/v1/usage/{key_id}/billing` | Admin | Get billing information | [Usage & Billing](/authentication/usage-billing#get-billing-info) |
| `GET` | `/api/v1/usage/aggregate` | Admin | Aggregate usage across all keys | [Usage & Billing](/authentication/usage-billing#aggregate-usage) |

### Admin — Registration Management

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/v1/admin/registrations` | Admin | List registration requests (paginated, filterable) |
| `GET` | `/api/v1/admin/registrations/{id}` | Admin | Get registration details |
| `PATCH` | `/api/v1/admin/registrations/{id}` | Admin | Approve or reject a registration |
| `GET` | `/api/v1/admin/registration/whitelist` | Admin | List rate-limit whitelist entries |
| `POST` | `/api/v1/admin/registration/whitelist` | Admin | Add whitelist entry (IP or domain) |
| `PATCH` | `/api/v1/admin/registration/whitelist/{id}` | Admin | Enable/disable whitelist entry |
| `DELETE` | `/api/v1/admin/registration/whitelist/{id}` | Admin | Delete whitelist entry |
| `GET` | `/api/v1/admin/registration/bans/{ip}` | Admin | Check ban status for an IP |
| `DELETE` | `/api/v1/admin/registration/bans/{ip}` | Admin | Remove temporary IP ban |

### Health & Monitoring

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/health` | No | Service health check |
| `GET` | `/ready` | No | Readiness check (database + Redis) |
| `GET` | `/metrics` | No | Service metrics summary |

## Model API

Base URL: `https://api.hokus.ai`

The Model API provides access to Hokusai's AI models for predictions and management. All endpoints require a valid API key.

For detailed Model API documentation, see the [Model API Guide](/model-api-guide).

### Models

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/models` | List available models |
| `GET` | `/v1/models/{model_id}` | Get model details |

### Predictions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/predict` | Single prediction |
| `POST` | `/v1/batch-predict` | Batch prediction |

### License Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/models/{model_id}/license` | Check license status |

### Benchmark Datasets

All benchmark dataset endpoints require a valid API key. See [Uploading Datasets via API](/supplying-data#uploading-a-dataset-file-directly) for a full walkthrough.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/benchmarks/upload/{model_id}` | Upload a CSV or Parquet benchmark dataset (multipart, ≤ 500 MB); creates a `BenchmarkSpec` record |
| `GET` | `/api/v1/dataset-arrivals` | List recent S3 dataset arrivals; optional `?model_id=&limit=` query params |

### Evaluation Schedules

All evaluation schedule endpoints require a valid API key. A `BenchmarkSpec` must exist for the model before a schedule can be created. See [Automating Evaluations with Schedules](/supplying-data#automating-evaluations-with-schedules).

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/v1/models/{model_id}/evaluation-schedule` | 201 | Create an evaluation schedule; 409 if one already exists |
| `GET` | `/api/v1/models/{model_id}/evaluation-schedule` | 200 | Retrieve the current schedule |
| `PUT` | `/api/v1/models/{model_id}/evaluation-schedule` | 200 | Update the `cron_expression` or `enabled` flag |
| `DELETE` | `/api/v1/models/{model_id}/evaluation-schedule` | 204 | Remove the schedule |

## Common Response Formats

### Success Response

```json
{
  "data": { ... },
  "status": "success"
}
```

### Error Response

```json
{
  "detail": "Human-readable error message"
}
```

### Standard HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Request succeeded |
| `400` | Invalid request parameters |
| `401` | Missing or invalid authentication |
| `403` | Valid auth but insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate evaluation schedule) |
| `413` | Payload too large (file exceeds size limit) |
| `422` | Validation failed (schema, PII, or column errors) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service unavailable (dependency down) |

## Authentication

All Hokusai APIs authenticate using API keys. See the [Authentication Overview](/authentication/overview) for details on:

- [Creating API keys](/authentication/api-keys)
- [Three ways to send keys](/authentication/validation)
- [Environment prefixes](/authentication/overview#environments) (`hk_live_`, `hk_test_`, `hk_dev_`)
- [Security best practices](/authentication/security)
