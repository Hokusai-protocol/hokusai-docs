---
title: Quick Start Guide
id: quick-start
sidebar_label: Quick Start
sidebar_position: 2
---

# Quick Start Guide

Get up and running with the Hokusai data pipeline in 5 minutes. This guide shows you how to test the pipeline locally with sample data.

:::info Prerequisites
This guide assumes you have:
- Python 3.8+ installed
- Basic familiarity with command line
- Git installed on your system
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

### Step 4: View MLFlow UI (Optional)

```bash
# Start MLFlow UI
mlflow ui

# Open browser to http://localhost:5000
```

You'll see:
- Experiment runs
- Model parameters
- Performance metrics
- Artifacts

## Understanding the Output

The pipeline generates several output files:

### DeltaOne Attestation
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

### Technical Output Format
```json
{
  "pipeline_version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "baseline_model": {
    "id": "baseline_model_v1",
    "metrics": {
      "accuracy": 0.85,
      "f1_score": 0.82
    }
  },
  "improved_model": {
    "id": "improved_model_v1",
    "metrics": {
      "accuracy": 0.88,
      "f1_score": 0.86
    }
  },
  "delta": {
    "accuracy": 0.03,
    "f1_score": 0.04
  }
}
```

### Key Metrics
- **DeltaOne Score**: Percentage improvement (1 DeltaOne = 1% improvement)
- **Component Scores**: Breakdown by evaluation criteria
- **Technical Metrics**: Raw model performance measurements

## Understanding the Pipeline

### What Just Happened?

```mermaid
graph LR
    A[Contributed Data] --> B[Data Validation]
    B --> C[Model Training]
    C --> D[Evaluation]
    D --> E[Delta Calculation]
    E --> F[DeltaOne Score]
    F --> G[Attestation Output]
    
    style A fill:#e1f5fe
    style F fill:#fff59d
    style G fill:#c8e6c9
```

1. **Data Loading**: The pipeline loaded your contributed data
2. **Validation**: Data was checked for schema compliance and PII
3. **Model Training**: A new model was trained with the data
4. **Evaluation**: Both models were evaluated on a benchmark
5. **Delta Calculation**: Performance improvement was calculated
6. **DeltaOne Score**: Improvement converted to DeltaOne rewards
7. **Attestation**: Results were formatted for blockchain verification

## Real Data Example

### Prepare Your Data

Create a CSV file with your training data:

```csv
query,document,relevance
"What is machine learning?","Machine learning is a subset of AI...",1
"How does Python work?","Python is an interpreted language...",1
"What is the weather?","Machine learning algorithms can...",0
```

Save as `my_data.csv`.

### Run Pipeline with Real Data

```bash
# Set environment for real run
export HOKUSAI_TEST_MODE=false

# Run pipeline
python -m src.pipeline.hokusai_pipeline run \
    --baseline-model-path=models/baseline.pkl \
    --contributed-data=my_data.csv \
    --output-dir=./outputs \
    --contributor-address=0xYourWalletAddress \
    --experiment-name=my-first-contribution
```

### Monitor Progress

```bash
# Watch logs
tail -f outputs/pipeline.log

# Check pipeline status
python -m metaflow tag list
```

## Common Commands

### Data Validation

```bash
# Validate your data before submission
python -m src.cli.validate_data \
    --input-file=my_data.csv \
    --schema=config/data_schema.json
```

### Preview Mode

```bash
# Preview expected improvement
python -m src.preview.preview_improvement \
    --baseline-model=models/baseline.pkl \
    --contributed-data=my_data.csv
```

### Configuration Options

```bash
# Custom configuration
python -m src.pipeline.hokusai_pipeline run \
    --config=my_config.yaml \
    --batch-size=64 \
    --epochs=20 \
    --learning-rate=0.001
```

## Output Files

After a successful run, you'll find:

```
outputs/
├── deltaone_output_20240115_103000.json  # Main attestation file
├── metrics_summary.csv                    # Detailed metrics
├── model_artifacts/                       # Trained models
│   ├── baseline_model.pkl
│   └── improved_model.pkl
├── evaluation_results/                    # Evaluation details
│   └── benchmark_scores.json
└── pipeline.log                          # Execution logs
```

## Next Steps

Now that you've run your first pipeline:

1. **[Configure Your Pipeline](../configuration)** - Customize evaluation parameters
2. **[Supply Real Data](../supplying-data)** - Learn how to contribute your own datasets
3. **[First Contribution](./first-contribution)** - Step-by-step guide for your first real contribution
4. **[Understanding DeltaOne](../tokenomics/deltaone-calculations)** - Deep dive into reward calculations

## Troubleshooting

### Python Version Error
```bash
# Check your Python version
python --version

# If below 3.8, install a newer version
```

### Pipeline Fails Immediately
```bash
# Check Python environment
which python  # Should show venv path

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### No Output Generated
```bash
# Check logs
cat outputs/pipeline.log | grep ERROR

# Verify data format
python -m src.cli.validate_data --input-file=your_data.csv
```

### MLFlow UI Not Working
```bash
# Kill existing process
pkill -f "mlflow ui"

# Start with specific settings
mlflow ui --backend-store-uri ./mlruns --port 5001
```

### Permission Denied
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

For more troubleshooting, see our [Troubleshooting Guide](../troubleshooting).