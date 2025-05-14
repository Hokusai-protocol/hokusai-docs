---
sidebar_position: 1
---

# API Reference

The Hokusai Protocol API allows developers to interact with the protocol programmatically.

## Authentication

```typescript
const apiKey = process.env.HOKUSAI_API_KEY;
const client = new HokusaiClient(apiKey);
```

## Endpoints

### Models

```typescript
// List available models
const models = await client.models.list();

// Get model details
const model = await client.models.get('model-id');

// Create a new model
const newModel = await client.models.create({
  name: 'My Model',
  description: 'A custom AI model',
});
```

### Data

```typescript
// Submit data
const submission = await client.data.submit({
  modelId: 'model-id',
  data: [...],
});

// Check submission status
const status = await client.data.status('submission-id');
```

### Tokens

```typescript
// Create token
const token = await client.tokens.create({
  name: 'My Token',
  symbol: 'MTK',
});

// Get token balance
const balance = await client.tokens.balance('token-id');
```

## Error Handling

```typescript
try {
  await client.models.get('invalid-id');
} catch (error) {
  if (error instanceof HokusaiError) {
    console.error(error.message);
  }
}
``` 