---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started with Hokusai

Hokusai is a decentralized protocol that incentivizes high-quality data contributions to improve AI models. This guide will help you get started based on your role in the ecosystem.

## Quick Overview by Role

### For Data Suppliers
1. Install the Hokusai data pipeline
2. Prepare your data in supported formats
3. Run data validation and quality checks
4. Submit data for evaluation and earn rewards

### For AI Model Developers
1. Set up the Hokusai SDK and pipeline
2. Integrate your model with the evaluation framework
3. Define performance metrics for DeltaOne token issuance
4. Deploy and monitor model improvements

**📖 New:** Check out our [Complete Model Launch Guide](guides/model-launch-guide) for step-by-step instructions on launching your model on Hokusai.

### For Token Investors
1. Understand the bonding curve mechanism
2. Participate in token auctions
3. Monitor token supply and burn rates
4. Track model performance metrics

## System Requirements

### Minimum Requirements
- Python 3.8 or higher
- 8GB RAM
- 10GB free disk space
- Unix-based OS (macOS, Linux) or WSL on Windows

### Recommended Requirements
- Python 3.11
- 16GB RAM
- 50GB free disk space for model storage
- SSD for faster data processing

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/hokusai/hokusai-data-pipeline.git
cd hokusai-data-pipeline
```

### 2. Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Run Setup Script

The project includes a setup script that handles all dependencies:

```bash
./setup.sh
```

This script will:
- Install Python dependencies from requirements.txt
- Set up MLFlow tracking directory
- Create necessary data directories
- Validate the installation

### 4. Configure Environment

Create a `.env` file in the project root:

```bash
# MLFlow Configuration
MLFLOW_TRACKING_URI=file:./mlruns
MLFLOW_EXPERIMENT_NAME=hokusai-pipeline

# Pipeline Configuration
HOKUSAI_TEST_MODE=false
PIPELINE_LOG_LEVEL=INFO
RANDOM_SEED=42

# Optional: Linear API for workflow automation
LINEAR_API_KEY=your_linear_api_key_here
```

## Quick Start: Run Your First Pipeline

### Test Mode (No External Dependencies)

The fastest way to see the pipeline in action is using dry-run mode:

```bash
python -m src.pipeline.hokusai_pipeline run \
    --dry-run \
    --contributed-data=data/test_fixtures/test_queries.csv \
    --output-dir=./outputs
```

This command:
- Uses mock models and data
- Completes in ~7 seconds
- Generates real output files
- Requires no external dependencies

### View Results

```bash
# View the attestation-ready output
cat outputs/delta_output_*.json | jq '.'

# Check MLFlow tracking
mlflow ui
# Open http://localhost:5000 in your browser
```

### Understanding the Output

The pipeline generates a comprehensive JSON output for attestation:

```json
{
  "schema_version": "1.0",
  "delta_computation": {
    "delta_one_score": 0.0332,
    "metric_deltas": {
      "accuracy": {
        "baseline_value": 0.8545,
        "new_value": 0.8840,
        "absolute_delta": 0.0296,
        "relative_delta": 0.0346,
        "improvement": true
      }
    }
  },
  "contributor_attribution": {
    "contributor_id": "contributor_xyz789",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f62341",
    "contributed_samples": 100
  }
}
```

## Working with Real Data

### Prepare Your Data

Create a CSV file with your contributed data:

```csv
query_id,query,relevant_doc_id,label
q001,"What is machine learning?",doc123,1
q002,"How to train a model?",doc456,1
q003,"Python programming basics",doc789,0
```

### Run the Pipeline

```bash
python -m src.pipeline.hokusai_pipeline run \
    --contributed-data=path/to/your/data.csv \
    --baseline-model-path=path/to/baseline/model \
    --output-dir=./outputs
```

## Key Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOKUSAI_TEST_MODE` | `false` | Enable test mode with mock data |
| `PIPELINE_LOG_LEVEL` | `INFO` | Logging verbosity (DEBUG, INFO, WARNING, ERROR) |
| `MLFLOW_TRACKING_URI` | `file:./mlruns` | MLFlow tracking location |
| `ENABLE_PII_DETECTION` | `true` | Automatic PII detection and hashing |
| `DATA_VALIDATION_STRICT` | `false` | Fail on any validation warning |

### Command-Line Arguments

| Argument | Description |
|----------|-------------|
| `--contributed-data` | Path to your contribution data (required) |
| `--dry-run` | Use mock data and models |
| `--output-dir` | Where to save results |
| `--baseline-model-path` | Path to baseline model |
| `--sample-size` | Limit data samples for testing |

For complete configuration reference, see [Configuration Guide](configuration.md).

## Common Issues and Solutions

### Permission Denied on setup.sh
```bash
chmod +x setup.sh
```

### Python Version Mismatch
Ensure you're using Python 3.8+:
```bash
python --version
```

### No Output Generated
Check output directory permissions:
```bash
mkdir -p outputs
chmod 755 outputs
```

## Next Steps

Now that you have Hokusai running:

1. **[Configuration Guide](configuration.md)** - Detailed configuration options
2. **[Supplying Data](supplying-data.md)** - Learn about data contribution process
3. **[Architecture Overview](core-workflows/architecture.md)** - Understand the system design
4. **[API Reference](api-reference.md)** - Integrate with your systems

## Getting Help

- Check the [Troubleshooting Guide](troubleshooting.md)
- Review existing [GitHub Issues](https://github.com/hokusai/hokusai-data-pipeline/issues)
- Join our [Discord community](https://discord.gg/hokusai)