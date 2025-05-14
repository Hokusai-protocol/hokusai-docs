---
sidebar_position: 2
---

# Integration Guide

Learn how to integrate your application with the Hokusai Protocol.

## Getting Started

1. **Create an Account**: Sign up at [hokus.ai](https://hokus.ai)
2. **Get API Keys**: Generate your API keys in the dashboard
3. **Install SDK**: Add the Hokusai SDK to your project

## SDK Installation

```bash
npm install @hokusai/sdk
# or
yarn add @hokusai/sdk
```

## Basic Integration

```typescript
import { HokusaiClient } from '@hokusai/sdk';

const client = new HokusaiClient({
  apiKey: process.env.HOKUSAI_API_KEY,
  environment: 'production'
});
```

## Common Use Cases

### Model Integration

```typescript
// List available models
const models = await client.models.list();

// Use a model for inference
const result = await client.models.infer('model-id', {
  input: 'Your input data'
});
```

### Data Submission

```typescript
// Submit training data
const submission = await client.data.submit({
  modelId: 'model-id',
  data: {
    input: 'Training input',
    output: 'Expected output'
  }
});
```

### Token Management

```typescript
// Create a new token
const token = await client.tokens.create({
  name: 'My Model Token',
  symbol: 'MMT'
});

// Check token balance
const balance = await client.tokens.balance('token-id');
```

## Best Practices

1. **Error Handling**: Always implement proper error handling
2. **Rate Limiting**: Respect API rate limits
3. **Security**: Keep your API keys secure
4. **Testing**: Test in development environment first 