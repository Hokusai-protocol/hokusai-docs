---
title: Quick Start - Pipeline
id: quick-start-pipeline
sidebar_label: Quick Start (Pipeline)
sidebar_position: 2
---

# Quick Start Guide - Data Pipeline

Get up and running with the Hokusai data pipeline in 5 minutes. This guide shows you how to test the pipeline locally with sample data.

:::info Prerequisites
This guide assumes you have:
- Python 3.8+ installed
- Basic familiarity with command line
- Cloned the hokusai-data-pipeline repository
:::

## 5-Minute Example

### Step 1: Setup Environment

```bash
# Clone the pipeline repository (if not already done)
git clone https://github.com/hokusai-protocol/hokusai-data-pipeline
cd hokusai-data-pipeline

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Run Pipeline in Dry-Run Mode

```bash
# Run with mock data to test setup
python -m src.pipeline.hokusai_pipeline run \
    --dry-run \
    --contributed-data=data/test_fixtures/test_queries.csv \
    --output-dir=./quick-start-output
```

This command:
- Uses `--dry-run` to generate mock baseline models
- Processes the test dataset
- Outputs attestation-ready results

### Step 3: View Results

```bash
# Check output
ls -la quick-start-output/

# View the attestation output
cat quick-start-output/deltaone_output_*.json | jq '.'
```

## Understanding the Output

The pipeline generates several output files:

### Attestation File
```json
{
  "model_id": "gpt-3.5-turbo",
  "run_id": "run_20240620_153045",
  "deltaone_score": 8.5,
  "improvements": {
    "accuracy": 0.085,
    "response_quality": 0.082,
    "latency_reduction": 0.001
  },
  "metadata": {
    "data_points": 100,
    "evaluation_date": "2024-06-20T15:30:45Z",
    "pipeline_version": "1.0.0"
  }
}
```

### Key Metrics
- **DeltaOne Score**: Percentage improvement (1 DeltaOne = 1% improvement)
- **Component Scores**: Breakdown by evaluation criteria
- **Metadata**: Context about the evaluation run

## Next Steps

Now that you've run your first pipeline:

1. **[Configure Your Pipeline](../configuration)** - Customize evaluation parameters
2. **[Supply Real Data](../supplying-data)** - Learn how to contribute your own datasets
3. **[Understanding DeltaOne](../tokenomics/deltaone-calculations)** - Deep dive into reward calculations

## Common Issues

### Python Version Error
```bash
# Check your Python version
python --version

# If below 3.8, install a newer version
```

### Missing Dependencies
```bash
# Reinstall all dependencies
pip install --upgrade -r requirements.txt
```

### Permission Denied
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

For more troubleshooting, see our [Troubleshooting Guide](../troubleshooting).