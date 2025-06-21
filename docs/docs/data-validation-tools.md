---
id: data-validation-tools
title: Data Validation Tools
sidebar_label: Validation Tools
sidebar_position: 4
---

# Data Validation Tools

Hokusai provides comprehensive validation tools to ensure your data meets format, quality, and privacy standards before submission. These tools are available through both the SDK and the data pipeline.

## Overview

The validation system includes:

1. **Format Validator**: Checks data structure and schema compliance
2. **Privacy Scanner**: Identifies and handles PII automatically
3. **Quality Analyzer**: Assesses data quality metrics
4. **Performance Estimator**: Estimates potential model improvement

## Installation Options

### Option 1: Hokusai SDK
```bash
pip install hokusai-sdk
```

### Option 2: Data Pipeline
```bash
git clone https://github.com/hokusai/hokusai-data-pipeline.git
cd hokusai-data-pipeline
./setup.sh
```

## Validation Tools

### 1. Format Validation

#### Using the SDK:
```python
from hokusai import FormatValidator

validator = FormatValidator(
    model_id='target_model_id',  # Required for model-specific rules
    strict_mode=True            # Optional: enables stricter validation
)

result = validator.validate(dataset)

if result.is_valid:
    print('Format validation passed')
else:
    print('Validation errors:', result.errors)
    print('Suggested fixes:', result.suggestions)
```

#### Using the Pipeline:
```bash
python -m src.utils.validate_contribution \
    --data=my_contribution.csv \
    --manifest=manifest.json \
    --format-check
```

#### Supported Data Formats

**CSV Format:**
```csv
query_id,query,relevant_doc_id,label
q001,"What is machine learning?",doc123,1
q002,"How to train a model?",doc456,1
```

**JSON Format:**
```json
{
  "samples": [
    {
      "id": "sample_001",
      "text": "Sample text",
      "label": "positive",
      "confidence": 0.95
    }
  ]
}
```

**Parquet Format:**
- Features array (float)
- Labels (string)
- Metadata (struct)
- Contributor ID (string)

#### Validation Checks

| Check | Description | Requirement |
|-------|-------------|-------------|
| Schema Compliance | Matches expected structure | 100% |
| Required Fields | All mandatory fields present | 100% |
| Data Types | Correct field types | 100% |
| Encoding | UTF-8 for text data | Required |
| File Size | Within limits | < 1GB |

### 2. Privacy Scanning

#### Automatic PII Detection

The pipeline automatically detects and handles PII:

```python
from hokusai import PrivacyScanner

scanner = PrivacyScanner(
    sensitivity='high',        # 'low', 'medium', 'high'
    auto_hash=True            # Automatically hash detected PII
)

scan_result = scanner.scan(dataset)

print('PII fields detected:', scan_result.pii_fields)
print('Privacy score:', scan_result.privacy_score)
print('Actions taken:', scan_result.actions)
```

#### Pipeline Privacy Processing

```bash
# Enable strict privacy mode
export ENABLE_PII_DETECTION=true
export PII_HASH_ALGORITHM=sha256

python -m src.pipeline.hokusai_pipeline run \
    --contributed-data=data.csv \
    --privacy-strict
```

#### Privacy Features

- **Automatic Detection**: Emails, phone numbers, SSNs, names
- **One-way Hashing**: SHA-256 for identifiers
- **Field Removal**: Option to remove sensitive fields
- **Audit Trail**: Logs all privacy actions

### 3. Quality Analysis

#### Quality Metrics

```python
from hokusai import QualityAnalyzer

analyzer = QualityAnalyzer(
    metrics=['completeness', 'consistency', 'uniqueness', 'validity'],
    thresholds={
        'completeness': 0.95,  # 95% non-null values
        'uniqueness': 0.80,    # 80% unique samples
        'consistency': 0.90,   # 90% format consistency
        'validity': 1.00       # 100% schema compliance
    }
)

analysis = analyzer.analyze(dataset)

print('Quality metrics:', analysis.metrics)
print('Overall score:', analysis.overall_score)
print('Issues found:', analysis.issues)
```

#### Pipeline Quality Scoring

The pipeline automatically calculates quality scores:

```bash
python -m src.pipeline.hokusai_pipeline run \
    --contributed-data=data.csv \
    --quality-report \
    --output-dir=./quality_reports
```

Quality Score Calculation:
- **Completeness**: (non-null values / total values) × 100
- **Uniqueness**: (unique samples / total samples) × 100
- **Consistency**: (valid formats / total records) × 100
- **Overall Score**: Weighted average of all metrics

### 4. Performance Estimation

#### Estimate Potential Improvement

```python
from hokusai import PerformanceEstimator

estimator = PerformanceEstimator(
    model_id='target_model_id',
    baseline_metrics={'accuracy': 0.85}
)

estimate = estimator.estimate(dataset)

print(f'Estimated improvement: {estimate.delta_percentage}%')
print(f'Potential DeltaOnes: {estimate.delta_ones}')
print(f'Confidence interval: {estimate.confidence_interval}')
```

## Batch Validation

For large datasets, use batch processing:

```python
from hokusai import BatchValidator

validator = BatchValidator(
    batch_size=10000,
    parallel_workers=4,
    memory_limit_gb=8
)

# Process in batches
for batch_result in validator.process_file('large_dataset.csv'):
    print(f'Batch {batch_result.batch_id}: {batch_result.status}')
    if not batch_result.is_valid:
        print(f'Errors: {batch_result.errors}')
```

## Validation Reports

### Generate Comprehensive Reports

```python
from hokusai import ValidationReporter

reporter = ValidationReporter()
report = reporter.generate(
    dataset=dataset,
    include_privacy_scan=True,
    include_quality_metrics=True,
    format='html'  # Options: 'html', 'pdf', 'json', 'markdown'
)

# Save report
report.save('validation-report.html')

# Get summary
summary = report.get_summary()
print(f'Validation passed: {summary.passed}')
print(f'Quality score: {summary.quality_score}')
print(f'Privacy compliance: {summary.privacy_compliant}')
```

### Pipeline Validation Output

The pipeline generates detailed validation reports:

```json
{
  "validation_results": {
    "format_validation": {
      "passed": true,
      "schema_version": "1.0",
      "errors": []
    },
    "privacy_scan": {
      "pii_detected": false,
      "fields_hashed": ["email", "user_id"],
      "privacy_score": 0.98
    },
    "quality_analysis": {
      "completeness": 0.97,
      "uniqueness": 0.85,
      "consistency": 0.99,
      "overall_score": 0.94
    },
    "estimated_impact": {
      "delta_percentage": 3.2,
      "confidence": 0.87
    }
  }
}
```

## CLI Validation Tools

### Standalone Validation

```bash
# Validate data format
hokusai-validate format --data=my_data.csv --model=model_id

# Scan for privacy issues
hokusai-validate privacy --data=my_data.csv --sensitivity=high

# Analyze quality
hokusai-validate quality --data=my_data.csv --report=quality.json

# Full validation
hokusai-validate all --data=my_data.csv --output=validation_report.html
```

### Pipeline Integration

```bash
# Dry-run with validation only
python -m src.pipeline.hokusai_pipeline validate \
    --contributed-data=data.csv \
    --no-training \
    --output-dir=./validation_results
```

## Best Practices

### 1. Validation Workflow
1. **Format First**: Always validate format before other checks
2. **Privacy Second**: Ensure PII is handled before processing
3. **Quality Third**: Assess data quality metrics
4. **Performance Last**: Estimate impact after other validations pass

### 2. Error Handling
```python
try:
    result = validator.validate(dataset)
    if not result.is_valid:
        # Handle validation errors
        for error in result.errors:
            logger.error(f"Validation error: {error}")
        # Attempt fixes
        dataset = validator.auto_fix(dataset)
except ValidationException as e:
    logger.error(f"Critical validation failure: {e}")
    raise
```

### 3. Performance Optimization
- Use batch processing for datasets > 100MB
- Enable parallel validation for multi-core systems
- Cache validation results for repeated checks
- Use streaming for very large files

## Troubleshooting

### Common Issues

**Schema Validation Fails**
```
Error: Column 'query_id' not found in data
```
Solution: Ensure your data has all required columns with exact names

**Quality Score Too Low**
```
Warning: Data quality score 0.65 below threshold 0.80
```
Solution: Check for duplicates, missing values, or inconsistent formats

**PII Detection False Positives**
```
Warning: Field 'product_id' detected as potential PII
```
Solution: Configure custom patterns to exclude known safe fields:
```python
scanner = PrivacyScanner(
    exclude_patterns=['product_id', 'order_id']
)
```

**Memory Issues with Large Files**
```
Error: MemoryError during validation
```
Solution: Use batch processing or increase memory limits:
```bash
export MEMORY_LIMIT_GB=16
```

## Configuration

Key environment variables for validation:

```bash
# Privacy settings
ENABLE_PII_DETECTION=true
PII_HASH_ALGORITHM=sha256
PII_SENSITIVITY_LEVEL=high

# Quality thresholds
MIN_QUALITY_SCORE=0.80
COMPLETENESS_THRESHOLD=0.95
UNIQUENESS_THRESHOLD=0.80

# Performance settings
VALIDATION_BATCH_SIZE=10000
VALIDATION_WORKERS=4
VALIDATION_TIMEOUT=300
```

## Next Steps

- [Contributing Data](supplying-data.md) - Complete data submission guide
- [Privacy Compliance](privacy-compliance.md) - Detailed privacy requirements
- [Configuration Guide](configuration.md) - Full configuration reference
- [Architecture Overview](core-workflows/architecture.md) - System design details

For additional support, contact our [Support Team](https://hokus.ai/contact-us/) or join our [Community Forum](https://community.hokus.ai).