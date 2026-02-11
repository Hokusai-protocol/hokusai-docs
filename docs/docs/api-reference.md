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

The authentication service manages API keys, validation, and usage tracking for the entire Hokusai platform.

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

### Usage & Billing

| Method | Endpoint | Auth Required | Description | Docs |
|--------|----------|---------------|-------------|------|
| `POST` | `/api/v1/usage/{key_id}` | No (internal) | Record API usage | [Usage & Billing](/authentication/usage-billing#record-usage) |
| `GET` | `/api/v1/usage/{key_id}/stats` | Admin | Get usage statistics | [Usage & Billing](/authentication/usage-billing#get-usage-statistics) |
| `GET` | `/api/v1/usage/{key_id}/billing` | Admin | Get billing information | [Usage & Billing](/authentication/usage-billing#get-billing-info) |
| `GET` | `/api/v1/usage/aggregate` | Admin | Aggregate usage across all keys | [Usage & Billing](/authentication/usage-billing#aggregate-usage) |

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
| `POST` | `/v1/models/{model_id}/whitelist` | Request whitelist access (Co-Op models) |

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
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service unavailable (dependency down) |

## Authentication

All Hokusai APIs authenticate using API keys. See the [Authentication Overview](/authentication/overview) for details on:

- [Creating API keys](/authentication/api-keys)
- [Three ways to send keys](/authentication/validation)
- [Environment prefixes](/authentication/overview#environments) (`hk_live_`, `hk_test_`, `hk_dev_`)
- [Security best practices](/authentication/security)
