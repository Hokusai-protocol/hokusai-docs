---
id: usage-billing
title: Usage & Billing
sidebar_label: Usage & Billing
sidebar_position: 5
---

# Usage & Billing

The auth service tracks API usage per key and provides billing information based on consumption. This page covers usage recording, statistics retrieval, billing queries, and aggregate reporting.

## Record Usage

**`POST /api/v1/usage/{key_id}`**

Internal endpoint used by Hokusai services to report API usage after handling a request. This endpoint does not require admin authentication — it is designed for service-to-service calls.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `service_id` | string | Yes | Which service handled the request |
| `endpoint` | string | Yes | The endpoint that was called (e.g., `/predict`) |
| `status_code` | integer | Yes | HTTP status code of the response |
| `response_time_ms` | integer | Yes | Response time in milliseconds |
| `predictions_count` | integer | No | Number of predictions made (default: `0`) |
| `compute_ms` | integer | No | Compute time in milliseconds (default: `0`) |

### Example

```bash
curl -X POST https://auth.hokus.ai/api/v1/usage/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": "prediction",
    "endpoint": "/predict",
    "status_code": 200,
    "response_time_ms": 145,
    "predictions_count": 5,
    "compute_ms": 120
  }'
```

```python
import requests

key_id = "550e8400-e29b-41d4-a716-446655440000"
requests.post(
    f"https://auth.hokus.ai/api/v1/usage/{key_id}",
    json={
        "service_id": "prediction",
        "endpoint": "/predict",
        "status_code": 200,
        "response_time_ms": 145,
        "predictions_count": 5,
        "compute_ms": 120,
    },
)
```

### Response

```json
{
  "message": "Usage recorded successfully"
}
```

---

## Get Usage Statistics

**`GET /api/v1/usage/{key_id}/stats`**

Returns usage statistics for a specific API key over a given billing period.

:::info
Requires admin authentication via `Authorization: Bearer {ADMIN_TOKEN}`.
:::

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | Current month | Billing period in `YYYY-MM` format (e.g., `2025-01`) |

### Example

```bash
curl "https://auth.hokus.ai/api/v1/usage/550e8400-e29b-41d4-a716-446655440000/stats?period=2025-01" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

```python
key_id = "550e8400-e29b-41d4-a716-446655440000"
response = requests.get(
    f"https://auth.hokus.ai/api/v1/usage/{key_id}/stats",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
    params={"period": "2025-01"},
)
stats = response.json()
print(f"Total requests: {stats['total_requests']}")
print(f"Error rate: {stats['error_rate']:.1%}")
```

### Response

```json
{
  "key_id": "550e8400-e29b-41d4-a716-446655440000",
  "period": "2025-01",
  "total_requests": 15230,
  "total_predictions": 8450,
  "total_compute_ms": 1234567,
  "average_response_time_ms": 82.3,
  "error_rate": 0.023,
  "top_endpoints": [
    {"endpoint": "/predict", "count": 12500},
    {"endpoint": "/models", "count": 2730}
  ]
}
```

---

## Get Billing Info

**`GET /api/v1/usage/{key_id}/billing`**

Returns billing information for a specific API key, including current usage against limits and any overage charges.

### Example

```bash
curl https://auth.hokus.ai/api/v1/usage/550e8400-e29b-41d4-a716-446655440000/billing \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

```python
key_id = "550e8400-e29b-41d4-a716-446655440000"
response = requests.get(
    f"https://auth.hokus.ai/api/v1/usage/{key_id}/billing",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
)
billing = response.json()
print(f"Plan: {billing['billing_plan']}")
print(f"Predictions used: {billing['current_usage']['predictions']}")
print(f"Overage charges: ${billing['overage_charges']:.2f}")
```

### Response

```json
{
  "key_id": "550e8400-e29b-41d4-a716-446655440000",
  "billing_plan": "free",
  "current_usage": {
    "requests": 15230,
    "predictions": 8450,
    "compute_ms": 1234567
  },
  "monthly_limit": 10000,
  "overage_charges": 0.0,
  "next_billing_date": "2025-02-01T00:00:00Z"
}
```

### Pricing Model

| Metric | Free Plan | Details |
|--------|-----------|---------|
| Included predictions | Based on `monthly_prediction_limit` | Set at key creation |
| Overage rate | $0.001 per prediction | Charged for predictions over the monthly limit |
| Billing cycle | Monthly | Resets on the 1st of each month |
| Compute time | Tracked | Available in usage stats for cost analysis |

---

## Aggregate Usage

**`GET /api/v1/usage/aggregate`**

Returns usage data aggregated across all keys, broken down by date and service. Useful for platform-wide monitoring and capacity planning.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `service_id` | string | — | Filter by service |
| `start_date` | ISO 8601 datetime | 30 days ago | Start of the reporting window |
| `end_date` | ISO 8601 datetime | Now | End of the reporting window |

### Example

```bash
curl "https://auth.hokus.ai/api/v1/usage/aggregate?service_id=prediction&start_date=2025-01-01T00:00:00Z&end_date=2025-01-31T23:59:59Z" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

```python
response = requests.get(
    "https://auth.hokus.ai/api/v1/usage/aggregate",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
    params={
        "service_id": "prediction",
        "start_date": "2025-01-01T00:00:00Z",
        "end_date": "2025-01-31T23:59:59Z",
    },
)
aggregate = response.json()
for date, services in aggregate["usage_by_date"].items():
    for svc, stats in services.items():
        print(f"{date} - {svc}: {stats['requests']} requests")
```

### Response

```json
{
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-01-31T23:59:59Z",
  "usage_by_date": {
    "2025-01-15": {
      "prediction": {
        "requests": 5230,
        "predictions": 3100,
        "compute_ms": 456789,
        "avg_response_time_ms": 78.5
      },
      "website": {
        "requests": 1200,
        "predictions": 0,
        "compute_ms": 12000,
        "avg_response_time_ms": 45.2
      }
    }
  }
}
```

## Next Steps

- **[Security](/authentication/security)** — Protect your API keys and usage data
- **[Troubleshooting](/authentication/troubleshooting)** — Debug usage tracking issues
- **[API Reference](/api-reference)** — Complete endpoint listing
