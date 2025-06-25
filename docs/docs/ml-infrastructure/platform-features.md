---
title: ML Platform Features
id: platform-features
sidebar_label: Platform Features
sidebar_position: 3
---

# ML Platform Features (Coming Soon)

The Hokusai ML Platform will extend the current pipeline capabilities into a comprehensive ML infrastructure package.

:::info Development Status
The ML Platform is currently under active development. Features described here represent the planned architecture.
:::

## Core Features

### Model Registry

Centralized model management with version control:

```python
from hokusai.core import ModelRegistry

registry = ModelRegistry()
model_id = registry.register_model(
    model=my_model,
    name="lead-scorer",
    version="1.0.0",
    metrics={"accuracy": 0.92}
)
```

**Capabilities:**
- Store models with metadata
- Track performance metrics
- Compare model versions
- Integrate with MLFlow

### A/B Testing Framework

Test model improvements in production:

```python
from hokusai.core.ab_testing import ModelTrafficRouter

router = ModelTrafficRouter()
router.create_test(
    model_a="lead-scorer/1.0.0",
    model_b="lead-scorer/1.1.0", 
    traffic_split={"a": 0.8, "b": 0.2}
)
```

**Features:**
- Traffic splitting
- Performance monitoring
- Statistical significance testing
- Automatic winner selection

### Inference Pipeline

Optimized model serving with caching:

```python
from hokusai.inference import InferencePipeline

pipeline = InferencePipeline(
    model_name="lead-scorer",
    cache_ttl=300,  # 5 minutes
    batch_size=32
)

predictions = await pipeline.predict(inputs)
```

**Optimizations:**
- Request batching
- Result caching
- Load balancing
- Fallback handling

### SDK Integration

Easy integration for any application:

```python
from hokusai import HokusaiClient

client = HokusaiClient(api_key="...")
result = client.evaluate_contribution(
    baseline="gpt-3.5",
    data="path/to/data.csv"
)
```

## Deployment Options

### Cloud Deployment
- Managed service on Hokusai infrastructure
- Auto-scaling and monitoring included
- Pay-per-use pricing model

### Self-Hosted
- Deploy on your own infrastructure
- Full control over data and models
- Enterprise support available

### Hybrid Mode
- Models on your infrastructure
- Evaluation on Hokusai network
- Best of both worlds

## Integration Examples

### FastAPI Application
```python
from fastapi import FastAPI
from hokusai import MLPlatform

app = FastAPI()
platform = MLPlatform()

@app.post("/predict")
async def predict(data: dict):
    model = platform.get_model("my-model", version="latest")
    return await model.predict(data)
```

### Jupyter Notebook
```python
# Experiment with models
from hokusai.notebook import experiment

exp = experiment("lead-scoring-v2")
exp.log_dataset("training_data.csv")
exp.train_model(params={...})
exp.evaluate()
```

## Roadmap

### Phase 1: Core Platform (Q2 2024)
- ✅ Model registry
- ✅ Basic inference pipeline
- 🚧 MLFlow integration

### Phase 2: Advanced Features (Q3 2024)
- 📋 A/B testing framework
- 📋 Auto-scaling inference
- 📋 SDK release

### Phase 3: Enterprise Features (Q4 2024)
- 📋 Private deployments
- 📋 Advanced monitoring
- 📋 SLA guarantees

## Migration Path

For current pipeline users:

1. **Continue using the pipeline** - No changes required
2. **Gradual adoption** - Platform will support pipeline outputs
3. **Enhanced features** - Access new capabilities as they launch

## Get Involved

- **GitHub**: Watch for updates at [hokusai-data-pipeline](https://github.com/Hokusai-protocol/hokusai-data-pipeline)
- **Discord**: Join discussions in #ml-platform channel
- **Beta Program**: Sign up for early access